-- Add automatic audit logging triggers for admin-managed tables

CREATE OR REPLACE FUNCTION public.audit_log_changes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  row_id UUID;
  old_row JSONB;
  new_row JSONB;
  payload JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    new_row := to_jsonb(NEW) - 'file_data';
    row_id := COALESCE(NULLIF(NEW.id::text, '')::UUID, NULL);
    payload := jsonb_build_object('new', new_row);
  ELSIF TG_OP = 'UPDATE' THEN
    old_row := to_jsonb(OLD) - 'file_data';
    new_row := to_jsonb(NEW) - 'file_data';
    row_id := COALESCE(NULLIF(NEW.id::text, '')::UUID, NULL);
    payload := jsonb_build_object('old', old_row, 'new', new_row);
  ELSIF TG_OP = 'DELETE' THEN
    old_row := to_jsonb(OLD) - 'file_data';
    row_id := COALESCE(NULLIF(OLD.id::text, '')::UUID, NULL);
    payload := jsonb_build_object('old', old_row);
  ELSE
    RETURN NULL;
  END IF;

  INSERT INTO public.audit_logs (actor_id, action, table_name, row_id, changes)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_id, payload);
  RETURN NEW;
END;
$$;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Attach audit triggers to tables with direct admin and authenticated writes.
DROP TRIGGER IF EXISTS audit_program_categories ON public.program_categories;
CREATE TRIGGER audit_program_categories
  AFTER INSERT OR UPDATE OR DELETE ON public.program_categories
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_programs ON public.programs;
CREATE TRIGGER audit_programs
  AFTER INSERT OR UPDATE OR DELETE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_research_articles ON public.research_articles;
CREATE TRIGGER audit_research_articles
  AFTER INSERT OR UPDATE OR DELETE ON public.research_articles
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_news ON public.news;
CREATE TRIGGER audit_news
  AFTER INSERT OR UPDATE OR DELETE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_events ON public.events;
CREATE TRIGGER audit_events
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_resources ON public.resources;
CREATE TRIGGER audit_resources
  AFTER INSERT OR UPDATE OR DELETE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_course_enrollments ON public.course_enrollments;
CREATE TRIGGER audit_course_enrollments
  AFTER INSERT OR UPDATE OR DELETE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_membership_applications ON public.membership_applications;
CREATE TRIGGER audit_membership_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.membership_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_contacts ON public.contacts;
CREATE TRIGGER audit_contacts
  AFTER INSERT OR UPDATE OR DELETE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_partners ON public.partners;
CREATE TRIGGER audit_partners
  AFTER INSERT OR UPDATE OR DELETE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();

DROP TRIGGER IF EXISTS audit_testimonials ON public.testimonials;
CREATE TRIGGER audit_testimonials
  AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();
