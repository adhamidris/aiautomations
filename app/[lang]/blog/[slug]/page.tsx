import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getPostBySlug, getAllPostSlugs } from "@/lib/content";
import { Locale, i18n } from "@/i18n-config";
import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://autom8ed.space";

// Generate static paths for all posts and languages
export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    const params: { lang: Locale; slug: string }[] = [];

    for (const lang of i18n.locales) {
        for (const slug of slugs) {
            params.push({ lang, slug });
        }
    }
    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = getPostBySlug(slug, lang);

    if (!post) {
        return { title: "Post Not Found" };
    }

    const ogImageUrl = post.seo.ogImage
        ? `${SITE_URL}${post.seo.ogImage}`
        : `${SITE_URL}/og-default.jpg`;

    return {
        title: post.seo.title,
        description: post.seo.description,
        keywords: post.seo.keywords,
        openGraph: {
            title: post.seo.title,
            description: post.seo.description,
            url: `${SITE_URL}/${lang}/blog/${slug}`,
            siteName: "Autom8ed",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            locale: lang === "ar" ? "ar_EG" : "en_US",
            type: "article",
            publishedTime: post.publishedAt,
        },
        twitter: {
            card: "summary_large_image",
            title: post.seo.title,
            description: post.seo.description,
            images: [ogImageUrl],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const { lang, slug } = await params;
    const post = getPostBySlug(slug, lang);

    if (!post) {
        notFound();
    }

    const isRTL = lang === "ar";

    // JSON-LD Structured Data for Article
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.seo.description,
        image: post.seo.ogImage ? `${SITE_URL}${post.seo.ogImage}` : `${SITE_URL}/og-default.jpg`,
        datePublished: post.publishedAt,
        author: {
            "@type": "Organization",
            name: "Autom8ed",
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: "Autom8ed",
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/${lang}/blog/${slug}`,
        },
    };

    return (
        <article className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* JSON-LD Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Visual Background Elements */}
            <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-10 pointer-events-none z-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent blur-3xl pointer-events-none z-0" />

            {/* Navigation Bar Placeholder (Back Button) */}
            <div className="relative z-50 w-full max-w-4xl mx-auto px-6 py-8 md:py-12 flex items-center justify-between">
                <Link
                    href={`/${lang}`}
                    className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    {isRTL ? "العودة للرئيسية" : "Back to Home"}
                </Link>
            </div>

            {/* Hero Header */}
            <header className="relative z-10 w-full max-w-4xl mx-auto px-6 mb-12 md:mb-16 text-center md:text-start">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm">
                        <Tag className="w-3 h-3" />
                        {post.category}
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString(
                            lang === "ar" ? "ar-EG" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                        )}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-foreground leading-tight mb-8">
                    {post.title}
                </h1>

                <div className="w-24 h-1 bg-gradient-to-r from-foreground to-transparent rounded-full mx-auto md:mx-0 opacity-50" />
            </header>

            {/* Article Content */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-24">
                <div
                    className="prose prose-zinc dark:prose-invert max-w-none 
                       prose-headings:font-heading prose-headings:tracking-tight
                       prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                       prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground
                       prose-strong:text-foreground prose-strong:font-semibold
                       prose-li:text-muted-foreground
                       "
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </article>
    );
}
