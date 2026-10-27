import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Truck, Wrench, Package, BarChart3, FileText, Navigation, 
  Shield, Clock, Users, Play, MessageCircle, Mail, Phone, 
  CheckCircle, ArrowRight, X, Cpu, Fuel, Activity, Sparkles, Building2, ExternalLink, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Swal.fire({
        icon: 'success',
        title: 'Mensaje Enviado',
        text: 'Gracias por contactarnos. Un especialista de GAVAL se comunicará contigo a la brevedad.',
        confirmButtonColor: '#0891b2'
      });
      setContactForm({ name: '', email: '', company: '', phone: '', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo GAVAL / PULSER */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">GAVAL</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                  PULSER TMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Gestión Inteligente de Flotas</p>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#producto" className="hover:text-cyan-400 transition-colors">PULSER</a>
            <a href="#servicios" className="hover:text-cyan-400 transition-colors">Servicios GAVAL</a>
            <a href="#caracteristicas" className="hover:text-cyan-400 transition-colors">Soluciones</a>
            <a href="#sectores" className="hover:text-cyan-400 transition-colors">Sectores</a>
            <a href="#contacto" className="hover:text-cyan-400 transition-colors">Contacto</a>
          </nav>

          {/* Botón CTA Acceso */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')} 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all hover:scale-105 shadow-sm"
              title="Probar maqueta interactiva"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Maqueta Demo</span>
            </button>

            {session ? (
              <ButtonCTA 
                onClick={() => navigate('/dashboard')}
                text="Ir a Mi Plataforma"
                icon={<ArrowRight className="w-4 h-4 ml-1" />}
              />
            ) : (
              <ButtonCTA 
                onClick={() => navigate('/login')}
                text="Iniciar Sesión"
                icon={<ArrowRight className="w-4 h-4 ml-1" />}
              />
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="producto" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        {/* Fondo con Degradado y Textura */}
        <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0f17]/80 to-[#0b0f17] z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-8 animate-fade-in shadow-inner">
            <Sparkles className="w-3.5 h-3.5" /> Nueva Generación de Telemetría y Mantenimiento de Flotas
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Optimice las Operaciones de su Flota con <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">GAVAL</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal mb-10">
            GAVAL presenta <strong className="text-white font-bold">PULSER TMS</strong>, el software integral diseñado para maximizar la disponibilidad de vehículos, reducir drásticamente costos operacionales y controlar el ciclo de vida del transporte en un solo ecosistema en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-base flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-white/10"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              Ver Video Demostrativo
            </button>

            <button
              onClick={() => {
                if (session) navigate('/dashboard');
                else navigate('/login');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl shadow-cyan-600/30"
            >
              Acceder a la Plataforma
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Métricas destacadas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800/80 w-full max-w-4xl text-left">
            <div>
              <p className="text-3xl lg:text-4xl font-extrabold text-cyan-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Cumplimiento Pautas</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-extrabold text-blue-400 font-mono">-24%</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Costo por Kilómetro</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-extrabold text-emerald-400 font-mono">24/7</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Telemetría GPS en Vivo</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-extrabold text-purple-400 font-mono">TCO</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Rentabilidad por Unidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS GAVAL */}
      <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              Excelencia Operacional
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Nuestros Servicios Integrales
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Soluciones estratégicas, tecnológicas y consultivas para potenciar la rentabilidad de su flota en Chile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard 
              icon={<Cpu className="w-6 h-6 text-cyan-400" />}
              title="Gestión de Flotas con Software PULSER"
              desc="Plataforma centralizada para el control total del mantenimiento preventivo, inventario, costos de repuestos, telemetría y KPIs de su flota. Digitalice sus operaciones y tome decisiones respaldadas por datos vivos."
            />
            <ServiceCard 
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              title="Consultoría de TCO y Rentabilidad"
              desc="Analizamos su operación para identificar puntos de fuga de recursos, optimizar el Costo Total de Propiedad (TCO) y definir estrategias que aumenten la rentabilidad por camión y por contrato de servicio."
            />
            <ServiceCard 
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
              title="Implementación y Soporte Dedicado"
              desc="Acompañamos a su equipo directivo y de taller en la puesta en marcha de PULSER, asegurando una transición técnica sin contratiempos. Soporte continuo para resolver dudas y maximizar el rendimiento."
            />
            <ServiceCard 
              icon={<Users className="w-6 h-6 text-purple-400" />}
              title="Capacitación de Personal y Taller"
              desc="Programas de formación para administradores, supervisores y mecánicos, enfocados en las mejores prácticas de mantenimiento, registro digital de órdenes de trabajo y trazabilidad de repuestos."
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS / SOLUCIONES */}
      <section id="caracteristicas" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              Poder Tecnológico
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Características Clave de PULSER TMS
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Cada módulo ha sido construido pensando en la exigencia real del transporte y la minería.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Wrench className="w-6 h-6 text-cyan-400" />}
              title="Pizarra de Mantenimiento"
              desc="Programación predictiva y semáforo automático a 10 días para no perder jamás una pauta de servicio por kilometraje."
            />
            <FeatureCard 
              icon={<Package className="w-6 h-6 text-blue-400" />}
              title="Gestión de Suministros y Kardex"
              desc="Control milimétrico de inventarios, bodegas, precios y trazabilidad hacia atrás de cada repuesto consumido en cada OT."
            />
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-emerald-400" />}
              title="Órdenes de Trabajo (OTs)"
              desc="Asignación técnica de mecánicos, repuestos, tareas y cálculo automático de costos por insumos y mano de obra."
            />
            <FeatureCard 
              icon={<Navigation className="w-6 h-6 text-rose-400" />}
              title="Seguimiento GPS Telemétrico"
              desc="Sincronización horaria automática con proveedores telemétricos (GPS Global, FleetSat) sin digitar odómetros a mano."
            />
            <FeatureCard 
              icon={<Fuel className="w-6 h-6 text-amber-400" />}
              title="Control de Combustible y Rendimiento"
              desc="Auditoría de cargas, detección de desvíos críticos en km/litro y control de abastecimiento por unidad."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-purple-400" />}
              title="Análisis de Fallas y KPIs"
              desc="Reportes ejecutivos de disponibilidad de flota, MTBF, MTTR y tableros financieros listos para exportar a Excel."
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN SECTORES / PARA QUIÉN ES */}
      <section id="sectores" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ¿Para Quién es PULSER?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Adaptable a flotas de transporte terrestre, carga pesada, faenas mineras y servicios interurbanos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SectorCard title="Empresas de Camiones y Carga" desc="Tractocamiones, ramplas y tolvas con monitoreo de desgastes y contratos de flete." />
            <SectorCard title="Empresas de Buses y Pasajeros" desc="Flotas de transporte interurbano y de personal con control documental y pautas periódicas." />
            <SectorCard title="Maquinaria Pesada y Minería" desc="Control por horas de servicio (horómetro), turnos de operadores y soporte de mantenciones en faena." />
            <SectorCard title="Proveedores de Logística y Distribución" desc="Optimice tiempos de ciclo, despacho de última milla y disponibilidad de flota en ruta." />
            <SectorCard title="Servicios de Entrega y Utilitarios" desc="Furgones, camionetas y vehículos livianos de supervisión con mantenciones al día." />
            <SectorCard title="Talleres y Servicios Técnicos" desc="Organice la atención de flotas de terceros con órdenes de trabajo y cobro transparente de tareas." />
          </div>
        </div>
      </section>

      {/* FORMULARIO DE CONTACTO */}
      <section id="contacto" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            Hablemos
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            Contáctenos para una Demostración
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Descubra cómo PULSER puede transformar la rentabilidad y control de su flota.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Ej: Carlos Morales" 
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="carlos@empresa.cl" 
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Empresa / Flota</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.company}
                  onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                  placeholder="Ej: Transportes del Norte" 
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono / Celular</label>
                <input 
                  type="tel" 
                  value={contactForm.phone}
                  onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+56 9 1234 5678" 
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mensaje o Consulta</label>
              <textarea 
                rows={4}
                required
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Cuéntenos sobre el tamaño de su flota y qué desafíos busca solucionar..." 
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando Mensaje...' : 'Enviar Consulta y Solicitar Demo'}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#070a10] py-12 px-6 lg:px-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white">
              P
            </div>
            <div>
              <span className="text-white font-bold">GAVAL Consultora & PULSER TMS</span>
              <p className="text-xs text-slate-500">Ingeniería y Gestión de Flotas de Transporte - Chile</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#producto" className="hover:text-white transition-colors">PULSER</a>
            <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
            <a href="#caracteristicas" className="hover:text-white transition-colors">Soluciones</a>
            <Link to="/login" className="hover:text-cyan-400 transition-colors font-bold text-white">Acceso Clientes</Link>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} GAVAL. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a 
        href="https://wa.me/56982938737?text=Hola,%20quisiera%20más%20información%20sobre%20PULSER%20TMS."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        title="Contáctanos vía WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>

      {/* MODAL DE VIDEO YOUTUBE */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Demostración en Video - PULSER TMS</h3>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe 
                src="https://www.youtube.com/embed/Gi4Y6kj3944?autoplay=1" 
                title="Demostración PULSER TMS" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ButtonCTA({ onClick, text, icon }: { onClick: () => void; text: string; icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm flex items-center transition-all hover:scale-105 shadow-md shadow-cyan-600/30 cursor-pointer"
    >
      <span>{text}</span>
      {icon}
    </button>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 p-8 rounded-2xl hover:border-slate-700 transition-all hover:-translate-y-1 shadow-lg">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-lg group">
      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function SectorCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-xl hover:border-slate-700 transition-all">
      <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
        <CheckCircle className="w-4 h-4" />
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
