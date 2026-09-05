import { defineQuery } from "next-sanity";

/**
 * Kueri GROQ bilingual.
 *
 * Setiap field terlokalisasi dibaca dengan `coalesce(field[$lang], field.id, field.en)`
 * sehingga dokumen yang baru diisi satu bahasa tetap tampil — tidak ada
 * halaman kosong hanya karena terjemahan belum lengkap.
 */

const IMAGE = /* groq */ `{
  alt,
  caption,
  asset,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
}`;

const PROJECT_CARD = /* groq */ `{
  _id,
  "title": coalesce(title[$lang], title.id, title.en),
  "slug": slug.current,
  "summary": coalesce(summary[$lang], summary.id, summary.en),
  "role": coalesce(role[$lang], role.id, role.en),
  "projectType": coalesce(projectType[$lang], projectType.id, projectType.en),
  techStack,
  featured,
  publishedAt,
  "year": coalesce(year, string::split(string(publishedAt), "-")[0]),
  "cover": cover${IMAGE},
  metrics[]{
    value,
    "label": coalesce(label[$lang], label.id, label.en)
  }
}`;

export const siteSettingsQuery = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0]{
    "name": name,
    "headline": coalesce(headline[$lang], headline.id, headline.en),
    "role": coalesce(role[$lang], role.id, role.en),
    "bio": coalesce(bio[$lang], bio.id, bio.en),
    "focus": coalesce(focus[$lang], focus.id, focus.en),
    location,
    email,
    phone,
    "cvUrl": cv.asset->url,
    "avatar": avatar${IMAGE},
    socials[]{ label, url, platform },
    metrics[]{
      value,
      "label": coalesce(label[$lang], label.id, label.en)
    }
  }
`);

export const projectsQuery = defineQuery(/* groq */ `
  *[_type == "project" && !(_id in path("drafts.**"))]
    | order(featured desc, coalesce(publishedAt, _createdAt) desc)
    ${PROJECT_CARD}
`);

export const featuredProjectsQuery = defineQuery(/* groq */ `
  *[_type == "project" && !(_id in path("drafts.**"))]
    | order(featured desc, coalesce(publishedAt, _createdAt) desc)[0...$limit]
    ${PROJECT_CARD}
`);

export const projectSlugsQuery = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`);

export const projectBySlugQuery = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    "title": coalesce(title[$lang], title.id, title.en),
    "slug": slug.current,
    "summary": coalesce(summary[$lang], summary.id, summary.en),
    "body": coalesce(body[$lang], body.id, body.en),
    "role": coalesce(role[$lang], role.id, role.en),
    "projectType": coalesce(projectType[$lang], projectType.id, projectType.en),
    techStack,
    demoUrl,
    repoUrl,
    featured,
    publishedAt,
    "year": coalesce(year, string::split(string(publishedAt), "-")[0]),
    "cover": cover${IMAGE},
    "gallery": gallery[]${IMAGE},
    metrics[]{
      value,
      "label": coalesce(label[$lang], label.id, label.en)
    }
  }
`);

/** Proyek sesudah slug saat ini pada urutan yang sama dengan halaman indeks. */
export const adjacentProjectQuery = defineQuery(/* groq */ `
  *[_type == "project" && slug.current != $slug && !(_id in path("drafts.**"))]
    | order(featured desc, coalesce(publishedAt, _createdAt) desc)[0]{
      "title": coalesce(title[$lang], title.id, title.en),
      "slug": slug.current,
      "summary": coalesce(summary[$lang], summary.id, summary.en)
    }
`);

export const researchListQuery = defineQuery(/* groq */ `
  *[_type == "research" && !(_id in path("drafts.**"))]
    | order(coalesce(year, 0) desc, _createdAt desc){
      _id,
      "title": coalesce(title[$lang], title.id, title.en),
      "slug": slug.current,
      "summary": coalesce(summary[$lang], summary.id, summary.en),
      authors,
      venue,
      year,
      doi,
      state,
      keywords,
      "pdfUrl": coalesce(pdf.asset->url, pdfUrl),
      "cover": cover${IMAGE}
    }
`);

export const researchSlugsQuery = defineQuery(/* groq */ `
  *[_type == "research" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current
`);

export const researchBySlugQuery = defineQuery(/* groq */ `
  *[_type == "research" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    "title": coalesce(title[$lang], title.id, title.en),
    "slug": slug.current,
    "summary": coalesce(summary[$lang], summary.id, summary.en),
    "body": coalesce(body[$lang], body.id, body.en),
    authors,
    venue,
    year,
    doi,
    state,
    keywords,
    "pdfUrl": coalesce(pdf.asset->url, pdfUrl),
    "cover": cover${IMAGE},
    "gallery": gallery[]${IMAGE}
  }
`);

export const experienceQuery = defineQuery(/* groq */ `
  *[_type == "experience" && !(_id in path("drafts.**"))]
    | order(startDate desc){
      _id,
      company,
      "role": coalesce(role[$lang], role.id, role.en),
      "description": coalesce(description[$lang], description.id, description.en),
      startDate,
      endDate,
      location,
      employmentType,
      "highlights": coalesce(highlights[$lang], highlights.id, highlights.en),
      "logo": logo${IMAGE}
    }
`);

export const activitiesQuery = defineQuery(/* groq */ `
  *[_type == "activity" && !(_id in path("drafts.**"))]
    | order(date desc){
      _id,
      "title": coalesce(title[$lang], title.id, title.en),
      "description": coalesce(description[$lang], description.id, description.en),
      category,
      date,
      organiser,
      links[]{ label, url },
      "cover": cover${IMAGE}
    }
`);

export const skillGroupsQuery = defineQuery(/* groq */ `
  *[_type == "skillGroup" && !(_id in path("drafts.**"))]
    | order(coalesce(order, 99) asc){
      _id,
      "category": coalesce(category[$lang], category.id, category.en),
      icon,
      skills
    }
`);
