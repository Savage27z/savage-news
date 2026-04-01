"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Loader2, CheckCircle2, XCircle, RefreshCw, Clock } from "lucide-react";

interface PipelineRun {
  id: string;
  status: "running" | "completed" | "failed";
  topics_found: number;
  articles_generated: number;
  started_at: string;
  completed_at: string | null;
  error: string | null;
}

export default function AdminPage() {
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/runs");
      if (res.ok) {
        const data = await res.json();
        setRuns(data.runs || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  useEffect(() => {
    if (!currentRunId || status !== "running") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pipeline/status/${currentRunId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            setStatus("completed");
            setCurrentRunId(null);
            fetchRuns();
          } else if (data.status === "failed") {
            setStatus("failed");
            setError(data.error || "Pipeline failed");
            setCurrentRunId(null);
            fetchRuns();
          }
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [currentRunId, status, fetchRuns]);

  async function triggerPipeline() {
    setLoading(true);
    setError(null);
    setStatus("running");

    try {
      const res = await fetch("/api/admin/trigger", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to trigger pipeline");
      }

      if (data.runId) {
        setCurrentRunId(data.runId);
      } else {
        setStatus("completed");
        fetchRuns();
      }
    } catch (e) {
      setStatus("failed");
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const statusConfig = {
    idle: { icon: Play, color: "text-muted-foreground", bg: "bg-muted" },
    running: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10" },
    completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
          Admin
        </span>
        <h1 className="font-serif text-3xl font-bold mt-1">Pipeline Control</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manually trigger the AI editorial pipeline and monitor its progress.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${statusConfig[status].bg}`}>
              <StatusIcon
                className={`h-5 w-5 ${statusConfig[status].color} ${status === "running" ? "animate-spin" : ""}`}
              />
            </div>
            <div>
              <p className="font-medium text-sm capitalize">{status}</p>
              <p className="text-xs text-muted-foreground">
                {status === "idle" && "Ready to run"}
                {status === "running" && "Pipeline is processing..."}
                {status === "completed" && "Pipeline finished successfully"}
                {status === "failed" && "Pipeline encountered an error"}
              </p>
            </div>
          </div>

          <button
            onClick={triggerPipeline}
            disabled={status === "running" || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "running" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Pipeline Now
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs uppercase tracking-widest font-medium text-muted-foreground">
            Recent Runs
          </h2>
          <button
            onClick={fetchRuns}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No pipeline runs recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {runs.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-3">
                  {run.status === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {run.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                  {run.status === "running" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                  <div>
                    <p className="text-sm font-medium">
                      {run.articles_generated} article{run.articles_generated !== 1 ? "s" : ""} generated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {run.topics_found} topics found
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(run.started_at).toLocaleString()}
                  </div>
                  {run.error && (
                    <p className="text-[10px] text-red-400 mt-0.5 max-w-[200px] truncate">
                      {run.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
