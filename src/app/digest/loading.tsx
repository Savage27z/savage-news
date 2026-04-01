export default function DigestLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
        <div className="h-12 w-64 rounded bg-muted mb-3" />
        <div className="h-4 w-48 rounded bg-muted" />
      </div>

      <div className="border-l-2 border-muted pl-6 space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-4 w-8 rounded bg-muted" />
            </div>
            <div className="h-6 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
