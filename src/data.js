// src/data.js

const PROJECTS = [
  {
    id: "simulador-asteroides",
    title: "Simulador de Impacto de Asteroides",
    description: "Simulacion interactiva visual de impactos de asteroides reales y sus efectos ecologicos y fisicos sobre la Tierra. Desarrollado para el NASA Space Apps Challenge.",
    tags: ["JavaScript", "HTML5 Canvas", "Fisica", "NASA Data"],
    status: "live",
    date: "Octubre 2025",
    github: "https://github.com/Arturo-Mosqueda",
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
    github: "https://github.com/Arturo-Mosqueda",
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
