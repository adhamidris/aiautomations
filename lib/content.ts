import fs from "fs";
import path from "path";
import { Locale } from "@/i18n-config";

// Define the shape of a blog post content file
export interface BlogPostFile {
    slug: string;
    publishedAt: string;
    seo: {
        title: string;
        description: string;
        keywords: string[];
        ogImage?: string; // Optional: URL to Open Graph image for social sharing
    };
    en: LocalizedContent;
    ar: LocalizedContent;
}

export interface LocalizedContent {
    title: string;
    category: string;
    excerpt: string;
    content: string;
}

// Combined type for a post with a specific language's content hydrated
export interface BlogPost {
    slug: string;
    publishedAt: string;
    seo: BlogPostFile["seo"];
    title: string;
    category: string;
    excerpt: string;
    content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Gets all blog post slugs (filenames without .json extension).
 */
export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(CONTENT_DIR)) {
        return [];
    }
    const files = fs.readdirSync(CONTENT_DIR);
    return files
        .filter((file) => file.endsWith(".json"))
        .map((file) => file.replace(".json", ""));
}

/**
 * Reads a single blog post file by slug.
 */
function readPostFile(slug: string): BlogPostFile | null {
    const filePath = path.join(CONTENT_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent) as BlogPostFile;
}

/**
 * Gets a single blog post with content for the specified language.
 */
export function getPostBySlug(slug: string, lang: Locale): BlogPost | null {
    const postFile = readPostFile(slug);
    if (!postFile) {
        return null;
    }

    const localizedContent = postFile[lang];

    return {
        slug: postFile.slug,
        publishedAt: postFile.publishedAt,
        seo: postFile.seo,
        title: localizedContent.title,
        category: localizedContent.category,
        excerpt: localizedContent.excerpt,
        content: localizedContent.content,
    };
}

/**
 * Gets all blog posts (metadata only, no full content) for listing purposes.
 * Sorted by publishedAt date, descending.
 */
export function getAllPosts(lang: Locale): Omit<BlogPost, "content">[] {
    const slugs = getAllPostSlugs();
    const posts = slugs
        .map((slug) => {
            const post = getPostBySlug(slug, lang);
            if (!post) return null;
            // Destructure to omit full content for listing
            const { content, ...metadata } = post;
            return metadata;
        })
        .filter((post): post is Omit<BlogPost, "content"> => post !== null);

    // Sort by publishedAt descending
    posts.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return posts;
}
