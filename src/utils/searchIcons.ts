import type { IconDefinition, LibraryFilterValue, StyleFilterValue } from '../types/icon';

export function searchIcons(
  icons: IconDefinition[],
  query: string,
  library: LibraryFilterValue,
  style: StyleFilterValue
): IconDefinition[] {
  const byLibrary = library === 'all' ? icons : icons.filter((icon) => icon.library === library);
  const byStyle = style === 'all' ? byLibrary : byLibrary.filter((icon) => icon.style === style);

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return byStyle;

  return byStyle.filter((icon) => {
    if (icon.name.toLowerCase().includes(normalizedQuery)) return true;
    return icon.tags.some((tag) => tag.includes(normalizedQuery));
  });
}
