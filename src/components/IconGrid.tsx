import type { IconDefinition } from '../types/icon';
import { IconCard } from './IconCard';

interface IconGridProps {
  icons: IconDefinition[];
  selectedIconId: string | null;
  onSelectIcon: (icon: IconDefinition) => void;
  onClearFilters: () => void;
  favoriteIds: Set<string>;
  onToggleFavorite: (iconId: string) => void;
}

export function IconGrid({
  icons,
  selectedIconId,
  onSelectIcon,
  onClearFilters,
  favoriteIds,
  onToggleFavorite,
}: IconGridProps) {
  if (icons.length === 0) {
    return (
      <section className="icon-grid-empty">
        <NoResultsGlyph />
        <h2>No icons found</h2>
        <p>Try another keyword or remove a filter.</p>
        <button type="button" className="icon-grid-empty__clear" onClick={onClearFilters}>
          Clear filters
        </button>
      </section>
    );
  }

  return (
    <div className="icon-grid-wrapper">
      <p className="icon-grid-count" aria-live="polite">
        {icons.length} icon{icons.length === 1 ? '' : 's'}
      </p>
      <section className="icon-grid" aria-label="Icon results">
        {icons.map((icon) => (
          <IconCard
            key={icon.id}
            icon={icon}
            isSelected={icon.id === selectedIconId}
            onSelect={onSelectIcon}
            isFavorite={favoriteIds.has(icon.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </section>
    </div>
  );
}

function NoResultsGlyph() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="6" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
