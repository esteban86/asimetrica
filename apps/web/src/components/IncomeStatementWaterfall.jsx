import React, { useState } from 'react';

// EEFF visual + distill: estado de resultados en cascada (waterfall) interactivo.
const fmt = (m) => '$' + Math.round(m).toLocaleString('es-CO');

const Slider = ({ label, value, min, max, step, suffix, onChange }) => (
  <div>
    <div className="flex items-baseline justify-between mb-1">
      <label className="text-sm text-foreground body-text">{label}</label>
      <span className="text-sm font-semibold text-primary tnum">{value.toLocaleString('es-CO')}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 cursor-pointer appearance-none rounded-full bg-white/[0.08]"
      style={{ accentColor: 'hsl(var(--primary))' }} />
  </div>
);

const IncomeStatementWaterfall = () => {
  const [ingresos, setIngresos] = useState(5000);
  const [cogs, setCogs] = useState(58);
  const [opex, setOpex] = useState(24);
  const [otros, setOtros] = useState(6); // deprec. + intereses, % ingresos
  const [tax, setTax] = useState(30);

  const costo = (ingresos * cogs) / 100;
  const margenBruto = ingresos - costo;
  const gastosOp = (ingresos * opex) / 100;
  const ebitda = margenBruto - gastosOp;
  const otrosV = (ingresos * otros) / 100;
  const uai = ebitda - otrosV;
  const impuestos = Math.max(0, (uai * tax) / 100);
  const neto = uai - impuestos;

  const steps = [
    { label: 'Ingresos', kind: 'total', value: ingresos },
    { label: 'Costo ventas', kind: 'minus', value: costo },
    { label: 'Margen bruto', kind: 'subtotal', value: margenBruto },
    { label: 'Gastos op.', kind: 'minus', value: gastosOp },
    { label: 'EBITDA', kind: 'subtotal', value: ebitda },
    { label: 'Deprec.+int.', kind: 'minus', value: otrosV },
    { label: 'Impuestos', kind: 'minus', value: impuestos },
    { label: 'Utilidad neta', kind: 'total', value: neto },
  ];

  const { bars } = steps.reduce((st, s) => {
    let lo, hi;
    if (s.kind === 'minus') { hi = st.running; lo = st.running - s.value; }
    else { lo = 0; hi = s.value; }
    return { running: s.kind === 'minus' ? lo : s.value, bars: [...st.bars, { ...s, lo, hi }] };
  }, { running: 0, bars: [] });

  const max = ingresos || 1;
  const margin = (n) => (ingresos > 0 ? Math.round((n / ingresos) * 100) : 0);

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo · EEFF</span>
        <span className="text-xs text-muted-foreground body-secondary">· mueve los márgenes y ve la cascada</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Estado de resultados en cascada</h3>

      {/* Chips de márgenes */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center"><div className="text-xl heading-secondary text-foreground tnum">{margin(margenBruto)}%</div><div className="text-[0.7rem] text-muted-foreground body-secondary">Margen bruto</div></div>
        <div className="text-center"><div className="text-xl heading-secondary text-foreground tnum">{margin(ebitda)}%</div><div className="text-[0.7rem] text-muted-foreground body-secondary">Margen EBITDA</div></div>
        <div className="text-center"><div className="text-xl heading-secondary tnum" style={{ color: neto >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>{margin(neto)}%</div><div className="text-[0.7rem] text-muted-foreground body-secondary">Margen neto</div></div>
      </div>

      {/* Cascada */}
      <div className="flex items-end gap-1 sm:gap-2 overflow-x-auto pb-1">
        {bars.map((b) => {
          const loPct = Math.max(0, (b.lo / max) * 100);
          const hPct = Math.max(1.5, (Math.abs(b.hi - b.lo) / max) * 100);
          const color = b.kind === 'minus' ? 'hsl(var(--secondary) / 0.55)' : 'hsl(var(--primary))';
          return (
            <div key={b.label} className="flex-1 min-w-[34px] flex flex-col items-center">
              <div className="relative w-full h-44">
                <span className="absolute left-0 right-0 text-center text-[0.6rem] text-muted-foreground tnum" style={{ bottom: `calc(${Math.min(loPct + hPct, 98)}% + 2px)` }}>{Math.round(b.value).toLocaleString('es-CO')}</span>
                <div className="absolute left-1/2 -translate-x-1/2 w-[70%] rounded-sm" style={{ bottom: loPct + '%', height: hPct + '%', background: color }}></div>
              </div>
              <div className="mt-2 text-[0.6rem] leading-tight text-center text-muted-foreground body-secondary">{b.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        <Slider label="Ingresos" value={ingresos} min={500} max={50000} step={500} suffix=" M" onChange={setIngresos} />
        <Slider label="Costo de ventas" value={cogs} min={20} max={85} step={1} suffix=" %" onChange={setCogs} />
        <Slider label="Gastos operativos" value={opex} min={5} max={50} step={1} suffix=" %" onChange={setOpex} />
        <Slider label="Deprec. + intereses" value={otros} min={0} max={25} step={1} suffix=" %" onChange={setOtros} />
        <Slider label="Tasa de impuestos" value={tax} min={0} max={40} step={1} suffix=" %" onChange={setTax} />
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        Verde = ingresos y subtotales (margen bruto, EBITDA, utilidad). Coral = lo que resta. Modelo educativo: tu modelo real conecta este P&amp;G con balance y caja.
      </p>
    </figure>
  );
};

export default IncomeStatementWaterfall;
