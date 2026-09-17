export type Library = 'lucide' | 'heroicons' | 'material-symbols' | 'font-awesome';

export type LibraryFilterValue = Library | 'all';

/** Whether an icon is drawn as an outline (color applied via `stroke`) or a solid shape (`fill`). */
export type IconRenderType = 'stroke' | 'fill';

/** The icon's visual design — a genuine variant shipped by its source library, never a CSS-faked conversion. */
export type IconStyle = 'outline' | 'filled';

export type StyleFilterValue = IconStyle | 'all';

export interface IconDefinition {
  id: string;
  name: string;
  library: Library;
  style: IconStyle;
  /** id of this same icon's opposite-style variant from the same library, when one genuinely exists. */
  styleSiblingId?: string;
  tags: string[];
  viewBox: string;
  type: IconRenderType;
  /** Only meaningful for stroke-type icons — the library's own default stroke width. */
  strokeWidth?: number;
  /** Raw inner SVG markup (paths/shapes) sourced from the library's own files at build time. */
  markup: string;
}

export interface IconCustomization {
  size: number;
  color: string;
  strokeWidth: number;
  rotation: number;
}
