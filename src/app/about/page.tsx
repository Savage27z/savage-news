import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  FileText,
  PenLine,
  CheckCircle,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Pulse AI uses artificial intelligence to deliver premium, transparent journalism covering technology, AI, and science.",
};

const pipelineSteps = [
  {
    icon: Search,
    title: "Discovery",
    description:
      "Our AI systems continuously monitor hundreds of sources — academic papers, press releases, government filings, and trusted news outlets — to identify the most significant emerging stories.",
  },
  {
    icon: FileText,
    title: "Research",
    description:
      "Once a story is identified, the pipeline aggregates information from multiple primary sources, cross-references claims, and builds a comprehensive factual foundation for the article.",
  },
  {
    icon: PenLine,
    title: "Writing",
    description:
      "Using advanced language models, articles are drafted following journalistic best practices: strong ledes, proper context, balanced perspectives, and clear analysis.",
  },
  {
    icon: CheckCircle,
    title: "Editorial Review",
    description:
      "A separate AI editorial pass checks for accuracy, bias, readability, and adherence to our style guide. Sources are verified and properly attributed.",
  },
  {
    icon: Globe,
    title: "Publication",
    description:
      "Approved articles are published with full source attribution, AI model disclosure, and transparent labeling. Every article clearly states it was AI-generated.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
          About Pulse AI
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Pulse AI is an AI-native newsroom that delivers in-depth, transparent journalism
          covering the frontiers of technology, artificial intelligence, and science. We
          believe the future of news is augmented by AI — faster, more comprehensive, and
          radically transparent about its origins.
        </p>
      </header>

      <Separator className="my-10" />

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Every article published on Pulse AI goes through a multi-step editorial pipeline
          designed to ensure quality, accuracy, and transparency. Here&apos;s how our
          process works:
        </p>

        <div className="space-y-8">
          {pipelineSteps.map((step, i) => (
            <div key={step.title} className="flex gap-5">
              <div className="shrink-0 flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <step.icon className="h-5 w-5" />
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-2" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-serif text-lg font-semibold mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-10" />

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-4">
          Our Commitment to Transparency
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Every article on Pulse AI is clearly labeled as AI-generated content. We
            believe readers deserve to know how their news is produced, and we&apos;re
            committed to full disclosure about our methods.
          </p>
          <p>
            All articles include source attribution — the primary sources, research
            papers, and references used to produce each piece. We link directly to
            original sources whenever possible so readers can verify claims independently.
          </p>
          <p>
            We also disclose the AI model used to generate each article, providing an
            additional layer of accountability and reproducibility.
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      <section>
        <h2 className="font-serif text-2xl font-bold mb-4">Technology Stack</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Pulse AI is built with modern, open technologies:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              <strong className="text-foreground">Next.js</strong> — React framework for the web interface
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              <strong className="text-foreground">Supabase</strong> — PostgreSQL database and authentication
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              <strong className="text-foreground">Claude (Anthropic)</strong> — Large language model for article generation
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              <strong className="text-foreground">Tailwind CSS</strong> — Utility-first styling
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
