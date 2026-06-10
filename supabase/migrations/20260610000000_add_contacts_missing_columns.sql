-- Add missing columns to contacts table
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_response TEXT;

-- Update RLS policy to allow admins to update the new columns
DROP POLICY IF EXISTS "Admins update contacts" ON public.contacts;
CREATE POLICY "Admins update contacts" ON public.contacts 
FOR UPDATE USING (public.has_role(auth.uid(),'admin'));
