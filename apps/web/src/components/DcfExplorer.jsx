import React, { useState } from 'react';

// Explorable estilo distill: valoración por flujo de caja descontado (DCF).
// Mueve crecimiento y WACC y ve cómo cambia el valor. Educativo/aproximado.
const fmt = (m) => '$' + Math.round(m).toLocaleString('es-CO') + ' M';

const Slider = ({ label, value, min, max, step, suffix, onChange }) => (
  <div>
    <div className="flex items-baseline justify-between mb-1.5">
      <label className="text-sm text-foreground body-text">{label}</label>
      <span className="text-sm font-semibold text-primary tnum">{value.toLocaleString('es-CO')}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 cursor-pointer appearance-none rounded-full bg-white/[0.08]"
      style={{ accentColor: 'hsl(var(--primary))' }} />
  </div>
);

const DcfExplorer = () => {
  const [fcf1, setFcf1] = useState(1000); // FCF año 1 (millones)
  const [growth, setGrowth] = useState(12); // % crecimiento anual
  const [wacc, setWacc] = useState(16); // % tasa de descuento
  const gT = 3; // crecimiento perpetuo (fijo)
  const years = 5;

  const valido = wacc > gT;
  const flujos = Array.from({ length: years }, (_, idx) => {
    const t = idx + 1;
    const fcfT = fcf1 * Math.pow(1 + growth / 100, t - 1);
    return { fcfT, pv: fcfT / Math.pow(1 + wacc / 100, t) };
  });
  const pvExplicito = flujos.reduce((acc, f) => acc + f.pv, 0);
  const fcfN = flujos[flujos.length - 1].fcfT;
  const tv = valido ? (fcfN * (1 + gT / 100)) / ((wacc - gT) / 100) : 0;
  const pvTerminal = valido ? tv / Math.pow(1 + wacc / 100, years) : 0;
  const ev = pvExplicito + pvTerminal;
  const pctTerminal = ev > 0 ? Math.round((pvTerminal / ev) * 100) : 0;

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo</span>
        <span className="text-xs text-muted-foreground body-secondary">· mueve los supuestos y ve el valor</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Valora tu empresa por flujo de caja descontado</h3>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
        <div className="space-y-4">
          <Slider label="Flujo de caja libre (año 1)" value={fcf1} min={100} max={10000} step={100} suffix=" M" onChange={setFcf1} />
          <Slider label="Crecimiento anual" value={growth} min={0} max={40} step={1} suffix=" %" onChange={setGrowth} />
          <Slider label="WACC (tasa de descuento)" value={wacc} min={8} max={30} step={1} suffix=" %" onChange={setWacc} />
          <p className="text-xs text-muted-foreground body-secondary">Crecimiento perpetuo fijo en {gT}%. La sensibilidad al WACC es enorme: súbelo 2 puntos y mira caer el valor.</p>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground body-secondary">Valor estimado de la empresa</div>
            {valido ? (
              <div className="text-3xl md:text-4xl heading-secondary text-primary tnum mt-1 leading-none">{fmt(ev)}</div>
            ) : (
              <div className="text-base text-secondary mt-2 body-text">El WACC debe ser mayor que el crecimiento perpetuo ({gT}%).</div>
            )}
          </div>

          {valido && (
            <div>
              <div className="text-xs text-muted-foreground body-secondary mb-2">De dónde viene el valor</div>
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full bg-primary" style={{ width: (100 - pctTerminal) + '%' }} title="Flujos explícitos"></div>
                <div className="h-full" style={{ width: pctTerminal + '%', background: 'hsl(var(--accent) / 0.7)' }} title="Valor terminal"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs body-secondary">
                <span className="text-primary">Flujos 5 años · {100 - pctTerminal}%</span>
                <span style={{ color: 'hsl(var(--accent))' }}>Valor terminal · {pctTerminal}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        Estimación educativa (DCF simplificado a 5 años). Una valoración real ajusta capital de trabajo, deuda neta, riesgo país y comparables.
      </p>
    </figure>
  );
};

export default DcfExplorer;
