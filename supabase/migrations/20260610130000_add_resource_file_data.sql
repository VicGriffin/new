ALTER TABLE public.resources
  ADD COLUMN file_data TEXT,
  ADD COLUMN file_name TEXT,
  ADD COLUMN content_type TEXT;
