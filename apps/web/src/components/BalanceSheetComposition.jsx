import React, { useState } from 'react';
import FinSlider from '@/components/FinSlider.jsx';

const fmt = (m) => '$' + Math.round(m).toLocaleString('es-CO');

const Stack = ({ title, segments, total }) => (
  <div className="flex-1">
    <div className="text-xs uppercase tracking-wider text-muted-foreground body-secondary mb-2 text-center">{title}</div>
    <div className="h-56 w-full rounded-lg overflow-hidden flex flex-col bg-white/[0.03]">
      {segments.map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-center text-[0.65rem] text-foreground/90 body-secondary overflow-hidden"
          style={{ height: (total > 0 ? Math.max(0, (s.value / total) * 100) : 0) + '%', background: s.color }}
          title={`${s.label}: ${fmt(s.value)}`}
        >
          <span className="px-1 truncate">{s.label}</span>
        </div>
      ))}
    </div>
    <div className="text-center text-sm font-semibold text-foreground tnum mt-2">{fmt(total)}</div>
  </div>
);

const BalanceSheetComposition = () => {
  const [ac, setAc] = useState(1800); // activo corriente
  const [anc, setAnc] = useState(2200); // activo no corriente
  const [pc, setPc] = useState(1200); // pasivo corriente
  const [pnc, setPnc] = useState(900); // pasivo no corriente

  const activos = ac + anc;
  const pasivos = pc + pnc;
  const patrimonio = activos - pasivos;
  const insolvente = patrimonio < 0;

  const razonCorriente = pc > 0 ? ac / pc : 0;
  const endeudamiento = activos > 0 ? Math.round((pasivos / activos) * 100) : 0;

  const activoSeg = [
    { label: 'Activo no corriente', value: anc, color: 'hsl(var(--primary) / 0.45)' },
    { label: 'Activo corriente', value: ac, color: 'hsl(var(--primary))' },
  ];
  const pasPatSeg = [
    { label: 'Patrimonio', value: Math.max(0, patrimonio), color: 'hsl(var(--accent) / 0.75)' },
    { label: 'Pasivo no corriente', value: pnc, color: 'hsl(var(--secondary) / 0.4)' },
    { label: 'Pasivo corriente', value: pc, color: 'hsl(var(--secondary) / 0.6)' },
  ];

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo · EEFF</span>
        <span className="text-xs text-muted-foreground body-secondary">· el balance siempre cuadra</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Balance: Activo = Pasivo + Patrimonio</h3>

      <div className="flex items-end gap-4 sm:gap-8 max-w-md mx-auto">
        <Stack title="Activo" segments={activoSeg} total={activos} />
        <div className="pb-10 text-2xl text-muted-foreground">=</div>
        <Stack title="Pasivo + Patrimonio" segments={pasPatSeg} total={Math.max(activos, pasivos)} />
      </div>

      {insolvente && (
        <p className="text-sm mt-4 text-center body-text" style={{ color: 'hsl(var(--secondary))' }}>
          ⚠ Patrimonio negativo: los pasivos superan los activos (insolvencia técnica).
        </p>
      )}

      <div className="grid grid-cols-3 gap-3 mt-5 mb-6">
        <div className="text-center"><div className="text-lg heading-secondary text-foreground tnum">{razonCorriente.toFixed(2)}</div><div className="text-[0.7rem] text-muted-foreground body-secondary">Razón corriente</div></div>
        <div className="text-center"><div className="text-lg heading-secondary text-foreground tnum">{endeudamiento}%</div><div className="text-[0.7rem] text-muted-foreground body-secondary">Endeudamiento</div></div>
        <div className="text-center"><div className="text-lg heading-secondary tnum" style={{ color: insolvente ? 'hsl(var(--secondary))' : 'hsl(var(--accent))' }}>{fmt(patrimonio)}</div><div className="text-[0.7rem] text-muted-foreground body-secondary">Patrimonio</div></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        <FinSlider label="Activo corriente" value={ac} min={0} max={6000} step={100} suffix=" M" onChange={setAc} />
        <FinSlider label="Activo no corriente" value={anc} min={0} max={6000} step={100} suffix=" M" onChange={setAnc} />
        <FinSlider label="Pasivo corriente" value={pc} min={0} max={6000} step={100} suffix=" M" onChange={setPc} />
        <FinSlider label="Pasivo no corriente" value={pnc} min={0} max={6000} step={100} suffix=" M" onChange={setPnc} />
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        El patrimonio es lo que queda de los activos tras pagar los pasivos. Por eso el balance siempre cuadra.
      </p>
    </figure>
  );
};

export default BalanceSheetComposition;
