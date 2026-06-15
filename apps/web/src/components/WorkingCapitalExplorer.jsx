import React, { useState } from 'react';

// Explorable estilo distill.pub: mueve los controles y ve, con tus números,
// cuánta caja queda atrapada en el capital de trabajo. Cálculo aproximado/educativo.
const fmt = (millones) => '$' + Math.round(millones).toLocaleString('es-CO') + ' M';

const Slider = ({ label, value, min, max, step, suffix, onChange }) => (
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

const WorkingCapitalExplorer = () => {
  const [ventas, setVentas] = useState(6000); // millones COP / año
  const [dso, setDso] = useState(60); // días de cartera
  const [dio, setDio] = useState(45); // días de inventario
  const [dpo, setDpo] = useState(30); // días de proveedores
  const [mejora, setMejora] = useState(15); // días a reducir

  const ccc = dso + dio - dpo; // ciclo de conversión de efectivo
  const atrapado = (ventas * Math.max(ccc, 0)) / 365; // proxy capital de trabajo
  const liberable = (ventas * Math.min(mejora, Math.max(ccc, 0))) / 365;

  const operativo = dso + dio;
  const escala = Math.max(operativo, 1);

  return (
    <figure className="card-surface p-5 md:p-7">
      <figcaption className="flex items-center gap-2 mb-1">
        <span className="text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-primary body-secondary">Interactivo</span>
        <span className="text-xs text-muted-foreground body-secondary">· mueve los controles con tus números</span>
      </figcaption>
      <h3 className="text-lg md:text-xl heading-tertiary text-foreground mb-5">¿Cuánta caja tienes atrapada en el capital de trabajo?</h3>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
        <div className="space-y-4">
          <Slider label="Ventas al año" value={ventas} min={500} max={50000} step={500} suffix=" M" onChange={setVentas} />
          <Slider label="Días de cartera (cobras a)" value={dso} min={0} max={150} step={5} suffix=" días" onChange={setDso} />
          <Slider label="Días de inventario" value={dio} min={0} max={180} step={5} suffix=" días" onChange={setDio} />
          <Slider label="Días de proveedores (te financian)" value={dpo} min={0} max={150} step={5} suffix=" días" onChange={setDpo} />
        </div>

        <div className="flex flex-col justify-between gap-5">
          {/* Visual del ciclo */}
          <div>
            <div className="text-xs text-muted-foreground body-secondary mb-2">Ciclo de conversión de efectivo</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Tu plata afuera (cartera + inventario)</span><span className="tnum">{operativo} d</span></div>
                <div className="h-3 rounded-full" style={{ background: 'hsl(var(--secondary) / 0.45)', width: '100%' }}></div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Te financia el proveedor</span><span className="tnum">{dpo} d</span></div>
                <div className="h-3 rounded-full bg-primary" style={{ width: Math.round((Math.min(dpo, escala) / escala) * 100) + '%' }}></div>
              </div>
            </div>
            <div className="mt-2 text-sm text-foreground body-text">
              Ciclo neto: <span className="text-primary font-semibold tnum">{ccc} días</span>
            </div>
          </div>

          {/* Resultado */}
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground body-secondary">Caja atrapada en el ciclo</div>
            <div className="text-3xl heading-secondary tnum mt-1" style={{ color: 'hsl(var(--secondary))' }}>{fmt(atrapado)}</div>
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-foreground body-text">Si reduces el ciclo <span className="tnum">{mejora}</span> días, liberas</span>
                <span className="text-xl heading-secondary text-primary tnum whitespace-nowrap">{fmt(liberable)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={mejora}
                onChange={(e) => setMejora(Number(e.target.value))}
                className="w-full h-2 mt-2 cursor-pointer appearance-none rounded-full bg-white/[0.08]"
                style={{ accentColor: 'hsl(var(--primary))' }}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-5 body-secondary">
        Estimación educativa para construir intuición. En un diagnóstico real medimos tu ciclo con tus estados financieros.
      </p>
    </figure>
  );
};

export default WorkingCapitalExplorer;
