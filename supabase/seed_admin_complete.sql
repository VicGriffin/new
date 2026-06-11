-- Production-safe first-admin provisioning SQL.
-- This file intentionally contains no credentials. scripts/provision-admin-db.mjs
-- injects ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_DISPLAY_NAME as transaction-local
-- PostgreSQL settings before executing it.
--
-- Manual SQL Editor usage (replace placeholders before running):
--   SELECT set_config('app.admin_email', '<ADMIN_EMAIL>', false);
--   SELECT set_config('app.admin_password', '<ADMIN_PASSWORD>', false);
--   SELECT set_config('app.admin_display_name', '<ADMIN_DISPLAY_NAME>', false);
--   \i supabase/seed_admin_complete.sql -- psql only; paste the remainder in Dashboard SQL Editor.

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

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id UUID;
  v_admin_email TEXT := lower(nullif(current_setting('app.admin_email', true), ''));
  v_admin_password TEXT := nullif(current_setting('app.admin_password', true), '');
  v_display_name TEXT := coalesce(nullif(current_setting('app.admin_display_name', true), ''), 'AMTMTI Administrator');
  v_encrypted_pw TEXT;
BEGIN
  IF v_admin_email IS NULL OR v_admin_password IS NULL THEN
    RAISE EXCEPTION 'app.admin_email and app.admin_password settings are required';
  END IF;
  IF length(v_admin_password) < 12 THEN
    RAISE EXCEPTION 'Admin password must be at least 12 characters';
  END IF;

  v_encrypted_pw := crypt(v_admin_password, gen_salt('bf'));
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_admin_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    )
    VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_admin_email,
      v_encrypted_pw,
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', v_display_name),
      NOW(),
      NOW()
    );

    INSERT INTO auth.identities (
      user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    )
    VALUES (
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_admin_email),
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
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('full_name', v_display_name),
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, profession, country, status)
  VALUES (v_user_id, v_display_name, 'Administrator', 'Kenya', 'approved')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    profession = COALESCE(public.profiles.profession, EXCLUDED.profession),
    country = COALESCE(public.profiles.country, EXCLUDED.country),
    status = 'approved';

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
