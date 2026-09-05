import type { SchemaTypeDefinition } from "sanity";

import { activity } from "./documents/activity";
import { experience } from "./documents/experience";
import { project } from "./documents/project";
import { research } from "./documents/research";
import { siteSettings } from "./documents/siteSettings";
import { skillGroup } from "./documents/skillGroup";
import { localeBlock, localeString, localeStringList, localeText } from "./objects/locale";
import { codeBlock, contentImage, externalLink, metric, socialLink } from "./objects/shared";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objek dasar didaftarkan lebih dulu karena dirujuk oleh dokumen.
  localeString,
  localeText,
  localeStringList,
  localeBlock,
  contentImage,
  codeBlock,
  metric,
  socialLink,
  externalLink,
  // Dokumen
  siteSettings,
  project,
  research,
  experience,
  activity,
  skillGroup,
];
