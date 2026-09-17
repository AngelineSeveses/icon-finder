import { useState } from 'react';
import type { IconCustomization, IconDefinition } from '../types/icon';
import { buildJsxComponent, buildSvgMarkup } from '../utils/buildIconMarkup';
import { copyToClipboard } from '../utils/clipboard';
import { downloadSvg } from '../utils/downloadSvg';

interface CopyButtonsProps {
  icon: IconDefinition;
  customization: IconCustomization;
}

type CopyFormat = 'svg' | 'html' | 'jsx';

const COPY_LABELS: Record<CopyFormat, string> = {
  svg: 'Copy SVG',
  html: 'Copy HTML',
  jsx: 'Copy JSX',
};

function buildCopyText(format: CopyFormat, icon: IconDefinition, customization: IconCustomization): string {
  switch (format) {
    case 'svg':
      return buildSvgMarkup({ icon, customization, includeXmlns: true });
    case 'html':
      return buildSvgMarkup({ icon, customization, includeXmlns: false });
    case 'jsx':
      return buildJsxComponent(icon, customization);
  }
}

export function CopyButtons({ icon, customization }: CopyButtonsProps) {
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);

  const handleCopy = async (format: CopyFormat) => {
    const success = await copyToClipboard(buildCopyText(format, icon, customization));
    if (!success) return;
    setCopiedFormat(format);
    setTimeout(() => {
      setCopiedFormat((current) => (current === format ? null : current));
    }, 1500);
  };

  const handleDownload = () => {
    downloadSvg(`${icon.id}.svg`, buildSvgMarkup({ icon, customization, includeXmlns: true }));
  };

  return (
    <div className="copy-buttons">
      <div className="copy-buttons__row">
        {(Object.keys(COPY_LABELS) as CopyFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            className={`copy-buttons__button${copiedFormat === format ? ' copy-buttons__button--copied' : ''}`}
            onClick={() => handleCopy(format)}
          >
            {copiedFormat === format ? '✓ Copied' : COPY_LABELS[format]}
          </button>
        ))}
      </div>

      <button type="button" className="copy-buttons__download" onClick={handleDownload}>
        Download SVG
      </button>
    </div>
  );
}
