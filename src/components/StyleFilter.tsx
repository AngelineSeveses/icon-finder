import type { IconStyle, StyleFilterValue } from '../types/icon';

interface StyleOption {
  id: StyleFilterValue;
  label: string;
}

const OPTIONS: StyleOption[] = [
  { id: 'all', label: 'All' },
  { id: 'outline', label: 'Outline' },
  { id: 'filled', label: 'Filled' },
];

interface StyleFilterProps {
  active: StyleFilterValue;
  onChange: (value: StyleFilterValue) => void;
  availableStyles: Set<IconStyle>;
}

export function StyleFilter({ active, onChange, availableStyles }: StyleFilterProps) {
  return (
    <div className="style-filter">
      <span className="style-filter__label">Style</span>
      <div className="style-filter__options" role="tablist" aria-label="Filter by icon style">
        {OPTIONS.map((option) => {
          const isActive = active === option.id;
          const isDisabled = option.id !== 'all' && !availableStyles.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={isDisabled}
              title={isDisabled ? `No ${option.label.toLowerCase()} icons in this library` : undefined}
              className={`style-filter__item${isActive ? ' style-filter__item--active' : ''}`}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
