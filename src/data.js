// src/data.js

const PROJECTS = [
  {
    id: "simulador-asteroides",
    title: "Simulador de Impacto de Asteroides",
    description: "Simulacion interactiva visual de impactos de asteroides reales y sus efectos ecologicos y fisicos sobre la Tierra. Desarrollado para el NASA Space Apps Challenge.",
    tags: ["JavaScript", "HTML5 Canvas", "Fisica", "NASA Data"],
    status: "live",
    date: "Octubre 2025",
    github: "https://github.com/Arturo-Mosqueda/Mi-portafolio/tree/main/proyectos/simulador-asteroides",
    live: "./proyectos/simulador-asteroides/index.html",
    imageUrl: "./proyectos/simulador-asteroides/screenshot.png",
    fallbackUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "mapa-contaminacion-qro",
    title: "Mapa de Calidad del Aire — Queretaro",
    description: "Mapa interactivo para la visualizacion historica y espacial de la contaminacion del aire en la zona metropolitana de Queretaro, facilitando el analisis temporal de emisiones.",
    tags: ["Leaflet.js", "JavaScript", "HTML/CSS", "APIs"],
    status: "live",
    date: "Diciembre 2025",
    github: "https://github.com/ExoBUckT/Mapeo-de-la-calidad-del-aire-en-Html",
    live: "./proyectos/mapa-contaminacion-qro/index.html",
    imageUrl: "./proyectos/mapa-contaminacion-qro/screenshot.png",
    fallbackUrl: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "garra-servomotor-web",
    title: "Controlador Web para Garra Servomotor",
    description: "Interfaz web y logica de control para la manipulacion y calibracion en tiempo real de una garra robotica articulada accionada por servomotores.",
    tags: ["Electronica", "Microcontroladores", "IoT", "JavaScript"],
    status: "live",
    date: "Enero 2026",
    github: "https://github.com/Arturo-Mosqueda/Mi-portafolio/tree/main/proyectos/garra-servomotor",
    live: "./proyectos/garra-servomotor/index.html",
    imageUrl: "./proyectos/garra-servomotor/screenshot.png",
    fallbackUrl: "https://images.unsplash.com/photo-1617791160505-6f006e121980?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "plan-alimentacion",
    title: "Plan de Alimentacion Personal",
    description: "Aplicacion web personal para la planificacion y seguimiento de nutricion, macronutrientes y habitos alimenticios saludables.",
    tags: ["HTML", "CSS", "JavaScript", "Nutricion"],
    status: "live",
    date: "Noviembre 2026",
    github: "",
    live: "./proyectos/plan-alimentacion.html",
    imageUrl: "./proyectos/screenshot-plan.png",
    fallbackUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "fixture-sujecion-cnc",
    title: "Fixture Metrologico de Bujes",
    description: "Proyecto integrador. Ingenieria Aeronautica en Manufactura (El Marques, Qro). Diseno y modelado CAD de un fixture metrologico para la sujecion y posicionamiento de bujes aeronauticos, orientado a mejorar la precision y repetibilidad de las inspecciones dimensionales (En proceso).",
    tags: ["SolidWorks", "Diseno CAD", "Metrologia", "Aeronautica"],
    status: "concept",
    date: "Mayo 2026",
    github: "",
    live: "",
    imageUrl: "./proyectos/screenshot-fixture.png",
    fallbackUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "mezclador-pintura-pic",
    title: "Sistema Automatizado de Mezcla de Pinturas",
    description: "Sistema automatizado con control de electrovalvulas, garra automatica y programacion de microcontrolador PIC4550. Proyecto de graduacion de Mecatronica.",
    tags: ["Mecatronica", "PIC4550", "Electronica", "C++"],
    status: "concept",
    date: "Julio 2024",
    github: "",
    live: "",
    imageUrl: "./proyectos/screenshot-mezclador.png",
    fallbackUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop"
  }
];

const CERTIFICATIONS = [
  {
    id: "cert-cswp-s1",
    title: "Certified SOLIDWORKS Professional (CSWP) — Segmento 1",
    issuer: "Dassault Systemes",
    date: "Marzo 2026",
    category: "Diseno CAD / SolidWorks",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswp-s1.png"
  },
  {
    id: "cert-cswp-s2",
    title: "Certified SOLIDWORKS Professional (CSWP) — Segmento 2",
    issuer: "Dassault Systemes",
    date: "En proceso",
    category: "Diseno CAD / SolidWorks",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswp-s2.png"
  },
  {
    id: "cert-cswp-s3",
    title: "Certified SOLIDWORKS Professional (CSWP) — Segmento 3",
    issuer: "Dassault Systemes",
    date: "En proceso",
    category: "Diseno CAD / SolidWorks",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswp-s3.png"
  },
  {
    id: "cert-cswa",
    title: "Certified SOLIDWORKS Associate (CSWA)",
    issuer: "Dassault Systemes",
    date: "En proceso",
    category: "Diseno CAD / SolidWorks",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswa.png"
  },
  {
    id: "cert-cswp-sheetmetal",
    title: "CSWP — Sheet Metal",
    issuer: "Dassault Systemes",
    date: "En proceso",
    category: "Diseno CAD / Especialidad",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswp-sheetmetal.png"
  },
  {
    id: "cert-cswp-cam",
    title: "CSWP — CAM",
    issuer: "Dassault Systemes",
    date: "En proceso",
    category: "Manufactura / CNC",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswp-cam.png"
  },
  {
    id: "cert-cswp-am",
    title: "CSWP — Additive Manufacturing",
    issuer: "Dassault Systemes",
    date: "En proceso",
    category: "Manufactura Aditiva / 3D",
    credentialUrl: "https://virtualtester.com",
    imageUrl: "./proyectos/certificaciones/cswp-am.png"
  }
];

const BOOKS = [

  {
    id: "book-defensa-ilustracion",
    title: "En defensa de la ilustracion",
    author: "Steven Pinker",
    rating: 5,
    categories: ["Pensamiento Critico", "Ciencia"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788449334627-M.jpg",
    quote: "",
    summary: "<p>Pinker demuestra con datos convincentes que la salud, prosperidad, seguridad y felicidad global han mejorado drasticamente gracias a la razon, la ciencia y el humanismo.</p>"
  },


  {
    id: "book-pensar-sistemas",
    title: "Pensar en Sistemas",
    author: "Donella Meadows",
    rating: 0,
    categories: ["Sistemas", "Ingenieria"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/1603580557-M.jpg",
    quote: "",
    summary: "<p style=\"font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-3);margin-bottom:1rem;\">En proceso de lectura</p><p>Ver el mundo no como eventos aislados sino como sistemas con ciclos de retroalimentacion. Clave para ingenieros y disenadores de soluciones complejas.</p>"
  },
  {
    id: "book-desastre-climatico",
    title: "Como Evitar un Desastre Climatico",
    author: "Bill Gates",
    rating: 4,
    categories: ["Tecnologia", "Medio Ambiente"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/0385546130-M.jpg",
    quote: "",
    summary: "<p>Gates detalla las soluciones tecnologicas y politicas para llegar a cero emisiones. Analisis sector por sector: electricidad, manufactura, agricultura, transporte y construccion.</p>"
  },
  {
    id: "book-enfocate",
    title: "Enfocate (Deep Work)",
    author: "Cal Newport",
    rating: 5,
    categories: ["Productividad", "Trabajo Profundo"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/1455586692-M.jpg",
    quote: "",
    summary: "<p>La capacidad de concentrarse sin distracciones en tareas cognitivamente exigentes es la habilidad mas valiosa hoy, y esta desapareciendo justo cuando mas se necesita.</p>"
  },
  {
    id: "book-ego-enemigo",
    title: "El Ego es el Enemigo",
    author: "Ryan Holiday",
    rating: 5,
    categories: ["Filosofia", "Estoicismo"],
    coverUrl: "https://covers.openlibrary.org/b/isbn/1591847818-M.jpg",
    quote: "",
    summary: "<p>Inspirado en el estoicismo, Holiday examina como el ego descontrolado sabotea el exito. El antidoto: humildad, trabajo duro y mantenerse orientado al proposito.</p>"
  }
];

const BLOG = [
  {
    id: "futuro-retos-oportunidades",
    title: "El futuro del mundo: Retos, peligros y oportunidades",
    date: "09 Jun 2026",
    readTime: "5 min",
    category: "Ensayos",
    excerpt: "Un breve vistazo de las tecnologias actuales, como estan mejorando y como podrian desarrollarse ante los retos globales del siglo XXI.",
    content: "<p>Desde el comienzo de la revolucion cientifica el crecimiento en ciencia y tecnologia ha ido acelerando siglo a siglo, decada a decada y mas recientemente ano a ano. Con tecnologias que pasaron del descubrimiento, al uso cotidiano y finalmente a quedar obsoletas en el transcurso de una vida humana. Este ensayo busca dar un breve vistazo de las tecnologias actuales, como estan mejorando y como podrian desarrollarse. Intentar predecir el futuro es una tarea imposible, mas en esta epoca, pero analizando tendencias, indicadores y planes de empresas y gobiernos podemos hacer inferencias informadas de que nos depara el futuro.</p><p>En primer lugar, nos encontramos en la cuspide de una revolucion energetica impulsada por la energia solar y los avances en la fusion nuclear comercial. A medida que el costo por megavatio solar disminuye de manera exponencial, se abren las puertas a una descarbonizacion real de nuestras industrias y redes de transporte. Simultaneamente, la maduracion de la computacion cuantica promete desbloquear simulaciones moleculares sin precedentes, catalizando el descubrimiento de nuevos materiales conductores de alta temperatura y farmacos personalizados sintetizados en horas en lugar de anos.</p><p>Sin embargo, esta aceleracion tecnologica no esta exenta de peligros existenciales. El mayor reto del siglo XXI no reside en nuestra capacidad de invencion, sino en nuestra capacidad de coordinacion global. La proliferacion de la biotecnologia de escritorio, donde el diseno de patogenos sinteticos es accesible a actores individuales, y la falta de marcos regulatorios globales robustos representan una amenaza inminente. Tambien, la transicion rapida hacia una economia pos-escasez material corre el riesgo de exacerbar la desigualdad estructural si los beneficios del capital intelectual automatizado no se distribuyen equitativamente.</p><p>El futuro, por tanto, no es un destino predeterminado, sino un espacio moldeado por las decisiones eticas e institucionales que tomemos hoy. La oportunidad historica de nuestra generacion reside en crear estructuras de gobernanza tan agiles y avanzadas como las tecnologias que intentan regular.</p>"
  },
  {
    id: "ia-consecuencias-habilidades",
    title: "La IA y el futuro con AGI: Habilidades y consecuencias",
    date: "09 Jun 2026",
    readTime: "7 min",
    category: "Tecnologia y Sociedad",
    excerpt: "Analisis de los impactos de la Inteligencia Artificial General y sistemas expertos que se automejoran en educacion, trabajo, salud y gobernanza.",
    content: "<p>La velocidad del desarrollo en Inteligencia Artificial ha superado incluso las predicciones mas optimistas de los expertos. Hoy no nos preguntamos si es posible construir una Inteligencia Artificial General (AGI), sino cuando ocurrira y como debemos prepararnos para un mundo gobernado por sistemas capaces de automejorar su propio codigo a velocidades electronicas.</p><h3>Impactos a Corto, Mediano y Largo Plazo</h3><p>A <strong>corto plazo</strong>, estamos presenciando la automatizacion acelerada de tareas cognitivas repetitivas y de soporte. Los desarrolladores de software, redactores y disenadores estan adoptando copilotos cognitivos que aumentan la productividad en ordenes de magnitud. El impacto inmediato es una reestructuracion de la fuerza laboral donde el valor reside en la direccion y validacion del trabajo de las IA, mas que en la generacion de codigo base.</p><p>A <strong>mediano plazo</strong>, con la llegada de sistemas expertos integrados y agentes autonomos multisectoriales, sectores enteros como la <strong>salud</strong> y la <strong>educacion</strong> se transformaran. En la salud, diagnosticos ultraprecisos basados en analisis genomicos y modelos moleculares en tiempo real permitiran tratamientos ultra-personalizados. En educacion, pasaremos de aulas estandarizadas a tutores de IA dedicados que adaptaran el curriculo al ritmo, intereses y estilo cognitivo de cada estudiante.</p><p>A <strong>largo plazo</strong>, cuando la AGI alcance capacidades de automejora recursiva, entraremos en la era de la superinteligencia. Esto afectara profundamente la <strong>gobernanza</strong> y el <strong>trabajo</strong>. La nocion tradicional de empleo como medio de subsistencia quedara obsoleta, forzando a la sociedad a implementar esquemas como la Renta Basica Universal y a redefinir el proposito del ser humano en un mundo donde el esfuerzo intelectual puramente utilitario ya no sea escaso.</p><h3>Habilidades y Conocimientos Requeridos</h3><p>En este nuevo paradigma, el conocimiento enciclopedico y las habilidades tecnicas de ejecucion manual perderan valor rapidamente. Las competencias criticas seran:</p><ul><li><strong>Pensamiento Sistemico y Arquitectura de Soluciones:</strong> La capacidad de conectar diferentes areas cientificas y tecnologicas para resolver problemas complejos a alto nivel, delegando la ejecucion detallada a las IA.</li><li><strong>Juicio Etico y Filosofia Practica:</strong> A medida que delegamos decisiones criticas (en salud, justicia y economia) a sistemas de IA, los humanos necesitaremos asegurar la alineacion de valores.</li><li><strong>Adaptabilidad Cognitiva:</strong> La agilidad para desaprender y reaprender constantemente a medida que las herramientas tecnologicas evolucionan mes a mes.</li><li><strong>Inteligencia Emocional y Conexion Humana:</strong> El entretenimiento, el arte humano y las profesiones de cuidado interpersonal ganaran un valor premium por su autenticidad.</li></ul>"
  },
  {
    id: "filosofia-multipotencial",
    title: "El poder del perfil multipotencial en ingenieria",
    date: "02 Jun 2026",
    readTime: "3 min",
    category: "Crecimiento Profesional",
    excerpt: "Por que especializarse en una sola area cuando la robotica demanda electronica, mecanica, diseno CAD y software al mismo tiempo?",
    content: "<p>Tradicionalmente se nos dice que debemos elegir un solo camino. Sin embargo, en areas como la <strong>robotica</strong> y la <strong>Industria 4.0</strong>, los perfiles transversales tienen una ventaja unica.</p><p>Un ingeniero multipotencial puede entender los requerimientos de torque de un actuador, disenar el fixture para su fabricacion, seleccionar sensores e implementar la logica de control en codigo.</p><h3>Ventajas Clave</h3><ul><li><strong>Traduccion de ideas:</strong> Puente entre equipos de mecanicos y desarrolladores.</li><li><strong>Aprendizaje acelerado:</strong> El cerebro se vuelve flexible para aprender nuevas tecnologias.</li><li><strong>Innovacion en la interseccion:</strong> Las mejores soluciones surgen al cruzar disciplinas.</li></ul>"
  }
];

window.PROJECTS       = PROJECTS;
window.CERTIFICATIONS = CERTIFICATIONS;
window.BOOKS          = BOOKS;
window.BLOG           = BLOG;

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio v2 content layer
// All interface copy is stored here so the renderer stays language-agnostic.
// The legacy records below are retained only as a migration reference. The
// active CAD data contract near the end of this file uses curated real evidence.
// ─────────────────────────────────────────────────────────────────────────────
const COPY = {
  en: {
    metaTitle: "Jesús Arturo Mosqueda Lara — Portfolio",
    metaDescription: "Portfolio of Jesús Arturo Mosqueda Lara — aeronautical manufacturing engineering, mechanical design, CAD/CAM, automation and programming.",
    nav: { home: "Home", projects: "Projects", certifications: "Certifications", books: "Books", blog: "Blog" },
    social: { LinkedIn: "LinkedIn", GitHub: "GitHub", Correo: "Email", "Teléfono": "Phone" },
    home: {
      eyebrow: "Personal portfolio",
      lead: "Seventh-term Aeronautical Manufacturing Engineering student at UNAQ, with technical training in Mechatronics. Focused on mechanical design, CAD/CAM, manufacturing, automation and programming.",
      projectsButton: "Projects",
      certificationsButton: "Certifications",
      stats: { projects: "Projects", certification: "Certification", university: "University", location: "Location" },
      skillsTitle: "Technical Skills",
      educationTitle: "Education",
      strengthsTitle: "Professional Strengths",
      cvTitle: "Need a printable copy?",
      cvDescription: "Download my complete résumé as a PDF.",
      cvButton: "Download Resume",
      cvFile: "CV_Jesus_Arturo_Mosqueda_Lara_EN.pdf",
      education: [
        { degree: "Aeronautical Manufacturing Engineering", institution: "Universidad Aeronáutica en Querétaro (UNAQ)", period: "Sep 2024 — Present", detail: "Seventh term of 12 · El Marqués, Querétaro." },
        { degree: "Mechatronics Technician", institution: "CBTis 118", period: "Jul 2020 — Jul 2023", detail: "Corregidora, Querétaro · Automated paint mixing project." }
      ],
      strengths: [
        "Mechanical, electronic and software integration in multidisciplinary projects.",
        "Analytical problem solving and practical design iteration.",
        "Teamwork, documentation and clear technical communication.",
        "Discipline developed through physical training and marathon preparation."
      ]
    },
    projects: {
      eyebrow: "Selected work",
      title: "Projects",
      intro: "Mechanical, manufacturing, automation and software projects developed through academic work and independent practice.",
      featured: "Featured project",
      viewProject: "View project",
      viewGallery: "Open gallery",
      viewGithub: "GitHub",
      open: "Open",
      caseStudy: "Case study",
      cadOnly: "CAD / case study",
      galleryTitle: "Mechanical Design Gallery",
      gallerySubtitle: "SolidWorks · Fusion 360 · CAD/CAM",
      galleryDescription: "A curated gallery of real academic mechanical parts, drawings and lightweight presentation renders.",
      external: "Live site",
      noProjects: "No projects registered."
    },
    status: { live: "Live", dev: "In development", concept: "Concept", academic: "Academic" },
    cad: {
      eyebrow: "Mechanical design",
      title: "Mechanical Design Gallery",
      intro: "A modular gallery for SolidWorks and Fusion 360 parts. Images, drawings and optimized 3D models are optional per record.",
      placeholderNotice: "Development placeholders — these examples are not presented as Arturo’s real parts.",
      placeholder: "PLACEHOLDER",
      back: "Back to Projects",
      viewPiece: "View piece",
      piece: "Mechanical component",
      software: "Software",
      year: "Year",
      semester: "Term",
      category: "Category",
      techniques: "Techniques",
      description: "Description",
      additionalViews: "Additional views",
      drawing: "Engineering drawing",
      model3d: "3D model",
      modelUnavailable: "No optimized web model has been added yet.",
      noImage: "Preview pending",
      noPieces: "No pieces registered."
    },
    horizon: {
      eyebrow: "Featured academic project",
      title: "Horizon Fixture",
      subtitle: "Self-Centering Fixture for Aeronautical Bushings",
      back: "Back to Projects",
      disclaimer: "Educational functional prototype — not an industrial or certified metrology fixture.",
      overview: "Overview",
      specifications: "Recorded specifications",
      validation: "Functional validation",
      sourceNote: "Evidence is based on the project report, presentation and supplied prototype media. Unmeasured claims are identified as future work.",
      cadLabel: "CAD assembly",
      prototypeLabel: "Physical prototype",
      videoLabel: "Assembly video"
    },
    certs: { eyebrow: "Credentials", title: "Certifications", completed: "Completed", inProgress: "In progress", viewCredential: "View credential", empty: "No certifications registered." },
    books: { eyebrow: "Reading", title: "Library", reading: "In progress", empty: "No books registered." },
    blog: { eyebrow: "Writing", title: "Blog", inProgress: "In progress", intro: "Articles about engineering, technology, personal projects and books will be published here.", topics: "Planned topics: microcontroller automation, CAD/CAM, self-directed learning and systems thinking.", back: "Back to Blog", reading: "reading" },
    footer: "Portfolio of Jesús Arturo Mosqueda Lara",
    cnc: {
      aria: "Interactive CNC milling visualization",
      active: "ACTIVE",
      process: "GEAR_MACHINING",
      spindle: "SPINDLE",
      pass: "PASS",
      removed: "REMOVED",
      camX: "CAM_X",
      camY: "CAM_Y",
      xAxis: "X-AXIS",
      yAxis: "Y-AXIS",
      zAxis: "Z-AXIS",
      off: "OFF",
      position: "POSITION",
      plunge: "PLUNGE",
      roughing: "ROUGHING",
      return: "RETURN",
      complete: "COMPLETE"
    }
  },
  es: {
    metaTitle: "Jesús Arturo Mosqueda Lara — Portafolio",
    metaDescription: "Portafolio de Jesús Arturo Mosqueda Lara — ingeniería aeronáutica en manufactura, diseño mecánico, CAD/CAM, automatización y programación.",
    nav: { home: "Inicio", projects: "Proyectos", certifications: "Certificaciones", books: "Libros", blog: "Blog" },
    social: { LinkedIn: "LinkedIn", GitHub: "GitHub", Correo: "Correo", "Teléfono": "Teléfono" },
    home: {
      eyebrow: "Portafolio personal",
      lead: "Estudiante de séptimo cuatrimestre de Ingeniería Aeronáutica en Manufactura en la UNAQ, con formación técnica en Mecatrónica. Enfocado en diseño mecánico, CAD/CAM, manufactura, automatización y programación.",
      projectsButton: "Proyectos",
      certificationsButton: "Certificaciones",
      stats: { projects: "Proyectos", certification: "Certificación", university: "Universidad", location: "Ubicación" },
      skillsTitle: "Habilidades técnicas",
      educationTitle: "Educación",
      strengthsTitle: "Fortalezas profesionales",
      cvTitle: "¿Necesitas una copia imprimible?",
      cvDescription: "Descarga mi currículum completo en PDF.",
      cvButton: "Descargar CV",
      cvFile: "CV_Jesus_Arturo_Mosqueda_Lara_ES.pdf",
      education: [
        { degree: "Ingeniería Aeronáutica en Manufactura", institution: "Universidad Aeronáutica en Querétaro (UNAQ)", period: "Sep 2024 — Actualidad", detail: "Séptimo cuatrimestre de 12 · El Marqués, Querétaro." },
        { degree: "Técnico en Mecatrónica", institution: "CBTis 118", period: "Jul 2020 — Jul 2023", detail: "Corregidora, Querétaro · Proyecto de mezcla automatizada de pintura." }
      ],
      strengths: [
        "Integración mecánica, electrónica y de software en proyectos multidisciplinarios.",
        "Resolución analítica de problemas e iteración práctica de diseño.",
        "Trabajo en equipo, documentación y comunicación técnica clara.",
        "Disciplina desarrollada mediante entrenamiento físico y preparación para maratones."
      ]
    },
    projects: {
      eyebrow: "Trabajo seleccionado",
      title: "Proyectos",
      intro: "Proyectos de diseño mecánico, manufactura, automatización y software desarrollados en la universidad y mediante práctica independiente.",
      featured: "Proyecto principal",
      viewProject: "Ver proyecto",
      viewGallery: "Abrir galería",
      viewGithub: "GitHub",
      open: "Abrir",
      caseStudy: "Caso de estudio",
      cadOnly: "CAD / caso de estudio",
      galleryTitle: "Galería de Diseño Mecánico",
      gallerySubtitle: "SolidWorks · Fusion 360 · CAD/CAM",
      galleryDescription: "Una galería curada de piezas mecánicas académicas reales, planos y renders de presentación ligeros.",
      external: "Sitio activo",
      noProjects: "No hay proyectos registrados."
    },
    status: { live: "Activo", dev: "En desarrollo", concept: "Concepto", academic: "Académico" },
    cad: {
      eyebrow: "Diseño mecánico",
      title: "Galería de Diseño Mecánico",
      intro: "Galería modular para piezas de SolidWorks y Fusion 360. Las imágenes, planos y modelos 3D optimizados son opcionales en cada registro.",
      placeholderNotice: "Placeholders de desarrollo — estos ejemplos no se presentan como piezas reales de Arturo.",
      placeholder: "PLACEHOLDER",
      back: "Volver a Proyectos",
      viewPiece: "Ver pieza",
      piece: "Componente mecánico",
      software: "Software",
      year: "Año",
      semester: "Cuatrimestre",
      category: "Categoría",
      techniques: "Técnicas",
      description: "Descripción",
      additionalViews: "Vistas adicionales",
      drawing: "Plano de ingeniería",
      model3d: "Modelo 3D",
      modelUnavailable: "Todavía no se ha añadido un modelo web optimizado.",
      noImage: "Preview pendiente",
      noPieces: "No hay piezas registradas."
    },
    horizon: {
      eyebrow: "Proyecto académico principal",
      title: "Horizon Fixture",
      subtitle: "Fixture autocentrante para bujes aeronáuticos",
      back: "Volver a Proyectos",
      disclaimer: "Prototipo funcional educativo — no es un fixture industrial ni de metrología certificada.",
      overview: "Resumen",
      specifications: "Especificaciones registradas",
      validation: "Validación funcional",
      sourceNote: "La evidencia proviene del reporte, la presentación y los medios del prototipo suministrados. Los puntos no medidos se identifican como trabajo futuro.",
      cadLabel: "Ensamble CAD",
      prototypeLabel: "Prototipo físico",
      videoLabel: "Video del ensamble"
    },
    certs: { eyebrow: "Credenciales", title: "Certificaciones", completed: "Completada", inProgress: "En proceso", viewCredential: "Ver credencial", empty: "No hay certificaciones registradas." },
    books: { eyebrow: "Lecturas", title: "Biblioteca", reading: "En proceso", empty: "No hay libros registrados." },
    blog: { eyebrow: "Escritos", title: "Blog", inProgress: "En proceso", intro: "Aquí publicaré artículos sobre ingeniería, tecnología, proyectos personales y libros.", topics: "Temas planeados: automatización con microcontroladores, CAD/CAM, aprendizaje autodidacta y pensamiento en sistemas.", back: "Volver al Blog", reading: "de lectura" },
    footer: "Portafolio de Jesús Arturo Mosqueda Lara",
    cnc: {
      aria: "Visualización interactiva de fresado CNC",
      active: "ACTIVO",
      process: "MAQUINADO_DE_ENGRANE",
      spindle: "HUSILLO",
      pass: "PASE",
      removed: "REMOVIDO",
      camX: "CAM_X",
      camY: "CAM_Y",
      xAxis: "EJE_X",
      yAxis: "EJE_Y",
      zAxis: "EJE_Z",
      off: "APAGADO",
      position: "POSICIÓN",
      plunge: "BAJADA",
      roughing: "DESBASTE",
      return: "RETORNO",
      complete: "COMPLETADO"
    }
  }
};

const SKILLS_V2 = [
  { id: "solidworks", name: "SolidWorks", detail: { en: "CSWA / CSWP", es: "CSWA / CSWP" }, period: { en: "Sep 2023 — 2026", es: "Sep 2023 — 2026" } },
  { id: "fusion", name: "Fusion 360", detail: { en: "CAD Modeling / CAM / CNC Programming", es: "Modelado CAD / CAM / Programación CNC" }, period: { en: "Jan 2026 — 2026", es: "Ene 2026 — 2026" } },
  { id: "drawings", name: { en: "Engineering Drawings", es: "Planos de ingeniería" }, detail: { en: "Drawing Interpretation / GD&T", es: "Interpretación de planos / GD&T" }, period: { en: "Sep 2024 — 2026", es: "Sep 2024 — 2026" } },
  { id: "electronics", name: { en: "Electronics", es: "Electrónica" }, detail: { en: "Circuit Design / Sensors / Data Acquisition", es: "Diseño de circuitos / Sensores / Adquisición de datos" }, period: { en: "May 2020 — 2026", es: "May 2020 — 2026" } },
  { id: "programming", name: { en: "Programming", es: "Programación" }, detail: { en: "Python / HTML / CSS / JavaScript / Git/GitHub", es: "Python / HTML / CSS / JavaScript / Git/GitHub" }, period: { en: "Mar 2024 — 2026", es: "Mar 2024 — 2026" } },
  { id: "english", name: { en: "English", es: "Inglés" }, detail: { en: "B1+", es: "B1+" }, period: { en: "Developing", es: "En desarrollo" } }
];

const EDUCATION_V2 = [
  { degree: { en: "Aeronautical Manufacturing Engineering", es: "Ingeniería Aeronáutica en Manufactura" }, institution: { en: "Universidad Aeronáutica en Querétaro (UNAQ)", es: "Universidad Aeronáutica en Querétaro (UNAQ)" }, period: { en: "Sep 2024 — Present", es: "Sep 2024 — Actualidad" }, detail: { en: "Seventh term of 12 · El Marqués, Querétaro.", es: "Séptimo cuatrimestre de 12 · El Marqués, Querétaro." } },
  { degree: { en: "Mechatronics Technician", es: "Técnico en Mecatrónica" }, institution: { en: "CBTis 118", es: "CBTis 118" }, period: { en: "Jul 2020 — Jul 2023", es: "Jul 2020 — Jul 2023" }, detail: { en: "Corregidora, Querétaro · Automated paint mixing project.", es: "Corregidora, Querétaro · Proyecto de mezcla automatizada de pintura." } }
];

const PROJECTS_V2 = [
  {
    id: "horizon-fixture", type: "horizon", featured: true,
    title: { en: "Horizon Fixture", es: "Horizon Fixture" },
    subtitle: { en: "Self-Centering Fixture for Aeronautical Bushings", es: "Fixture autocentrante para bujes aeronáuticos" },
    description: { en: "Educational functional prototype combining SolidWorks parametric modeling, three radial supports, a pinion-and-gear mechanism, a rotating base, FDM manufacturing and physical validation.", es: "Prototipo funcional educativo que combina modelado paramétrico en SolidWorks, tres soportes radiales, un mecanismo de piñón y engrane, una base giratoria, manufactura FDM y validación física." },
    tags: { en: ["SolidWorks", "Mechanical Design", "FDM / PLA"], es: ["SolidWorks", "Diseño mecánico", "FDM / PLA"] },
    date: { en: "Jul 2026", es: "Jul 2026" }, status: "academic",
    imageUrl: "./assets/cad/horizon-fixture/horizon-assembly-cad.webp",
    secondaryImageUrl: "./assets/cad/horizon-fixture/prototype-overview.webp"
  },
  {
    id: "mechanical-design-gallery", type: "cad-gallery",
    title: { en: "Mechanical Design Gallery", es: "Galería de Diseño Mecánico" },
    description: { en: "A curated selection of real academic CAD, CAM and additive-manufacturing work, presented through lightweight visual evidence.", es: "Una selección curada de trabajos académicos reales de CAD, CAM y manufactura aditiva, presentada mediante evidencia visual ligera." },
    tags: { en: ["SolidWorks", "Fusion 360", "CAD/CAM"], es: ["SolidWorks", "Fusion 360", "CAD/CAM"] }, status: "academic",
    imageUrl: "./assets/cad/thumbnails/engine-assembly.webp",
    secondaryImageUrl: "./assets/cad/thumbnails/gap-experiment.webp"
  },
  {
    id: "simulador-asteroides", title: { en: "Asteroid Impact Simulator", es: "Simulador de Impacto de Asteroides" },
    description: { en: "Interactive visual simulation of asteroid impacts and their ecological and physical effects on Earth, developed for NASA Space Apps.", es: "Simulación visual interactiva de impactos de asteroides y sus efectos ecológicos y físicos sobre la Tierra, desarrollada para NASA Space Apps." },
    tags: { en: ["JavaScript", "HTML5 Canvas", "Physics", "NASA Data"], es: ["JavaScript", "HTML5 Canvas", "Física", "NASA Data"] }, status: "live",
    date: { en: "Sep 2024 — Sep 2025", es: "Sep 2024 — Sep 2025" },
    github: "https://github.com/Arturo-Mosqueda/Mi-portafolio/tree/main/proyectos/simulador-asteroides", live: "./proyectos/simulador-asteroides/index.html", imageUrl: "./proyectos/simulador-asteroides/screenshot.png", fallbackUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "mapa-contaminacion-qro", title: { en: "Air Quality Map — Querétaro", es: "Mapa de Calidad del Aire — Querétaro" },
    description: { en: "Interactive map for historical and spatial exploration of air pollution in the Querétaro metropolitan area.", es: "Mapa interactivo para explorar histórica y espacialmente la contaminación del aire en la zona metropolitana de Querétaro." },
    tags: { en: ["Leaflet.js", "JavaScript", "HTML/CSS", "APIs"], es: ["Leaflet.js", "JavaScript", "HTML/CSS", "APIs"] }, status: "live",
    date: { en: "Dec 2025", es: "Dic 2025" }, github: "https://github.com/ExoBUckT/Mapeo-de-la-calidad-del-aire-en-Html", live: "./proyectos/mapa-contaminacion-qro/index.html", imageUrl: "./proyectos/mapa-contaminacion-qro/screenshot.png", fallbackUrl: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "garra-servomotor-web", title: { en: "Web Controller for a Servo Gripper", es: "Controlador Web para Garra Servomotor" },
    description: { en: "Web interface and control logic for real-time manipulation and calibration of an articulated servo-driven gripper.", es: "Interfaz web y lógica de control para manipular y calibrar en tiempo real una garra articulada accionada por servomotores." },
    tags: { en: ["Electronics", "Microcontrollers", "IoT", "JavaScript"], es: ["Electrónica", "Microcontroladores", "IoT", "JavaScript"] }, status: "live",
    date: { en: "Jan 2026", es: "Ene 2026" }, github: "https://github.com/Arturo-Mosqueda/Mi-portafolio/tree/main/proyectos/garra-servomotor", live: "./proyectos/garra-servomotor/index.html", imageUrl: "./proyectos/garra-servomotor/screenshot.png", fallbackUrl: "https://images.unsplash.com/photo-1617791160505-6f006e121980?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "mezclador-pintura-pic", type: "academic", title: { en: "Automated Paint Mixing System", es: "Sistema Automatizado de Mezcla de Pinturas" },
    description: { en: "Mechatronics project integrating solenoid valves, sensors, an automatic gripper, PIC18F4550 microcontroller programming, electronic circuit design and electrical/control integration.", es: "Proyecto de mecatrónica que integra electroválvulas, sensores, una garra automática, programación del microcontrolador PIC18F4550, diseño de circuitos electrónicos e integración eléctrica y de control." },
    tags: { en: ["Mechatronics", "PIC18F4550", "Sensors", "Control"], es: ["Mecatrónica", "PIC18F4550", "Sensores", "Control"] }, status: "academic", date: { en: "Jul 2023", es: "Jul 2023" }
  },
  {
    id: "laboratorio-ingles", title: { en: "English Lab", es: "Laboratorio de Inglés" },
    description: { en: "Interactive B1+ to C1 English learning platform with skill labs, modules, activities and saved progress.", es: "Plataforma interactiva de aprendizaje de inglés de B1+ a C1 con laboratorios, módulos, actividades y progreso guardado." },
    tags: { en: ["JavaScript", "Education", "LocalStorage"], es: ["JavaScript", "Educación", "LocalStorage"] }, status: "live", date: { en: "Aug 2026", es: "Ago 2026" }, github: "https://github.com/Arturo-Mosqueda/laboratorio-ingles", live: "https://arturo-mosqueda.github.io/laboratorio-ingles/"
  },
  {
    id: "ciencia-materiales", title: { en: "Materials Science Learning Lab", es: "Laboratorio de Ciencia de los Materiales" },
    description: { en: "Step-by-step educational site for exploring materials science concepts with locally managed visual resources.", es: "Sitio educativo paso a paso para explorar conceptos de ciencia de los materiales con recursos visuales administrados localmente." },
    tags: { en: ["JavaScript", "Materials", "Education"], es: ["JavaScript", "Materiales", "Educación"] }, status: "live", date: { en: "Jul 2026", es: "Jul 2026" }, github: "https://github.com/Arturo-Mosqueda/ciencia-de-los-materiales", live: "https://arturo-mosqueda.github.io/ciencia-de-los-materiales/"
  },
  {
    id: "plan-alimentacion", title: { en: "Personal Nutrition Planner", es: "Plan de Alimentación Personal" },
    description: { en: "Personal web application for planning nutrition, macronutrients and healthy habits.", es: "Aplicación web personal para planear nutrición, macronutrientes y hábitos saludables." },
    tags: { en: ["HTML", "CSS", "JavaScript"], es: ["HTML", "CSS", "JavaScript"] }, status: "live", date: { en: "Personal", es: "Personal" }, live: "./proyectos/plan-alimentacion.html", imageUrl: "./proyectos/screenshot-plan.png", fallbackUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"
  }
];

const CERTIFICATIONS_V2 = [
  { id: "cert-cswp-s1", title: { en: "Certified SOLIDWORKS Professional (CSWP) — Segment 1", es: "Certified SOLIDWORKS Professional (CSWP) — Segmento 1" }, issuer: "Dassault Systèmes", date: { en: "Mar 2026", es: "Mar 2026" }, completed: true, category: { en: "CAD Design / SolidWorks", es: "Diseño CAD / SolidWorks" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswp-s1.png" },
  { id: "cert-cswp-s2", title: { en: "Certified SOLIDWORKS Professional (CSWP) — Segment 2", es: "Certified SOLIDWORKS Professional (CSWP) — Segmento 2" }, issuer: "Dassault Systèmes", date: { en: "In progress", es: "En proceso" }, completed: false, category: { en: "CAD Design / SolidWorks", es: "Diseño CAD / SolidWorks" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswp-s2.png" },
  { id: "cert-cswp-s3", title: { en: "Certified SOLIDWORKS Professional (CSWP) — Segment 3", es: "Certified SOLIDWORKS Professional (CSWP) — Segmento 3" }, issuer: "Dassault Systèmes", date: { en: "In progress", es: "En proceso" }, completed: false, category: { en: "CAD Design / SolidWorks", es: "Diseño CAD / SolidWorks" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswp-s3.png" },
  { id: "cert-cswa", title: { en: "Certified SOLIDWORKS Associate (CSWA)", es: "Certified SOLIDWORKS Associate (CSWA)" }, issuer: "Dassault Systèmes", date: { en: "In progress", es: "En proceso" }, completed: false, category: { en: "CAD Design / SolidWorks", es: "Diseño CAD / SolidWorks" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswa.png" },
  { id: "cert-cswp-sheetmetal", title: { en: "CSWP — Sheet Metal", es: "CSWP — Chapa metálica" }, issuer: "Dassault Systèmes", date: { en: "In progress", es: "En proceso" }, completed: false, category: { en: "Specialty", es: "Especialidad" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswp-sheetmetal.png" },
  { id: "cert-cswp-cam", title: { en: "CSWP — CAM", es: "CSWP — CAM" }, issuer: "Dassault Systèmes", date: { en: "In progress", es: "En proceso" }, completed: false, category: { en: "Manufacturing / CNC", es: "Manufactura / CNC" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswp-cam.png" },
  { id: "cert-cswp-am", title: { en: "CSWP — Additive Manufacturing", es: "CSWP — Manufactura aditiva" }, issuer: "Dassault Systèmes", date: { en: "In progress", es: "En proceso" }, completed: false, category: { en: "Additive Manufacturing / 3D", es: "Manufactura aditiva / 3D" }, credentialUrl: "https://virtualtester.com", imageUrl: "./proyectos/certificaciones/cswp-am.png" }
];

const BOOKS_V2 = [
  { id: "book-defensa-ilustracion", title: { en: "En defensa de la ilustración", es: "En defensa de la ilustración" }, author: "Steven Pinker", rating: 5, categories: { en: ["Critical Thinking", "Science"], es: ["Pensamiento crítico", "Ciencia"] }, coverUrl: "https://covers.openlibrary.org/b/isbn/9788449334627-M.jpg", summary: { en: "<p>Pinker uses data to examine how reason, science and humanism have improved global health, prosperity, safety and happiness.</p>", es: "<p>Pinker demuestra con datos cómo la razón, la ciencia y el humanismo han mejorado la salud, prosperidad, seguridad y felicidad global.</p>" } },
  { id: "book-pensar-sistemas", title: { en: "Thinking in Systems", es: "Pensar en Sistemas" }, author: "Donella Meadows", rating: 0, categories: { en: ["Systems", "Engineering"], es: ["Sistemas", "Ingeniería"] }, coverUrl: "https://covers.openlibrary.org/b/isbn/1603580557-M.jpg", summary: { en: "<p>Seeing the world as systems with feedback loops rather than isolated events. Currently in progress.</p>", es: "<p>Ver el mundo como sistemas con ciclos de retroalimentación y no como eventos aislados. En proceso de lectura.</p>" } },
  { id: "book-desastre-climatico", title: { en: "How to Avoid a Climate Disaster", es: "Cómo Evitar un Desastre Climático" }, author: "Bill Gates", rating: 4, categories: { en: ["Technology", "Environment"], es: ["Tecnología", "Medio ambiente"] }, coverUrl: "https://covers.openlibrary.org/b/isbn/0385546130-M.jpg", summary: { en: "<p>An overview of technological and policy solutions for reaching zero emissions across energy, manufacturing, agriculture, transport and construction.</p>", es: "<p>Un panorama de soluciones tecnológicas y políticas para llegar a cero emisiones en energía, manufactura, agricultura, transporte y construcción.</p>" } },
  { id: "book-enfocate", title: { en: "Deep Work", es: "Enfócate (Deep Work)" }, author: "Cal Newport", rating: 5, categories: { en: ["Productivity", "Focus"], es: ["Productividad", "Trabajo profundo"] }, coverUrl: "https://covers.openlibrary.org/b/isbn/1455586692-M.jpg", summary: { en: "<p>The ability to focus without distraction on demanding cognitive tasks is becoming increasingly valuable.</p>", es: "<p>La capacidad de concentrarse sin distracciones en tareas cognitivamente exigentes es cada vez más valiosa.</p>" } },
  { id: "book-ego-enemigo", title: { en: "Ego Is the Enemy", es: "El Ego es el Enemigo" }, author: "Ryan Holiday", rating: 5, categories: { en: ["Philosophy", "Stoicism"], es: ["Filosofía", "Estoicismo"] }, coverUrl: "https://covers.openlibrary.org/b/isbn/1591847818-M.jpg", summary: { en: "<p>A practical examination of how humility, hard work and purpose can counter an unchecked ego.</p>", es: "<p>Un análisis práctico de cómo la humildad, el trabajo constante y el propósito pueden contrarrestar un ego descontrolado.</p>" } }
];

const BLOG_V2 = [
  { id: "futuro-retos-oportunidades", title: { en: "The Future of the World: Challenges and Opportunities", es: "El futuro del mundo: retos y oportunidades" }, date: { en: "09 Jun 2026", es: "09 Jun 2026" }, readTime: "5 min", category: { en: "Essays", es: "Ensayos" }, excerpt: { en: "A short look at current technologies, their development and the global challenges ahead.", es: "Una mirada breve a las tecnologías actuales, su desarrollo y los retos globales que vienen." }, content: { en: "<p>This essay considers how accelerating science and technology creates both opportunities and risks, and why coordination matters as much as invention.</p>", es: "<p>Este ensayo considera cómo la aceleración de la ciencia y la tecnología crea oportunidades y riesgos, y por qué la coordinación importa tanto como la invención.</p>" } },
  { id: "ia-consecuencias-habilidades", title: { en: "AI and the Future with AGI", es: "La IA y el futuro con AGI" }, date: { en: "09 Jun 2026", es: "09 Jun 2026" }, readTime: "7 min", category: { en: "Technology and Society", es: "Tecnología y sociedad" }, excerpt: { en: "A reflection on changing skills, education and work as intelligent systems evolve.", es: "Una reflexión sobre las habilidades, la educación y el trabajo mientras evolucionan los sistemas inteligentes." }, content: { en: "<p>Artificial intelligence is changing how technical work is performed. The durable skills will include systems thinking, ethical judgment, adaptability and human connection.</p>", es: "<p>La inteligencia artificial está cambiando cómo se realiza el trabajo técnico. Las habilidades duraderas incluirán pensamiento sistémico, juicio ético, adaptabilidad y conexión humana.</p>" } },
  { id: "filosofia-multipotencial", title: { en: "The Power of a Multipotentialite Engineering Profile", es: "El poder del perfil multipotencial en ingeniería" }, date: { en: "02 Jun 2026", es: "02 Jun 2026" }, readTime: "3 min", category: { en: "Professional Growth", es: "Crecimiento profesional" }, excerpt: { en: "Why robotics and Industry 4.0 benefit from people who can connect mechanics, electronics, CAD and software.", es: "Por qué la robótica y la Industria 4.0 se benefician de conectar mecánica, electrónica, CAD y software." }, content: { en: "<p>Transversal engineering profiles create bridges between teams and make it easier to innovate at the intersection of disciplines.</p>", es: "<p>Los perfiles de ingeniería transversales crean puentes entre equipos y facilitan innovar en la intersección de las disciplinas.</p>" } }
];

/* const CAD_PROJECTS_LEGACY_PLACEHOLDERS = [
  { id: "mechanical-bracket", placeholder: true, name: { en: "Mechanical Bracket", es: "Soporte mecánico" }, software: "SolidWorks", year: "2025", semester: { en: "4th term", es: "4.º cuatrimestre" }, category: { en: "Mechanical Design", es: "Diseño mecánico" }, techniques: { en: ["Parametric Modeling", "Extrusions", "Patterns"], es: ["Modelado paramétrico", "Extrusiones", "Patrones"] }, preview: null, images: [], additionalImages: [], drawing: null, model3d: null, description: { en: "PLACEHOLDER — Example record for testing the gallery layout.", es: "PLACEHOLDER — Registro de ejemplo para probar el layout de la galería." } },
  { id: "flanged-component", placeholder: true, name: { en: "Flanged Component", es: "Componente bridado" }, software: "SolidWorks", year: "2025", semester: { en: "4th term", es: "4.º cuatrimestre" }, category: { en: "Mechanical Part", es: "Pieza mecánica" }, techniques: { en: ["Revolves", "Fillets", "Engineering Drawings"], es: ["Revoluciones", "Redondeos", "Planos de ingeniería"] }, preview: null, images: [], additionalImages: [], drawing: null, model3d: null, description: { en: "PLACEHOLDER — Optional drawing and model fields are ready for a future real asset.", es: "PLACEHOLDER — Los campos opcionales de plano y modelo están listos para un asset real futuro." } },
  { id: "machined-housing", placeholder: true, name: { en: "Machined Housing", es: "Carcasa mecanizada" }, software: "Fusion 360", year: "2026", semester: { en: "7th term", es: "7.º cuatrimestre" }, category: { en: "CAD/CAM", es: "CAD/CAM" }, techniques: { en: ["CAM Setup", "Toolpaths", "Machining Features"], es: ["Preparación CAM", "Trayectorias", "Geometrías de maquinado"] }, preview: null, images: [], additionalImages: [], drawing: null, model3d: null, description: { en: "PLACEHOLDER — Example of a CNC-oriented component record.", es: "PLACEHOLDER — Ejemplo de registro de componente orientado a CNC." } },
  { id: "gear-component", placeholder: true, name: { en: "Gear Component", es: "Componente de engrane" }, software: "SolidWorks", year: "2026", semester: { en: "7th term", es: "7.º cuatrimestre" }, category: { en: "Mechanical Design", es: "Diseño mecánico" }, techniques: { en: ["Circular Patterns", "Clearance", "Assembly Relations"], es: ["Patrones circulares", "Holguras", "Relaciones de ensamble"] }, preview: null, images: [], additionalImages: [], drawing: null, model3d: null, description: { en: "PLACEHOLDER — Example record for a gear and assembly study.", es: "PLACEHOLDER — Registro de ejemplo para un estudio de engranes y ensamble." } },
  { id: "rotational-part", placeholder: true, name: { en: "Rotational Part", es: "Pieza de revolución" }, software: "Fusion 360", year: "2026", semester: { en: "7th term", es: "7.º cuatrimestre" }, category: { en: "CNC-oriented Design", es: "Diseño orientado a CNC" }, techniques: { en: ["Turning Profile", "Tolerances", "CAM Preparation"], es: ["Perfil de torneado", "Tolerancias", "Preparación CAM"] }, preview: null, images: [], additionalImages: [], drawing: null, model3d: null, description: { en: "PLACEHOLDER — Example record for a rotational part.", es: "PLACEHOLDER — Registro de ejemplo para una pieza de revolución." } },
  { id: "practice-assembly", placeholder: true, name: { en: "Practice Assembly", es: "Ensamble de práctica" }, software: "SolidWorks", year: "2025", semester: { en: "4th term", es: "4.º cuatrimestre" }, category: { en: "Assembly Modeling", es: "Modelado de ensamble" }, techniques: { en: ["Mates", "Exploded Views", "Interference Review"], es: ["Relaciones de posición", "Vistas explosionadas", "Revisión de interferencias"] }, preview: null, images: [], additionalImages: [], drawing: null, model3d: null, description: { en: "PLACEHOLDER — Example of an assembly record with optional media.", es: "PLACEHOLDER — Ejemplo de registro de ensamble con medios opcionales." } }
]; */

// Curated from the extracted academic inventory. Only lightweight presentation
// evidence is referenced below; source CAD files remain outside the website.
const CAD_PROJECTS_V2 = [
  {
    id: "engine-mechanism-assembly", placeholder: false,
    name: { en: "Engine Mechanism Assembly", es: "Ensamble de mecanismo de motor" }, software: "SolidWorks", year: "2025–2026",
    semester: { en: "5th term", es: "5.º cuatrimestre" }, category: { en: "Mechanical Design / Assembly", es: "Diseño mecánico / Ensamble" },
    techniques: { en: ["Parametric parts", "Assembly mates", "Exploded views"], es: ["Piezas paramétricas", "Relaciones de posición", "Vistas explosionadas"] },
    preview: "./assets/cad/thumbnails/engine-assembly.webp", images: ["./assets/cad/renders/engine-parts.webp"], additionalImages: ["./assets/cad/renders/engine-parts.webp"], drawing: "./assets/cad/drawings/engine-assembly.webp", model3d: null,
    description: { en: "A SolidWorks assembly study with a base plate, mounting bracket, motor block, cylinder head, flywheel and crank mechanism. The supplied evidence includes the assembly and part drawing sheets.", es: "Estudio de ensamble en SolidWorks con placa base, soporte, bloque de motor, cabeza de cilindro, volante y mecanismo de cigüeñal. La evidencia suministrada incluye el ensamble y los planos de las piezas." }
  },
  {
    id: "valve-mechanism-assembly", placeholder: false,
    name: { en: "Valve Mechanism Assembly", es: "Ensamble de mecanismo de válvula" }, software: "SolidWorks", year: "2025–2026",
    semester: { en: "5th term", es: "5.º cuatrimestre" }, category: { en: "Mechanical Design / Assembly", es: "Diseño mecánico / Ensamble" },
    techniques: { en: ["Part modeling", "Assembly mates", "Engineering drawings"], es: ["Modelado de piezas", "Relaciones de posición", "Planos de ingeniería"] },
    preview: "./assets/cad/thumbnails/valve-assembly.webp", images: [], additionalImages: [], drawing: "./assets/cad/drawings/valve-assembly.webp", model3d: null,
    description: { en: "A multi-part valve mechanism assembled in SolidWorks. The drawing evidence identifies the body, hand wheel, spindle, valve, gland, studs and related hardware.", es: "Mecanismo de válvula de varias piezas ensamblado en SolidWorks. La evidencia de planos identifica el cuerpo, volante, husillo, válvula, prensaestopas, espárragos y herrajes relacionados." }
  },
  {
    id: "rotor-piston-assembly", placeholder: false,
    name: { en: "Rotor and Piston Assembly", es: "Ensamble de rotores y pistón" }, software: "SolidWorks", year: "2025–2026",
    semester: { en: "5th term", es: "5.º cuatrimestre" }, category: { en: "Assembly Modeling", es: "Modelado de ensamble" },
    techniques: { en: ["Assembly relations", "Exploded views", "Part drawings"], es: ["Relaciones de ensamble", "Vistas explosionadas", "Planos de piezas"] },
    preview: "./assets/cad/thumbnails/rotor-assembly.webp", images: ["./assets/cad/renders/rotor-assembly.webp"], additionalImages: ["./assets/cad/renders/rotor-assembly.webp"], drawing: "./assets/cad/drawings/rotor-assembly.webp", model3d: null,
    description: { en: "A documented SolidWorks practice assembly composed of a base, upper and lower rotors, piston, flywheel and fasteners, with normal and exploded drawing views.", es: "Ensamble de práctica documentado en SolidWorks compuesto por base, rotores superior e inferior, pistón, volante y sujetadores, con vistas normal y explosionada en los planos." }
  },
  {
    id: "gear-transmission-study", placeholder: false,
    name: { en: "Gear Transmission Study", es: "Estudio de transmisión por engranes" }, software: "SolidWorks", year: "2025–2026",
    semester: { en: "5th term", es: "5.º cuatrimestre" }, category: { en: "Mechanical Motion Study", es: "Estudio de movimiento mecánico" },
    techniques: { en: ["Gear relations", "Motion study", "Clearance review"], es: ["Relaciones de engranes", "Estudio de movimiento", "Revisión de holguras"] },
    preview: "./assets/cad/thumbnails/gear-transmission.webp", images: [], additionalImages: [], drawing: null, model3d: null,
    description: { en: "A SolidWorks motion-study frame documenting a pair of meshing gears and their relative movement. It is presented as an academic mechanism exercise.", es: "Fotograma de un estudio de movimiento en SolidWorks que documenta un par de engranes en contacto y su movimiento relativo. Se presenta como ejercicio académico de mecanismos." }
  },
  {
    id: "forming-mechanisms-study", placeholder: false,
    name: { en: "Forming Mechanisms Study", es: "Estudio de mecanismos de conformado" }, software: "SolidWorks", year: "2025–2026",
    semester: { en: "5th term", es: "5.º cuatrimestre" }, category: { en: "Manufacturing / Forming", es: "Manufactura / Conformado" },
    techniques: { en: ["Bending", "Cutting", "Deformation studies"], es: ["Doblado", "Corte", "Estudios de deformación"] },
    preview: "./assets/cad/thumbnails/forming-operations.webp", images: [], additionalImages: [], drawing: null, model3d: null,
    description: { en: "A set of SolidWorks animation exercises covering bending, cutting and deformation mechanisms. The preview is taken from the supplied academic simulation evidence.", es: "Conjunto de ejercicios de animación en SolidWorks sobre mecanismos de doblado, corte y deformación. El preview proviene de la evidencia de simulación académica suministrada." }
  },
  {
    id: "tower-control-component", placeholder: false,
    name: { en: "Control Tower Component", es: "Componente torre de control" }, software: "SolidWorks", year: "2026",
    semester: { en: "6th term", es: "6.º cuatrimestre" }, category: { en: "Conventional Machining", es: "Maquinado convencional" },
    techniques: { en: ["Part modeling", "Machining features", "Engineering drawing"], es: ["Modelado de pieza", "Geometrías de maquinado", "Plano de ingeniería"] },
    preview: "./assets/cad/thumbnails/tower-control.webp", images: [], additionalImages: [], drawing: "./assets/cad/drawings/tower-control.webp", model3d: null,
    description: { en: "A documented part named “Torre de control OK” with a matching engineering drawing. It is included as evidence of part modeling and conventional-machining documentation.", es: "Pieza documentada con el nombre “Torre de control OK” y su plano de ingeniería correspondiente. Se incluye como evidencia de modelado y documentación para maquinado convencional." }
  },
  {
    id: "gap-experiment-set", placeholder: false,
    name: { en: "Gap and Fit Experiment Set", es: "Conjunto experimental de holguras y ajustes" }, software: "Fusion 360 / FDM", year: "2026",
    semester: { en: "6th term", es: "6.º cuatrimestre" }, category: { en: "Additive Manufacturing / Experimental Design", es: "Manufactura aditiva / Diseño de experimentos" },
    techniques: { en: ["Parametric modeling", "Gap study", "FDM printing"], es: ["Modelado paramétrico", "Estudio de holguras", "Impresión FDM"] },
    preview: "./assets/cad/thumbnails/gap-experiment.webp", images: ["./assets/cad/renders/gap-experiment-views.webp"], additionalImages: ["./assets/cad/renders/gap-experiment-views.webp"], drawing: "./assets/cad/drawings/gap-experiment.webp", model3d: null,
    description: { en: "A documented set of 18 printed specimens used to study hole-and-shaft fit under different gap conditions. The supplied report includes CAD views, printed samples and technical drawing evidence.", es: "Conjunto documentado de 18 especímenes impresos para estudiar el ajuste entre agujero y eje con distintas holguras. El reporte suministrado incluye vistas CAD, muestras impresas y evidencia de plano técnico." }
  },
  {
    id: "bed-leveling-calibration-plate", placeholder: false,
    name: { en: "Bed-Leveling Calibration Plate", es: "Placa de calibración de nivelación" }, software: "Fusion 360 / FDM", year: "2026",
    semester: { en: "6th term", es: "6.º cuatrimestre" }, category: { en: "Additive Manufacturing", es: "Manufactura aditiva" },
    techniques: { en: ["Aerospace-inspired layout", "CAD modeling", "First-layer validation"], es: ["Diseño inspirado en aeronáutica", "Modelado CAD", "Validación de primera capa"] },
    preview: "./assets/cad/thumbnails/bed-leveling.webp", images: ["./assets/cad/renders/bed-leveling-prototype.webp"], additionalImages: ["./assets/cad/renders/bed-leveling-prototype.webp"], drawing: null, model3d: null,
    description: { en: "An aerospace-inspired single-body plate designed to expose first-layer height differences across a 3D-printer bed. The supplied report documents the CAD layout and finished print.", es: "Placa de un solo cuerpo inspirada en aeronáutica, diseñada para hacer visibles las diferencias de altura de la primera capa en la cama de una impresora 3D. El reporte suministrado documenta el diseño CAD y la pieza terminada." }
  },
  {
    id: "titan-10-cam-setup", placeholder: false,
    name: { en: "TITAN 10 CAM Setup", es: "Preparación CAM de TITAN 10" }, software: "Fusion 360", year: "2026",
    semester: { en: "6th term", es: "6.º cuatrimestre" }, category: { en: "CAM / CNC Programming", es: "Programación CAM / CNC" },
    techniques: { en: ["Tool selection", "Setup planning", "Toolpath simulation"], es: ["Selección de herramientas", "Planeación de setups", "Simulación de trayectorias"] },
    preview: "./assets/cad/thumbnails/titan-cam.webp", images: [], additionalImages: [], drawing: null, model3d: null,
    description: { en: "A Fusion 360 CAM practice focused on tool selection and operation planning for the TITAN 10 exercise, supported by the supplied technical report and simulation evidence.", es: "Práctica CAM en Fusion 360 enfocada en la selección de herramientas y la planeación de operaciones para el ejercicio TITAN 10, respaldada por el reporte técnico y la evidencia de simulación suministrados." }
  },
  {
    id: "sheet-metal-cam-study", placeholder: false,
    name: { en: "Sheet-Metal CAM Study", es: "Estudio CAM de lámina" }, software: "Fusion 360", year: "2026",
    semester: { en: "6th term", es: "6.º cuatrimestre" }, category: { en: "Sheet Metal / CAM", es: "Lámina / CAM" },
    techniques: { en: ["Sheet-metal modeling", "Laser and water cutting", "Simulation"], es: ["Modelado de lámina", "Corte láser y agua", "Simulación"] },
    preview: "./assets/cad/thumbnails/sheet-metal-cam.webp", images: [], additionalImages: [], drawing: null, model3d: null,
    description: { en: "A Fusion 360 study for two sheet-metal pieces prepared for laser and water cutting, shown through the supplied CAM simulation frame.", es: "Estudio en Fusion 360 para dos piezas de lámina preparadas para corte con láser y agua, mostrado mediante el fotograma de simulación CAM suministrado." }
  },
  {
    id: "nameplate-3d", placeholder: false,
    name: { en: "3D Nameplate", es: "Placa de nombre 3D" }, software: "Fusion 360", year: "2025",
    semester: { en: "Academic project", es: "Proyecto académico" }, category: { en: "Additive Manufacturing", es: "Manufactura aditiva" },
    techniques: { en: ["3D modeling", "Rendering", "FDM preparation"], es: ["Modelado 3D", "Renderizado", "Preparación FDM"] },
    preview: "./assets/cad/thumbnails/nameplate.webp", images: [], additionalImages: [], drawing: null, model3d: null,
    description: { en: "A Fusion 360 nameplate exercise documented with presentation renders. The project was completed as collaborative academic work and is shown as such.", es: "Ejercicio de placa de nombre en Fusion 360 documentado con renders de presentación. El proyecto se realizó como trabajo académico colaborativo y se muestra como tal." }
  }
];

const HORIZON = {
  media: {
    cad: "./assets/cad/horizon-fixture/horizon-assembly-cad.webp",
    prototype: "./assets/cad/horizon-fixture/prototype-overview.webp",
    top: "./assets/cad/horizon-fixture/prototype-top.webp",
    side: "./assets/cad/horizon-fixture/prototype-side.webp",
    printing: "./assets/cad/horizon-fixture/printing-components.webp",
    drawing: "./assets/cad/horizon-fixture/base-giratoria-drawing.png",
    video: "./assets/cad/horizon-fixture/assembly-video.mp4"
  },
  sections: [
    { id: "overview", title: { en: "Overview", es: "Resumen" }, body: { en: "Horizon Fixture is an academic functional prototype for holding and positioning an aeronautical bushing during educational measurement practice. The project combines parametric SolidWorks modeling, engineering drawings, FDM manufacturing and a physical assembly.", es: "Horizon Fixture es un prototipo funcional académico para sujetar y posicionar un buje aeronáutico durante prácticas educativas de medición. El proyecto combina modelado paramétrico en SolidWorks, planos de ingeniería, manufactura FDM y un ensamble físico." } },
    { id: "problem", title: { en: "Problem", es: "Problema" }, body: { en: "Manual handling can change a cylindrical part’s position, angle and contact. The project therefore needed a stable reference, manual adjustment and coordinated radial supports that could be made with available resources.", es: "La manipulación manual puede cambiar la posición, el ángulo y el contacto de una pieza cilíndrica. Por ello se necesitaba una referencia estable, ajuste manual y soportes radiales coordinados, fabricables con los recursos disponibles." } },
    { id: "concept", title: { en: "Mechanical Concept", es: "Concepto mecánico" }, body: { en: "The concept uses a main fixture base, three radial guides and supports, a rotating base with curved slots, a large gear, a pinion and a reference bushing. The geometry is intended to move the supports toward a common axis.", es: "El concepto utiliza una base principal, tres guías y soportes radiales, una base giratoria con ranuras curvas, un engrane mayor, un piñón y un buje de referencia. La geometría busca mover los soportes hacia un eje común." } },
    { id: "how-it-works", title: { en: "How It Works", es: "Cómo funciona" }, body: { en: "The operator turns the pinion by hand. The pinion drives the larger gear; that rotation moves the slotted base, which guides the three supports toward the bushing. The report treats centering and repeatability as items for future measurement.", es: "El operador gira manualmente el piñón. El piñón mueve el engrane mayor; esa rotación mueve la base ranurada, que guía los tres soportes hacia el buje. El reporte deja el centrado y la repetibilidad como aspectos por medir posteriormente." } },
    { id: "cad-assembly", title: { en: "CAD & Assembly", es: "CAD y ensamble" }, body: { en: "Parts and assembly were modeled parametrically in SolidWorks. The available evidence includes an assembly view, engineering drawings and a documented nominal 0.25 mm gap for moving areas. This design value is not presented as certified metrology tolerance.", es: "Las piezas y el ensamble se modelaron paramétricamente en SolidWorks. La evidencia disponible incluye una vista del ensamble, planos de ingeniería y una holgura nominal documentada de 0.25 mm para zonas móviles. Este valor de diseño no se presenta como tolerancia metrológica certificada." } },
    { id: "drawings", title: { en: "Engineering Drawings", es: "Planos de ingeniería" }, body: { en: "The supplied drawing evidence documents the rotating base with views, dimensions and the educational SolidWorks notice. It is included as a visual record of the design documentation.", es: "La evidencia de planos suministrada documenta la base giratoria con vistas, cotas y el aviso de SolidWorks educativo. Se incluye como registro visual de la documentación de diseño." } },
    { id: "dfm", title: { en: "Design for Manufacturing", es: "Diseño para manufactura" }, body: { en: "Three supports distribute contact, modular pieces can be inspected separately, and the geometry was prepared for FDM in PLA. The reported gap was selected to keep printed moving surfaces from fusing while allowing adjustment.", es: "Tres soportes distribuyen el contacto, las piezas modulares pueden revisarse por separado y la geometría se preparó para FDM en PLA. La holgura reportada busca evitar que las superficies móviles impresas se fusionen y permitir el ajuste." } },
    { id: "fdm", title: { en: "FDM Manufacturing", es: "Manufactura FDM" }, body: { en: "The project records a Creality Ender-3 V2, PLA, Standard Quality at 0.2 mm, 10% infill, no supports or additional adhesion, 60 °C bed and 205 °C extrusion. Five recorded jobs total approximately 17 h 06 min, 130 g and 43.46 m of filament; material cost was estimated at $58.50.", es: "El proyecto registra una Creality Ender-3 V2, PLA, calidad estándar de 0.2 mm, 10% de relleno, sin soportes ni adhesión adicional, cama a 60 °C y extrusión a 205 °C. Cinco trabajos registrados suman aproximadamente 17 h 06 min, 130 g y 43.46 m de filamento; el costo de material se estimó en $58.50." } },
    { id: "prototype", title: { en: "Physical Prototype", es: "Prototipo físico" }, body: { en: "The supplied photographs show the completed printed mechanism with a metal reference bushing, three radial supports, the rotating base and the gear train. The prototype is documented as an educational demonstrator, not as an industrial product.", es: "Las fotografías suministradas muestran el mecanismo impreso terminado con un buje metálico de referencia, tres soportes radiales, la base giratoria y el tren de engranes. El prototipo se documenta como demostrador educativo, no como producto industrial." } },
    { id: "validation", title: { en: "Functional Validation", es: "Validación funcional" }, body: { en: "The available evidence supports complete parts, integrated mounting and observed actuation. Centering error, force and repeatability were not measured in the supplied evidence, so they remain future validation work.", es: "La evidencia disponible respalda piezas completas, montaje integrado y accionamiento observado. El error de centrado, la fuerza y la repetibilidad no fueron medidos en la evidencia suministrada, por lo que quedan como trabajo de validación futuro." } },
    { id: "improvements", title: { en: "Possible Improvements", es: "Posibles mejoras" }, body: { en: "A next iteration could run ten cycles, measure centering error with a vernier or dial indicator, add stops or metal inserts for higher loads, compare PETG or nylon, and use an inspection sheet.", es: "Una siguiente iteración podría ejecutar diez ciclos, medir el error de centrado con vernier o indicador de carátula, agregar topes o insertos metálicos para cargas mayores, comparar PETG o nylon y usar una hoja de inspección." } }
  ],
  specs: [
    { label: { en: "Printer", es: "Equipo" }, value: "Creality Ender-3 V2" },
    { label: { en: "Material", es: "Material" }, value: "PLA" },
    { label: { en: "Profile", es: "Perfil" }, value: "Standard Quality · 0.2 mm" },
    { label: { en: "Infill", es: "Relleno" }, value: "10%" },
    { label: { en: "Nominal moving gap", es: "Holgura móvil nominal" }, value: "0.25 mm" },
    { label: { en: "Recorded work", es: "Trabajo registrado" }, value: "5 jobs · 17 h 06 min · 130 g" },
    { label: { en: "Filament", es: "Filamento" }, value: "43.46 m" },
    { label: { en: "Material estimate", es: "Estimación de material" }, value: "$58.50" }
  ],
  validation: [
    { test: { en: "Complete parts", es: "Piezas completas" }, result: { en: "Completed", es: "Cumplida" }, evidence: { en: "Base, guides, supports and gears integrated.", es: "Base, guías, soportes y engranes integrados." } },
    { test: { en: "Mounting", es: "Montaje" }, result: { en: "Qualitative", es: "Cualitativa" }, evidence: { en: "Supports placed on guides.", es: "Soportes colocados en las guías." } },
    { test: { en: "Actuation", es: "Accionamiento" }, result: { en: "Observed", es: "Observado" }, evidence: { en: "Pinion and gear transmit motion.", es: "Piñón y engrane transmiten movimiento." } },
    { test: { en: "Repeatability", es: "Repetibilidad" }, result: { en: "Pending measurement", es: "Medición pendiente" }, evidence: { en: "Ten-cycle measurement proposed.", es: "Se propone medición de diez ciclos." } }
  ]
};

// Public data contract consumed by src/app.js. Keep this assignment at the end
// so it intentionally supersedes the legacy Spanish-only records above.
window.COPY = COPY;
window.SKILLS = SKILLS_V2;
window.EDUCATION = EDUCATION_V2;
window.PROJECTS = PROJECTS_V2;
window.CERTIFICATIONS = CERTIFICATIONS_V2;
window.BOOKS = BOOKS_V2;
window.BLOG = BLOG_V2;
window.CAD_PROJECTS = CAD_PROJECTS_V2;
window.HORIZON = HORIZON;
