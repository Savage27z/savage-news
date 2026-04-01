import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify, calculateReadingTime } from "@/lib/utils";
import type { EditorialResult } from "./editorial";

const CATEGORY_IMAGES: Record<string, string[]> = {
  ai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1680474569854-81216b34417a?w=1200&h=630&fit=crop",
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop",
  ],
  science: [
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=630&fit=crop",
  ],
  business: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=1200&h=630&fit=crop",
  ],
  analysis: [
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=1200&h=630&fit=crop",
  ],
};

function pickImage(category: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.technology;
  return images[Math.floor(Math.random() * images.length)];
}

const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  ai: "a1b2c3d4-0001-4000-8000-000000000001",
  technology: "a1b2c3d4-0002-4000-8000-000000000002",
  science: "a1b2c3d4-0003-4000-8000-000000000003",
  business: "a1b2c3d4-0004-4000-8000-000000000004",
  analysis: "a1b2c3d4-0005-4000-8000-000000000005",
};

async function getCategoryId(slug: string): Promise<string> {
  if (CATEGORY_SLUG_TO_ID[slug]) {
    return CATEGORY_SLUG_TO_ID[slug];
  }

  const { data } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  return data?.id || CATEGORY_SLUG_TO_ID.technology;
}

export interface PublishedArticle {
  id: string;
  title: string;
  slug: string;
  quality_score: number;
}

export async function publishArticle(
  reviewed: EditorialResult
): Promise<PublishedArticle> {
  const baseSlug = slugify(reviewed.title);
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;
  const readingTime = calculateReadingTime(reviewed.content);
  const imageUrl = pickImage(reviewed.category);
  const categoryId = await getCategoryId(reviewed.category);

  const sources = reviewed.topic.source_articles.map((url) => ({
    name: url.replace(/https?:\/\/(www\.)?/, "").split("/")[0],
    url,
  }));

  if (reviewed.topic.social_signal) {
    sources.push({
      name: "Social Media Trends (Virlo)",
      url: reviewed.topic.social_signal,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert({
      title: reviewed.title,
      slug,
      subtitle: reviewed.subtitle,
      content: reviewed.content,
      summary: reviewed.summary,
      category_id: categoryId,
      image_url: imageUrl,
      image_caption: `AI-generated coverage of ${reviewed.category} news`,
      sources,
      reading_time: readingTime,
      ai_model: "claude-sonnet-4-5",
      status: "published",
      featured: false,
      published_at: new Date().toISOString(),
    })
    .select("id, title, slug")
    .single();

  if (error) {
    console.error(`[publish] Failed to insert article: ${error.message}`);
    throw error;
  }

  console.log(`[publish] Published: "${reviewed.title}" → /article/${slug}`);

  return {
    id: data.id,
    title: reviewed.title,
    slug,
    quality_score: reviewed.quality_score,
  };
}

export async function setFeaturedArticle(articleId: string): Promise<void> {
  await supabaseAdmin
    .from("articles")
    .update({ featured: false })
    .eq("featured", true);

  await supabaseAdmin
    .from("articles")
    .update({ featured: true })
    .eq("id", articleId);

  console.log(`[publish] Set featured article: ${articleId}`);
}
