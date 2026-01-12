export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://autom8ed.space/#website",
        "url": "https://autom8ed.space/",
        "name": "AUTOM8ED",
        "description": "Premium Web Development & AI Solutions.",
        "publisher": {
          "@id": "https://autom8ed.space/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://autom8ed.space/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://autom8ed.space/#organization",
        "name": "AUTOM8ED",
        "url": "https://autom8ed.space/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://autom8ed.space/favicon.png",
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
        "@id": "https://autom8ed.space/#service",
        "name": "AUTOM8ED",
        "url": "https://autom8ed.space/",
        "image": "https://autom8ed.space/opengraph-image",
        "description": "Premium Web Development & AI Solutions.",
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
