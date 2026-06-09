-- Add organization field to contact submissions
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS organization TEXT;

-- Allow admins to create notifications for users
CREATE POLICY "Admins insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed program categories
INSERT INTO public.program_categories (name, slug, description) VALUES
  ('Pharmacists', 'pharmacists', 'Postgraduate and advanced MTM pathways for pharmacists'),
  ('Pharmaceutical Technologists', 'technologists', 'Diploma-level MTM training for technologists'),
  ('Pharmaceutical Technicians', 'technicians', 'Certificate programs for pharmacy technicians'),
  ('Clinicians', 'clinicians', 'CPD for clinical officers and allied clinicians'),
  ('Physicians', 'physicians', 'CPD for physicians and medical officers'),
  ('Nurses', 'nurses', 'CPD for nursing professionals')
ON CONFLICT (slug) DO NOTHING;

-- Seed flagship programs (idempotent via slug)
INSERT INTO public.programs (title, slug, category_id, summary, description, duration, level, certification, price_usd, is_published)
SELECT v.title, v.slug, c.id, v.summary, v.description, v.duration, v.level, v.certification, v.price_usd, true
FROM (VALUES
  ('MTM for Pharmacists', 'mtm-for-pharmacists', 'pharmacists',
   'Advanced training for pharmacists leading clinical MTM services in hospitals, community pharmacies, and outpatient clinics.',
   'Conduct comprehensive medication reviews, develop pharmaceutical care plans, lead deprescribing initiatives, and collaborate in multidisciplinary teams.',
   '12 months', 'Postgraduate Diploma', 'AMTMTI Postgraduate Diploma in MTM', 2400.00),
  ('MTM for Pharmaceutical Technologists', 'mtm-for-pharmaceutical-technologists', 'technologists',
   'Strengthen dispensing accuracy, screening, and therapy-review competencies in routine practice.',
   'Screen prescriptions for safety issues, support medication adherence, identify drug-related problems, and document interventions.',
   '9 months', 'Diploma', 'AMTMTI Diploma in MTM', 1200.00),
  ('MTM for Pharmaceutical Technicians', 'mtm-for-pharmaceutical-technicians', 'technicians',
   'Core MTM skills for technicians in community and institutional pharmacy practice.',
   'Apply MTM principles in daily practice, communicate with patients effectively, and support quality medication supply.',
   '6 months', 'Certificate', 'AMTMTI Certificate in MTM', 600.00),
  ('MTM for Clinicians', 'mtm-for-clinicians', 'clinicians',
   'Equip clinical officers and allied clinicians to integrate medication review into patient care.',
   'Recognize drug-related problems, apply rational prescribing principles, and refer effectively to pharmacy.',
   '12 weeks', 'Professional CPD', 'AMTMTI CPD Certificate', 350.00),
  ('MTM for Physicians', 'mtm-for-physicians', 'physicians',
   'Optimize prescribing, deprescribing, and chronic disease medication strategies.',
   'Apply evidence-based prescribing, manage polypharmacy, and lead deprescribing in chronic care.',
   '12 weeks', 'Professional CPD', 'AMTMTI CPD Certificate', 450.00),
  ('MTM for Nurses', 'mtm-for-nurses', 'nurses',
   'Lead medication reconciliation, adherence counseling, and patient education at the bedside.',
   'Perform medication reconciliation, educate patients on regimens, and identify adverse events.',
   '10 weeks', 'Professional CPD', 'AMTMTI CPD Certificate', 300.00)
) AS v(title, slug, cat_slug, summary, description, duration, level, certification, price_usd)
JOIN public.program_categories c ON c.slug = v.cat_slug
ON CONFLICT (slug) DO NOTHING;

-- Seed sample research articles
INSERT INTO public.research_articles (title, slug, area, abstract, authors, published_date, is_published) VALUES
  ('Implementing Pharmacist-Led MTM Services in Kenyan County Hospitals', 'pharmacist-led-mtm-kenya', 'Clinical Pharmacy',
   'A mixed-methods evaluation of pharmacist-led MTM implementation across Kenyan county hospitals.',
   'AMTMTI Research Division', '2026-01-15', true),
  ('Polypharmacy and Deprescribing Opportunities in West African Elderly Outpatients', 'polypharmacy-west-africa', 'Medication Safety',
   'Cross-sectional study identifying deprescribing opportunities among elderly outpatients.',
   'AMTMTI Research Division', '2025-08-20', true),
  ('Mobile-Health Adherence Tools for HIV Patients: A Pan-African Systematic Review', 'mhealth-hiv-adherence', 'Medication Adherence',
   'Systematic review of mobile health interventions for HIV medication adherence across Africa.',
   'AMTMTI Research Division', '2025-05-10', true),
  ('Pharmacovigilance Capacity Across SADC: A Cross-Sectional Study', 'pharmacovigilance-sadc', 'Public Health',
   'Assessment of pharmacovigilance systems and reporting capacity across SADC member states.',
   'AMTMTI Research Division', '2024-11-30', true)
ON CONFLICT (slug) DO NOTHING;
