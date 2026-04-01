"use client";

import Link from "next/link";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="font-mono text-sm text-accent mb-4">Error</span>
      <h1 className="font-serif text-3xl font-bold mb-4">
        Couldn&apos;t load category
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Something went wrong loading this category. Please try again.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
