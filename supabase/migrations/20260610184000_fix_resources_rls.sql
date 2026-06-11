-- Restrict authenticated access to resources to enrolled program members and admins only

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated read resources" ON public.resources;
CREATE POLICY "Authenticated read resources" ON public.resources
  FOR SELECT
  USING (
    is_public
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1
      FROM public.course_enrollments ce
      WHERE ce.user_id = auth.uid()
        AND ce.program_id = public.resources.program_id
    )
  );
