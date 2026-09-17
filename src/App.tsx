import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { LibraryFilter } from './components/LibraryFilter';
import { StyleFilter } from './components/StyleFilter';
import { IconGrid } from './components/IconGrid';
import { IconInspector } from './components/IconInspector';
import { ICONS } from './data/icons';
import { searchIcons } from './utils/searchIcons';
import type {
  IconCustomization,
  IconDefinition,
  IconStyle,
  LibraryFilterValue,
  StyleFilterValue,
} from './types/icon';
import './App.css';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'icon-finder-theme';
const FAVORITES_STORAGE_KEY = 'icon-finder-favorites';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

// Matches --color-text-primary for each theme, so a freshly selected icon is
// always visible against the inspector's preview background by default.
function getDefaultColor(theme: Theme): string {
  return theme === 'dark' ? '#F5F1E9' : '#100E0C';
}

function getDefaultCustomization(icon: IconDefinition, theme: Theme): IconCustomization {
  return {
    size: 24,
    color: getDefaultColor(theme),
    strokeWidth: icon.strokeWidth ?? 2,
    rotation: 0,
  };
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [query, setQuery] = useState('');
  const [activeLibrary, setActiveLibrary] = useState<LibraryFilterValue>('all');
  const [activeStyle, setActiveStyle] = useState<StyleFilterValue>('all');
  const [selectedIcon, setSelectedIcon] = useState<IconDefinition | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(getInitialFavorites);
  const [customization, setCustomization] = useState<IconCustomization>(() => ({
    size: 24,
    color: getDefaultColor(getInitialTheme()),
    strokeWidth: 2,
    rotation: 0,
  }));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favoriteIds]));
  }, [favoriteIds]);

  // Which styles the current library selection actually offers — computed
  // from the full dataset (not the search results), since this describes the
  // library's structural capability, not what a particular query matched.
  const availableStyles = useMemo<Set<IconStyle>>(() => {
    const scoped = activeLibrary === 'all' ? ICONS : ICONS.filter((icon) => icon.library === activeLibrary);
    return new Set(scoped.map((icon) => icon.style));
  }, [activeLibrary]);

  // If switching libraries makes the current style filter produce nothing
  // (e.g. Filled while Lucide, which is outline-only, is selected), fall back
  // to "All" rather than silently showing an unexplained empty grid. Derived
  // during render rather than via an effect + setState, so the underlying
  // choice is preserved and reapplies automatically if the user switches back
  // to a library that does support it.
  const effectiveStyle: StyleFilterValue =
    activeStyle !== 'all' && !availableStyles.has(activeStyle) ? 'all' : activeStyle;

  const results = useMemo(
    () => searchIcons(ICONS, query, activeLibrary, effectiveStyle),
    [query, activeLibrary, effectiveStyle]
  );

  const handleClearFilters = () => {
    setQuery('');
    setActiveLibrary('all');
    setActiveStyle('all');
  };

  const handleSelectIcon = (icon: IconDefinition) => {
    setSelectedIcon(icon);
    setCustomization(getDefaultCustomization(icon, theme));
  };

  const handleResetCustomization = () => {
    if (selectedIcon) setCustomization(getDefaultCustomization(selectedIcon, theme));
  };

  // Switching to the same icon's other style keeps the current size/color/
  // rotation — the user is looking at "this icon, but filled," not picking a
  // new icon from scratch, so resetting their customization would surprise them.
  const handleSwitchStyle = (siblingId: string) => {
    const sibling = ICONS.find((icon) => icon.id === siblingId);
    if (sibling) setSelectedIcon(sibling);
  };

  const handleToggleFavorite = (iconId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(iconId)) {
        next.delete(iconId);
      } else {
        next.add(iconId);
      }
      return next;
    });
  };

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />

      <main className="app-main">
        <section className="hero">
          <h1 className="hero__heading">Search & Discover</h1>
          <SearchBar value={query} onChange={setQuery} />
          <LibraryFilter active={activeLibrary} onChange={setActiveLibrary} />
          <StyleFilter active={effectiveStyle} onChange={setActiveStyle} availableStyles={availableStyles} />
        </section>

        <div className="content-layout">
          <IconGrid
            icons={results}
            selectedIconId={selectedIcon?.id ?? null}
            onSelectIcon={handleSelectIcon}
            onClearFilters={handleClearFilters}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
          <IconInspector
            icon={selectedIcon}
            customization={customization}
            onCustomizationChange={setCustomization}
            onResetCustomization={handleResetCustomization}
            onClose={() => setSelectedIcon(null)}
            onSwitchStyle={handleSwitchStyle}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
