import type { IconDefinition } from '../types/icon';
import { LIBRARIES } from '../data/libraries';
import { IconGlyph } from './IconGlyph';

interface IconCardProps {
  icon: IconDefinition;
  isSelected: boolean;
  onSelect: (icon: IconDefinition) => void;
  isFavorite: boolean;
  onToggleFavorite: (iconId: string) => void;
}

export function IconCard({ icon, isSelected, onSelect, isFavorite, onToggleFavorite }: IconCardProps) {
  const library = LIBRARIES[icon.library];

  return (
    <div className={`icon-card${isSelected ? ' icon-card--selected' : ''}`}>
      <button
        type="button"
        className="icon-card__select"
        aria-pressed={isSelected}
        aria-label={`${icon.name}, ${library.name}`}
        onClick={() => onSelect(icon)}
      >
        <span className="icon-card__preview">
          <IconGlyph icon={icon} size={26} />
        </span>
        <span className="icon-card__meta">
          <span className="icon-card__name">{icon.name}</span>
          <span className="icon-card__library">{library.name}</span>
        </span>
      </button>

      <button
        type="button"
        className={`icon-card__favorite${isFavorite ? ' icon-card__favorite--active' : ''}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${icon.name} from favorites` : `Add ${icon.name} to favorites`}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(icon.id);
        }}
      >
        <StarIcon filled={isFavorite} />
      </button>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}
