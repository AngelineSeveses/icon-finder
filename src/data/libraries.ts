import type { Library } from '../types/icon';

export interface LibraryMeta {
  id: Library;
  name: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  commercialUse: boolean;
  /** Whether the license's own terms require attribution. Always link licenseUrl alongside this — never the only source of truth. */
  attributionRequired: boolean;
}

export const LIBRARIES: Record<Library, LibraryMeta> = {
  lucide: {
    id: 'lucide',
    name: 'Lucide',
    license: 'ISC License',
    licenseUrl: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
    sourceUrl: 'https://lucide.dev',
    commercialUse: true,
    attributionRequired: false,
  },
  heroicons: {
    id: 'heroicons',
    name: 'Heroicons',
    license: 'MIT License',
    licenseUrl: 'https://github.com/tailwindlabs/heroicons/blob/master/LICENSE',
    sourceUrl: 'https://heroicons.com',
    commercialUse: true,
    attributionRequired: false,
  },
  'material-symbols': {
    id: 'material-symbols',
    name: 'Material Symbols',
    license: 'Apache License 2.0',
    licenseUrl: 'https://github.com/google/material-design-icons/blob/master/LICENSE',
    sourceUrl: 'https://fonts.google.com/icons',
    commercialUse: true,
    attributionRequired: false,
  },
  'font-awesome': {
    id: 'font-awesome',
    name: 'Font Awesome Free',
    license: 'CC BY 4.0 (icons)',
    licenseUrl: 'https://fontawesome.com/license/free',
    sourceUrl: 'https://fontawesome.com',
    commercialUse: true,
    attributionRequired: true,
  },
};
