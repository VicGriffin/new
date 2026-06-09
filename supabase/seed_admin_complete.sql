-- Run once in Supabase Dashboard → SQL Editor (project ocmdizojulrfpnvgdile)
-- Enables scripts/ensure-dev-admin.mjs and fixes admin@amtmti.org access.

-- Bootstrap helpers (safe to re-run)
CREATE OR REPLACE FUNCTION public.has_any_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;

REVOKE ALL ON FUNCTION public.has_any_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_any_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to bootstrap admin access';
  END IF;
  IF public.has_any_admin() THEN
    RAISE EXCEPTION 'An admin account already exists. Contact an existing administrator.';
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;

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

-- Create auth user if missing (bypasses client weak-password checks)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT := crypt('Admin@123456', gen_salt('bf'));
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower('admin@amtmti.org');

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@amtmti.org',
      v_encrypted_pw,
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"AMTMTI Administrator"}',
      NOW(),
      NOW()
    );

    INSERT INTO auth.identities (
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id,
      format('{"sub":"%s","email":"admin@amtmti.org"}', v_user_id)::jsonb,
      'email',
      v_user_id::text,
      NOW(),
      NOW(),
      NOW()
    );
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, profession, country)
  VALUES (v_user_id, 'AMTMTI Administrator', 'Administrator', 'Kenya')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    profession = EXCLUDED.profession,
    country = EXCLUDED.country;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
