import { useEffect, useRef, useState } from 'react';
import type { IconCustomization, IconDefinition } from '../types/icon';
import { LIBRARIES } from '../data/libraries';
import { IconGlyph } from './IconGlyph';
import { IconCustomizer } from './IconCustomizer';
import { CopyButtons } from './CopyButtons';

interface IconInspectorProps {
  icon: IconDefinition | null;
  customization: IconCustomization;
  onCustomizationChange: (customization: IconCustomization) => void;
  onResetCustomization: () => void;
  onClose: () => void;
  onSwitchStyle: (siblingId: string) => void;
}

// The preview box has a fixed footprint regardless of the chosen size, the
// same way a design tool's property panel doesn't resize itself as you drag.
const PREVIEW_MAX_DISPLAY = 96;

// Matches the @media breakpoint where .content-layout switches to a single
// column — below it, the inspector becomes a dismissible bottom sheet instead
// of an inline panel, since JS (not CSS) is what can lock background scroll
// and trap focus the way a real dialog needs to.
const MOBILE_LAYOUT_QUERY = '(max-width: 860px)';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useIsMobileLayout(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_LAYOUT_QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LAYOUT_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}

export function IconInspector({
  icon,
  customization,
  onCustomizationChange,
  onResetCustomization,
  onClose,
  onSwitchStyle,
}: IconInspectorProps) {
  const isMobileLayout = useIsMobileLayout();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpenAsDialog = Boolean(icon) && isMobileLayout;

  // Moves focus into the sheet on open and back to whatever triggered it on
  // close — the baseline expectation for any dialog-like overlay.
  useEffect(() => {
    if (!isOpenAsDialog) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocused?.focus();
    };
  }, [isOpenAsDialog]);

  useEffect(() => {
    if (!icon) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !isOpenAsDialog || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [icon, isOpenAsDialog, onClose]);

  useEffect(() => {
    if (!icon || !isMobileLayout) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [icon, isMobileLayout]);

  const library = icon ? LIBRARIES[icon.library] : null;

  return (
    <>
      <div
        className={`inspector-backdrop${icon ? ' inspector-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className={`inspector${icon ? ' inspector--open' : ' inspector--empty'}`}
        aria-label="Icon inspector"
        role={isOpenAsDialog ? 'dialog' : undefined}
        aria-modal={isOpenAsDialog ? true : undefined}
      >
        {!icon || !library ? (
          <p>Select an icon to see its details.</p>
        ) : (
          <>
            <button
              ref={closeButtonRef}
              type="button"
              className="inspector__close"
              onClick={onClose}
              aria-label="Close inspector"
            >
              <CloseIcon />
            </button>

            <p className="inspector__eyebrow">Icon Inspector</p>

            <div className="inspector__preview">
              <IconGlyph
                icon={icon}
                size={Math.min(customization.size, PREVIEW_MAX_DISPLAY)}
                color={customization.color}
                strokeWidth={customization.strokeWidth}
                rotation={customization.rotation}
              />
            </div>

            <h2 className="inspector__name">{icon.name}</h2>
            <p className="inspector__library">{library.name}</p>

            <div className="inspector__style">
              <span className="inspector__style-label">Style</span>
              <span className="inspector__style-value">
                {icon.style === 'outline' ? 'Outline' : 'Filled'}
              </span>
              {icon.styleSiblingId && (
                <button
                  type="button"
                  className="inspector__style-switch"
                  onClick={() => onSwitchStyle(icon.styleSiblingId!)}
                >
                  Switch to {icon.style === 'outline' ? 'Filled' : 'Outline'}
                </button>
              )}
            </div>

            <hr className="inspector__divider" />

            <IconCustomizer
              icon={icon}
              customization={customization}
              onChange={onCustomizationChange}
              onReset={onResetCustomization}
            />

            <CopyButtons icon={icon} customization={customization} />

            <hr className="inspector__divider" />

            <dl className="inspector__facts">
              <div className="inspector__fact">
                <dt>ViewBox</dt>
                <dd>{icon.viewBox}</dd>
              </div>
            </dl>

            <hr className="inspector__divider" />

            <div className="inspector__license">
              <h3 className="inspector__section-title">License</h3>
              <p className="inspector__license-name">{library.name}</p>
              <p className="inspector__license-type">{library.license}</p>

              <dl className="inspector__facts">
                <div className="inspector__fact">
                  <dt>Commercial use</dt>
                  <dd>{library.commercialUse ? 'Allowed' : 'Restricted'}</dd>
                </div>
                <div className="inspector__fact">
                  <dt>Attribution</dt>
                  <dd>{library.attributionRequired ? 'Required' : 'Not required'}</dd>
                </div>
              </dl>

              <div className="inspector__license-links">
                <a href={library.sourceUrl} target="_blank" rel="noreferrer">
                  View source
                </a>
                <a href={library.licenseUrl} target="_blank" rel="noreferrer">
                  View license
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
