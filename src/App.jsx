import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Droplet,
  Droplets,
  Building2,
  Sparkles,
  Umbrella,
  PaintBucket,
  Wrench,
  Zap,
  ShieldCheck,
  Hammer,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Star,
  ChevronDown,
  Menu,
  X,
  Check,
  ArrowUpRight,
  Send,
  Quote,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATOS DE EJEMPLO — reemplazar por la información real del cliente  */
/* ------------------------------------------------------------------ */

const BRAND = {
  name: "NIVEL",
  suffix: "Mantenimiento Integral",
  phone: "56 4677 0490",
  phoneHref: "+525646770490",
  whatsapp: "525646770490",
  email: "alexandermedina2604@gmail.com",
  address: "Cuautitlán Izcalli, Estado de México",
};

const SERVICES = [
  {
    code: "SRV-01",
    title: "Lavado de tinacos",
    icon: Droplet,
    desc: "Desinfección y limpieza profunda del tinaco para eliminar sedimento, sarro y bacterias del agua de uso diario.",
  },
  {
    code: "SRV-02",
    title: "Lavado de cisternas",
    icon: Droplets,
    desc: "Vaciado, cepillado, desinfección y sellado de cisternas conforme a la norma sanitaria vigente.",
  },
  {
    code: "SRV-03",
    title: "Mantenimiento de edificios",
    icon: Building2,
    desc: "Revisión y cuidado integral de áreas comunes, fachadas, azoteas e instalaciones de condominios y oficinas.",
  },
  {
    code: "SRV-04",
    title: "Limpieza de oficinas",
    icon: Sparkles,
    desc: "Limpieza profunda y de mantenimiento para espacios de trabajo, con horarios que no interrumpen la operación.",
  },
  {
    code: "SRV-05",
    title: "Impermeabilización",
    icon: Umbrella,
    desc: "Aplicación de sistemas impermeabilizantes en azoteas y muros para evitar filtraciones y humedad.",
  },
  {
    code: "SRV-06",
    title: "Pintura",
    icon: PaintBucket,
    desc: "Pintura de interiores, exteriores y fachadas con acabados de larga duración.",
  },
  {
    code: "SRV-07",
    title: "Plomería",
    icon: Wrench,
    desc: "Detección y reparación de fugas, cambio de instalaciones hidráulicas y sanitarias.",
  },
  {
    code: "SRV-08",
    title: "Electricidad",
    icon: Zap,
    desc: "Instalación y reparación de circuitos, contactos, iluminación y tableros eléctricos.",
  },
  {
    code: "SRV-09",
    title: "Mantenimiento preventivo",
    icon: ShieldCheck,
    desc: "Revisiones programadas que anticipan fallas y alargan la vida útil de instalaciones y equipos.",
  },
  {
    code: "SRV-10",
    title: "Mantenimiento correctivo",
    icon: Hammer,
    desc: "Reparación puntual de fallas y desperfectos con tiempos de respuesta cortos.",
  },
];

const GALLERY_TABS = ["Antes y después", "Personal trabajando", "Equipos", "Proyectos realizados"];

const GALLERY_ITEMS = {
  "Antes y después": [
    { label: "Cisterna — antes / después" },
    { label: "Fachada — antes / después" },
    { label: "Azotea — antes / después" },
  ],
  "Personal trabajando": [
    { label: "Equipo en lavado de tinaco" },
    { label: "Técnico en instalación eléctrica" },
    { label: "Cuadrilla de pintura" },
  ],
  Equipos: [
    { label: "Bomba de succión" },
    { label: "Equipo de impermeabilización" },
    { label: "Herramienta especializada" },
  ],
  "Proyectos realizados": [
    { label: "Edificio Reforma 120" },
    { label: "Plaza Los Encinos" },
    { label: "Corporativo Vía Norte" },
  ],
};



const COBERTURA = [
  "Cuautitlán Izcalli",
  "Tultitlán",
  "Tlalnepantla de Baz",
  "Naucalpan",
  "Atizapán de Zaragoza",
  "Coacalco",
  "Ecatepec",
  "CDMX (varias alcaldías)",
];

const HORARIOS = [
  { dia: "Lunes a viernes", horario: "8:00 – 18:00" },
  { dia: "Sábado", horario: "9:00 – 14:00" },
  { dia: "Domingo", horario: "Cerrado" },
];

const NAV_LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "galeria", label: "Galería" },
 
  { id: "cobertura", label: "Cobertura" },
  { id: "contacto", label: "Contacto" },
];

/* ------------------------------------------------------------------ */
/*  UTILIDADES                                                         */
/* ------------------------------------------------------------------ */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Eyebrow({ code, children }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" aria-hidden="true" />
      <span className="eyebrow-code">{code}</span>
      <span className="eyebrow-text">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState(GALLERY_TABS[0]);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    servicio: SERVICES[0].title,
    direccion: "",
    comentarios: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const waMessage = encodeURIComponent(
    `Hola, soy ${form.nombre || "(nombre)"}. Quiero cotizar: ${form.servicio}.` +
      (form.direccion ? ` Dirección: ${form.direccion}.` : "") +
      (form.comentarios ? ` Comentarios: ${form.comentarios}.` : "")
  );

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="site">
      <GlobalStyles />

      {/* ---------------- NAV ---------------- */}
      <header className="nav">
        <div className="nav-inner">
          <button className="brand" onClick={() => scrollTo("inicio")} aria-label="Ir al inicio">
            <span className="brand-mark">N</span>
            <span className="brand-text">
              {BRAND.name}
              <span className="brand-suffix">{BRAND.suffix}</span>
            </span>
          </button>

          <nav className="nav-links" aria-label="Navegación principal">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="nav-link">
                {l.label}
              </button>
            ))}
          </nav>

          <button className="nav-cta" onClick={() => scrollTo("cotizacion")}>
            Cotizar
          </button>

          <button
            className="nav-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="nav-mobile">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="nav-mobile-link">
                {l.label}
              </button>
            ))}
            <button className="nav-cta nav-cta--block" onClick={() => scrollTo("cotizacion")}>
              Cotizar
            </button>
          </div>
        )}
      </header>

      {/* ---------------- HERO / INICIO ---------------- */}
      <section id="inicio" className="hero">
        <AuroraBackdrop />
        <div className="hero-inner">
          <div className="hero-copy">
            <Eyebrow code="EST. MX">Mantenimiento integral para edificios y negocios</Eyebrow>
            <h1 className="hero-title">
              <SplitText text="Del tinaco a la instalación eléctrica," />
              <span className="hero-title-accent">
                <SplitText text="un solo equipo lo mantiene todo en orden." startDelay={420} />
              </span>
            </h1>
            <p className="hero-lead hero-lead--fade">
              Atendemos limpieza, impermeabilización, pintura, plomería, electricidad y
              mantenimiento preventivo o correctivo en condominios, oficinas y comercios de la
              zona metropolitana.
            </p>
            <div className="hero-actions hero-actions--fade">
              <MagneticButton className="btn btn--primary" onClick={() => scrollTo("cotizacion")}>
                Solicitar cotización
                <ArrowUpRight size={18} />
              </MagneticButton>
              <a
                className="btn btn--ghost"
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </a>
            </div>
            <div className="hero-stats hero-stats--fade">
              <div className="hero-stat">
                <span className="hero-stat-num">
                  <Counter to={10} />
                </span>
                <span className="hero-stat-label">servicios integrados</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">
                  <Counter to={8} />
                </span>
                <span className="hero-stat-label">municipios atendidos</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">24/7</span>
                <span className="hero-stat-label">emergencias de plomería y electricidad</span>
              </div>
            </div>
          </div>

          <div className="hero-diagram" aria-hidden="true">
            <BuildingDiagram />
          </div>
        </div>
      </section>

      {/* ---------------- NOSOTROS ---------------- */}
      <section id="nosotros" className="section section--tight">
        <Reveal>
          <Eyebrow code="01">Nosotros</Eyebrow>
          <h2 className="section-title">Un equipo, todos los oficios de mantenimiento.</h2>
        </Reveal>

        <div className="nosotros-grid">
          <Reveal className="nosotros-lead" delay={80}>
            <p>
              Nació de una idea sencilla: los administradores de edificios y negocios no deberían
              tener que llamar a un plomero, un electricista, un pintor y una empresa de limpieza
              distinta cada vez. Reunimos esos oficios en un solo equipo con procesos,
              herramienta y reportes estandarizados.
            </p>
          </Reveal>

          <div className="nosotros-cards">
            <Reveal className="nosotros-card" delay={120}>
              <span className="nosotros-card-code">MIS</span>
              <h3>Misión</h3>
              <p>
                Resolver el mantenimiento integral de edificios y negocios con un solo punto de
                contacto, tiempos de respuesta claros y trabajo verificable.
              </p>
            </Reveal>
            <Reveal className="nosotros-card" delay={200}>
              <span className="nosotros-card-code">VIS</span>
              <h3>Visión</h3>
              <p>
                Ser la referencia de mantenimiento integral en la zona metropolitana, reconocida
                por la consistencia del servicio más que por el precio.
              </p>
            </Reveal>
            <Reveal className="nosotros-card" delay={280}>
              <span className="nosotros-card-code">EXP</span>
              <h3>Experiencia</h3>
              <p>
                Cuadrillas especializadas por oficio, equipo propio y protocolos de limpieza y
                seguridad documentados para cada visita.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICIOS ---------------- */}
      <section id="servicios" className="section section--alt">
        <Reveal>
          <Eyebrow code="02">Servicios</Eyebrow>
          <h2 className="section-title">Diez frentes de trabajo, una sola ficha de servicio.</h2>
        </Reveal>

        <div className="services-grid">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as={SpotlightCard} className="service-card" delay={(i % 5) * 60} key={s.code}>
                <div className="service-card-top">
                  <span className="service-code">{s.code}</span>
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------- GALERÍA ---------------- */}
      <section id="galeria" className="section">
        <Reveal>
          <Eyebrow code="03">Galería</Eyebrow>
          <h2 className="section-title">Trabajo verificable, no solo prometido.</h2>
        </Reveal>

        <Reveal className="gallery-tabs" delay={80}>
          {GALLERY_TABS.map((tab) => (
            <button
              key={tab}
              className={`gallery-tab ${galleryTab === tab ? "gallery-tab--active" : ""}`}
              onClick={() => setGalleryTab(tab)}
            >
              {tab}
            </button>
          ))}
        </Reveal>

        <div className="gallery-grid">
          {GALLERY_ITEMS[galleryTab].map((item, i) => (
            <Reveal className="gallery-item" delay={i * 90} key={item.label}>
              <div className="gallery-placeholder">
                <span className="gallery-placeholder-tag">FOTO</span>
                <span className="gallery-placeholder-label">{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="gallery-note">
          * Espacios de ejemplo — aquí se colocarán fotografías reales del antes y después,
          personal, equipos y proyectos.
        </p>
      </section>

      

      {/* ---------------- COTIZACIÓN ---------------- */}
      <section id="cotizacion" className="section section--alt">
        <div className="cotizacion-grid">
          <Reveal className="cotizacion-side">
            <Eyebrow code="04">Cotización</Eyebrow>
            <h2 className="section-title">Cuéntanos qué necesitas.</h2>
            <p className="cotizacion-lead">
              Completa el formulario y te contactamos con una cotización. Si prefieres, envía la
              misma información directo por WhatsApp.
            </p>
            <ul className="cotizacion-steps">
              <li>
                <span className="cotizacion-step-num">1</span>
                Recibimos tu solicitud y confirmamos los datos del servicio.
              </li>
              <li>
                <span className="cotizacion-step-num">2</span>
                Agendamos una visita o diagnóstico, según el servicio.
              </li>
              <li>
                <span className="cotizacion-step-num">3</span>
                Te enviamos cotización por escrito antes de iniciar cualquier trabajo.
              </li>
            </ul>
          </Reveal>

          <Reveal className="form-card" delay={100}>
            {sent ? (
              <div className="form-success">
                <Check size={28} />
                <h3>Solicitud registrada</h3>
                <p>
                  Gracias, {form.nombre || "vecino(a)"}. En este ejemplo el formulario no envía
                  datos a ningún servidor; en la versión final se conectará a correo o WhatsApp.
                </p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label className="form-field">
                    <span>Nombre</span>
                    <input
                      required
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label className="form-field">
                    <span>Teléfono</span>
                    <input
                      required
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="55 0000 0000"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="form-field">
                    <span>Correo</span>
                    <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                    />
                  </label>
                  <label className="form-field">
                    <span>Servicio requerido</span>
                    <select name="servicio" value={form.servicio} onChange={handleChange}>
                      {SERVICES.map((s) => (
                        <option key={s.code} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="form-field">
                  <span>Dirección</span>
                  <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, colonia, municipio"
                  />
                </label>

                <label className="form-field">
                  <span>Comentarios</span>
                  <textarea
                    name="comentarios"
                    value={form.comentarios}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Cuéntanos brevemente qué necesitas"
                  />
                </label>

                <div className="form-actions">
               
                  <a
                    className="btn btn--ghost"
                    href={`https://wa.me/${BRAND.whatsapp}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    Enviar por WhatsApp
                  </a>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <hr />

      {/* ---------------- TESTIMONIOS ---------------- */}
     

      {/* ---------------- COBERTURA ---------------- */}
      <section id="cobertura" className="section section--alt">
        <Reveal>
          <Eyebrow code="06">Cobertura</Eyebrow>
          <h2 className="section-title">Dónde damos servicio.</h2>
          <p className="cobertura-lead">
            Atendemos la zona metropolitana del Valle de México. Si tu municipio no aparece,
            pregúntanos por WhatsApp.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Marquee items={COBERTURA} />
        </Reveal>
      </section>

      {/* ---------------- CONTACTO ---------------- */}
      <section id="contacto" className="section">
        <Reveal>
          <Eyebrow code="07">Contacto</Eyebrow>
          <h2 className="section-title">Hablemos de tu edificio o negocio.</h2>
        </Reveal>

        <div className="contacto-grid">
          <Reveal className="contacto-info" delay={80}>
            <a className="contacto-row" href={`tel:${BRAND.phoneHref}`}>
              <Phone size={18} />
              <div>
                <span className="contacto-label">Teléfono</span>
                <span className="contacto-value">{BRAND.phone}</span>
              </div>
            </a>
            <a
              className="contacto-row"
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              <div>
                <span className="contacto-label">WhatsApp</span>
                <span className="contacto-value">{BRAND.phone}</span>
              </div>
            </a>
            <a className="contacto-row" href={`mailto:${BRAND.email}`}>
              <Mail size={18} />
              <div>
                <span className="contacto-label">Correo</span>
                <span className="contacto-value">{BRAND.email}</span>
              </div>
            </a>
            <div className="contacto-row contacto-row--static">
              <Clock size={18} />
              <div>
                <span className="contacto-label">Horarios</span>
                <table className="horarios-table">
                  <tbody>
                    {HORARIOS.map((h) => (
                      <tr key={h.dia}>
                        <td>{h.dia}</td>
                        <td>{h.horario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <span className="contacto-emergencia">Emergencias de plomería y electricidad 24/7</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="contacto-map" delay={140}>
            <div className="map-placeholder">
              <MapPin size={26} />
              <span>Mapa de ubicación</span>
              <span className="map-placeholder-sub">{BRAND.address}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-mark brand-mark--footer">N</span>
            <span>
              {BRAND.name}
              <span className="brand-suffix">{BRAND.suffix}</span>
            </span>
          </div>
          <nav className="footer-links">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>
          <p className="footer-legal">
            Sitio de ejemplo con fines de presentación. Logotipo, redes sociales, número de
            WhatsApp, correo y fotografías se sustituirán por los definitivos del cliente.
          </p>
        </div>
      </footer>

      {/* ---------------- WHATSAPP FLOTANTE ---------------- */}
      <a
        className="whatsapp-float"
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={26} strokeWidth={2} />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DIAGRAMA — elemento distintivo: corte de edificio anotado          */
/* ------------------------------------------------------------------ */

function BuildingDiagram() {
  return (
    <svg viewBox="0 0 520 560" className="diagram-svg" role="img" aria-label="Corte esquemático de un edificio con los servicios señalados">
      {/* tanque / tinaco */}
      <rect x="205" y="30" width="70" height="46" rx="6" className="d-fill-accent" />
      <line x1="240" y1="76" x2="240" y2="96" className="d-line" />

      {/* estructura del edificio */}
      <rect x="140" y="96" width="200" height="330" className="d-fill-panel d-stroke" rx="4" />
      {[1, 2, 3, 4].map((i) => (
        <line key={i} x1="140" y1={96 + i * 66} x2="340" y2={96 + i * 66} className="d-line-faint" />
      ))}
      {/* ventanas */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={168 + col * 90}
            y={118 + row * 66}
            width="46"
            height="34"
            className="d-window"
          />
        ))
      )}

      {/* tubería lateral */}
      <path d="M340 130 v 260" className="d-pipe" />
      <circle cx="340" cy="130" r="4" className="d-dot" />
      <circle cx="340" cy="390" r="4" className="d-dot" />

      {/* cableado */}
      <path d="M140 160 h -24 v 160 h 24" className="d-wire" />
      <circle cx="116" cy="160" r="4" className="d-dot-accent" />

      {/* cisterna subterránea */}
      <rect x="170" y="440" width="140" height="60" rx="6" className="d-fill-deep" />
      <line x1="170" y1="426" x2="310" y2="426" className="d-line-faint" />

      {/* piso */}
      <line x1="60" y1="426" x2="460" y2="426" className="d-ground" />

      {/* -------- líneas guía y etiquetas -------- */}
      <Leader x1="240" y1="53" x2="404" y2="40" label="SRV-01" text="Tinaco" />
      <Leader x1="340" y1="200" x2="452" y2="180" label="SRV-07" text="Plomería" />
      <Leader x1="116" y1="200" x2="20" y2="230" label="SRV-08" text="Electricidad" flip />
      <Leader x1="190" y1="118" x2="452" y2="270" label="SRV-06" text="Pintura" />
      <Leader x1="240" y1="470" x2="20" y2="470" label="SRV-02" text="Cisterna" flip />
      <Leader x1="340" y1="360" x2="452" y2="370" label="SRV-05" text="Impermeabilización" />
    </svg>
  );
}

function Leader({ x1, y1, x2, y2, label, text, flip }) {
  const midX = flip ? x2 + 60 : x2 - 60;
  return (
    <g className="leader">
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="d-leader-line" />
      <circle cx={x1} cy={y1} r="4" className="d-dot-accent" />
      <text x={x2} y={y2 - 8} textAnchor={flip ? "start" : "end"} className="d-leader-code">
        {label}
      </text>
      <text x={x2} y={y2 + 10} textAnchor={flip ? "start" : "end"} className="d-leader-text">
        {text}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPONENTES ANIMADOS                                                */
/* ------------------------------------------------------------------ */

/* Texto que entra palabra por palabra, en cascada */
function SplitText({ text, startDelay = 0 }) {
  const [ref, visible] = useReveal();
  const words = text.split(" ");
  return (
    <span ref={ref} className="split-text">
      {words.map((w, i) => (
        <span className="split-text-mask" key={`${w}-${i}`}>
          <span
            className={`split-text-word ${visible ? "split-text-word--visible" : ""}`}
            style={{ transitionDelay: `${startDelay + i * 55}ms` }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

/* Botón que sigue ligeramente al cursor (efecto magnético) */
function MagneticButton({ className = "", children, onClick, ...rest }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return (
    <button
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

/* Contador que sube de 0 al valor final cuando entra en pantalla */
function Counter({ to, duration = 900 }) {
  const [ref, visible] = useReveal();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, duration]);

  return <span ref={ref}>{value}</span>;
}

/* Fondo del hero: dos manchas de gradiente en movimiento lento */
function AuroraBackdrop() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora-blob aurora-blob--a" />
      <span className="aurora-blob aurora-blob--b" />
      <span className="aurora-grid" />
    </div>
  );
}

/* Marquesina infinita para la lista de municipios */
function Marquee({ items }) {
  const track = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {track.map((item, i) => (
          <span className="marquee-chip" key={`${item}-${i}`}>
            <MapPin size={14} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Tarjeta con brillo que sigue al cursor + ligera inclinación 3D */
const SpotlightCard = React.forwardRef(function SpotlightCard(
  { className = "", style, children, ...rest },
  forwardedRef
) {
  const localRef = useRef(null);

  const setRefs = useCallback(
    (node) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  const handleMove = (e) => {
    const el = localRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${((y / rect.height - 0.5) * -6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x / rect.width - 0.5) * 6).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const el = localRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={setRefs}
      className={`spotlight-card ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span className="spotlight-glow" aria-hidden="true" />
      <div className="spotlight-inner">{children}</div>
    </article>
  );
});

/* ------------------------------------------------------------------ */
/*  ESTILOS                                                             */
/* ------------------------------------------------------------------ */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

      .site {
        --ink: #16232B;
        --ink-soft: #4B5B60;
        --paper: #F4F7F6;
        --panel: #FFFFFF;
        --teal: #0B4F6C;
        --teal-deep: #073B52;
        --orange: #EE8C36;
        --amber: #F4A100;
        --line: #D9E2E0;
        --line-faint: #E7EEEC;
        --radius: 10px;
        --shadow: 0 12px 30px -18px rgba(11, 79, 108, 0.35);
        font-family: 'Work Sans', system-ui, sans-serif;
        color: var(--ink);
        background: var(--paper);
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      .site * { box-sizing: border-box; }
      .site h1, .site h2, .site h3 {
        font-family: 'Barlow Condensed', system-ui, sans-serif;
        letter-spacing: 0.01em;
        margin: 0;
        color: var(--teal-deep);
      }
      .site button { font-family: inherit; cursor: pointer; }
      .site a { color: inherit; text-decoration: none; }
      .site :focus-visible {
        outline: 2px solid var(--orange);
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .site * { animation: none !important; transition: none !important; }
        .site .reveal,
        .site .hero-lead--fade,
        .site .hero-actions--fade,
        .site .hero-stats--fade,
        .site .split-text-word {
          opacity: 1 !important;
          transform: none !important;
        }
      }

      /* -------- eyebrow -------- */
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--teal);
        margin-bottom: 12px;
      }
      .eyebrow-dot {
        width: 7px; height: 7px; border-radius: 999px;
        background: var(--orange);
      }
      .eyebrow-code { color: var(--orange); font-weight: 600; }
      .eyebrow-text { color: var(--ink-soft); }

      .section-title {
        font-size: clamp(28px, 3.6vw, 40px);
        font-weight: 600;
        max-width: 720px;
        margin-bottom: 8px;
      }

      /* -------- reveal animation -------- */
      .reveal {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .reveal--visible { opacity: 1; transform: translateY(0); }

      /* -------- nav -------- */
      .nav {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(244, 247, 246, 0.92);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--line);
      }
      .nav-inner {
        max-width: 1180px;
        margin: 0 auto;
        padding: 14px 24px;
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        border: none;
        padding: 0;
      }
      .brand-mark {
        width: 34px; height: 34px;
        display: grid; place-items: center;
        background: var(--teal);
        color: #fff;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 18px;
        border-radius: 6px;
      }
      .brand-mark--footer { background: var(--amber); color: var(--teal-deep); }
      .brand-text {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 20px;
        letter-spacing: 0.03em;
        color: var(--teal-deep);
        display: flex;
        flex-direction: column;
        line-height: 1.1;
        text-align: left;
      }
      .brand-suffix {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--ink-soft);
        font-weight: 500;
      }
      .nav-links {
        display: flex;
        gap: 4px;
        margin-left: auto;
      }
      .nav-link {
        background: none; border: none;
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--ink-soft);
        border-radius: 999px;
        transition: color 0.2s, background 0.2s;
      }
      .nav-link:hover { color: var(--teal-deep); background: var(--line-faint); }
      .nav-cta {
        border: none;
        background: var(--orange);
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        padding: 10px 18px;
        border-radius: 999px;
        transition: transform 0.15s, background 0.2s;
      }
      .nav-cta:hover { background: var(--teal); transform: translateY(-1px); }
      .nav-cta--block { width: 100%; margin-top: 8px; }
      .nav-burger {
        display: none;
        background: none; border: none;
        color: var(--teal-deep);
        margin-left: auto;
      }
      .nav-mobile {
        display: none;
      }

      @media (max-width: 900px) {
        .nav-links, .nav-cta { display: none; }
        .nav-burger { display: block; }
        .nav-mobile {
          display: flex;
          flex-direction: column;
          padding: 8px 24px 20px;
          gap: 4px;
          border-top: 1px solid var(--line);
        }
        .nav-mobile-link {
          text-align: left;
          background: none; border: none;
          padding: 12px 4px;
          font-size: 15px;
          font-weight: 500;
          color: var(--ink);
          border-bottom: 1px solid var(--line-faint);
        }
      }

      /* -------- buttons -------- */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 15px;
        padding: 13px 22px;
        border-radius: 999px;
        border: 1px solid transparent;
        transition: transform 0.15s, background 0.2s, border-color 0.2s;
      }
      .btn--primary {
        background: var(--teal);
        color: #fff;
      }
      .btn--primary:hover { background: var(--teal-deep); transform: translateY(-1px); }
      .btn--ghost {
        background: transparent;
        border-color: var(--line);
        color: var(--teal-deep);
      }
      .btn--ghost:hover { border-color: var(--teal); background: var(--panel); }

      /* -------- hero -------- */
      .hero {
        position: relative;
        max-width: 1180px;
        margin: 0 auto;
        padding: 56px 24px 40px;
        overflow: hidden;
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 48px;
        align-items: center;
      }

      /* -------- aurora backdrop -------- */
      .aurora {
        position: absolute;
        inset: -10% -6% auto -6%;
        height: 480px;
        z-index: 0;
        pointer-events: none;
      }
      .aurora-blob {
        position: absolute;
        border-radius: 999px;
        filter: blur(60px);
        opacity: 0.35;
        animation: aurora-drift 16s ease-in-out infinite alternate;
      }
      .aurora-blob--a {
        top: -60px; left: 0;
        width: 380px; height: 380px;
        background: radial-gradient(circle, var(--teal), transparent 70%);
      }
      .aurora-blob--b {
        top: 40px; right: 0;
        width: 340px; height: 340px;
        background: radial-gradient(circle, var(--amber), transparent 70%);
        animation-duration: 20s;
        animation-direction: alternate-reverse;
      }
      .aurora-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(var(--line-faint) 1px, transparent 1px),
          linear-gradient(90deg, var(--line-faint) 1px, transparent 1px);
        background-size: 42px 42px;
        -webkit-mask-image: radial-gradient(60% 60% at 30% 20%, #000 0%, transparent 75%);
        mask-image: radial-gradient(60% 60% at 30% 20%, #000 0%, transparent 75%);
        opacity: 0.5;
      }
      @keyframes aurora-drift {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(30px, 24px) scale(1.12); }
      }

      /* -------- split text -------- */
      .split-text-mask { display: inline-block; overflow: hidden; vertical-align: top; }
      .split-text-word {
        display: inline-block;
        transform: translateY(110%);
        opacity: 0;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
      }
      .split-text-word--visible { transform: translateY(0); opacity: 1; }

      /* -------- fades that follow the split-text reveal -------- */
      .hero-lead--fade, .hero-actions--fade, .hero-stats--fade {
        opacity: 0;
        animation: hero-fade-in 0.7s ease forwards;
      }
      .hero-lead--fade { animation-delay: 0.55s; }
      .hero-actions--fade { animation-delay: 0.75s; }
      .hero-stats--fade { animation-delay: 0.95s; }
      @keyframes hero-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* -------- magnetic button -------- */
      .magnetic { transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s; }
      .hero-title {
        font-size: clamp(34px, 5vw, 54px);
        font-weight: 600;
        line-height: 1.05;
        margin-bottom: 20px;
      }
      .hero-title-accent { color: var(--orange); }
      .hero-lead {
        font-size: 17px;
        color: var(--ink-soft);
        max-width: 480px;
        margin-bottom: 28px;
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 40px;
      }
      .hero-stats {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
        border-top: 1px solid var(--line);
        padding-top: 20px;
      }
      .hero-stat { display: flex; flex-direction: column; }
      .hero-stat-num {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 30px;
        font-weight: 700;
        color: var(--teal);
      }
      .hero-stat-label {
        font-size: 12px;
        color: var(--ink-soft);
        max-width: 130px;
      }
      .hero-diagram { display: flex; justify-content: center; }
      .diagram-svg { width: 100%; max-width: 480px; height: auto; }

      .d-fill-accent { fill: var(--amber); }
      .d-fill-panel { fill: var(--panel); }
      .d-fill-deep { fill: var(--teal); opacity: 0.9; }
      .d-stroke { stroke: var(--teal); stroke-width: 2; }
      .d-line { stroke: var(--ink-soft); stroke-width: 1.5; }
      .d-line-faint { stroke: var(--line); stroke-width: 1; }
      .d-window { fill: #E4EEEC; stroke: var(--line); stroke-width: 1; }
      .d-pipe { stroke: var(--teal); stroke-width: 3; fill: none; }
      .d-wire { stroke: var(--orange); stroke-width: 2; fill: none; stroke-dasharray: 4 4; }
      .d-ground { stroke: var(--ink); stroke-width: 2; }
      .d-dot { fill: var(--teal); }
      .d-dot-accent { fill: var(--orange); }
      .d-leader-line { stroke: var(--line); stroke-width: 1; stroke-dasharray: 3 3; }
      .d-leader-code {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        font-weight: 600;
        fill: var(--orange);
      }
      .d-leader-text {
        font-family: 'Work Sans', sans-serif;
        font-size: 12px;
        fill: var(--ink);
      }

      @media (max-width: 900px) {
        .hero-inner { grid-template-columns: 1fr; }
        .hero-diagram { order: -1; }
      }

      /* -------- sections -------- */
      .section {
        max-width: 1180px;
        margin: 0 auto;
        padding: 72px 24px;
      }
      .section--tight { padding-top: 40px; }
      .section--alt { background: var(--panel); max-width: none; }
      .section--alt > * { max-width: 1180px; margin-left: auto; margin-right: auto; }

      /* -------- nosotros -------- */
      .nosotros-grid {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: 40px;
        margin-top: 24px;
      }
      .nosotros-lead p {
        font-size: 17px;
        color: var(--ink-soft);
      }
      .nosotros-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .nosotros-card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 20px;
      }
      .nosotros-card-code {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: var(--orange);
        font-weight: 600;
      }
      .nosotros-card h3 { font-size: 21px; margin: 6px 0 8px; }
      .nosotros-card p { font-size: 14px; color: var(--ink-soft); margin: 0; }

      @media (max-width: 900px) {
        .nosotros-grid { grid-template-columns: 1fr; }
        .nosotros-cards { grid-template-columns: 1fr; }
      }

      /* -------- servicios -------- */
      .services-grid {
        margin-top: 28px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
      }
      .service-card, .spotlight-card {
        position: relative;
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 18px;
        overflow: hidden;
        transform-style: preserve-3d;
        transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s ease-out;
      }
      .spotlight-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(11, 79, 108, 0.16), transparent 70%);
        opacity: 0;
        transition: opacity 0.35s ease;
        pointer-events: none;
      }
      .spotlight-inner { position: relative; z-index: 1; }
      .service-card:hover {
        border-color: var(--teal);
        box-shadow: var(--shadow);
        transform: perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-3px);
      }
      .service-card:hover .spotlight-glow { opacity: 1; }
      .service-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--teal);
        margin-bottom: 14px;
      }
      .service-code {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: var(--ink-soft);
      }
      .service-card h3 { font-size: 19px; margin-bottom: 6px; }
      .service-card p { font-size: 13.5px; color: var(--ink-soft); margin: 0; }

      /* -------- galeria -------- */
      .gallery-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 24px 0 28px;
      }
      .gallery-tab {
        border: 1px solid var(--line);
        background: var(--panel);
        padding: 9px 16px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 500;
        color: var(--ink-soft);
        transition: all 0.2s;
      }
      .gallery-tab--active {
        background: var(--teal);
        border-color: var(--teal);
        color: #fff;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 16px;
      }
      .gallery-placeholder {
        aspect-ratio: 4 / 3;
        border-radius: var(--radius);
        background: linear-gradient(135deg, var(--line-faint) 50%, #DCEAE6 50%);
        border: 1px dashed var(--line);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: var(--ink-soft);
      }
      .gallery-placeholder-tag {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.08em;
        color: var(--teal);
        background: #fff;
        padding: 3px 8px;
        border-radius: 999px;
      }
      .gallery-placeholder-label { font-size: 13px; text-align: center; padding: 0 12px; }
      .gallery-note { margin-top: 16px; font-size: 13px; color: var(--ink-soft); }

      /* -------- cotizacion -------- */
      .cotizacion-grid {
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: 48px;
        align-items: start;
      }
      .cotizacion-lead { color: var(--ink-soft); margin: 12px 0 24px; max-width: 420px; }
      .cotizacion-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; max-width: 420px; }
      .cotizacion-steps li {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        font-size: 14px;
        color: var(--ink-soft);
      }
      .cotizacion-step-num {
        flex: none;
        width: 24px; height: 24px;
        border-radius: 999px;
        background: var(--teal);
        color: #fff;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
        display: grid;
        place-items: center;
      }
      .form-card {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 28px;
      }
      .form { display: flex; flex-direction: column; gap: 16px; }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .form-field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--teal-deep); }
      .form-field input, .form-field select, .form-field textarea {
        font-family: inherit;
        font-size: 14px;
        font-weight: 400;
        color: var(--ink);
        padding: 11px 12px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        resize: vertical;
      }
      .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
        border-color: var(--teal);
      }
      .form-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
      .form-success {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        color: var(--teal-deep);
      }
      .form-success svg { color: var(--teal); }
      .form-success p { color: var(--ink-soft); font-size: 14px; }

      @media (max-width: 900px) {
        .cotizacion-grid { grid-template-columns: 1fr; }
        .form-row { grid-template-columns: 1fr; }
      }

      /* -------- testimonios -------- */
      .testimonios-row {
        margin-top: 28px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .testimonio-card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .testimonio-quote { color: var(--amber); }
      .testimonio-card blockquote { margin: 0; font-size: 14.5px; color: var(--ink); }
      .testimonio-stars { display: flex; gap: 2px; color: var(--amber); }
      .testimonio-card figcaption { display: flex; flex-direction: column; margin-top: 4px; }
      .testimonio-name { font-weight: 600; font-size: 13.5px; color: var(--teal-deep); }
      .testimonio-role { font-size: 12px; color: var(--ink-soft); }

      @media (max-width: 900px) {
        .testimonios-row { grid-template-columns: 1fr; }
      }

      /* -------- cobertura -------- */
      .cobertura-lead { color: var(--ink-soft); max-width: 480px; }

      /* -------- marquee -------- */
      .marquee {
        margin-top: 28px;
        overflow: hidden;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
      }
      .marquee-track {
        display: flex;
        gap: 12px;
        width: max-content;
        animation: marquee-scroll 26s linear infinite;
      }
      .marquee:hover .marquee-track { animation-play-state: paused; }
      .marquee-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--paper);
        border: 1px solid var(--line);
        padding: 10px 16px;
        border-radius: 999px;
        font-size: 13px;
        white-space: nowrap;
        color: var(--teal-deep);
      }
      .marquee-chip svg { color: var(--orange); flex: none; }
      @keyframes marquee-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      /* -------- contacto -------- */
      .contacto-grid {
        margin-top: 24px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      .contacto-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .contacto-row {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 16px 4px;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
        transition: color 0.2s;
      }
      .contacto-row:not(.contacto-row--static):hover { color: var(--teal); }
      .contacto-row svg { flex: none; margin-top: 2px; color: var(--teal); }
      .contacto-label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--ink-soft);
        font-family: 'IBM Plex Mono', monospace;
      }
      .contacto-value { display: block; font-size: 15px; font-weight: 600; }
      .horarios-table { border-collapse: collapse; margin-top: 4px; }
      .horarios-table td { padding: 2px 0; font-size: 14px; }
      .horarios-table td:first-child { color: var(--ink-soft); padding-right: 16px; }
      .contacto-emergencia {
        display: inline-block;
        margin-top: 8px;
        font-size: 12px;
        color: var(--orange);
        font-weight: 600;
      }
      .map-placeholder {
        height: 100%;
        min-height: 260px;
        border-radius: var(--radius);
        border: 1px dashed var(--line);
        background: repeating-linear-gradient(45deg, var(--line-faint), var(--line-faint) 10px, var(--paper) 10px, var(--paper) 20px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: var(--teal);
      }
      .map-placeholder-sub { font-size: 12px; color: var(--ink-soft); }

      @media (max-width: 900px) {
        .contacto-grid { grid-template-columns: 1fr; }
      }

      /* -------- footer -------- */
      .footer {
        background: var(--teal-deep);
        color: #E7EEEC;
        margin-top: 40px;
      }
      .footer-inner {
        max-width: 1180px;
        margin: 0 auto;
        padding: 40px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .footer-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 20px;
      }
      .footer-brand .brand-suffix { color: #9FB6BC; display: block; font-size: 10px; }
      .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .footer-links button {
        background: none; border: none;
        color: #C7D8DA;
        font-size: 13px;
        padding: 6px 10px;
      }
      .footer-links button:hover { color: #fff; }
      .footer-legal { font-size: 12px; color: #7E979C; max-width: 640px; }

      /* -------- whatsapp flotante -------- */
      .whatsapp-float {
        position: fixed;
        bottom: 22px;
        right: 22px;
        width: 58px; height: 58px;
        border-radius: 999px;
        background: #25D366;
        color: #fff;
        display: grid;
        place-items: center;
        box-shadow: 0 10px 24px -8px rgba(0,0,0,0.4);
        z-index: 60;
        transition: transform 0.2s;
      }
      .whatsapp-float:hover { transform: scale(1.08); }
    `}</style>
  );
}