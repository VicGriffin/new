-- Add program metadata fields for detailed program pages
ALTER TABLE public.programs
  ADD COLUMN mode TEXT DEFAULT 'Online',
  ADD COLUMN apply_link TEXT,
  ADD COLUMN learning_outcomes JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN requirements JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN curriculum JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN pdf_url TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.programs.mode IS 'Study mode: Online, In-person, Blended, etc.';
COMMENT ON COLUMN public.programs.apply_link IS 'External URL for program application or enrollment';
COMMENT ON COLUMN public.programs.learning_outcomes IS 'Array of learning outcome strings';
COMMENT ON COLUMN public.programs.requirements IS 'Array of entry requirement strings';
COMMENT ON COLUMN public.programs.curriculum IS 'Array of curriculum module objects with module_title, module_description, topics';
COMMENT ON COLUMN public.programs.pdf_url IS 'Optional URL to program details PDF';
