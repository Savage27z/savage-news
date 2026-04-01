export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-12 rounded bg-muted" />
        <div className="h-4 w-4 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
      <div className="max-w-3xl mx-auto space-y-6 mb-10">
        <div className="h-5 w-24 rounded-full bg-muted" />
        <div className="h-12 w-full rounded bg-muted" />
        <div className="h-12 w-3/4 rounded bg-muted" />
        <div className="h-5 w-48 rounded bg-muted" />
      </div>
      <div className="max-w-4xl mx-auto mb-10">
        <div className="aspect-[16/9] rounded-xl bg-muted" />
      </div>
      <div className="max-w-[680px] mx-auto space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
