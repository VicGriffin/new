-- 1. Add status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Ensure all current users have 'approved' status so they don't get locked out immediately
UPDATE public.profiles SET status = 'approved' WHERE status IS NULL OR status = 'pending';

-- 2. Modify course_enrollments relationship
-- Drop old foreign key referencing auth.users if it exists, and reference public.profiles instead
ALTER TABLE public.course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_user_id_fkey;
ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Add progress tracking columns to course_enrollments
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS last_accessed_module TEXT;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS last_accessed_topic TEXT;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS completed_topics JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 4. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'KSH',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  transaction_reference TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own payments" ON public.payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      WHERE ce.id = payments.enrollment_id AND ce.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_enrollments ce
      WHERE ce.id = payments.enrollment_id AND ce.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all payments" ON public.payments
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

-- 5. Add pdf_path to research_articles
ALTER TABLE public.research_articles ADD COLUMN IF NOT EXISTS pdf_path TEXT;

-- 6. Insert new program categories
INSERT INTO public.program_categories (name, slug, description) VALUES
  ('MTM Courses', 'mtm', 'Medication Therapy Management core courses'),
  ('Professional Development Courses', 'professional', 'Professional continuing development programs'),
  ('Certificate Courses', 'certificate', 'Accredited certificate courses'),
  ('Short Courses', 'short', 'Short focus courses'),
  ('Diploma Courses', 'diploma', 'Comprehensive diploma programs'),
  ('Others', 'others', 'General courses and categories')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Map existing programs to their new categories
UPDATE public.programs SET category_id = (SELECT id FROM public.program_categories WHERE slug = 'diploma') WHERE slug IN ('mtm-for-pharmacists', 'mtm-for-pharmaceutical-technologists');
UPDATE public.programs SET category_id = (SELECT id FROM public.program_categories WHERE slug = 'certificate') WHERE slug = 'mtm-for-pharmaceutical-technicians';
UPDATE public.programs SET category_id = (SELECT id FROM public.program_categories WHERE slug = 'professional') WHERE slug IN ('mtm-for-clinicians', 'mtm-for-physicians', 'mtm-for-nurses');

-- Clean up old categories that are no longer needed (optional, but keep safe)
DELETE FROM public.program_categories WHERE slug NOT IN ('mtm', 'professional', 'certificate', 'short', 'diploma', 'others');

-- 7. Configure storage buckets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('research_files', 'research_files', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resource_files', 'resource_files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage objects (needs security manager / service role permissions or standard admin role checking)
DROP POLICY IF EXISTS "Admins manage research storage" ON storage.objects;
CREATE POLICY "Admins manage research storage" ON storage.objects
  FOR ALL USING (
    bucket_id IN ('research_files', 'resource_files')
    AND auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin')
  ) WITH CHECK (
    bucket_id IN ('research_files', 'resource_files')
    AND auth.uid() IS NOT NULL
    AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Authenticated users read research storage" ON storage.objects;
CREATE POLICY "Authenticated users read research storage" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'research_files');

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
          AND ce.status = 'active'
          AND r.storage_path = name
      )
    )
  );
