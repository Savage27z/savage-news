export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="max-w-2xl mx-auto mb-12">
        <div className="h-10 w-48 mx-auto rounded bg-muted mb-8" />
        <div className="h-14 w-full rounded-xl bg-muted" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <div className="aspect-[16/9] bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-6 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
