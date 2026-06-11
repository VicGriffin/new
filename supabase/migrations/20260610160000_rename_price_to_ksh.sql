-- Rename price_usd to price_ksh for all pricing columns
ALTER TABLE public.programs
  RENAME COLUMN price_usd TO price_ksh;

-- Update column comment
COMMENT ON COLUMN public.programs.price_ksh IS 'Program price in Kenyan Shillings (KSH)';
