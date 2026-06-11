-- Run this in Supabase Dashboard → SQL Editor if migrations are not pushed yet.
-- Includes bootstrap functions + manual admin grant for an existing auth user.

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

-- Optional: grant admin to a user created in Authentication → Users
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = '<ADMIN_EMAIL>'
-- ON CONFLICT (user_id, role) DO NOTHING;
