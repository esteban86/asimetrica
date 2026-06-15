import React from 'react';

// Slider reutilizable para los explorables financieros (estilo distill).
export default function FinSlider({ label, value, min, max, step, suffix, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm text-foreground body-text">{label}</label>
        <span className="text-sm font-semibold text-primary tnum">{value.toLocaleString('es-CO')}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 cursor-pointer appearance-none rounded-full bg-white/[0.08]"
        style={{ accentColor: 'hsl(var(--primary))' }}
      />
    </div>
  );
}
