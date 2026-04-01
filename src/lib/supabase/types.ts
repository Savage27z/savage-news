export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  content: string;
  summary: string;
  category_id: string;
  image_url: string | null;
  image_caption: string | null;
  sources: { name: string; url: string }[];
  reading_time: number | null;
  ai_model: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface PipelineRun {
  id: string;
  status: "running" | "completed" | "failed";
  topics_found: number;
  articles_generated: number;
  started_at: string;
  completed_at: string | null;
  log: { step: string; message: string; timestamp: string }[];
  error: string | null;
}
