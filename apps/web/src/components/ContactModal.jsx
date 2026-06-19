import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { nombre: '', email: '', empresa: '', telefono: '', botcheck: '' };
const WA_LINK =
  'https://wa.me/573001303558?text=' +
  encodeURIComponent('Hola, vengo de la web y quiero más información sobre Asimétrica.');

/**
 * Island de contacto. Se monta una sola vez (client:idle) y escucha el evento
 * global `open-contact-modal`, que disparan los botones estáticos de la página.
 */
const ContactModal = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const startedRef = React.useRef(false);

  useEffect(() => {
    const openHandler = () => {
      startedRef.current = false;
      setDone(false);
      setErrors({});
      setTouched({});
      setOpen(true);
    };
    window.addEventListener('open-contact-modal', openHandler);
    return () => window.removeEventListener('open-contact-modal', openHandler);
  }, []);

  // Validación por campo. Devuelve '' si es válido.
  const validateField = (name, value) => {
    const v = (value || '').trim();
    switch (name) {
      case 'nombre': return v ? '' : 'Ingresa tu nombre.';
      case 'email': return !v ? 'Ingresa tu correo.' : (EMAIL_RE.test(v) ? '' : 'Ese correo no parece válido.');
      case 'empresa': return v ? '' : 'Ingresa el nombre de tu empresa.';
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Micro-conversión: el usuario empezó a llenar el formulario (una sola vez).
    if (!startedRef.current && typeof window !== 'undefined') {
      startedRef.current = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_start' });
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Si el campo ya fue tocado, revalida en vivo para que el error desaparezca al corregir.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Honeypot: si está lleno, es un bot → aborta en silencio.
    if (formData.botcheck) return;

    const required = ['nombre', 'email', 'empresa'];
    const nextErrors = {};
    required.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) nextErrors[f] = err;
    });
    setErrors(nextErrors);
    setTouched({ nombre: true, email: true, empresa: true });

    if (Object.keys(nextErrors).length > 0) {
      // Mide la fricción: qué campos fallan la validación (para GTM/GA4).
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'form_error', form_fields: Object.keys(nextErrors).join(',') });
      }
      const firstInvalid = required.find((f) => nextErrors[f]);
      const el = typeof document !== 'undefined' && document.getElementById(firstInvalid);
      if (el) el.focus();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY,
          subject: `Nuevo diagnóstico de ${formData.empresa.trim()}`,
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          empresa: formData.empresa.trim(),
          telefono: formData.telefono.trim(),
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      // Evento de conversión para GTM/GA4 (trigger de evento personalizado
      // "diagnostico_solicitado" → tag de GA4). Seguro si GTM no está activo.
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'diagnostico_solicitado' });
      }

      setFormData(EMPTY);
      setDone(true); // muestra el estado de éxito dentro del modal
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting form:", error);
      }
      toast.error("Hubo un error al enviar la solicitud. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (name) =>
    `bg-background text-foreground text-base sm:text-sm focus-visible:ring-primary ${
      errors[name] ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
    }`;

  const fieldError = (name) =>
    errors[name] ? (
      <p id={`${name}-error`} role="alert" className="text-xs text-destructive body-secondary">
        {errors[name]}
      </p>
    ) : null;

  const a11y = (name) => ({
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: isLoading,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: inputClass(name),
  });

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          {done ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <DialogTitle className="text-xl heading-tertiary">¡Solicitud enviada!</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground body-text">
                Te contactamos en menos de 48 horas para iniciar tu diagnóstico. Revisa tu correo —a veces caemos en la carpeta de promociones.
              </DialogDescription>
              <Button onClick={() => setOpen(false)} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]">
                Listo
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl heading-tertiary">Solicitar Diagnóstico Gratis</DialogTitle>
                <DialogDescription className="text-muted-foreground body-text">
                  Déjanos tus datos y te contactamos en menos de 48 horas para iniciar tu diagnóstico. 100% confidencial.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="text-foreground font-medium">Nombre completo</Label>
                  <Input id="nombre" name="nombre" autoComplete="name" placeholder="Ej. Maya Chen" value={formData.nombre} {...a11y('nombre')} />
                  {fieldError('nombre')}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-foreground font-medium">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="maya@empresa.com" value={formData.email} {...a11y('email')} />
                  {fieldError('email')}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="empresa" className="text-foreground font-medium">Empresa</Label>
                  <Input id="empresa" name="empresa" autoComplete="organization" placeholder="Nombre de tu empresa" value={formData.empresa} {...a11y('empresa')} />
                  {fieldError('empresa')}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="text-foreground font-medium">
                    Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
                  </Label>
                  <Input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" placeholder="+57 300 000 0000" value={formData.telefono} onChange={handleChange} disabled={isLoading} className="bg-background text-foreground border-input text-base sm:text-sm focus-visible:ring-primary" />
                </div>

                {/* Honeypot anti-spam: invisible para humanos; los bots lo llenan. */}
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData.botcheck}
                  onChange={handleChange}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                <Button type="submit" className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]" disabled={isLoading}>
                  {isLoading ? "Enviando…" : "Quiero mi diagnóstico gratis"}
                </Button>

                <div className="flex items-center gap-3 py-1" aria-hidden="true">
                  <span className="h-px flex-1 bg-border/60"></span>
                  <span className="text-xs text-muted-foreground body-secondary">o</span>
                  <span className="h-px flex-1 bg-border/60"></span>
                </div>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-md border border-input py-2.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary body-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>
                  Prefiero WhatsApp
                </a>

                <p className="text-xs text-muted-foreground text-center body-secondary">
                  Te respondemos en 24–48h · Sin compromiso. Al enviar aceptas nuestra <a href="/privacidad" className="link-underline hover:text-primary">política de datos</a>.
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactModal;
