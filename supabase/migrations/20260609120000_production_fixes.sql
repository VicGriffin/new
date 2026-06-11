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

-- Seed flagship programs (idempotent via slug) with rich content for demo/visual purposes
INSERT INTO public.programs (
  title, slug, category_id, summary, description, duration, level, certification, price_ksh,
  learning_outcomes, curriculum, requirements, apply_link, cover_url, is_published
)
SELECT v.title, v.slug, c.id, v.summary, v.description, v.duration, v.level, v.certification, v.price_ksh,
  v.learning_outcomes::jsonb, v.curriculum::jsonb, v.requirements::jsonb, v.apply_link, v.cover_url, true
FROM (VALUES
  ('MTM for Pharmacists', 'mtm-for-pharmacists', 'pharmacists',
   'Comprehensive training in advanced medication therapy management',
   'This comprehensive program equips pharmacists with advanced knowledge and clinical skills to optimize medication therapy management in diverse healthcare settings. Participants learn to conduct thorough medication reviews, identify drug-related problems, and develop evidence-based recommendations for medication optimization.',
   '12 months', 'Postgraduate Diploma', 'Advanced MTM Certificate in Pharmacotherapy', 312000.00,
   '["Conduct comprehensive medication therapy reviews","Identify and resolve drug-related problems","Develop evidence-based medication optimization plans","Counsel patients on medication adherence and safety","Lead MTM initiatives in healthcare settings","Apply evidence-based clinical guidelines in practice"]',
   '[{"module_title":"Module 1: Foundations of MTM","module_description":"Core concepts in medication therapy management and pharmaceutical care","topics":["MTM Process and Competencies","Pharmacist\'s Role in Healthcare","Patient-Centered Care","Documentation and Communication"]},{"module_title":"Module 2: Clinical Pharmacotherapy","module_description":"Advanced concepts in drug therapy across major disease states","topics":["Cardiovascular Disorders","Diabetes and Metabolic Disease","Respiratory Conditions","Infectious Diseases"]},{"module_title":"Module 3: Drug Interactions & Safety","module_description":"Comprehensive understanding of drug interactions and safety management","topics":["Pharmacokinetic Interactions","Pharmacodynamic Interactions","Adverse Drug Reactions","Risk Mitigation Strategies"]},{"module_title":"Module 4: Polypharmacy Management","module_description":"Strategies for managing complex medication regimens","topics":["Deprescribing Principles","Medication Reconciliation","Geriatric Considerations","Drug-Disease Interactions"]}]',
   '["Bachelor\'s degree in Pharmacy or equivalent","Valid pharmacy license in home country","Minimum 2 years professional experience","Good command of English","Access to computer with internet connection"]',
   '/auth', NULL),

  ('MTM for Pharmaceutical Technologists', 'mtm-for-pharmaceutical-technologists', 'technologists',
   'Strengthen dispensing accuracy, screening, and therapy-review competencies in routine practice.',
   'Focused diploma-level training to enhance technical competencies in dispensing, quality assurance, and medication safety for pharmaceutical technologists.',
   '9 months', 'Diploma', 'AMTMTI Diploma in MTM', 156000.00,
   '["Perform accurate dispensing and verification","Identify common medication errors","Support medication adherence initiatives","Document and communicate interventions"]',
   '[{"module_title":"Foundations","module_description":"Essentials of pharmacy operations and safety","topics":["Dispensing workflows","Supply chain basics","Documentation"]},{"module_title":"Medication Safety","module_description":"Detecting and preventing errors","topics":["Error recognition","Counseling basics","Reporting systems"]}]',
   '["Diploma in Pharmaceutical Technology or equivalent","Basic pharmacy experience","Good communication skills"]',
   '/auth', NULL),

  ('MTM for Pharmaceutical Technicians', 'mtm-for-pharmaceutical-technicians', 'technicians',
   'Core MTM skills for technicians in community and institutional pharmacy practice.',
   'Practical certificate-level training enabling technicians to support pharmacists with medication reviews, patient counseling, and safe medication handling.',
   '6 months', 'Certificate', 'AMTMTI Certificate in MTM', 78000.00,
   '["Support medication reconciliation","Assist in medication adherence counseling","Carry out basic screening for drug-related problems"]',
   '[{"module_title":"Community Practice","module_description":"Day-to-day pharmacy tasks","topics":["Customer communication","Basic screening","Stock management"]},{"module_title":"Medication Support","module_description":"Assistive roles in MTM","topics":["Adherence support","Documentation","Referral pathways"]}]',
   '["High school diploma or equivalent","On-the-job pharmacy experience"]',
   '/auth', NULL),

  ('MTM for Clinicians', 'mtm-for-clinicians', 'clinicians',
   'Equip clinical officers and allied clinicians to integrate medication review into patient care.',
   'Short professional CPD to help clinicians identify medication-related problems, apply rational prescribing principles, and collaborate with pharmacy services.',
   '12 weeks', 'Professional CPD', 'AMTMTI CPD Certificate', 45500.00,
   '["Recognize drug-related problems","Apply rational prescribing principles","Refer appropriately to pharmacy services"]',
   '[{"module_title":"Clinical Review","module_description":"Medication review in clinical practice","topics":["History taking","Medication reconciliation","Risk assessment"]},{"module_title":"Therapeutics","module_description":"Core therapeutic areas","topics":["Cardiovascular","Infectious diseases","Diabetes"]}]',
   '["Registered clinician","Professional practice experience"]',
   '/auth', NULL),

  ('MTM for Physicians', 'mtm-for-physicians', 'physicians',
   'Optimize prescribing, deprescribing, and chronic disease medication strategies.',
   'Focused CPD for physicians to optimize complex medication regimens, lead deprescribing efforts, and implement evidence-based pharmacotherapy.',
   '12 weeks', 'Professional CPD', 'AMTMTI CPD Certificate', 58500.00,
   '["Optimize prescribing in chronic disease","Lead deprescribing initiatives","Collaborate on interdisciplinary medication plans"]',
   '[{"module_title":"Advanced Pharmacotherapy","module_description":"In-depth therapeutic strategies","topics":["Polypharmacy management","Complex comorbidity care","Deprescribing frameworks"]},{"module_title":"Systems Approaches","module_description":"Implementing medication optimisation programs","topics":["Audit and feedback","Multidisciplinary pathways","Clinical governance"]}]',
   '["Medical degree","Clinical experience"]',
   '/auth', NULL),

  ('MTM for Nurses', 'mtm-for-nurses', 'nurses',
   'Lead medication reconciliation, adherence counseling, and patient education at the bedside.',
   'Practical CPD for nurses to improve medication safety, conduct reconciliation, and support patient-centered adherence strategies.',
   '10 weeks', 'Professional CPD', 'AMTMTI CPD Certificate', 39000.00,
   '["Perform medication reconciliation","Provide adherence counselling","Identify common adverse drug events"]',
   '[{"module_title":"Nursing Roles in MTM","module_description":"Nursing contributions to medication safety","topics":["Reconciliation","Patient education","Monitoring"]},{"module_title":"Adherence Support","module_description":"Practical adherence interventions","topics":["Counselling techniques","Follow-up strategies","Community resources"]}]',
   '["Registered nurse","Clinical experience"]',
   '/auth', NULL)
) AS v(title, slug, cat_slug, summary, description, duration, level, certification, price_ksh, learning_outcomes, curriculum, requirements, apply_link, cover_url)
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
