-- Create audit_logs table and helper to record admin actions

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  row_id UUID,
  changes JSONB,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.audit_logs TO service_role;
GRANT SELECT ON public.audit_logs TO authenticated;

-- Helper function to insert audit logs (security definer so server role can call it safely)
CREATE OR REPLACE FUNCTION public.insert_audit_log(
  _actor_id UUID,
  _action TEXT,
  _table_name TEXT,
  _row_id UUID DEFAULT NULL,
  _changes JSONB DEFAULT NULL,
  _meta JSONB DEFAULT NULL
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, table_name, row_id, changes, meta)
  VALUES (_actor_id, _action, _table_name, _row_id, _changes, _meta);
END;
$$;

-- Restrict direct inserts from non-service roles via RLS (optional but safer)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role insert only" ON public.audit_logs FOR ALL USING (false) WITH CHECK (false);

-- Make the helper function the intended API for writing audit logs
GRANT EXECUTE ON FUNCTION public.insert_audit_log(UUID, TEXT, TEXT, UUID, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_audit_log(UUID, TEXT, TEXT, UUID, JSONB, JSONB) TO service_role;

-- Index for faster queries by table_name and created_at
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_created_at ON public.audit_logs (table_name, created_at DESC);
