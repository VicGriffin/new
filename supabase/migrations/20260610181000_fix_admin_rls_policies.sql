-- Fix missing admin RLS policies for admin dashboard actions

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins delete applications" ON public.membership_applications;
CREATE POLICY "Admins delete applications" ON public.membership_applications FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins delete contacts" ON public.contacts;
CREATE POLICY "Admins delete contacts" ON public.contacts FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage enrollments" ON public.course_enrollments;
CREATE POLICY "Admins manage enrollments" ON public.course_enrollments FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
