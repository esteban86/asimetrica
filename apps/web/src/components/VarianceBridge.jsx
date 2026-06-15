import React, { useState } from 'react';
import FinSlider from '@/components/FinSlider.jsx';

const fmt = (m) => '$' + Math.round(m).toLocaleString('es-CO');
const signed = (m) => (m >= 0 ? '+' : '−') + Math.abs(Math.round(m)).toLocaleString('es-CO');

// Bridge de varianza (presupuesto vs. real): descompone la brecha de utilidad
// en sus causas. Cada slider es el IMPACTO en la utilidad (favorable = +).
const VarianceBridge = () => {
  const [presupuesto, setPresupuesto] = useState(500); // utilidad presupuestada
  const [ingresos, setIngresos] = useState(180); // mejor venta de lo previsto
  const [costos, setCostos] = useState(-140); // costos por encima de lo previsto
  const [gastos, setGastos] = useState(-60); // gastos por encima de lo previsto

  const real = presupuesto + ingresos + costos + gastos;
  const brecha = real - presupuesto;
  const cumplimiento = presupuesto !== 0 ? Math.round((real / presupuesto) * 100) : 0;

  const steps = [
    { label: 'Presupuesto', kind: 'total', value: presupuesto },
    { label: 'Ingresos', kind: 'delta', value: ingresos },
    { label: 'Costos', kind: 'delta', value: costos },
    { label: 'Gastos', kind: 'delta', value: gastos },
    { label: 'Real', kind: 'total', value: real },
  ];

  const { bars } = steps.reduce(
    (st, s) => {
      let lo, hi;
      if (s.kind === 'delta') {
        const start = st.running;
        const end = start + s.value;
        lo = Math.min(start, end);
        hi = Math.max(start, end);
        return { running: end, bars: [...st.bars, { ...s, lo, hi }] };
      }
      lo = Math.min(0, s.value);
      hi = Math.max(0, s.value);
      return { running: s.value, bars: [...st.bars, { ...s, lo, hi }] };
    },
    { running: 0, bars: [] }
  );

  const floor = Math.min(0, ...bars.map((b) => b.lo));
  const ceil = Math.max(0, ...bars.map((b) => b.hi));
  const range = ceil - floor || 1;
  const pct = (v) => ((v - floor) / range) * 100;
  const zeroPct = pct(0);

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo · FP&A</span>
        <span className="text-xs text-muted-foreground body-secondary">· por qué la utilidad real no fue la del presupuesto</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Análisis de variaciones: del presupuesto al resultado real</h3>

      <div className="relative flex items-end gap-2 sm:gap-3 h-52">
        {/* línea de cero */}
        <div className="absolute left-0 right-0 border-t border-dashed border-white/[0.18]" style={{ bottom: zeroPct + '%' }}></div>
        {bars.map((b) => {
          const favorable = b.value >= 0;
          // los totales (presupuesto/real) en mint; las desviaciones en mint (favorable) o coral (desfavorable)
          const color = b.kind === 'total' ? 'hsl(var(--primary))' : favorable ? 'hsl(var(--primary) / 0.7)' : 'hsl(var(--secondary) / 0.6)';
          return (
            <div key={b.label} className="flex-1 min-w-[44px] relative h-full">
              <span className="absolute left-0 right-0 text-center text-[0.6rem] text-muted-foreground tnum" style={{ bottom: `calc(${Math.min(pct(b.hi), 96)}% + 2px)` }}>
                {b.kind === 'delta' ? signed(b.value) : Math.round(b.value).toLocaleString('es-CO')}
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 w-[68%] rounded-sm" style={{ bottom: pct(b.lo) + '%', height: Math.max(1.5, pct(b.hi) - pct(b.lo)) + '%', background: color }}></div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 sm:gap-3 mt-2">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 min-w-[44px] text-[0.6rem] leading-tight text-center text-muted-foreground body-secondary">{b.label}</div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5 mb-6">
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 text-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground body-secondary">Brecha vs. presupuesto</span>
          <span className="block text-2xl heading-secondary tnum mt-1" style={{ color: brecha >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>{signed(brecha)} M</span>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 text-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground body-secondary">Cumplimiento</span>
          <span className="block text-2xl heading-secondary tnum mt-1" style={{ color: cumplimiento >= 100 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>{cumplimiento}%</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        <FinSlider label="Utilidad presupuestada" value={presupuesto} min={0} max={1500} step={50} suffix=" M" onChange={setPresupuesto} />
        <FinSlider label="Desviación en ingresos" value={ingresos} min={-500} max={500} step={20} suffix=" M" onChange={setIngresos} />
        <FinSlider label="Desviación en costos" value={costos} min={-500} max={500} step={20} suffix=" M" onChange={setCostos} />
        <FinSlider label="Desviación en gastos" value={gastos} min={-500} max={500} step={20} suffix=" M" onChange={setGastos} />
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        Cada barra es el <span className="text-foreground">impacto en la utilidad</span>: en mint lo favorable, en coral lo que la erosiona. El presupuesto no se cumple ni se incumple "en general" — se descompone en causas concretas sobre las que sí se puede actuar.
      </p>
    </figure>
  );
};

export default VarianceBridge;
