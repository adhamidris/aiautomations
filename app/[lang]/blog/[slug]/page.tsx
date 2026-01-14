
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { BLOG_DATA } from "@/lib/blog-data";
import { Locale } from "@/i18n-config";
import { Metadata } from "next";

// Force static generation for known paths (optional but good for performance)
export async function generateStaticParams() {
    const paths = [];
    const validLangs: Locale[] = ["en", "ar"];

    for (const lang of validLangs) {
        const slugs = Object.keys(BLOG_DATA[lang] || {});
        for (const slug of slugs) {
            paths.push({ lang, slug });
        }
    }
    return paths;
}

export async function generateMetadata(
    { params }: { params: Promise<{ lang: Locale; slug: string }> }
): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = BLOG_DATA[lang]?.[slug];

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: `${post.title} | Autom8ed`,
        description: post.content.substring(0, 150).replace(/<[^>]*>?/gm, "") + "...",
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ lang: Locale; slug: string }>;
}) {
    const { lang, slug } = await params;
    const post = BLOG_DATA[lang]?.[slug];

    if (!post) {
        notFound();
    }

    const isRTL = lang === "ar";

    return (
        <article className="min-h-screen bg-background relative overflow-hidden flex flex-col">
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
                        {post.date}
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
