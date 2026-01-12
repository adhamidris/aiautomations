import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "AUTOM8ED",
        short_name: "AUTOM8ED",
        description: "Premium Web Development & AI Solutions.",
        start_url: "/",
        display: "standalone",
        background_color: "#0B0B0B",
        theme_color: "#0B0B0B",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/favicon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/favicon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
