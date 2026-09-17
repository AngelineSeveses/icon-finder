import type { IconCustomization, IconDefinition } from '../types/icon';

interface BuildSvgMarkupOptions {
  icon: IconDefinition;
  customization: IconCustomization;
  /** Standalone .svg files need this; SVG pasted inline into an HTML page doesn't. */
  includeXmlns?: boolean;
}

// Some libraries' source markup (Font Awesome) hardcodes fill="currentColor" on inner
// elements, which resolves against the CSS `color` property rather than the `fill`/`stroke`
// attributes below — so `color` is always embedded in `style` too, the same fix as IconGlyph.
function buildStyle(customization: IconCustomization): string {
  const declarations = [`color: ${customization.color}`];
  if (customization.rotation) {
    declarations.push(`transform: rotate(${customization.rotation}deg)`);
  }
  return declarations.join('; ');
}

export function buildSvgMarkup({ icon, customization, includeXmlns = true }: BuildSvgMarkupOptions): string {
  const isStroke = icon.type === 'stroke';

  const attrs = [
    includeXmlns ? 'xmlns="http://www.w3.org/2000/svg"' : null,
    `width="${customization.size}"`,
    `height="${customization.size}"`,
    `viewBox="${icon.viewBox}"`,
    `fill="${isStroke ? 'none' : customization.color}"`,
    isStroke ? `stroke="${customization.color}"` : null,
    isStroke ? `stroke-width="${customization.strokeWidth}"` : null,
    isStroke ? 'stroke-linecap="round"' : null,
    isStroke ? 'stroke-linejoin="round"' : null,
    `style="${buildStyle(customization)}"`,
  ].filter((attr): attr is string => attr !== null);

  return `<svg ${attrs.join(' ')}>${icon.markup}</svg>`;
}

function toPascalCase(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function camelizeInnerMarkup(markup: string): string {
  return markup.replace(/stroke-linecap/g, 'strokeLinecap').replace(/stroke-linejoin/g, 'strokeLinejoin');
}

export function buildJsxComponent(icon: IconDefinition, customization: IconCustomization): string {
  const isStroke = icon.type === 'stroke';
  const componentName = `${toPascalCase(icon.name)}Icon`;

  const styleEntries = [`color: '${customization.color}'`];
  if (customization.rotation) {
    styleEntries.push(`transform: 'rotate(${customization.rotation}deg)'`);
  }

  const attrs = [
    `width={${customization.size}}`,
    `height={${customization.size}}`,
    `viewBox="${icon.viewBox}"`,
    `fill="${isStroke ? 'none' : customization.color}"`,
    isStroke ? `stroke="${customization.color}"` : null,
    isStroke ? `strokeWidth={${customization.strokeWidth}}` : null,
    isStroke ? 'strokeLinecap="round"' : null,
    isStroke ? 'strokeLinejoin="round"' : null,
    `style={{ ${styleEntries.join(', ')} }}`,
    '{...props}',
  ].filter((attr): attr is string => attr !== null);

  return `export function ${componentName}(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg ${attrs.join(' ')}>
      ${camelizeInnerMarkup(icon.markup)}
    </svg>
  );
}`;
}
