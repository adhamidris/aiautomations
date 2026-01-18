"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";

// Interface matches the shape returned by getAllPosts from lib/content.ts
interface BlogPostSummary {
    slug: string;
    publishedAt: string;
    title: string;
    category: string;
    excerpt: string;
}

interface BlogsSectionProps {
    subtitle: string;
    title: string;
    readMore: string;
    posts: BlogPostSummary[];
}

export function BlogsSection({
    subtitle,
    title,
    readMore,
    posts,
}: BlogsSectionProps) {
    const params = useParams();
    const lang = params.lang as string;

    // Helper to format the date based on locale
    const formatDate = (isoDate: string) => {
        return new Date(isoDate).toLocaleDateString(
            lang === "ar" ? "ar-EG" : "en-US",
            { year: "numeric", month: "short", day: "numeric" }
        );
    };

    return (
        <section className="relative w-full py-24 md:py-32 bg-background overflow-hidden border-t border-border/40">
            {/* Background Grid - consistent with other sections */}
            <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-20 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,var(--background)_100%)] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-muted-foreground underline decoration-border underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                        {subtitle}
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                        {title}
                    </h3>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/${lang}/blog/${post.slug}`}
                            className="group relative flex flex-col h-full bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-foreground/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
                        >
                            <div className="p-6 md:p-8 flex flex-col h-full">

                                {/* Meta Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-foreground/5 text-foreground/80 border border-border/50">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {formatDate(post.publishedAt)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <h4 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/70 transition-all duration-300">
                                        {post.title}
                                    </h4>
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>

                                {/* Footer Action */}
                                <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-between">
                                    <span className="text-xs font-mono font-medium text-foreground uppercase tracking-widest group-hover:opacity-100 opacity-70 transition-opacity">
                                        {readMore}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 group-hover:scale-110 group-hover:-rotate-45">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
