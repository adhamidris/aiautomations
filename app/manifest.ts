import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Automate Your Growth",
        short_name: "Autom8ed",
        description: "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/icon.png",
                sizes: "192x192",
                type: "image/png",
            },
        ],
    };
}
