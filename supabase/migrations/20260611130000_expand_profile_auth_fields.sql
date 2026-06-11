-- Expand profile data captured during sign up and keep email verification status in sync with Supabase Auth.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;

UPDATE public.profiles p
SET
  first_name = COALESCE(p.first_name, NULLIF(split_part(p.full_name, ' ', 1), '')),
  last_name = COALESCE(
    p.last_name,
    NULLIF(regexp_replace(COALESCE(p.full_name, ''), '^\S+\s*', ''), '')
  ),
  email_verified = COALESCE(u.email_confirmed_at IS NOT NULL, false)
FROM auth.users u
WHERE u.id = p.id;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_first_name TEXT := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'first_name', '')), '');
  v_last_name TEXT := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'last_name', '')), '');
  v_full_name TEXT := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')), '');
BEGIN
  IF v_full_name IS NULL THEN
    v_full_name := trim(COALESCE(v_first_name, '') || ' ' || COALESCE(v_last_name, ''));
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    first_name,
    last_name,
    avatar_url,
    phone,
    company,
    job_title,
    country,
    email_verified,
    marketing_consent,
    status
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(v_full_name, ''), split_part(NEW.email, '@', 1)),
    v_first_name,
    v_last_name,
    NEW.raw_user_meta_data->>'avatar_url',
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'phone', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'company', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'job_title', '')), ''),
    NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'country', '')), ''),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false),
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    first_name = COALESCE(public.profiles.first_name, EXCLUDED.first_name),
    last_name = COALESCE(public.profiles.last_name, EXCLUDED.last_name),
    phone = COALESCE(public.profiles.phone, EXCLUDED.phone),
    company = COALESCE(public.profiles.company, EXCLUDED.company),
    job_title = COALESCE(public.profiles.job_title, EXCLUDED.job_title),
    country = COALESCE(public.profiles.country, EXCLUDED.country),
    email_verified = EXCLUDED.email_verified,
    marketing_consent = public.profiles.marketing_consent OR EXCLUDED.marketing_consent;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_email_verified() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profiles
  SET email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_verified_changed ON auth.users;
CREATE TRIGGER on_auth_user_email_verified_changed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_email_verified();

CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);
