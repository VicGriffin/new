-- Grant admin role to the seed admin email (authenticated caller must match).
-- Used by scripts/ensure-dev-admin.mjs — no service role key required.

CREATE OR REPLACE FUNCTION public.claim_seed_admin()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  IF user_email IS NULL OR lower(user_email) <> lower('admin@amtmti.org') THEN
    RAISE EXCEPTION 'Seed admin claim is only for admin@amtmti.org';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.profiles
  SET
    full_name = COALESCE(NULLIF(full_name, ''), 'AMTMTI Administrator'),
    profession = COALESCE(NULLIF(profession, ''), 'Administrator'),
    country = COALESCE(NULLIF(country, ''), 'Kenya')
  WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.claim_seed_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_seed_admin() TO authenticated;

-- New signups for the seed email get admin instead of student
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  default_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  IF lower(NEW.email) = lower('admin@amtmti.org') THEN
    default_role := 'admin';
  ELSE
    default_role := 'student';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, default_role);
  RETURN NEW;
END;
$$;
