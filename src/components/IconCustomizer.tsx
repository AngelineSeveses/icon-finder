import type { IconCustomization, IconDefinition } from '../types/icon';

interface IconCustomizerProps {
  icon: IconDefinition;
  customization: IconCustomization;
  onChange: (customization: IconCustomization) => void;
  onReset: () => void;
}

const SIZE_MIN = 16;
const SIZE_MAX = 128;

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function IconCustomizer({ icon, customization, onChange, onReset }: IconCustomizerProps) {
  const isStroke = icon.type === 'stroke';

  return (
    <div className="customizer">
      <div className="customizer__row">
        <label htmlFor="customizer-size">Size</label>
        <div className="customizer__control">
          <input
            id="customizer-size"
            type="range"
            min={SIZE_MIN}
            max={SIZE_MAX}
            value={customization.size}
            onChange={(event) => onChange({ ...customization, size: Number(event.target.value) })}
          />
          <input
            type="number"
            className="customizer__number"
            min={SIZE_MIN}
            max={SIZE_MAX}
            value={customization.size}
            onChange={(event) =>
              onChange({ ...customization, size: clamp(Number(event.target.value), SIZE_MIN, SIZE_MAX) })
            }
            aria-label="Size in pixels"
          />
        </div>
      </div>

      {isStroke && (
        <div className="customizer__row">
          <label htmlFor="customizer-stroke">Stroke</label>
          <div className="customizer__control">
            <input
              id="customizer-stroke"
              type="range"
              min={0.5}
              max={4}
              step={0.5}
              value={customization.strokeWidth}
              onChange={(event) => onChange({ ...customization, strokeWidth: Number(event.target.value) })}
            />
            <span className="customizer__value">{customization.strokeWidth}</span>
          </div>
        </div>
      )}

      <div className="customizer__row">
        <label htmlFor="customizer-rotation">Rotation</label>
        <div className="customizer__control">
          <input
            id="customizer-rotation"
            type="range"
            min={-180}
            max={180}
            value={customization.rotation}
            onChange={(event) => onChange({ ...customization, rotation: Number(event.target.value) })}
          />
          <span className="customizer__value">{customization.rotation}°</span>
        </div>
      </div>

      <div className="customizer__row">
        <label htmlFor="customizer-color">Color</label>
        <div className="customizer__control customizer__control--color">
          <input
            id="customizer-color"
            type="color"
            value={customization.color}
            onChange={(event) => onChange({ ...customization, color: event.target.value })}
          />
          <span className="customizer__value">{customization.color}</span>
        </div>
      </div>

      <button type="button" className="customizer__reset" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
