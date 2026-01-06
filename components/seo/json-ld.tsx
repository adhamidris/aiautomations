export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://autom8ed.netlify.app/#website",
        "url": "https://autom8ed.netlify.app/",
        "name": "Automate Your Growth",
        "description": "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
        "publisher": {
          "@id": "https://autom8ed.netlify.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://autom8ed.netlify.app/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://autom8ed.netlify.app/#organization",
        "name": "Automate Your Growth",
        "url": "https://autom8ed.netlify.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://autom8ed.netlify.app/favicon.png",
          "width": 112,
          "height": 112
        },
        "sameAs": [
          "https://twitter.com/autom8ed",
          "https://linkedin.com/company/autom8ed",
          "https://www.instagram.com/autom8ed_solutions?igsh=MW9rejgwcTV6cnBjeA%3D%3D&utm_source=qr"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://autom8ed.netlify.app/#service",
        "name": "Automate Your Growth",
        "url": "https://autom8ed.netlify.app/",
        "image": "https://autom8ed.netlify.app/og-image.jpg",
        "description": "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
        "priceRange": "$$$"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
