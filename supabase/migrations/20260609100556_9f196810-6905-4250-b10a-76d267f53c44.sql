
-- Roles enum + user_roles
CREATE TYPE public.app_role AS ENUM ('admin','instructor','student','member');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  country TEXT,
  profession TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- Trigger to create profile + student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Programs
CREATE TABLE public.program_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);
GRANT SELECT ON public.program_categories TO anon, authenticated;
GRANT ALL ON public.program_categories TO service_role;
ALTER TABLE public.program_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.program_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.program_categories FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.program_categories(id) ON DELETE SET NULL,
  summary TEXT,
  description TEXT,
  duration TEXT,
  level TEXT,
  certification TEXT,
  price_ksh NUMERIC(12,2) DEFAULT 0,
  cover_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published programs" ON public.programs FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage programs" ON public.programs FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_programs_touch BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Research
CREATE TABLE public.research_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  area TEXT,
  abstract TEXT,
  authors TEXT,
  published_date DATE,
  url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.research_articles TO anon, authenticated;
GRANT ALL ON public.research_articles TO service_role;
ALTER TABLE public.research_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read research" ON public.research_articles FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage research" ON public.research_articles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- News
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT,
  cover_url TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon, authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage news" ON public.news FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (is_published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Resources (course materials)
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'document',
  url TEXT,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read public resources" ON public.resources FOR SELECT USING (is_public);
CREATE POLICY "Authenticated read resources" ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage resources" ON public.resources FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Enrollments
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  progress INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, program_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own enrollments" ON public.course_enrollments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all enrollments" ON public.course_enrollments FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- Membership applications
CREATE TABLE public.membership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  profession TEXT,
  tier TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.membership_applications TO anon, authenticated;
GRANT ALL ON public.membership_applications TO service_role;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.membership_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read applications" ON public.membership_applications FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update applications" ON public.membership_applications FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- Contact messages
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can contact" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read contacts" ON public.contacts FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update contacts" ON public.contacts FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
