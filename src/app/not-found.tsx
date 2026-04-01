import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="font-mono text-sm text-accent mb-4">404</span>
      <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to
        the homepage to find what you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Back to Homepage
      </Link>
    </div>
  );
}
