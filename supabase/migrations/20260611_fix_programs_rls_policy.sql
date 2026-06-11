-- Comprehensive fix for RLS policies to handle NULL auth.uid() for anonymous users
-- This prevents 401 errors when anonymous users try to read published content

-- Programs table
DROP POLICY IF EXISTS "Public read published programs" ON public.programs;
CREATE POLICY "Public read published programs" ON public.programs FOR SELECT 
USING (
  is_published = true 
  OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(),'admin'))
);

-- Research articles table
DROP POLICY IF EXISTS "Public read research" ON public.research_articles;
CREATE POLICY "Public read research" ON public.research_articles FOR SELECT 
USING (
  is_published = true 
  OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(),'admin'))
);

-- News table
DROP POLICY IF EXISTS "Public read news" ON public.news;
CREATE POLICY "Public read news" ON public.news FOR SELECT 
USING (
  is_published = true 
  OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(),'admin'))
);

-- Events table
DROP POLICY IF EXISTS "Public read events" ON public.events;
CREATE POLICY "Public read events" ON public.events FOR SELECT 
USING (
  is_published = true 
  OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(),'admin'))
);
