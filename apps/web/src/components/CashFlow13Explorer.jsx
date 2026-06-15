import React, { useState } from 'react';

// Explorable estilo distill: proyección de caja a 13 semanas.
// Mueve el pago grande y su semana, y ve el "valle" de caja desplazarse.
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

const CashFlow13Explorer = () => {
  const [saldo, setSaldo] = useState(200);
  const [ingreso, setIngreso] = useState(85);
  const [egreso, setEgreso] = useState(80);
  const [pago, setPago] = useState(140);
  const [semanaPago, setSemanaPago] = useState(6);

  // Balances semana 0..13
  const balances = [saldo];
  Array.from({ length: 13 }, (_, k) => k + 1).forEach((w) => {
    const extra = w === semanaPago ? pago : 0;
    balances.push(balances[balances.length - 1] + ingreso - egreso - extra);
  });
  let minVal = balances[0];
  let minWeek = 0;
  balances.forEach((b, i) => { if (b < minVal) { minVal = b; minWeek = i; } });
  const crisis = minVal < 0;

  // Geometría SVG (viewBox normal para que punto y trazo no se distorsionen)
  const W = 320, H = 150, padX = 12, top = 14, bot = 130;
  const yMax = Math.max(...balances, 0);
  const yMin = Math.min(...balances, 0);
  const range = yMax - yMin || 1;
  const xOf = (i) => padX + (i / 13) * (W - padX * 2);
  const yOf = (b) => bot - ((b - yMin) / range) * (bot - top);
  const linePts = balances.map((b, i) => `${xOf(i).toFixed(1)},${yOf(b).toFixed(1)}`).join(' ');
  const areaPts = `${xOf(0)},${yOf(yMin)} ${linePts} ${xOf(13)},${yOf(yMin)}`;
  const y0 = yOf(0);

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo</span>
        <span className="text-xs text-muted-foreground body-secondary">· mueve el pago grande y mira el valle de caja</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Tu caja en las próximas 13 semanas</h3>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" role="img" aria-label="Proyección de caja a 13 semanas">
        <defs>
          <linearGradient id="cf-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPts} fill="url(#cf-area)" />
        {/* línea base (cero) */}
        <line x1={padX} y1={y0} x2={W - padX} y2={y0} stroke="hsl(var(--muted) / 0.4)" strokeWidth="1" strokeDasharray="3 3" />
        <polyline points={linePts} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* punto del valle */}
        <circle cx={xOf(minWeek)} cy={yOf(minVal)} r="4" fill={crisis ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'} />
      </svg>
      <div className="flex justify-between mt-1 text-[0.7rem] text-muted-foreground body-secondary">
        <span>Hoy</span><span>Semana 13</span>
      </div>

      <div className={`mt-4 rounded-lg p-4 ${crisis ? '' : 'bg-white/[0.03] border border-white/[0.06]'}`} style={crisis ? { background: 'hsl(var(--secondary) / 0.10)', border: '1px solid hsl(var(--secondary) / 0.3)' } : {}}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground body-secondary">Saldo más bajo</div>
        <div className="text-2xl heading-secondary tnum mt-1" style={{ color: crisis ? 'hsl(var(--secondary))' : 'hsl(var(--primary))' }}>
          {fmt(minVal)} <span className="text-sm text-muted-foreground font-normal">· semana {minWeek}</span>
        </div>
        {crisis && <div className="text-sm mt-1 body-text" style={{ color: 'hsl(var(--secondary))' }}>⚠ Entras en crisis de caja: lo verías con semanas de anticipación.</div>}
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        <Slider label="Saldo inicial" value={saldo} min={0} max={1000} step={20} suffix=" M" onChange={setSaldo} />
        <Slider label="Ingreso semanal" value={ingreso} min={0} max={300} step={5} suffix=" M" onChange={setIngreso} />
        <Slider label="Egreso semanal" value={egreso} min={0} max={300} step={5} suffix=" M" onChange={setEgreso} />
        <Slider label="Pago grande (única vez)" value={pago} min={0} max={600} step={10} suffix=" M" onChange={setPago} />
        <div className="sm:col-span-2">
          <Slider label="¿En qué semana cae el pago grande?" value={semanaPago} min={1} max={13} step={1} suffix="" onChange={setSemanaPago} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        Modelo educativo simplificado. El flujo a 13 semanas real usa tus cobros y pagos reales, semana a semana.
      </p>
    </figure>
  );
};

export default CashFlow13Explorer;
