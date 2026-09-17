import type { LibraryFilterValue } from '../types/icon';

interface LibraryOption {
  id: LibraryFilterValue;
  label: string;
}

const OPTIONS: LibraryOption[] = [
  { id: 'all', label: 'All' },
  { id: 'lucide', label: 'Lucide' },
  { id: 'heroicons', label: 'Heroicons' },
  { id: 'material-symbols', label: 'Material Symbols' },
  { id: 'font-awesome', label: 'Font Awesome Free' },
];

interface LibraryFilterProps {
  active: LibraryFilterValue;
  onChange: (value: LibraryFilterValue) => void;
}

export function LibraryFilter({ active, onChange }: LibraryFilterProps) {
  return (
    <div className="library-filter" role="tablist" aria-label="Filter by icon library">
      {OPTIONS.map((option) => {
        const isActive = active === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`library-filter__item${isActive ? ' library-filter__item--active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
