import { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Pulse AI articles across technology, AI, science, and more.",
};

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="max-w-2xl mx-auto mb-12">
        <div className="h-10 w-48 mx-auto rounded bg-muted mb-8" />
        <div className="h-14 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchClient />
    </Suspense>
  );
}
