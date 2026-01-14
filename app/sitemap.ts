import { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/content";
import { i18n } from "@/i18n-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://autom8ed.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllPostSlugs();

  const blogUrls: MetadataRoute.Sitemap = [];

  for (const lang of i18n.locales) {
    // Add homepage for each language
    blogUrls.push({
      url: `${SITE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });

    // Add all blog posts for each language
    for (const slug of slugs) {
      blogUrls.push({
        url: `${SITE_URL}/${lang}/blog/${slug}`,
        lastModified: new Date(), // Ideally, read from post.publishedAt
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return blogUrls;
}
