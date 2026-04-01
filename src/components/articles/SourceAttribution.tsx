import { ExternalLink } from "lucide-react";

interface Source {
  name: string;
  url: string;
}

interface SourceAttributionProps {
  sources: Source[];
}

export function SourceAttribution({ sources }: SourceAttributionProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-6">
      <h3 className="font-mono text-xs uppercase tracking-widest font-medium text-muted-foreground mb-4">
        Sources & References
      </h3>
      <ul className="space-y-2.5">
        {sources.map((source, i) => (
          <li key={i}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {source.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
