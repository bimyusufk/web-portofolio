/* eslint-disable @typescript-eslint/no-explicit-any */

type JsonLdProps = {
  data: Record<string, any>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd({
  name = "Bim Yusuf",
  url = "https://bimyusuf.com",
  image,
  jobTitle,
  description,
  sameAs = [],
}: {
  name?: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    ...(image && { image }),
    ...(jobTitle && { jobTitle }),
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd({
  name = "Bim Yusuf - Portfolio",
  url = "https://bimyusuf.com",
  description,
}: {
  name?: string;
  url?: string;
  description?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    ...(description && { description }),
  };

  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "Bim Yusuf",
}: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    url,
    ...(description && { description }),
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  return <JsonLd data={data} />;
}

export function ProjectJsonLd({
  name,
  description,
  url,
  image,
  dateCreated,
  creator = "Bim Yusuf",
  keywords = [],
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  dateCreated?: string;
  creator?: string;
  keywords?: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    url,
    ...(description && { description }),
    ...(image && { image }),
    ...(dateCreated && { dateCreated }),
    author: {
      "@type": "Person",
      name: creator,
    },
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
