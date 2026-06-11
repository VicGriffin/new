-- Upsert rich demo content for flagship programs

-- MTM for Pharmacists
UPDATE public.programs SET
  summary = 'Comprehensive training in advanced medication therapy management',
  description = 'This comprehensive program equips pharmacists with advanced knowledge and clinical skills to optimize medication therapy management in diverse healthcare settings. Participants learn to conduct thorough medication reviews, identify drug-related problems, and develop evidence-based recommendations for medication optimization.',
  learning_outcomes = '["Conduct comprehensive medication therapy reviews","Identify and resolve drug-related problems","Develop evidence-based medication optimization plans","Counsel patients on medication adherence and safety","Lead MTM initiatives in healthcare settings","Apply evidence-based clinical guidelines in practice"]'::jsonb,
  curriculum = '[{"module_title":"Module 1: Foundations of MTM","module_description":"Core concepts in medication therapy management and pharmaceutical care","topics":["MTM Process and Competencies","Pharmacist''s Role in Healthcare","Patient-Centered Care","Documentation and Communication"]},{"module_title":"Module 2: Clinical Pharmacotherapy","module_description":"Advanced concepts in drug therapy across major disease states","topics":["Cardiovascular Disorders","Diabetes and Metabolic Disease","Respiratory Conditions","Infectious Diseases"]},{"module_title":"Module 3: Drug Interactions & Safety","module_description":"Comprehensive understanding of drug interactions and safety management","topics":["Pharmacokinetic Interactions","Pharmacodynamic Interactions","Adverse Drug Reactions","Risk Mitigation Strategies"]},{"module_title":"Module 4: Polypharmacy Management","module_description":"Strategies for managing complex medication regimens","topics":["Deprescribing Principles","Medication Reconciliation","Geriatric Considerations","Drug-Disease Interactions"]}]'::jsonb,
  requirements = '["Bachelor''s degree in Pharmacy or equivalent","Valid pharmacy license in home country","Minimum 2 years professional experience","Good command of English","Access to computer with internet connection"]'::jsonb,
  apply_link = '/auth'
WHERE slug = 'mtm-for-pharmacists';

-- Other programs: brief rich content
UPDATE public.programs SET
  summary = 'Strengthen dispensing accuracy, screening, and therapy-review competencies in routine practice.',
  description = 'Focused diploma-level training to enhance technical competencies in dispensing, quality assurance, and medication safety for pharmaceutical technologists.',
  learning_outcomes = '["Perform accurate dispensing and verification","Identify common medication errors","Support medication adherence initiatives","Document and communicate interventions"]'::jsonb,
  curriculum = '[{"module_title":"Foundations","module_description":"Essentials of pharmacy operations and safety","topics":["Dispensing workflows","Supply chain basics","Documentation"]},{"module_title":"Medication Safety","module_description":"Detecting and preventing errors","topics":["Error recognition","Counseling basics","Reporting systems"]}]'::jsonb,
  requirements = '["Diploma in Pharmaceutical Technology or equivalent","Basic pharmacy experience","Good communication skills"]'::jsonb,
  apply_link = '/auth'
WHERE slug = 'mtm-for-pharmaceutical-technologists';

UPDATE public.programs SET
  summary = 'Core MTM skills for technicians in community and institutional pharmacy practice.',
  description = 'Practical certificate-level training enabling technicians to support pharmacists with medication reviews, patient counseling, and safe medication handling.',
  learning_outcomes = '["Support medication reconciliation","Assist in medication adherence counseling","Carry out basic screening for drug-related problems"]'::jsonb,
  curriculum = '[{"module_title":"Community Practice","module_description":"Day-to-day pharmacy tasks","topics":["Customer communication","Basic screening","Stock management"]},{"module_title":"Medication Support","module_description":"Assistive roles in MTM","topics":["Adherence support","Documentation","Referral pathways"]}]'::jsonb,
  requirements = '["High school diploma or equivalent","On-the-job pharmacy experience"]'::jsonb,
  apply_link = '/auth'
WHERE slug = 'mtm-for-pharmaceutical-technicians';

UPDATE public.programs SET
  summary = 'Equip clinical officers and allied clinicians to integrate medication review into patient care.',
  description = 'Short professional CPD to help clinicians identify medication-related problems, apply rational prescribing principles, and collaborate with pharmacy services.',
  learning_outcomes = '["Recognize drug-related problems","Apply rational prescribing principles","Refer appropriately to pharmacy services"]'::jsonb,
  curriculum = '[{"module_title":"Clinical Review","module_description":"Medication review in clinical practice","topics":["History taking","Medication reconciliation","Risk assessment"]},{"module_title":"Therapeutics","module_description":"Core therapeutic areas","topics":["Cardiovascular","Infectious diseases","Diabetes"]}]'::jsonb,
  requirements = '["Registered clinician","Professional practice experience"]'::jsonb,
  apply_link = '/auth'
WHERE slug = 'mtm-for-clinicians';

UPDATE public.programs SET
  summary = 'Optimize prescribing, deprescribing, and chronic disease medication strategies.',
  description = 'Focused CPD for physicians to optimize complex medication regimens, lead deprescribing efforts, and implement evidence-based pharmacotherapy.',
  learning_outcomes = '["Optimize prescribing in chronic disease","Lead deprescribing initiatives","Collaborate on interdisciplinary medication plans"]'::jsonb,
  curriculum = '[{"module_title":"Advanced Pharmacotherapy","module_description":"In-depth therapeutic strategies","topics":["Polypharmacy management","Complex comorbidity care","Deprescribing frameworks"]},{"module_title":"Systems Approaches","module_description":"Implementing medication optimisation programs","topics":["Audit and feedback","Multidisciplinary pathways","Clinical governance"]}]'::jsonb,
  requirements = '["Medical degree","Clinical experience"]'::jsonb,
  apply_link = '/auth'
WHERE slug = 'mtm-for-physicians';

UPDATE public.programs SET
  summary = 'Lead medication reconciliation, adherence counseling, and patient education at the bedside.',
  description = 'Practical CPD for nurses to improve medication safety, conduct reconciliation, and support patient-centered adherence strategies.',
  learning_outcomes = '["Perform medication reconciliation","Provide adherence counselling","Identify common adverse drug events"]'::jsonb,
  curriculum = '[{"module_title":"Nursing Roles in MTM","module_description":"Nursing contributions to medication safety","topics":["Reconciliation","Patient education","Monitoring"]},{"module_title":"Adherence Support","module_description":"Practical adherence interventions","topics":["Counselling techniques","Follow-up strategies","Community resources"]}]'::jsonb,
  requirements = '["Registered nurse","Clinical experience"]'::jsonb,
  apply_link = '/auth'
WHERE slug = 'mtm-for-nurses';
