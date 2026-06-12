-- Production security and integrity hardening.
-- Removes legacy fixed-email admin claims and adds constraints/indexes used by the app.

-- The app provisions first admin via environment-backed scripts; no email address should
-- automatically become admin from database code.
DROP FUNCTION IF EXISTS public.claim_seed_admin();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'pending'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles
  ADD CONSTRAINT chk_profiles_status
  CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) NOT VALID;
ALTER TABLE public.profiles VALIDATE CONSTRAINT chk_profiles_status;

ALTER TABLE public.course_enrollments
  ADD CONSTRAINT chk_course_enrollments_status
  CHECK (status IN ('pending_payment', 'pending_payment_review', 'payment_approved', 'active', 'completed', 'rejected')) NOT VALID;
ALTER TABLE public.course_enrollments VALIDATE CONSTRAINT chk_course_enrollments_status;

ALTER TABLE public.payments
  ADD CONSTRAINT chk_payments_status
  CHECK (status IN ('pending', 'approved', 'rejected')) NOT VALID;
ALTER TABLE public.payments VALIDATE CONSTRAINT chk_payments_status;

ALTER TABLE public.payments
  ADD CONSTRAINT chk_payments_amount_positive
  CHECK (amount > 0) NOT VALID;
ALTER TABLE public.payments VALIDATE CONSTRAINT chk_payments_amount_positive;

CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_status ON public.course_enrollments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_program_status ON public.course_enrollments(program_id, status);
CREATE INDEX IF NOT EXISTS idx_resources_program_public ON public.resources(program_id, is_public);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment_status ON public.payments(enrollment_id, status);

-- Keep resource access in sync with application enrollment states.
DROP POLICY IF EXISTS "Authenticated read resources" ON public.resources;
CREATE POLICY "Authenticated read resources" ON public.resources
FOR SELECT TO authenticated USING (
  is_public
  OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (
    SELECT 1
    FROM public.course_enrollments ce
    WHERE ce.user_id = auth.uid()
      AND ce.program_id = public.resources.program_id
      AND ce.status IN ('active', 'completed')
  )
);

DROP POLICY IF EXISTS "Users read enrolled resources" ON storage.objects;
CREATE POLICY "Users read enrolled resources" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'resource_files' AND (
      public.has_role(auth.uid(), 'admin')
      OR EXISTS (
        SELECT 1 FROM public.resources r
        JOIN public.course_enrollments ce ON ce.program_id = r.program_id
        WHERE ce.user_id = auth.uid()
          AND ce.status IN ('active', 'completed')
          AND r.storage_path = name
      )
    )
  );
