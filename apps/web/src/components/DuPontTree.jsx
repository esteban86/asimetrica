import React, { useState } from 'react';
import FinSlider from '@/components/FinSlider.jsx';

const Factor = ({ value, label }) => (
  <div className="flex-1 min-w-[88px] rounded-lg border border-white/[0.07] bg-white/[0.03] p-3 text-center">
    <div className="text-xl heading-secondary text-foreground tnum">{value}</div>
    <div className="text-[0.7rem] text-muted-foreground body-secondary mt-1 leading-tight">{label}</div>
  </div>
);

const DuPontTree = () => {
  const [margen, setMargen] = useState(8); // margen neto %
  const [rotacion, setRotacion] = useState(1.2); // ventas / activos
  const [apalancamiento, setApalancamiento] = useState(1.8); // activos / patrimonio

  const roa = (margen / 100) * rotacion; // sobre activos
  const roe = roa * apalancamiento;
  const roePct = (roe * 100).toFixed(1);
  const roaPct = (roa * 100).toFixed(1);

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo · EEFF</span>
        <span className="text-xs text-muted-foreground body-secondary">· de dónde nace la rentabilidad (DuPont)</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">Árbol DuPont: ¿de dónde sale tu ROE?</h3>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
        <Factor value={`${margen}%`} label="Margen neto" />
        <div className="text-xl text-muted-foreground">×</div>
        <Factor value={`${rotacion.toFixed(1)}x`} label="Rotación de activos" />
        <div className="text-xl text-muted-foreground">×</div>
        <Factor value={`${apalancamiento.toFixed(1)}x`} label="Apalancamiento" />
        <div className="text-xl text-primary">=</div>
        <div className="flex-1 min-w-[96px] rounded-lg p-3 text-center" style={{ background: 'hsl(var(--primary) / 0.12)', border: '1px solid hsl(var(--primary) / 0.3)' }}>
          <div className="text-2xl heading-secondary text-primary tnum">{roePct}%</div>
          <div className="text-[0.7rem] text-muted-foreground body-secondary mt-1">ROE</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-4 body-text">
        Tu retorno sobre patrimonio (ROE) es <span className="text-primary font-semibold tnum">{roePct}%</span>; sobre activos (ROA), <span className="text-foreground tnum">{roaPct}%</span>. Dos empresas con el mismo ROE pueden lograrlo de formas muy distintas: una con margen, otra con rotación, otra con deuda.
      </p>

      <div className="grid sm:grid-cols-3 gap-x-6 gap-y-4 mt-6">
        <FinSlider label="Margen neto" value={margen} min={1} max={30} step={1} suffix=" %" onChange={setMargen} />
        <FinSlider label="Rotación de activos" value={rotacion} min={0.2} max={4} step={0.1} suffix="x" onChange={setRotacion} />
        <FinSlider label="Apalancamiento" value={apalancamiento} min={1} max={5} step={0.1} suffix="x" onChange={setApalancamiento} />
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        Subir el apalancamiento infla el ROE… y el riesgo. El árbol DuPont muestra si tu rentabilidad es sana (margen/rotación) o prestada (deuda).
      </p>
    </figure>
  );
};

export default DuPontTree;
