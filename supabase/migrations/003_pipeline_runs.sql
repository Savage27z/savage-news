CREATE TABLE pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  topics_found INTEGER DEFAULT 0,
  articles_generated INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  log JSONB DEFAULT '[]'::jsonb,
  error TEXT
);

CREATE INDEX idx_pipeline_runs_started_at ON pipeline_runs(started_at DESC);

ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pipeline_runs" ON pipeline_runs FOR SELECT USING (true);
CREATE POLICY "Service role full access pipeline_runs" ON pipeline_runs FOR ALL USING (auth.role() = 'service_role');
