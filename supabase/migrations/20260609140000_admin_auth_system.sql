-- Partners & Testimonials tables
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published partners" ON public.partners
  FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage partners" ON public.partners
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published testimonials" ON public.testimonials
  FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact archive & admin response
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS admin_response TEXT;

-- Extended admin RLS policies
CREATE POLICY "Admins delete contacts" ON public.contacts
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete applications" ON public.membership_applications
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage enrollments" ON public.course_enrollments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read all notifications" ON public.notifications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update notifications" ON public.notifications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete notifications" ON public.notifications
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON public.contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_is_archived ON public.contacts(is_archived);
CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON public.membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_partners_sort ON public.partners(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials(sort_order);

-- Seed default partners & testimonials (idempotent by name/quote)
INSERT INTO public.partners (name, sort_order, is_published)
SELECT v.name, v.sort_order, true
FROM (VALUES
  ('Ministry of Health', 1),
  ('WHO Africa', 2),
  ('KMTC', 3),
  ('UCT Pharmacy', 4),
  ('FIP', 5),
  ('PSK', 6),
  ('PCN', 7),
  ('Africa CDC', 8)
) AS v(name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.partners p WHERE p.name = v.name);

INSERT INTO public.testimonials (quote, author_name, author_role, sort_order, is_published)
SELECT v.quote, v.author_name, v.author_role, v.sort_order, true
FROM (VALUES
  ('AMTMTI''s clinical pharmacy program reshaped how our hospital approaches medication reviews. Patient outcomes have measurably improved.',
   'Dr. Amina Otieno', 'Chief Pharmacist, Nairobi Referral Hospital', 1),
  ('The blended learning model let me earn my MTM diploma without leaving my district pharmacy. The faculty truly understand African practice.',
   'Joseph Mwangi', 'Pharmaceutical Technologist, Kisumu', 2),
  ('Partnering with AMTMTI''s research division gave our adherence trial the methodological rigor and regional reach we needed.',
   'Prof. Chinwe Adeyemi', 'University College Hospital, Ibadan', 3)
) AS v(quote, author_name, author_role, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials t WHERE t.author_name = v.author_name);
