/**
 * Data terstruktur schema.org.
 *
 * Ditulis sebagai satu skrip JSON-LD per halaman. Nilai apa pun dilewatkan
 * JSON.stringify sehingga karakter khusus dari CMS tidak bisa memutus tag skrip.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}

export function personSchema(input: {
  name: string;
  url: string;
  jobTitle: string;
  description?: string;
  email?: string;
  image?: string | null;
  sameAs?: string[];
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
    jobTitle: input.jobTitle,
    ...(input.description ? { description: input.description } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    ...(input.location ? { address: { "@type": "PostalAddress", addressLocality: input.location } } : {}),
  };
}

export function websiteSchema(input: { name: string; url: string; description: string; lang: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    description: input.description,
    inLanguage: input.lang,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function creativeWorkSchema(input: {
  name: string;
  description: string;
  url: string;
  author: string;
  image?: string | null;
  datePublished?: string | null;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    description: input.description,
    url: input.url,
    author: { "@type": "Person", name: input.author },
    ...(input.image ? { image: input.image } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
  };
}

export function scholarlyArticleSchema(input: {
  name: string;
  description: string;
  url: string;
  authors: string[];
  year?: number | null;
  venue?: string | null;
  doi?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: input.name,
    description: input.description,
    url: input.url,
    author: input.authors.map((name) => ({ "@type": "Person", name })),
    ...(input.year ? { datePublished: String(input.year) } : {}),
    ...(input.venue ? { publisher: { "@type": "Organization", name: input.venue } } : {}),
    ...(input.doi ? { identifier: input.doi } : {}),
  };
}
