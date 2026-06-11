-- Fix audit trigger function to return OLD for DELETE operations

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
    INSERT INTO public.audit_logs (actor_id, action, table_name, row_id, changes)
      VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_id, payload);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    old_row := to_jsonb(OLD) - 'file_data';
    new_row := to_jsonb(NEW) - 'file_data';
    row_id := COALESCE(NULLIF(NEW.id::text, '')::UUID, NULL);
    payload := jsonb_build_object('old', old_row, 'new', new_row);
    INSERT INTO public.audit_logs (actor_id, action, table_name, row_id, changes)
      VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_id, payload);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    old_row := to_jsonb(OLD) - 'file_data';
    row_id := COALESCE(NULLIF(OLD.id::text, '')::UUID, NULL);
    payload := jsonb_build_object('old', old_row);
    INSERT INTO public.audit_logs (actor_id, action, table_name, row_id, changes)
      VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, row_id, payload);
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;
