import type { IconDefinition } from '../types/icon';

interface IconGlyphProps {
  icon: IconDefinition;
  size: number;
  color?: string;
  strokeWidth?: number;
  rotation?: number;
}

export function IconGlyph({ icon, size, color = 'currentColor', strokeWidth, rotation = 0 }: IconGlyphProps) {
  const isStroke = icon.type === 'stroke';
  const resolvedStrokeWidth = strokeWidth ?? icon.strokeWidth ?? 2;

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill={isStroke ? 'none' : color}
      stroke={isStroke ? color : 'none'}
      strokeWidth={isStroke ? resolvedStrokeWidth : undefined}
      strokeLinecap={isStroke ? 'round' : undefined}
      strokeLinejoin={isStroke ? 'round' : undefined}
      // Some libraries' source markup (e.g. Font Awesome) hardcodes fill="currentColor" on
      // inner elements. That resolves against the CSS `color` property, not our `fill`/`stroke`
      // attributes above, so we set both to the same value to cover either convention.
      style={{ color, ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}) }}
      aria-hidden="true"
      // icon.markup is our own curated build-time data, never user input — safe to inject
      dangerouslySetInnerHTML={{ __html: icon.markup }}
    />
  );
}
