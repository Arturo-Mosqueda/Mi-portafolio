// src/app.js

// ─── DATA ────────────────────────────────────────────
const DATA_VERSION = 'v16';
if (localStorage.getItem('v3_data_version') !== DATA_VERSION) {
  localStorage.setItem('v3_data_version', DATA_VERSION);
  localStorage.removeItem('v3_proj');
  localStorage.removeItem('v3_cert');
  localStorage.removeItem('v3_books');
  localStorage.removeItem('v3_blog');
}

let projects       = JSON.parse(localStorage.getItem('v3_proj'))  || window.PROJECTS       || [];
let certifications = JSON.parse(localStorage.getItem('v3_cert'))  || window.CERTIFICATIONS || [];
let books          = JSON.parse(localStorage.getItem('v3_books')) || window.BOOKS          || [];
let blog           = JSON.parse(localStorage.getItem('v3_blog'))  || window.BLOG           || [];

function save() {
  localStorage.setItem('v3_proj',  JSON.stringify(projects));
  localStorage.setItem('v3_cert',  JSON.stringify(certifications));
  localStorage.setItem('v3_books', JSON.stringify(books));
  localStorage.setItem('v3_blog',  JSON.stringify(blog));
}

// ─── STATE ───────────────────────────────────────────
let tab   = 'inicio';
let theme = localStorage.getItem('v3_theme') || 'dark';

// ─── SOCIAL LINKS ────────────────────────────────────
const SOCIALS = [
  {
    name: 'LinkedIn', url: 'https://www.linkedin.com/in/arturo-mosqueda-23951436a',
    svg: `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
  },
  {
    name: 'GitHub', url: 'https://github.com/Arturo-Mosqueda',
    svg: `<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`
  },
  {
    name: 'Correo', url: 'mailto:jmosquedalara111@gmail.com',
    svg: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`
  },
  {
    name: 'Teléfono', url: 'tel:+527202607183',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  }
];

// ─── DOM ─────────────────────────────────────────────
const $topBar  = document.getElementById('top-bar');
const $navRow  = document.getElementById('nav-row');
const $content = document.getElementById('content');
const $modal   = document.getElementById('modal-overlay');
const $mBody   = document.getElementById('modal-body');
const $mClose  = document.getElementById('modal-close');
const $footer  = document.getElementById('footer-year');

// ─── HELPERS ─────────────────────────────────────────
function uid() { return Math.random().toString(36).substr(2, 9); }
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}
function stars(n) { return '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0)); }

// ─── THEME ───────────────────────────────────────────
function applyTheme() {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('v3_theme', theme);
}
function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  buildTopBar();
}

// ─── TOP BAR ─────────────────────────────────────────
function buildTopBar() {
  const socialsHTML = SOCIALS.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener" class="social-link" title="${s.name}">
      ${s.svg}
      <span class="sl-label">${s.name}</span>
    </a>
  `).join('');

  // Sol (modo claro activo → click para oscuro)
  const sunSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="4"/>
    <line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="4" y2="12"/>
    <line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`;

  // Luna (modo oscuro activo → click para claro)
  const moonSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;

  const themeIcon = theme === 'dark' ? moonSVG : sunSVG;

  $topBar.innerHTML = `
    <button class="top-name" id="home-btn">Arturo Mosqueda Lara</button>
    <div class="top-right">
      <div class="socials">${socialsHTML}</div>
      <button class="theme-btn" id="theme-btn" title="${theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}">${themeIcon}</button>
    </div>
  `;

  document.getElementById('home-btn').onclick = () => go('inicio');
  document.getElementById('theme-btn').onclick = toggleTheme;
}

// ─── NAV ─────────────────────────────────────────────
const TABS = [
  { id: 'inicio',          label: 'Inicio'          },
  { id: 'proyectos',       label: 'Proyectos'       },
  { id: 'certificaciones', label: 'Certificaciones' },
  { id: 'libros',          label: 'Libros'          },
  { id: 'blog',            label: 'Blog'            },
];

function buildNav() {
  $navRow.innerHTML = TABS.map(t => `
    <button class="nav-tab ${tab === t.id ? 'active' : ''}" data-tab="${t.id}">
      ${t.label}
    </button>
  `).join('');

  $navRow.querySelectorAll('.nav-tab').forEach(btn => {
    btn.onclick = () => go(btn.dataset.tab);
  });
}

// ─── ROUTER ──────────────────────────────────────────
function go(id) {
  tab = id;
  buildNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const map = {
    inicio:          pageHome,
    proyectos:       pageProjects,
    certificaciones: pageCerts,
    libros:          pageBooks,
    blog:            pageBlog,
  };
  (map[id] || pageHome)();
}

// ─── HOME ─────────────────────────────────────────────
// ─── HOME ─────────────────────────────────────────────
function pageHome() {
  const skillsList = [
    { name: 'SolidWorks', detail: '2 años de exp. · Certificación CSWP (Marzo 2026)' },
    { name: 'Fusion 360, CNC y CAM', detail: 'En proceso de aprendizaje' },
    { name: 'Python, HTML, CSS y JS', detail: 'Nivel intermedio (Marzo 2024 - 2026)' },
    { name: 'Adquisición de Datos y Electrónica', detail: 'Integración de sensores (Julio 2020 - 2026)' },
    { name: 'Engineering Drawings / GD&T', detail: 'Updated in current CV' },
    { name: 'Inglés B1+', detail: 'En desarrollo y mejora constante' }
  ];

  const educations = [
    {
      degree: 'Ingeniería Aeronáutica en Manufactura',
      institution: 'Universidad Aeronáutica de Querétaro (UNAQ)',
      period: 'Sep 2024 - Actualidad',
      detail: '6.º cuatrimestre de 12. El Marqués, Qro.'
    },
    {
      degree: 'Técnico en Mecatrónica',
      institution: 'Centro de Bachillerato Tecnológico Industrial y de Servicios (CBTis 118)',
      period: 'Jul 2020 - Jul 2023',
      detail: 'Corregidora, Qro. Proyecto destacado de mezcla automatizada.'
    }
  ];

  const competencies = [
    'Liderazgo y trabajo en equipo en proyectos colaborativos y multidisciplinarios.',
    'Resolución de problemas en sistemas electrónicos, mecánicos y de adquisición de datos.',
    'Pensamiento analítico y optimización de sistemas en proyectos técnicos.',
    'Disciplina y constancia desarrolladas mediante entrenamiento físico y preparación para maratones.'
  ];

  const skillsHTML = skillsList.map(s => `
    <div class="skill-card">
      <div class="skill-card-name">${esc(s.name)}</div>
      <div class="skill-card-detail">${esc(s.detail)}</div>
    </div>
  `).join('');

  const eduHTML = educations.map(e => `
    <div class="edu-item">
      <div class="edu-meta">
        <span class="edu-period">${esc(e.period)}</span>
      </div>
      <div class="edu-degree">${esc(e.degree)}</div>
      <div class="edu-institution">${esc(e.institution)}</div>
      <p class="edu-detail">${esc(e.detail)}</p>
    </div>
  `).join('');

  const compHTML = competencies.map(c => `
    <li class="comp-bullet">${esc(c)}</li>
  `).join('');

  $content.innerHTML = `
    <div class="page-in">
      <!-- Split Hero: Bio Left, CAD Viewport Right -->
      <div class="home-hero-split">
        <div class="home-hero-left">
          <p class="page-eyebrow">Portafolio Personal</p>
          <h1 class="page-title" style="margin-bottom: 1rem;">
            Jesús Arturo<br><strong>Mosqueda Lara</strong>
          </h1>
          <p class="page-lead" style="margin-bottom: 1.5rem; max-width: 100%;">
            Estudiante de Ingeniería Aeronáutica en la UNAQ con formación técnica en Mecatrónica. Especializado en diseño CAD/CAM, manufactura y automatización multidisciplinaria.
          </p>
          <div class="cta-row" style="margin-top: 0; margin-bottom: 1rem;">
            <button class="btn btn-solid" onclick="go('proyectos')">Proyectos ↗</button>
            <button class="btn btn-ghost" onclick="go('certificaciones')">Certificaciones ↗</button>
          </div>
        </div>
        <div class="home-hero-right">
          <div class="cad-viewport">
            <div class="cad-grid"></div>
            <div class="cad-overlay-text">
              CNC_MILLING: ACTIVE<br>
              PROCESS: GEAR_MACHINING<br>
              SPINDLE: <span id="cnc-spindle">12000 RPM</span><br>
              PASS: <span id="cnc-pass">DESBASTE</span><br>
              REMOVED: <span id="cnc-progress">0.0%</span><br>
              CAM_X: <span id="cad-rx">0</span><br>
              CAM_Y: <span id="cad-ry">0</span>
            </div>
            <div class="cad-axis">
              <span style="color:#ff4a4a">X-AXIS</span>
              <span style="color:#4aef4a">Y-AXIS</span>
              <span style="color:#4a90ff">Z-AXIS</span>
            </div>
            <canvas id="hero-cnc-canvas" style="width: 100%; height: 100%; display: block; position: absolute; inset: 0; z-index: 1; pointer-events: auto;"></canvas>
          </div>
        </div>
      </div>

      <!-- Stats Bar (Full Width) -->
      <div class="home-stats" style="margin-top: 3.5rem;">
        <div class="stat-item">
          <span class="stat-num">${projects.length}</span>
          <span class="stat-label">Proyectos</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">1</span>
          <span class="stat-label">Certificación</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">UNAQ</span>
          <span class="stat-label">Universidad</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">Querétaro</span>
          <span class="stat-label">Ubicación</span>
        </div>
      </div>

      <!-- Habilidades Técnicas (Full Width Grid) -->
      <div class="home-sec" style="margin-top: 0;">
        <h2 class="home-sec-title">Habilidades Técnicas</h2>
        <div class="home-skills-grid">${skillsHTML}</div>
      </div>

      <!-- Educación y Competencias (Split Row) -->
      <div class="home-split-row" style="margin-top: 3.5rem;">
        <div class="home-split-col">
          <h2 class="home-sec-title">Educación</h2>
          <div class="edu-list">${eduHTML}</div>
        </div>
        <div class="home-split-col">
          <h2 class="home-sec-title">Competencias Profesionales</h2>
          <ul class="comp-list">${compHTML}</ul>
        </div>
      </div>

      <!-- CV Descarga Banner -->
      <div class="cv-download-banner" style="margin-top: 4rem;">
        <div>
          <h3 style="margin: 0; font-size: 0.95rem; font-weight: 500; color: var(--fg);">¿Necesitas una copia física?</h3>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: var(--fg-2);">Descarga mi Currículum Vitae completo en formato PDF listo para imprimir.</p>
        </div>
        <a href="./cv.pdf" download="CV_Arturo_Mosqueda.pdf" target="_blank" class="btn btn-solid">Descargar PDF 📄</a>
      </div>

    </div>
  `;

  // Inicializar visor 3D interactivo cuando Three.js está disponible.
  if (window.THREE && window.THREE.OrbitControls) initCadRotation();
}

// ─── PROJECTS ────────────────────────────────────────────
const STATUS = {
  live:    { label: 'Live',    cls: 'st-live'    },
  dev:     { label: 'En Dev', cls: 'st-dev'     },
  concept: { label: 'Concept', cls: 'st-concept' },
};

function pageProjects() {
  const cards = projects.map((p, i) => {
    const st = STATUS[p.status] || STATUS.concept;
    const tagsHTML = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
    
    const actionsHTML = `
      <div class="proj-card-actions">
        ${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener" class="proj-action-btn btn-open">Abrir ↗</a>` : ''}
        ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" class="proj-action-btn btn-git">GitHub ↗</a>` : ''}
        ${!p.live && !p.github ? `<span class="proj-action-empty">CAD / Sin demo</span>` : ''}
      </div>
    `;

    return `
      <div class="proj-card" role="article">
        <div class="proj-card-cover-wrap" style="display: ${p.imageUrl ? 'block' : 'none'};">
          ${p.imageUrl ? `<img src="${esc(p.imageUrl)}" class="proj-card-cover" alt="${esc(p.title)}" loading="lazy" onerror="if(this.src.indexOf('unsplash.com') === -1 && '${esc(p.fallbackUrl || '')}'){ this.src='${esc(p.fallbackUrl)}'; }else{ this.style.display='none'; this.parentNode.style.display='none'; }">` : ''}
        </div>
        <div class="proj-card-content">
          <div class="proj-card-head">
            <span class="proj-num">PRJ-${String(i+1).padStart(2,'0')}</span>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              ${p.date ? `<span class="proj-date">${esc(p.date)}</span>` : ''}
              <span class="proj-status ${st.cls}">${st.label}</span>
            </div>
          </div>
          <div class="proj-card-name">${esc(p.title)}</div>
          <div class="proj-card-desc">${esc(p.description)}</div>
          <div class="proj-tags" style="margin-top:.4rem; margin-bottom:.4rem;">${tagsHTML}</div>
          ${actionsHTML}
        </div>
      </div>
    `;
  }).join('');

  $content.innerHTML = `
    <div class="page-in">
      <p class="page-eyebrow">Trabajos</p>
      <h1 class="page-title" style="font-size:clamp(1.8rem,4vw,3rem);">Proyectos</h1>
      <div class="proj-grid">${cards || '<p style="color:var(--fg-3);font-size:.83rem;">Sin proyectos registrados.</p>'}</div>
    </div>
  `;
}

window.openProject = function(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const url = p.live || p.github || '';
  if (url) window.open(url, '_blank');
};



// ─── CERTS ───────────────────────────────────────────
function pageCerts() {
  const cards = certifications.map(c => {
    const isCompleted = c.date !== 'En proceso';
    const statusLabel = isCompleted ? 'Completado' : 'En proceso';
    const statusCls = isCompleted ? 'st-live' : 'st-concept';
    return `
      <div class="cert-card" onclick="openCertModal('${esc(c.id)}')" role="button" tabindex="0">
        <div class="cert-card-cover-wrap">
          ${c.imageUrl ? `<img src="${esc(c.imageUrl)}" class="cert-card-cover" alt="${esc(c.title)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
          <div class="cert-fallback" style="display: ${c.imageUrl ? 'none' : 'flex'};">
            <span>🛡️</span>
            <span class="cf-issuer">${esc(c.issuer)}</span>
          </div>
          <span class="cert-status-badge ${statusCls}">${statusLabel}</span>
        </div>
        <div class="cert-card-content">
          <div class="cert-issuer-tag">${esc(c.issuer)}</div>
          <div class="cert-name">${esc(c.title)}</div>
          <div class="cert-card-footer">
            <span class="cert-cat">${esc(c.category)}</span>
            <span class="cert-date-val">${esc(c.date)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  $content.innerHTML = `
    <div class="page-in">
      <p class="page-eyebrow">Credenciales</p>
      <h1 class="page-title" style="font-size:clamp(1.8rem,4vw,3rem);">Certificaciones</h1>
      <div class="cert-grid" style="margin-top:2rem;">${cards || '<p style="color:var(--fg-3);font-size:.83rem;">Sin certificaciones.</p>'}</div>
    </div>
  `;
}

window.openCertModal = function(id) {
  const c = certifications.find(x => x.id === id);
  if (!c) return;
  $mBody.innerHTML = `
    ${c.imageUrl ? `<img src="${esc(c.imageUrl)}" class="cm-img" alt="${esc(c.title)}" onerror="this.style.display='none';">` : ''}
    <div style="padding: ${c.imageUrl ? '1.5rem' : '2rem'} 2rem 2rem;">
      <p style="font-family:var(--mono);font-size:.57rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-3);margin-bottom:.4rem;">${esc(c.issuer)}</p>
      <h2 style="font-size:1.15rem;font-weight:500;color:var(--fg);margin-bottom:.6rem;line-height:1.3;">${esc(c.title)}</h2>
      <p style="font-size:.8rem;color:var(--fg-2);">${esc(c.category)} · ${esc(c.date)}</p>
      ${c.credentialUrl ? `<a href="${esc(c.credentialUrl)}" target="_blank" rel="noopener" style="margin-top:1.25rem;border-radius:100px;padding:.5rem 1.1rem;font-size:.75rem;display:inline-flex;border:1px solid var(--line-2);color:var(--fg-2);">Ver credencial ↗</a>` : ''}
    </div>
  `;
  $modal.classList.remove('hidden');
};

// ─── BOOKS ───────────────────────────────────────────
function pageBooks() {
  const cards = books.map(b => {
    const isEnProceso = b.id === 'book-pensar-sistemas' || b.rating === 0;
    const overlayContent = isEnProceso 
      ? `<span class="book-hover-status">📖 EN PROCESO</span>`
      : `<span class="book-hover-stars">${stars(b.rating)}</span>`;

    return `
      <div class="book-card" onclick="openBook('${esc(b.id)}')" role="button" tabindex="0">
        <div class="book-cover-wrap">
          ${b.coverUrl ? `<img src="${esc(b.coverUrl)}" class="book-cover" alt="${esc(b.title)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
          <div class="book-fallback" style="display: ${b.coverUrl ? 'none' : 'flex'};">
            <span>📖</span>
            <span class="bf-title">${esc(b.title)}</span>
          </div>
          <div class="book-hover-overlay">
            ${overlayContent}
          </div>
        </div>
      </div>
    `;
  }).join('');

  $content.innerHTML = `
    <div class="page-in">
      <p class="page-eyebrow">Lecturas</p>
      <h1 class="page-title" style="font-size:clamp(1.8rem,4vw,3rem);">Biblioteca</h1>
      <div class="books-grid" style="margin-top:2rem;">${cards || '<p style="color:var(--fg-3);font-size:.83rem;">Sin libros registrados.</p>'}</div>
    </div>
  `;
}

window.openBook = function(id) {
  const b = books.find(x => x.id === id);
  if (!b) return;
  $content.innerHTML = `
    <div class="reader page-in">
      <button class="back-btn" onclick="pageBooks()">← Biblioteca</button>
      <p class="reader-eyebrow">${(b.categories || []).join(' · ')}</p>
      <h1 class="reader-h">${esc(b.title)}</h1>
      <div class="reader-meta">
        <span>${esc(b.author)}</span>
        <span>${stars(b.rating)}</span>
      </div>
      ${b.quote ? `<blockquote class="reader-quote">"${esc(b.quote)}"</blockquote>` : ''}
      <div class="reader-body">${b.summary || ''}</div>
    </div>
  `;
};

// ─── BLOG ─────────────────────────────────────────────
function pageBlog() {
  $content.innerHTML = `
    <div class="page-in">
      <p class="page-eyebrow">Escritos</p>
      <h1 class="page-title" style="font-size:clamp(1.8rem,4vw,3rem);">Blog</h1>

      <div style="margin-top:2.5rem; max-width:560px;">
        <span style="
          display:inline-block;
          font-family:var(--mono);
          font-size:0.6rem;
          letter-spacing:0.14em;
          text-transform:uppercase;
          color:var(--accent);
          border:1px solid var(--accent);
          border-radius:99px;
          padding:0.25rem 0.85rem;
          margin-bottom:1.5rem;
        ">⏳ En proceso</span>

        <p style="font-size:1.05rem; line-height:1.75; color:var(--fg-2); margin-bottom:1.25rem;">
          Próximamente compartiré artículos sobre ingeniería, tecnología, proyectos personales y reflexiones sobre libros que he leído.
        </p>
        <p style="font-size:0.88rem; line-height:1.7; color:var(--fg-3);">
          Temas planeados: automatización con microcontroladores, diseño CAD/CAM, aprendizaje autodidacta y pensamiento en sistemas.
        </p>
      </div>
    </div>
  `;
}

window.openPost = function(id) {
  const p = blog.find(x => x.id === id);
  if (!p) return;
  $content.innerHTML = `
    <div class="reader page-in">
      <button class="back-btn" onclick="pageBlog()">← Blog</button>
      <p class="reader-eyebrow">${esc(p.category)}</p>
      <h1 class="reader-h">${esc(p.title)}</h1>
      <div class="reader-meta">
        <span>${esc(p.date)}</span>
        <span>${esc(p.readTime)} lectura</span>
      </div>
      <div class="reader-body">${p.content || ''}</div>
    </div>
  `;
};

function initCadRotation() {
  const vp = document.querySelector('.cad-viewport');
  const canvas = document.getElementById('hero-cnc-canvas');
  if (!vp || !canvas) return;

  // Cleanup old simulation to prevent memory leaks and multiple loops
  if (window.cncAnimId) {
    cancelAnimationFrame(window.cncAnimId);
    window.cncAnimId = null;
  }
  if (window.cncRendererInstance) {
    window.cncRendererInstance.dispose();
    window.cncRendererInstance = null;
  }
  if (window.cncControls) {
    window.cncControls.dispose();
    window.cncControls = null;
  }
  if (window.cncResizeObserver) {
    window.cncResizeObserver.disconnect();
    window.cncResizeObserver = null;
  }

  const width = vp.clientWidth;
  const height = vp.clientHeight;

  // 1. Scene, Camera, Renderer (alpha: true for transparency)
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 5, 8.5);
  camera.lookAt(0, 0.2, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  window.cncRendererInstance = renderer;

  // OrbitControls for active camera movement (drag, scroll, pinch)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 4.0;
  controls.maxDistance = 16.0;
  controls.maxPolarAngle = Math.PI / 2 + 0.12; // Don't go below machine bed
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.target.set(0, 0.2, 0);
  window.cncControls = controls;

  // 2. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.85);
  mainLight.position.set(5, 10, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 512;
  mainLight.shadow.mapSize.height = 512;
  scene.add(mainLight);

  // Technical cian accent light
  const accentLight = new THREE.DirectionalLight(0x0ea5e9, 0.65);
  accentLight.position.set(-5, 2, -5);
  scene.add(accentLight);

  // 3. Machine Structures (Bed, Vise, Gantry Frame)
  const structuralMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // dark metal frame
    roughness: 0.45,
    metalness: 0.8
  });
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // polished steel rails
    roughness: 0.15,
    metalness: 0.95
  });
  const chuckMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // collet chuck dark steel
    roughness: 0.3,
    metalness: 0.9
  });

  // Table (Mesa de trabajo)
  const bedGeo = new THREE.BoxGeometry(6.4, 0.15, 6.4);
  const bedMesh = new THREE.Mesh(bedGeo, structuralMat);
  bedMesh.position.y = -1.05;
  bedMesh.receiveShadow = true;
  scene.add(bedMesh);

  // Vise Jaws (Mordazas de sujeción)
  const jawGeo = new THREE.BoxGeometry(0.3, 0.8, 4.4);
  const jawL = new THREE.Mesh(jawGeo, structuralMat);
  jawL.position.set(-2.4, -0.65, 0);
  jawL.castShadow = true;
  scene.add(jawL);

  const jawR = new THREE.Mesh(jawGeo, structuralMat);
  jawR.position.set(2.4, -0.65, 0);
  jawR.castShadow = true;
  scene.add(jawR);

  // Gantry Frame Columns & Bridge
  const colGeo = new THREE.BoxGeometry(0.6, 3.8, 0.6);
  const colL = new THREE.Mesh(colGeo, structuralMat);
  colL.position.set(-3.1, 0.85, -2.2);
  scene.add(colL);

  const colR = new THREE.Mesh(colGeo, structuralMat);
  colR.position.set(3.1, 0.85, -2.2);
  scene.add(colR);

  const bridgeGeo = new THREE.BoxGeometry(6.8, 0.8, 0.6);
  const bridge = new THREE.Mesh(bridgeGeo, structuralMat);
  bridge.position.set(0, 2.5, -2.2);
  scene.add(bridge);

  // X-Axis Linear Rails
  const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.2, 12);
  const railX1 = new THREE.Mesh(railGeo, railMat);
  railX1.rotation.z = Math.PI / 2;
  railX1.position.set(0, 2.3, -2.0);
  scene.add(railX1);

  const railX2 = new THREE.Mesh(railGeo, railMat);
  railX2.rotation.z = Math.PI / 2;
  railX2.position.set(0, 2.7, -2.0);
  scene.add(railX2);

  // 4. X-Axis Carriage (slides horizontally)
  const carriageGeo = new THREE.BoxGeometry(1.3, 1.2, 0.6);
  const xCarriage = new THREE.Mesh(carriageGeo, structuralMat);
  xCarriage.position.set(0, 2.5, -2.0);
  xCarriage.castShadow = true;
  scene.add(xCarriage);

  // 5. Spindle Head Assembly (moves in X, Y, Z)
  const spindleGroup = new THREE.Group();
  scene.add(spindleGroup);

  const spindleBodyGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.6, 16);
  const spindleBodyMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.9
  });
  const spindleBody = new THREE.Mesh(spindleBodyGeo, spindleBodyMat);
  spindleBody.position.y = 1.0;
  spindleBody.castShadow = true;
  spindleGroup.add(spindleBody);

  const chuckGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.35, 16);
  const chuckMesh = new THREE.Mesh(chuckGeo, chuckMat);
  chuckMesh.position.y = 0.12;
  spindleGroup.add(chuckMesh);

  const bitGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  const bitMesh = new THREE.Mesh(bitGeo, railMat);
  bitMesh.position.y = -0.25; // bottom tip is at relative y = -0.5
  spindleGroup.add(bitMesh);

  // toolGroup coordinates represent the actual cutting bit tip
  const toolGroup = new THREE.Group();
  scene.add(toolGroup);

  // 6. Workpiece Voxels Group
  const voxelGroup = new THREE.Group();
  scene.add(voxelGroup);

  let voxels = [];
  const VOXEL_COUNT_X = 29;
  const VOXEL_COUNT_Y = 4;
  const VOXEL_COUNT_Z = 29;
  const VOXEL_SIZE = 0.155;
  const CUBE_SIZE = VOXEL_COUNT_X * VOXEL_SIZE;

  // ── Gear profile constants ──────────────────────────────────────────────
  // 12 teeth, tip/root ratio = 1.41  (real gear proportions, not a star)
  const GEAR_R0  = 1.05;   // pitch radius
  const GEAR_A   = 0.18;   // tooth amplitude  (tip=1.23, root=0.87)
  const GEAR_N   = 12;     // number of teeth
  const SHAFT_R  = 0.28;   // central shaft hole radius

  function gearSurface(px, pz) {            // r at angle of (px,pz)
    return GEAR_R0 + GEAR_A * Math.cos(GEAR_N * Math.atan2(pz, px));
  }
  function shouldVoxelBeCut(px, pz) {
    const r = Math.sqrt(px * px + pz * pz);
    return r > gearSurface(px, pz) || r < SHAFT_R;
  }

  // Materials: Outer rough metal vs Machined cian glowing core
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // steel-gray unmachined
    roughness: 0.6,
    metalness: 0.75
  });
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x00f3ff, // bright neon cian
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x00f3ff,
    emissiveIntensity: 0.85
  });

  function resetWorkpiece() {
    while (voxelGroup.children.length > 0) {
      const v = voxelGroup.children[0];
      voxelGroup.remove(v);
      v.geometry.dispose();
    }
    voxels = [];

    const halfX = (VOXEL_COUNT_X - 1) / 2;
    const halfY = (VOXEL_COUNT_Y - 1) / 2;
    const halfZ = (VOXEL_COUNT_Z - 1) / 2;

    const voxelGeo = new THREE.BoxGeometry(VOXEL_SIZE * 0.94, VOXEL_SIZE * 0.94, VOXEL_SIZE * 0.94);

    for (let x = 0; x < VOXEL_COUNT_X; x++) {
      for (let y = 0; y < VOXEL_COUNT_Y; y++) {
        for (let z = 0; z < VOXEL_COUNT_Z; z++) {
          const lx = (x - halfX) * VOXEL_SIZE;
          const ly = (y - halfY) * VOXEL_SIZE;
          const lz = (z - halfZ) * VOXEL_SIZE;

          // Pre-compute whether this voxel will be machined away
          const willCut = shouldVoxelBeCut(lx, lz);

          const vMesh = new THREE.Mesh(voxelGeo, outerMat);
          vMesh.position.set(lx, ly, lz);
          vMesh.castShadow = true;
          vMesh.receiveShadow = true;

          vMesh.userData = {
            lx: lx, ly: ly, lz: lz,
            initialY: ly,
            isCut: false,
            shouldBeCut: willCut   // ← gear shape encoded per-voxel
          };

          voxelGroup.add(vMesh);
          voxels.push(vMesh);
        }
      }
    }
  }

  resetWorkpiece();

  // 7. Sparks (Particles)
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  let particles = [];
  const sparkGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });

  function spawnSparks(worldPos) {
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      spark.position.copy(worldPos);

      // Circular spray in X-Z plane with vertical kick
      const angle = Math.random() * Math.PI * 2;
      const sparkVel = new THREE.Vector3(Math.cos(angle), 0.6 + Math.random() * 0.8, Math.sin(angle)).normalize();
      sparkVel.multiplyScalar(1.8 + Math.random() * 1.8);

      spark.userData = {
        velocity: sparkVel,
        life: 0.45 + Math.random() * 0.25
      };

      particleGroup.add(spark);
      particles.push(spark);
    }
  }

  function updateParticles(delta) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.userData.life -= delta;
      if (p.userData.life <= 0) {
        particleGroup.remove(p);
        p.geometry.dispose();
        particles.splice(i, 1);
      } else {
        p.position.addScaledVector(p.userData.velocity, delta);
        p.userData.velocity.y -= 9.8 * delta; // gravity
        p.scale.setScalar(p.userData.life);
      }
    }
  }

  // 8. CNC Queue Planner (Precision Gear Carving)
  let cncQueue = [];
  let currentPassName = v2Copy().cnc.off;
  let materialRemovedCount = 0;
  const totalVoxelsCount = voxels.length;

  function rebuildCNCQueue() {
    cncQueue = [];
    materialRemovedCount = 0;

    const safeY = 1.35;
    const cutY  = 0.52;
    const half  = (VOXEL_COUNT_X - 1) / 2 * VOXEL_SIZE;  // = 2.17

    // ── Boustrophedon raster with explicit plunge per row ────────────────
    // 3 commands per row: rapid to safe → SLOW plunge → fast cut sweep
    // rowStep ≈ 1.8 voxels so cutRadiusZ (1.05 voxels) covers every gap
    const rowStep = VOXEL_SIZE * 1.8;

    let rowIdx = 0;
    for (let pz = -half; pz <= half + 0.001; pz += rowStep) {
      const fromX = (rowIdx % 2 === 0) ? -half :  half;
      const toX   = (rowIdx % 2 === 0) ?  half : -half;

      // 1. Rapid: move to row start above the block
      cncQueue.push({ type: 'move_rapid', x: fromX, y: safeY, z: pz, pass: v2Copy().cnc.position });
      // 2. Plunge: slow visible descent into the cut depth
      cncQueue.push({ type: 'plunge',     x: fromX, y: cutY,  z: pz, pass: v2Copy().cnc.plunge   });
      // 3. Cut: sweep across the full row at cut depth
      cncQueue.push({ type: 'cut',        x: toX,   y: cutY,  z: pz, pass: v2Copy().cnc.roughing });
      rowIdx++;
    }

    // Return home
    cncQueue.push({ type: 'move_rapid', x: 0, y: safeY, z: 0, pass: v2Copy().cnc.return });
  }

  rebuildCNCQueue();
  toolGroup.position.set(0, 1.35, 0);

  // 9. Loop
  let clock = new THREE.Clock();
  let completeWaitTime = 0;
  let isSpindleRunning = true;
  let spindleRPM = 12000;
  const voxelWorldPos = new THREE.Vector3();

  function animate() {
    window.cncAnimId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (delta > 0.1) return;

    // Spin bit and chuck vertical axis
    if (isSpindleRunning) {
      chuckMesh.rotation.y += (spindleRPM / 60) * Math.PI * 2 * delta;
      bitMesh.rotation.y += (spindleRPM / 60) * Math.PI * 2 * delta;
    }

    // Process CNC queue waypoints
    if (cncQueue.length > 0) {
      const cmd = cncQueue[0];
      currentPassName = cmd.pass;

      // Plunge: slow so descent is visible. Cut: moderate. Rapid: fast.
      const feedrate = cmd.type === 'plunge' ? 1.8
                     : cmd.type === 'cut'    ? 3.5
                     : 18;

      const dx = cmd.x - toolGroup.position.x;
      const dy = cmd.y - toolGroup.position.y;
      const dz = cmd.z - toolGroup.position.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if (dist < 0.04) {
        toolGroup.position.set(cmd.x, cmd.y, cmd.z);
        cncQueue.shift();
      } else {
        toolGroup.position.x += (dx / dist) * feedrate * delta;
        toolGroup.position.y += (dy / dist) * feedrate * delta;
        toolGroup.position.z += (dz / dist) * feedrate * delta;
      }

      // Sync physical mechanical parts to match coordinates
      xCarriage.position.x = toolGroup.position.x;
      spindleGroup.position.set(
        toolGroup.position.x,
        toolGroup.position.y + 0.5,
        toolGroup.position.z
      );

      // Perform cuts — only voxels flagged shouldBeCut get machined
      if (cmd.type === 'cut' || cmd.type === 'plunge') {
        const toolX = toolGroup.position.x;
        const toolY = toolGroup.position.y;
        const toolZ = toolGroup.position.z;
        // X: 1.5 voxels radius, Z: 1.05 voxels (matches rowStep of 1.8)
        const cutRadiusX = VOXEL_SIZE * 1.5;
        const cutRadiusZ = VOXEL_SIZE * 1.05;
        const cutHeight  = VOXEL_SIZE * VOXEL_COUNT_Y + 0.2; // full block height

        for (let i = 0; i < voxels.length; i++) {
          const v = voxels[i];
          if (v.userData.isCut) continue;
          if (!v.userData.shouldBeCut) continue;  // ← gear body protected!

          const vx = v.position.x;
          const vy = v.position.y;
          const vz = v.position.z;

          if (Math.abs(vx - toolX) < cutRadiusX &&
              Math.abs(vy - toolY) < cutHeight  &&
              Math.abs(vz - toolZ) < cutRadiusZ) {

            v.userData.isCut = true;
            v.material = innerMat;
            v.scale.y = 0.25;
            v.position.y = v.userData.initialY - VOXEL_SIZE * 0.35;

            v.getWorldPosition(voxelWorldPos);
            spawnSparks(voxelWorldPos);
            materialRemovedCount++;
          }
        }
      }
    } else {
      currentPassName = v2Copy().cnc.complete;
      completeWaitTime += delta;

      if (completeWaitTime > 4.0) {
        completeWaitTime = 0;
        resetWorkpiece();
        rebuildCNCQueue();
        toolGroup.position.set(0, 1.35, 0);
      }
    }

    updateParticles(delta);

    // Update orbit controls
    controls.update();

    // Show camera positions in overlay panel numbers
    const $rx = document.getElementById('cad-rx');
    const $ry = document.getElementById('cad-ry');
    if ($rx) $rx.textContent = Math.round(camera.position.x * 10);
    if ($ry) $ry.textContent = Math.round(camera.position.y * 10);

    const $spindleText = document.getElementById('cnc-spindle');
    const $passText = document.getElementById('cnc-pass');
    const $progressText = document.getElementById('cnc-progress');

    if ($spindleText) $spindleText.textContent = isSpindleRunning ? "12,000 RPM" : "0 RPM";
    if ($passText) $passText.textContent = currentPassName;
    if ($progressText) {
      const pct = (materialRemovedCount / totalVoxelsCount) * 100;
      $progressText.textContent = pct.toFixed(1) + "%";
    }

    renderer.render(scene, camera);
  }

  animate();

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const w = entry.contentRect.width || vp.clientWidth;
      const h = entry.contentRect.height || vp.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
  resizeObserver.observe(vp);
  window.cncResizeObserver = resizeObserver;
}

// ─── MODAL ───────────────────────────────────────────
$mClose.onclick = () => $modal.classList.add('hidden');
$modal.onclick  = (e) => { if (e.target === $modal) $modal.classList.add('hidden'); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') $modal.classList.add('hidden'); });

// ─── EXPOSE ──────────────────────────────────────────
window.go        = go;
window.pageBooks = pageBooks;
window.pageBlog  = pageBlog;

// ─── INIT ────────────────────────────────────────────
(function () {
  if ($footer) $footer.textContent = new Date().getFullYear() + ' ©';
  applyTheme();
  buildTopBar();
  buildNav();
  pageHome();
})();

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio v2 renderer
// The legacy renderer above is kept for backwards compatibility with old local
// storage snapshots. These functions are the active, bilingual renderer and
// consume only the data contract in src/data.js.
// ─────────────────────────────────────────────────────────────────────────────
function v2Language() {
  return localStorage.getItem('portfolio_language') === 'es' ? 'es' : 'en';
}

function v2Copy() {
  return (window.COPY && window.COPY[v2Language()]) || window.COPY.en;
}

function v2Value(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[v2Language()] ?? value.en ?? value.es ?? '';
  }
  return value ?? '';
}

function v2List(value) {
  const result = v2Value(value);
  return Array.isArray(result) ? result : (result ? [result] : []);
}

function v2Projects() { return window.PROJECTS || []; }
function v2Certifications() { return window.CERTIFICATIONS || []; }
function v2Books() { return window.BOOKS || []; }
function v2Blog() { return window.BLOG || []; }
function v2CadProjects() { return window.CAD_PROJECTS || []; }

function v2Status(status) {
  const c = v2Copy().status;
  return { live: c.live, dev: c.dev, concept: c.concept, academic: c.academic }[status] || c.concept;
}

function v2Theme() {
  return localStorage.getItem('portfolio_theme') || 'light';
}

function v2SunIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
}

function v2MoonIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

function applyThemeV2() {
  document.body.classList.toggle('light', v2Theme() === 'light');
}

function toggleThemeV2() {
  localStorage.setItem('portfolio_theme', v2Theme() === 'light' ? 'dark' : 'light');
  applyThemeV2();
  buildTopBarV2();
}

function setLanguageV2(lang) {
  localStorage.setItem('portfolio_language', lang === 'es' ? 'es' : 'en');
  updateDocumentV2();
  buildTopBarV2();
  buildNavV2();
  renderHashV2(false);
}

function buildTopBarV2() {
  const c = v2Copy();
  const socialNames = c.social || {};
  const socialsHtml = (typeof SOCIALS !== 'undefined' ? SOCIALS : []).map(s => `
    <a href="${esc(s.url)}" target="_blank" rel="noopener" class="social-link" aria-label="${esc(socialNames[s.name] || s.name)}" title="${esc(socialNames[s.name] || s.name)}">
      ${s.svg}<span class="sl-label">${esc(socialNames[s.name] || s.name)}</span>
    </a>
  `).join('');
  const languageLabel = v2Language() === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés';
  const themeLabel = v2Theme() === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  $topBar.innerHTML = `
    <button class="top-name" id="home-btn-v2" type="button">Arturo Mosqueda Lara</button>
    <div class="top-right">
      <div class="socials">${socialsHtml}</div>
      <div class="language-switcher" role="group" aria-label="${esc(languageLabel)}">
        <button type="button" class="language-btn ${v2Language() === 'en' ? 'active' : ''}" data-language="en" aria-pressed="${v2Language() === 'en'}">EN</button>
        <span aria-hidden="true">|</span>
        <button type="button" class="language-btn ${v2Language() === 'es' ? 'active' : ''}" data-language="es" aria-pressed="${v2Language() === 'es'}">ES</button>
      </div>
      <button class="theme-btn" id="theme-btn-v2" type="button" aria-label="${esc(themeLabel)}" title="${esc(themeLabel)}">${v2Theme() === 'light' ? v2SunIcon() : v2MoonIcon()}</button>
    </div>
  `;

  document.getElementById('home-btn-v2').onclick = () => goV2('inicio');
  document.getElementById('theme-btn-v2').onclick = toggleThemeV2;
  $topBar.querySelectorAll('[data-language]').forEach(button => {
    button.onclick = () => setLanguageV2(button.dataset.language);
  });
}

function buildNavV2() {
  const n = v2Copy().nav;
  const tabs = [
    ['inicio', n.home], ['proyectos', n.projects], ['certificaciones', n.certifications], ['libros', n.books], ['blog', n.blog]
  ];
  $navRow.setAttribute('aria-label', n.home === 'Home' ? 'Main navigation' : 'Navegación principal');
  $navRow.innerHTML = tabs.map(([id, label]) => `
    <button type="button" class="nav-tab ${tab === id ? 'active' : ''}" data-tab="${id}">${esc(label)}</button>
  `).join('');
  $navRow.querySelectorAll('[data-tab]').forEach(button => {
    button.onclick = () => goV2(button.dataset.tab);
  });
}

function updateDocumentV2() {
  const c = v2Copy();
  document.documentElement.lang = v2Language();
  document.title = c.metaTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', c.metaDescription);
  const footerName = document.getElementById('footer-name');
  if (footerName) footerName.textContent = c.footer;
  if ($footer) $footer.textContent = new Date().getFullYear();
}

function renderImageV2(src, alt, className) {
  if (!src) return `<div class="media-empty">${esc(v2Copy().cad.noImage)}</div>`;
  return `<img src="${esc(src)}" alt="${esc(alt)}" class="${className || ''}" loading="lazy" decoding="async">`;
}

function statValueV2(value) {
  return `<span class="stat-num">${esc(String(value))}</span>`;
}

function pageHomeV2() {
  const c = v2Copy();
  const skills = window.SKILLS || [];
  const education = (window.EDUCATION || []).map(item => ({
    degree: v2Value(item.degree), institution: v2Value(item.institution), period: v2Value(item.period), detail: v2Value(item.detail)
  }));
  const strengths = c.home.strengths || [];
  const completed = v2Certifications().filter(cert => cert.completed).length;
  const skillsHtml = skills.map(skill => `
    <article class="skill-card">
      <div class="skill-card-name">${esc(v2Value(skill.name))}</div>
      <div class="skill-card-detail">${esc(v2Value(skill.detail))}</div>
      <div class="skill-card-period">${esc(v2Value(skill.period))}</div>
    </article>
  `).join('');
  const educationHtml = education.map(item => `
    <article class="edu-item"><div class="edu-meta">${esc(item.period)}</div><div class="edu-degree">${esc(item.degree)}</div><div class="edu-institution">${esc(item.institution)}</div><p class="edu-detail">${esc(item.detail)}</p></article>
  `).join('');
  const strengthsHtml = strengths.map(item => `<li class="comp-bullet">${esc(item)}</li>`).join('');
  const cnc = c.cnc;

  $content.innerHTML = `
    <div class="page-in">
      <div class="home-hero-split">
        <div class="home-hero-left">
          <p class="page-eyebrow">${esc(c.home.eyebrow)}</p>
          <h1 class="page-title">Jesús Arturo<br><strong>Mosqueda Lara</strong></h1>
          <p class="page-lead">${esc(c.home.lead)}</p>
          <div class="cta-row">
            <button class="btn btn-solid" type="button" onclick="goV2('proyectos')">${esc(c.home.projectsButton)} ↗</button>
            <button class="btn btn-ghost" type="button" onclick="goV2('certificaciones')">${esc(c.home.certificationsButton)} ↗</button>
          </div>
        </div>
        <div class="home-hero-right">
          <div class="cad-viewport" role="img" aria-label="${esc(cnc.aria)}">
            <div class="cad-grid"></div>
            <div class="cad-overlay-text" aria-hidden="true">
              CNC_MILLING: ${esc(cnc.active)}<br>
              PROCESS: ${esc(cnc.process)}<br>
              ${esc(cnc.spindle)}: <span id="cnc-spindle">12000 RPM</span><br>
              ${esc(cnc.pass)}: <span id="cnc-pass">${esc(cnc.roughing)}</span><br>
              ${esc(cnc.removed)}: <span id="cnc-progress">0.0%</span><br>
              ${esc(cnc.camX)}: <span id="cad-rx">0</span><br>
              ${esc(cnc.camY)}: <span id="cad-ry">0</span>
            </div>
            <div class="cad-axis" aria-hidden="true"><span style="color:#ff4a4a">${esc(cnc.xAxis)}</span><span style="color:#4aef4a">${esc(cnc.yAxis)}</span><span style="color:#4a90ff">${esc(cnc.zAxis)}</span></div>
            <canvas id="hero-cnc-canvas"></canvas>
          </div>
        </div>
      </div>

      <div class="home-stats" aria-label="Portfolio summary">
        <div class="stat-item">${statValueV2(v2Projects().length)}<span class="stat-label">${esc(c.home.stats.projects)}</span></div>
        <div class="stat-sep"></div>
        <div class="stat-item">${statValueV2(completed)}<span class="stat-label">${esc(c.home.stats.certification)}</span></div>
        <div class="stat-sep"></div>
        <div class="stat-item">${statValueV2('UNAQ')}<span class="stat-label">${esc(c.home.stats.university)}</span></div>
        <div class="stat-sep"></div>
        <div class="stat-item">${statValueV2('Querétaro')}<span class="stat-label">${esc(c.home.stats.location)}</span></div>
      </div>

      <section class="home-sec"><h2 class="home-sec-title">${esc(c.home.skillsTitle)}</h2><div class="home-skills-grid">${skillsHtml}</div></section>
      <div class="home-split-row">
        <section class="home-split-col"><h2 class="home-sec-title">${esc(c.home.educationTitle)}</h2><div class="edu-list">${educationHtml}</div></section>
        <section class="home-split-col"><h2 class="home-sec-title">${esc(c.home.strengthsTitle)}</h2><ul class="comp-list">${strengthsHtml}</ul></section>
      </div>
      <div class="cv-download-banner">
        <div><h3>${esc(c.home.cvTitle)}</h3><p>${esc(c.home.cvDescription)}</p></div>
        <a href="./assets/cv/${esc(c.home.cvFile)}" download="${esc(c.home.cvFile)}" target="_blank" rel="noopener" class="btn btn-solid">${esc(c.home.cvButton)} ↓</a>
      </div>
    </div>
  `;

  if (window.THREE && window.THREE.OrbitControls && typeof initCadRotation === 'function') initCadRotation();
}

function projectTagsV2(project) {
  return v2List(project.tags).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
}

function projectImageV2(project) {
  if (project.imageUrl) return renderImageV2(project.imageUrl, v2Value(project.title), 'proj-card-cover');
  return `<div class="project-cover-placeholder"><span>${project.type === 'cad-gallery' ? 'CAD' : '◌'}</span></div>`;
}

function projectActionsV2(project) {
  const c = v2Copy().projects;
  if (project.type === 'horizon') return `<button type="button" class="proj-action-btn btn-open" onclick="openHorizonV2()">${esc(c.viewProject)} ↗</button>`;
  if (project.type === 'cad-gallery') return `<button type="button" class="proj-action-btn btn-open" onclick="openCadGalleryV2()">${esc(c.viewGallery)} ↗</button>`;
  return `${project.live ? `<a href="${esc(project.live)}" target="_blank" rel="noopener" class="proj-action-btn btn-open">${esc(c.open)} ↗</a>` : ''}${project.github ? `<a href="${esc(project.github)}" target="_blank" rel="noopener" class="proj-action-btn btn-git">${esc(c.viewGithub)} ↗</a>` : ''}${!project.live && !project.github ? `<span class="proj-action-empty">${esc(c.caseStudy)}</span>` : ''}`;
}

function projectCardV2(project, index) {
  const c = v2Copy().projects;
  return `<article class="proj-card" role="article">
    <div class="proj-card-cover-wrap">${projectImageV2(project)}</div>
    <div class="proj-card-content">
      <div class="proj-card-head"><span class="proj-num">PRJ-${String(index + 1).padStart(2, '0')}</span><div class="proj-card-meta">${project.date ? `<span class="proj-date">${esc(v2Value(project.date))}</span>` : ''}<span class="proj-status ${project.status === 'live' ? 'st-live' : project.status === 'academic' ? 'st-dev' : 'st-concept'}">${esc(v2Status(project.status))}</span></div></div>
      <div class="proj-card-name">${esc(v2Value(project.title))}</div>
      <div class="proj-card-desc">${esc(v2Value(project.description))}</div>
      <div class="proj-tags">${projectTagsV2(project)}</div>
      <div class="proj-card-actions">${projectActionsV2(project)}</div>
    </div>
  </article>`;
}

function featuredProjectV2(project) {
  const c = v2Copy().projects;
  return `<article class="featured-project">
    <div class="featured-project-media">
      <div class="featured-primary">${renderImageV2(project.imageUrl, v2Value(project.title), 'featured-image')}</div>
      <div class="featured-secondary">${renderImageV2(project.secondaryImageUrl, c.galleryTitle, 'featured-image')}</div>
    </div>
    <div class="featured-project-content">
      <p class="featured-label">${esc(c.featured)}</p>
      <h2>${esc(v2Value(project.title))}</h2>
      <p class="featured-subtitle">${esc(v2Value(project.subtitle))}</p>
      <p class="featured-description">${esc(v2Value(project.description))}</p>
      <div class="proj-tags">${projectTagsV2(project)}</div>
      <button type="button" class="btn btn-solid featured-cta" onclick="openHorizonV2()">${esc(c.viewProject)} ↗</button>
    </div>
  </article>`;
}

function galleryProjectCardV2(project) {
  const c = v2Copy().projects;
  const art = project.imageUrl
    ? `<div class="gallery-project-art gallery-project-art-real">${renderImageV2(project.imageUrl, v2Value(project.title), 'gallery-project-image')}${project.secondaryImageUrl ? `<div class="gallery-project-art-secondary">${renderImageV2(project.secondaryImageUrl, c.galleryTitle, 'gallery-project-image')}</div>` : ''}</div>`
    : `<div class="gallery-project-art"><span class="cad-art-ring"></span><span class="cad-art-bar"></span><span class="cad-art-dot"></span></div>`;
  return `<article class="gallery-project-card" role="article" onclick="openCadGalleryV2()" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){openCadGalleryV2();event.preventDefault();}">
    ${art}
    <div><p class="featured-label">${esc(c.gallerySubtitle)}</p><h2>${esc(c.galleryTitle)}</h2><p>${esc(c.galleryDescription)}</p><span class="gallery-arrow">${esc(c.viewGallery)} ↗</span></div>
  </article>`;
}

function pageProjectsV2() {
  const c = v2Copy().projects;
  const all = v2Projects();
  const featured = all.find(project => project.type === 'horizon') || all[0];
  const gallery = all.find(project => project.type === 'cad-gallery');
  const rest = all.filter(project => project !== featured && project !== gallery);
  $content.innerHTML = `<div class="page-in"><p class="page-eyebrow">${esc(c.eyebrow)}</p><h1 class="page-title">${esc(c.title)}</h1><p class="project-section-intro">${esc(c.intro)}</p>${featured ? featuredProjectV2(featured) : ''}${gallery ? galleryProjectCardV2(gallery) : ''}<div class="proj-grid">${rest.map((project, index) => projectCardV2(project, index + 2)).join('') || `<p class="empty-state">${esc(c.noProjects)}</p>`}</div></div>`;
}

function detailBackV2(label, action) {
  return `<button type="button" class="back-btn" onclick="${action}">← ${esc(label)}</button>`;
}

function horizonMediaV2(src, alt, label, className) {
  return `<figure class="detail-media ${className || ''}">${renderImageV2(src, alt, 'detail-image')}<figcaption>${esc(label)}</figcaption></figure>`;
}

function pageHorizonV2() {
  const c = v2Copy();
  const h = window.HORIZON;
  if (!h) return pageProjectsV2();
  const sections = h.sections || [];
  const overview = sections.find(section => section.id === 'overview');
  const bodySections = sections.filter(section => section.id !== 'overview');
  const specs = (h.specs || []).map(spec => `<div class="spec-item"><dt>${esc(v2Value(spec.label))}</dt><dd>${esc(spec.value)}</dd></div>`).join('');
  const validationRows = (h.validation || []).map(row => `<tr><th scope="row">${esc(v2Value(row.test))}</th><td>${esc(v2Value(row.result))}</td><td>${esc(v2Value(row.evidence))}</td></tr>`).join('');
  const textSections = bodySections.map(section => `<section class="detail-section" id="horizon-${esc(section.id)}"><p class="detail-section-index">${esc(section.id.replaceAll('-', ' '))}</p><h2>${esc(v2Value(section.title))}</h2><p>${esc(v2Value(section.body))}</p></section>`).join('');

  $content.innerHTML = `<div class="page-in detail-page">
    ${detailBackV2(c.horizon.back, "goV2('proyectos')")}
    <p class="page-eyebrow">${esc(c.horizon.eyebrow)}</p>
    <div class="detail-title-row"><div><h1 class="page-title">${esc(c.horizon.title)}</h1><p class="detail-subtitle">${esc(c.horizon.subtitle)}</p></div><span class="detail-disclaimer">${esc(c.horizon.disclaimer)}</span></div>
    <div class="detail-hero-grid"><div>${horizonMediaV2(h.media.cad, c.horizon.cadLabel, c.horizon.cadLabel, 'detail-media-large')}</div><div>${horizonMediaV2(h.media.prototype, c.horizon.prototypeLabel, c.horizon.prototypeLabel, 'detail-media-large')}</div></div>
    <div class="detail-overview-grid"><section class="detail-section detail-overview"><p class="detail-section-index">01</p><h2>${esc(c.horizon.overview)}</h2><p>${esc(v2Value(overview && overview.body))}</p></section><dl class="spec-grid">${specs}</dl></div>
    <div class="detail-narrative">${textSections}</div>
    <div class="detail-media-grid detail-media-grid-three">${horizonMediaV2(h.media.printing, c.horizon.videoLabel, c.horizon.videoLabel)}${horizonMediaV2(h.media.top, c.horizon.prototypeLabel, c.horizon.prototypeLabel)}${horizonMediaV2(h.media.side, c.horizon.prototypeLabel, c.horizon.prototypeLabel)}</div>
    <section class="detail-section detail-drawing-section"><p class="detail-section-index">CAD</p><h2>${esc(v2Value(bodySections.find(s => s.id === 'drawings')?.title || 'Engineering Drawings'))}</h2><div class="drawing-frame">${renderImageV2(h.media.drawing, 'Base giratoria engineering drawing', 'drawing-image')}</div></section>
    <section class="detail-section detail-video-section"><p class="detail-section-index">VIDEO</p><h2>${esc(c.horizon.videoLabel)}</h2><video class="detail-video" controls preload="metadata" poster="${esc(h.media.prototype)}"><source src="${esc(h.media.video)}" type="video/mp4">${esc(c.horizon.videoLabel)}</video></section>
    <section class="detail-section validation-section"><p class="detail-section-index">VALIDATION</p><h2>${esc(c.horizon.validation)}</h2><div class="table-wrap"><table class="detail-table"><thead><tr><th>${v2Language() === 'en' ? 'Test' : 'Prueba'}</th><th>${v2Language() === 'en' ? 'Status' : 'Estado'}</th><th>${v2Language() === 'en' ? 'Evidence / next step' : 'Evidencia / siguiente paso'}</th></tr></thead><tbody>${validationRows}</tbody></table></div></section>
    <p class="detail-source-note">${esc(c.horizon.sourceNote)}</p>
  </div>`;
}

function cadPlaceholderV2() {
  return `<div class="cad-placeholder" aria-label="PLACEHOLDER preview"><span class="cad-placeholder-ring ring-one"></span><span class="cad-placeholder-ring ring-two"></span><span class="cad-placeholder-block"></span><span class="cad-placeholder-axis axis-x"></span><span class="cad-placeholder-axis axis-y"></span><em>CAD</em></div>`;
}

function cadPreviewV2(piece, detail) {
  const src = piece.preview || (piece.images || [])[0];
  return src ? renderImageV2(src, v2Value(piece.name), detail ? 'piece-main-image' : 'cad-card-image') : cadPlaceholderV2();
}

function pieceCardV2(piece) {
  const c = v2Copy().cad;
  return `<article class="cad-card" role="article"><button type="button" class="cad-card-button" onclick="openCadPieceV2('${esc(piece.id)}')"><div class="cad-card-preview">${cadPreviewV2(piece, false)}${piece.placeholder ? `<span class="placeholder-badge">${esc(c.placeholder)}</span>` : ''}</div><div class="cad-card-content"><div class="cad-card-top"><span>${esc(piece.software)}</span><span>${esc(piece.year)}</span></div><h2>${esc(v2Value(piece.name))}</h2><p>${esc(v2Value(piece.category))}</p><div class="proj-tags">${v2List(piece.techniques).slice(0, 3).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div><span class="cad-card-link">${esc(c.viewPiece)} ↗</span></div></button></article>`;
}

function pageCadGalleryV2() {
  const c = v2Copy().cad;
  const pieces = v2CadProjects();
  const hasPlaceholders = pieces.some(piece => piece.placeholder);
  $content.innerHTML = `<div class="page-in cad-gallery-page">${detailBackV2(c.back, "goV2('proyectos')")}<p class="page-eyebrow">${esc(c.eyebrow)}</p><h1 class="page-title">${esc(c.title)}</h1><p class="project-section-intro">${esc(c.intro)}</p>${hasPlaceholders ? `<div class="placeholder-notice" role="note"><strong>${esc(c.placeholder)}</strong><span>${esc(c.placeholderNotice)}</span></div>` : ''}<div class="cad-grid-page">${pieces.map(pieceCardV2).join('') || `<p class="empty-state">${esc(c.noPieces)}</p>`}</div></div>`;
}

function modelSourceV2(model) {
  if (!model) return '';
  return typeof model === 'string' ? model : model.src || '';
}

function ensureModelViewerV2() {
  if (document.querySelector('script[data-model-viewer]')) return;
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
  script.dataset.modelViewer = 'true';
  document.head.appendChild(script);
}

function pageCadPieceV2(id) {
  const c = v2Copy().cad;
  const piece = v2CadProjects().find(item => item.id === id);
  if (!piece) return pageCadGalleryV2();
  const additional = [...(piece.additionalImages || []), ...(piece.images || [])].filter((src, index, list) => src && list.indexOf(src) === index);
  const model = modelSourceV2(piece.model3d);
  const optionalDrawing = piece.drawing ? `<section class="optional-media"><h2>${esc(c.drawing)}</h2>${renderImageV2(piece.drawing, c.drawing, 'drawing-image')}</section>` : '';
  const additionalHtml = additional.length ? `<section class="optional-media"><h2>${esc(c.additionalViews)}</h2><div class="detail-media-grid">${additional.map((src, i) => horizonMediaV2(src, `${v2Value(piece.name)} ${i + 1}`, `${v2Value(piece.name)} ${i + 1}`)).join('')}</div></section>` : '';
  const modelHtml = model ? `<section class="optional-media"><h2>${esc(c.model3d)}</h2><model-viewer class="model-viewer" src="${esc(model)}" camera-controls auto-rotate shadow-intensity="0.5" loading="lazy" aria-label="${esc(v2Value(piece.name))}"></model-viewer></section>` : '';
  $content.innerHTML = `<div class="page-in detail-page piece-detail-page">${detailBackV2(c.title, "openCadGalleryV2()")}<div class="piece-detail-header"><div><p class="page-eyebrow">${esc(c.piece)}</p><h1 class="page-title">${esc(v2Value(piece.name))}</h1><p class="detail-subtitle">${esc(piece.software)}</p></div>${piece.placeholder ? `<span class="placeholder-badge large">${esc(c.placeholder)}</span>` : ''}</div><div class="piece-main-grid"><div class="piece-main-frame">${cadPreviewV2(piece, true)}</div><dl class="piece-facts"><div><dt>${esc(c.software)}</dt><dd>${esc(piece.software)}</dd></div><div><dt>${esc(c.year)} / ${esc(c.semester)}</dt><dd>${esc(piece.year)} · ${esc(v2Value(piece.semester))}</dd></div><div><dt>${esc(c.category)}</dt><dd>${esc(v2Value(piece.category))}</dd></div><div><dt>${esc(c.techniques)}</dt><dd>${v2List(piece.techniques).map(technique => `<span class="fact-tag">${esc(technique)}</span>`).join('')}</dd></div></dl></div><section class="detail-section piece-description"><p class="detail-section-index">INFO</p><h2>${esc(c.description)}</h2><p>${esc(v2Value(piece.description))}</p></section>${additionalHtml}${optionalDrawing}${modelHtml}${!model ? `<p class="optional-note">${esc(c.modelUnavailable)}</p>` : ''}</div>`;
  if (model) ensureModelViewerV2();
}

function pageCertsV2() {
  const c = v2Copy().certs;
  const cards = v2Certifications().map(cert => `<article class="cert-card" onclick="openCertModalV2('${esc(cert.id)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){openCertModalV2('${esc(cert.id)}');event.preventDefault();}"><div class="cert-card-cover-wrap">${cert.imageUrl ? renderImageV2(cert.imageUrl, v2Value(cert.title), 'cert-card-cover') : `<div class="cert-fallback"><span>◈</span><span>${esc(cert.issuer)}</span></div>`}<span class="cert-status-badge ${cert.completed ? 'st-live' : 'st-concept'}">${esc(cert.completed ? c.completed : c.inProgress)}</span></div><div class="cert-card-content"><div class="cert-issuer-tag">${esc(cert.issuer)}</div><div class="cert-name">${esc(v2Value(cert.title))}</div><div class="cert-card-footer"><span class="cert-cat">${esc(v2Value(cert.category))}</span><span class="cert-date-val">${esc(v2Value(cert.date))}</span></div></div></article>`).join('');
  $content.innerHTML = `<div class="page-in"><p class="page-eyebrow">${esc(c.eyebrow)}</p><h1 class="page-title">${esc(c.title)}</h1><div class="cert-grid">${cards || `<p class="empty-state">${esc(c.empty)}</p>`}</div></div>`;
}

function openCertModalV2(id) {
  const cert = v2Certifications().find(item => item.id === id);
  if (!cert) return;
  const c = v2Copy().certs;
  $mBody.innerHTML = `${cert.imageUrl ? renderImageV2(cert.imageUrl, v2Value(cert.title), 'cm-img') : ''}<div class="modal-copy"><p class="page-eyebrow">${esc(cert.issuer)}</p><h2>${esc(v2Value(cert.title))}</h2><p>${esc(v2Value(cert.category))} · ${esc(v2Value(cert.date))}</p>${cert.credentialUrl ? `<a class="btn btn-ghost" href="${esc(cert.credentialUrl)}" target="_blank" rel="noopener">${esc(c.viewCredential)} ↗</a>` : ''}</div>`;
  $modal.classList.remove('hidden');
}

function starsV2(rating) { return '★'.repeat(Number(rating) || 0) + '☆'.repeat(5 - (Number(rating) || 0)); }

function pageBooksV2() {
  const c = v2Copy().books;
  const cards = v2Books().map(book => `<article class="book-card" onclick="openBookV2('${esc(book.id)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){openBookV2('${esc(book.id)}');event.preventDefault();}"><div class="book-cover-wrap">${book.coverUrl ? renderImageV2(book.coverUrl, v2Value(book.title), 'book-cover') : `<div class="book-fallback"><span>📖</span></div>`}<div class="book-hover-overlay"><span class="book-hover-stars">${book.rating ? starsV2(book.rating) : esc(c.reading)}</span></div></div></article>`).join('');
  $content.innerHTML = `<div class="page-in"><p class="page-eyebrow">${esc(c.eyebrow)}</p><h1 class="page-title">${esc(c.title)}</h1><div class="books-grid">${cards || `<p class="empty-state">${esc(c.empty)}</p>`}</div></div>`;
}

function openBookV2(id) {
  const book = v2Books().find(item => item.id === id);
  if (!book) return;
  const c = v2Copy().books;
  $content.innerHTML = `<div class="reader page-in">${detailBackV2(c.title, "goV2('libros')")}<p class="reader-eyebrow">${esc(v2List(book.categories).join(' · '))}</p><h1 class="reader-h">${esc(v2Value(book.title))}</h1><div class="reader-meta"><span>${esc(book.author)}</span><span>${book.rating ? starsV2(book.rating) : esc(c.reading)}</span></div><div class="reader-body">${v2Value(book.summary)}</div></div>`;
}

function pageBlogV2() {
  const c = v2Copy().blog;
  const rows = v2Blog().map(post => `<article class="blog-row" onclick="openPostV2('${esc(post.id)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){openPostV2('${esc(post.id)}');event.preventDefault();}"><div class="blog-meta"><span>${esc(v2Value(post.date))}</span><span>${esc(v2Value(post.category))}</span><span>${esc(post.readTime)} ${esc(c.reading)}</span></div><h2 class="blog-row-title">${esc(v2Value(post.title))}</h2><p class="blog-excerpt">${esc(v2Value(post.excerpt))}</p></article>`).join('');
  $content.innerHTML = `<div class="page-in"><p class="page-eyebrow">${esc(c.eyebrow)}</p><h1 class="page-title">${esc(c.title)}</h1><div class="blog-intro"><span class="placeholder-badge">${esc(c.inProgress)}</span><p>${esc(c.intro)}</p><p>${esc(c.topics)}</p></div><div class="blog-list">${rows}</div></div>`;
}

function openPostV2(id) {
  const post = v2Blog().find(item => item.id === id);
  if (!post) return;
  const c = v2Copy().blog;
  $content.innerHTML = `<div class="reader page-in">${detailBackV2(c.back, "goV2('blog')")}<p class="reader-eyebrow">${esc(v2Value(post.category))}</p><h1 class="reader-h">${esc(v2Value(post.title))}</h1><div class="reader-meta"><span>${esc(v2Value(post.date))}</span><span>${esc(post.readTime)} ${esc(c.reading)}</span></div><div class="reader-body">${v2Value(post.content)}</div></div>`;
}

function renderHashV2(updateHash) {
  const raw = (window.location.hash || '').replace(/^#/, '');
  const route = raw || 'inicio';
  if (route === 'horizon-fixture') { tab = 'proyectos'; buildNavV2(); pageHorizonV2(); return; }
  if (route === 'cad-gallery') { tab = 'proyectos'; buildNavV2(); pageCadGalleryV2(); return; }
  if (route.indexOf('cad-piece/') === 0) { tab = 'proyectos'; buildNavV2(); pageCadPieceV2(decodeURIComponent(route.slice('cad-piece/'.length))); return; }
  const valid = ['inicio', 'proyectos', 'certificaciones', 'libros', 'blog'];
  const target = valid.includes(route) ? route : 'inicio';
  tab = target;
  buildNavV2();
  ({ inicio: pageHomeV2, proyectos: pageProjectsV2, certificaciones: pageCertsV2, libros: pageBooksV2, blog: pageBlogV2 }[target])();
  if (updateHash && window.location.hash !== `#${target}`) window.history.replaceState(null, '', `#${target}`);
}

function goV2(route) {
  const target = route || 'inicio';
  if (window.location.hash !== `#${target}`) {
    window.location.hash = target;
  } else {
    renderHashV2(false);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openHorizonV2() { window.location.hash = 'horizon-fixture'; }
function openCadGalleryV2() { window.location.hash = 'cad-gallery'; }
function openCadPieceV2(id) { window.location.hash = `cad-piece/${encodeURIComponent(id)}`; }

// Activate the v2 functions only after the legacy script has initialized its
// DOM references. This keeps the page resilient to old browser storage while
// making the new data-driven renderer the one users see.
pageHome = pageHomeV2;
pageProjects = pageProjectsV2;
pageCerts = pageCertsV2;
pageBooks = pageBooksV2;
pageBlog = pageBlogV2;
buildTopBar = buildTopBarV2;
buildNav = buildNavV2;
applyTheme = applyThemeV2;
toggleTheme = toggleThemeV2;
go = goV2;
window.go = goV2;
window.openHorizonV2 = openHorizonV2;
window.openCadGalleryV2 = openCadGalleryV2;
window.openCadPieceV2 = openCadPieceV2;
window.openCertModalV2 = openCertModalV2;
window.openBookV2 = openBookV2;
window.openPostV2 = openPostV2;
window.addEventListener('hashchange', () => renderHashV2(false));

updateDocumentV2();
applyThemeV2();
buildTopBarV2();
renderHashV2(false);
