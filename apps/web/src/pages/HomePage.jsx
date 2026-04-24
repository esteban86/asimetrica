import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ContactFormModal from '@/components/ContactFormModal.jsx';
const HomePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-100px'
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const scrollToSection = id => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  return <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/[0.08]">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button onClick={() => scrollToSection('hero')} className="flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none" aria-label="Volver al inicio">
                <img src="/logo.png" alt="Asimétrica" width="120" height="32" className="h-8 w-auto" />
                <span className="text-sm text-muted-foreground hidden sm:inline body-secondary border-l border-border/[0.2] pl-3">Finanzas estratégicas</span>
              </button>
              
              <div className="hidden md:flex items-center gap-6 text-sm body-text">
                {['problema', 'solucion', 'herramientas', 'proceso', 'planes', 'contacto'].map(section => <button key={section} onClick={() => scrollToSection(section)} className={`capitalize transition-all duration-200 hover:text-primary ${activeSection === section ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {section === 'solucion' ? 'Solución' : section}
                  </button>)}
              </div>

              <Button onClick={() => setModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-sm body-text">
                Contáctanos
              </Button>
            </div>
          </nav>
        </header>

        <main id="main">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="aurora-glow turquesa"></div>
          <div className="aurora-glow purpura"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl heading-primary mb-6">
                La contabilidad registra el pasado.{' '}
                <span className="gradient-text-primary">Asimétrica construye el futuro.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 mx-auto leading-relaxed body-text">
                Dirección Financiera Estratégica para empresas colombianas que quieren crecer con inteligencia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={() => setModalOpen(true)} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-base px-8 body-text">
                  Solicitar Diagnóstico Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <button onClick={() => scrollToSection('planes')} className="text-base text-foreground hover:text-primary transition-all duration-200 underline underline-offset-4 body-text">
                  Conocer los planes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* El Problema Section */}
        <section id="problema" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in mb-12">
              <h2 className="text-3xl md:text-4xl heading-section mb-4">
                El <span className="text-primary">Problema</span>
              </h2>
            </div>

            <div className="space-y-8 max-w-4xl">
              {[{
              num: '01',
              title: 'Contabilidad de espejo retrovisor.',
              desc: 'Solo miras el pasado, nunca el camino que viene.'
            }, {
              num: '02',
              title: 'Caja estrecha a pesar de las ventas.',
              desc: 'Vendes pero el dinero no aparece.'
            }, {
              num: '03',
              title: 'Decisiones a ciegas.',
              desc: 'Sin datos confiables, cada decisión es una apuesta.'
            }, {
              num: '04',
              title: 'Sin acceso real al crédito o inversión.',
              desc: 'Los bancos piden lo que no tienes estructurado.'
            }, {
              num: '05',
              title: 'Deterioro del patrimonio.',
              desc: 'La empresa genera ingresos pero destruye valor.'
            }].map((item, index) => <div key={index} className="fade-in flex gap-6 items-start" style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <span className="text-6xl font-bold text-primary/20 leading-none heading-secondary">{item.num}</span>
                  <div>
                    <h3 className="text-xl heading-tertiary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground description">{item.desc}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        <div className="gradient-separator"></div>

        {/* Qué es Asimétrica Section */}
        <section id="solucion" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in mb-8">
              <h2 className="text-3xl md:text-4xl heading-section mb-6">
                ¿Qué es <span className="text-primary">Asimétrica</span>?
              </h2>
            </div>

            <div className="fade-in max-w-4xl">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 body-text">
                Somos tu equipo de <strong className="text-foreground">dirección financiera estratégica</strong> — con la experiencia y las herramientas de un gerente financiero, pero sin el costo fijo de tenerlo en nómina. Eso es lo que se conoce como <strong className="text-foreground">CFO Fraccional</strong>: accedes a la función financiera completa, adaptada al ritmo y la realidad de tu empresa.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 body-text">
                Construimos <strong className="text-foreground">inteligencia financiera</strong> para tu empresa: modelos integrados que proyectan el futuro, dashboards ejecutivos que revelan dónde se crea y se destruye valor, y estrategias concretas que liberan caja, fortalecen la estructura de capital y construyen patrimonio real. Para que cada decisión estratégica esté respaldada por datos, no solo por instinto.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed body-text">
                Trabajamos con empresas que facturan entre $500M y $50.000M COP anuales y que están listas para dejar de adivinar y empezar a dirigir.
              </p>
            </div>
          </div>
        </section>

        {/* Tres Pilares Section */}
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in text-center mb-12">
              <h2 className="text-3xl md:text-4xl heading-section mb-4">
                Convertimos tu empresa en una que <span className="text-primary">construye patrimonio</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
              num: '01',
              title: 'CLARIDAD',
              color: 'secondary',
              desc: 'Sabes exactamente dónde estás parado: cuánto generas, cuánto gastas, cuánto queda y por qué.'
            }, {
              num: '02',
              title: 'DIRECCIÓN',
              color: 'primary',
              desc: 'Tienes un modelo que proyecta escenarios, anticipa crisis y guía cada decisión con datos confiables.'
            }, {
              num: '03',
              title: 'CRECIMIENTO',
              color: 'accent',
              desc: 'Liberas caja, optimizas capital de trabajo y estructuras la empresa para escalar o atraer inversión.'
            }].map((pilar, index) => <Card key={index} className="fade-in card-hover bg-card border-t-4 p-6" style={{
              borderTopColor: `hsl(var(--${pilar.color}))`,
              transitionDelay: `${index * 100}ms`
            }}>
                  <div className="text-4xl font-bold text-muted-foreground/30 mb-4 heading-secondary">{pilar.num}</div>
                  <h3 className="text-xl heading-tertiary mb-3">{pilar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed description">{pilar.desc}</p>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Herramientas Section */}
        <section id="herramientas" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in mb-4">
              <h2 className="text-3xl md:text-4xl heading-section mb-4">
                Las herramientas que activamos para tu empresa
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl body-text">
                No solo asesoría — modelos concretos y dashboards accionables según el plan que elijas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[{
              title: 'Modelo de 3 Estados',
              category: 'Herramienta base',
              desc: 'P&G + Balance + Caja integrado, histórico y proyectado.'
            }, {
              title: 'Flujo de Caja 13 Semanas',
              category: 'Control de liquidez',
              desc: 'Control operativo semana a semana. Anticipas la crisis antes de que llegue.'
            }, {
              title: 'Dashboard de KPIs',
              category: 'Visibilidad ejecutiva',
              desc: 'EBITDA, margen bruto, rotación de cartera, cobertura de deuda.'
            }, {
              title: 'Capital de Trabajo',
              category: 'Liberación de caja',
              desc: 'Optimización del ciclo cartera–inventario–proveedores.'
            }, {
              title: 'Presupuesto y Forecast',
              category: 'Dirección financiera',
              desc: 'Plan anual + rolling forecast trimestral con análisis de variaciones.'
            }, {
              title: 'Árbol de Rentabilidad',
              category: 'Qué negocio conviene',
              desc: 'Descomposición por producto, cliente, canal o unidad.'
            }, {
              title: 'Análisis de Deuda y Capital',
              category: 'Optimización financiera',
              desc: 'Revisión de pasivos, tasas, plazos y covenants.'
            }, {
              title: 'Investment Readiness Pack',
              category: 'Solo plan Estratégico',
              desc: 'Information memorandum, modelo a 5 años, valoración y data room.'
            }].map((tool, index) => <Card key={index} className="fade-in card-hover bg-card p-6" style={{
              transitionDelay: `${index * 50}ms`
            }}>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 body-secondary">
                    {tool.category}
                  </div>
                  <h3 className="text-lg heading-tertiary mb-3">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed description">{tool.desc}</p>
                </Card>)}
            </div>
          </div>
        </section>

        <div className="gradient-separator"></div>

        {/* Proceso Section */}
        <section id="proceso" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in mb-12">
              <h2 className="text-3xl md:text-4xl heading-section mb-4">
                Cómo <span className="text-primary">Trabajamos</span>
              </h2>
            </div>

            <div className="space-y-12 max-w-4xl">
              {[{
              num: '00',
              title: 'Diagnóstico Flash',
              time: '48h · Sin costo',
              desc: 'Revisamos tus estados financieros e identificamos 3–5 ineficiencias concretas con su impacto en COP.'
            }, {
              num: '01',
              title: 'Inmersión y Diagnóstico',
              time: 'Semanas 1–4',
              desc: 'Conocemos el negocio a fondo: ingresos, costos, caja, deuda. Construimos el modelo base y la hoja de ruta de 90 días.'
            }, {
              num: '02',
              title: 'Quick Wins',
              time: 'Meses 2–3',
              desc: 'Activamos las herramientas de mayor impacto. Generamos los primeros resultados cuantificables.'
            }, {
              num: '03',
              title: 'Dirección Continua',
              time: 'Mes 4 en adelante',
              desc: 'Cadencia mensual: modelo actualizado, comité financiero, informe ejecutivo y soporte constante.'
            }].map((step, index) => <div key={index} className="fade-in flex gap-6 items-start" style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary heading-secondary">{step.num}</span>
                    </div>
                    {index < 3 && <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-transparent mt-4"></div>}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-xl heading-tertiary">{step.title}</h3>
                      <span className="text-sm text-primary font-medium body-secondary">{step.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed description">{step.desc}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Planes y Precios Section */}
        <section id="planes" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in text-center mb-12">
              <h2 className="text-3xl md:text-4xl heading-section mb-4">
                Tres Planes. Un Solo Estándar de <span className="text-primary">Excelencia</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[{
              name: 'ESENCIAL',
              features: ['Modelo 3 Estados', 'Dashboard KPIs', 'Árbol de Rentabilidad', 'Análisis de Deuda', 'Flujo de Caja 13 Sem.', 'Comité Financiero 2h', 'Respuesta 2 días']
            }, {
              name: 'CRECIMIENTO',
              badge: 'Más Elegido',
              highlight: true,
              features: ['Todo Esencial +', 'Capital de Trabajo', 'Flujo semanal', 'Presupuesto + 4h/mes', 'Sesión pre-junta', 'Valoración básica', 'Respuesta 1 día']
            }, {
              name: 'ESTRATÉGICO',
              features: ['Todo Crecimiento +', 'Investment Readiness', 'Valoración DCF', 'Data Room', 'Deck de junta', 'Analítica avanzada', 'Respuesta mismo día']
            }].map((plan, index) => <Card key={index} className={`fade-in card-hover bg-card p-8 relative ${plan.highlight ? 'ring-2 ring-primary scale-105' : ''}`} style={{
              transitionDelay: `${index * 100}ms`
            }}>
                  {plan.badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold body-secondary">
                      {plan.badge}
                    </div>}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl heading-tertiary">{plan.name}</h3>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => <li key={i} className="flex items-start gap-2 text-sm body-text">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>)}
                  </ul>

                  <Button onClick={() => setModalOpen(true)} className={`w-full transition-all duration-200 active:scale-[0.98] body-text ${plan.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                    Solicitar Diagnóstico
                  </Button>
                </Card>)}
            </div>
          </div>
        </section>

        <div className="gradient-separator"></div>

        {/* Final CTA Section */}
        <section id="contacto" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl heading-section mb-6">
                ¿Listo para dejar de adivinar y empezar a <span className="text-primary">dirigir</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed body-text">
                Solicita tu Diagnóstico Flash sin costo. En 48 horas sabrás exactamente dónde están las oportunidades.
              </p>
              <Button onClick={() => setModalOpen(true)} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-lg px-12 body-text">
                Contáctanos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-6 body-secondary">
                www.asimetrica.co
              </p>
            </div>
          </div>
        </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/[0.08] py-8 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground body-secondary">
              <p>© 2026 Asimétrica · Finanzas Estratégicas · Colombia</p>
            </div>
          </div>
        </footer>

        <ContactFormModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </>;
};
export default HomePage;