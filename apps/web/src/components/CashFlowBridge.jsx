import React, { useState } from 'react';
import FinSlider from '@/components/FinSlider.jsx';

const fmt = (m) => '$' + Math.round(m).toLocaleString('es-CO');

const CashFlowBridge = () => {
  const [inicial, setInicial] = useState(300);
  const [operacion, setOperacion] = useState(450);
  const [inversion, setInversion] = useState(250); // salida
  const [financiacion, setFinanciacion] = useState(-120); // pago de deuda/dividendos por defecto

  const final = inicial + operacion - inversion + financiacion;

  const steps = [
    { label: 'Caja inicial', kind: 'total', value: inicial },
    { label: 'Operación', kind: 'delta', value: operacion },
    { label: 'Inversión', kind: 'delta', value: -inversion },
    { label: 'Financiación', kind: 'delta', value: financiacion },
    { label: 'Caja final', kind: 'total', value: final },
  ];

  const { bars } = steps.reduce((st, s) => {
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
  }, { running: 0, bars: [] });

  const floor = Math.min(0, ...bars.map((b) => b.lo));
  const ceil = Math.max(0, ...bars.map((b) => b.hi));
  const range = ceil - floor || 1;
  const pct = (v) => ((v - floor) / range) * 100;
  const zeroPct = pct(0);

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo · EEFF</span>
        <span className="text-xs text-muted-foreground body-secondary">· de dónde entra y sale la caja</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Flujo de caja del período (bridge)</h3>

      <div className="relative flex items-end gap-2 sm:gap-3 h-52">
        {/* línea de cero */}
        <div className="absolute left-0 right-0 border-t border-dashed border-white/[0.18]" style={{ bottom: zeroPct + '%' }}></div>
        {bars.map((b) => {
          const positivo = b.kind === 'total' ? b.value >= 0 : b.value >= 0;
          const color = positivo ? 'hsl(var(--primary))' : 'hsl(var(--secondary) / 0.6)';
          return (
            <div key={b.label} className="flex-1 min-w-[44px] relative h-full">
              <span className="absolute left-0 right-0 text-center text-[0.6rem] text-muted-foreground tnum" style={{ bottom: `calc(${Math.min(pct(b.hi), 96)}% + 2px)` }}>{Math.round(b.value).toLocaleString('es-CO')}</span>
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

      <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4 mt-5 text-center">
        <span className="text-xs uppercase tracking-wider text-muted-foreground body-secondary">Caja final del período</span>
        <span className="block text-2xl heading-secondary tnum mt-1" style={{ color: final >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>{fmt(final)}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        <FinSlider label="Caja inicial" value={inicial} min={0} max={2000} step={50} suffix=" M" onChange={setInicial} />
        <FinSlider label="Flujo de operación" value={operacion} min={-500} max={1500} step={50} suffix=" M" onChange={setOperacion} />
        <FinSlider label="Inversión (CapEx)" value={inversion} min={0} max={1500} step={50} suffix=" M" onChange={setInversion} />
        <FinSlider label="Financiación (deuda/dividendos)" value={financiacion} min={-800} max={1000} step={50} suffix=" M" onChange={setFinanciacion} />
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        La operación debería financiar la inversión a la larga. Si la caja vive de financiación, hay una alerta estructural.
      </p>
    </figure>
  );
};

export default CashFlowBridge;
