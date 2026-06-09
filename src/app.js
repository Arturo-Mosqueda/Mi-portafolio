// src/app.js

// ─── DATA ────────────────────────────────────────────
const DATA_VERSION = 'v10';
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
    { name: 'Microsoft Office 360', detail: 'Nivel intermedio (Mayo 2024 - 2026)' },
    { name: 'Inglés B2', detail: 'En desarrollo y mejora constante' }
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
              CAD_VIEWPORT: ACTIVE<br>
              TARGET: CSWP_SOLIDWORKS<br>
              ROT_X: <span id="cad-rx">AUTO</span>°<br>
              ROT_Y: <span id="cad-ry">AUTO</span>°
            </div>
            <div class="cad-axis">
              <span style="color:#ff4a4a">X-AXIS</span>
              <span style="color:#4aef4a">Y-AXIS</span>
              <span style="color:#4a90ff">Z-AXIS</span>
            </div>
            <div class="cad-object-wrap">
              <div class="cad-object">
                <div class="face front"></div>
                <div class="face back"></div>
                <div class="face left"></div>
                <div class="face right"></div>
                <div class="face top"></div>
                <div class="face bottom"></div>
              </div>
            </div>
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
          <span class="stat-num">${certifications.length}</span>
          <span class="stat-label">Certificaciones</span>
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

  // Inicializar visor 3D interactivo
  initCadRotation();
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
            <span class="proj-status ${st.cls}">${st.label}</span>
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
  const cards = books.map(b => `
    <div class="book-card" onclick="openBook('${esc(b.id)}')">
      <div class="book-cover-wrap">
        ${b.coverUrl ? `<img src="${esc(b.coverUrl)}" class="book-cover" alt="${esc(b.title)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
        <div class="book-fallback" style="display: ${b.coverUrl ? 'none' : 'flex'};">
          <span>📖</span>
          <span class="bf-title">${esc(b.title)}</span>
        </div>
      </div>
      <div class="book-title">${esc(b.title)}</div>
      <div class="book-author">${esc(b.author)}</div>
      <div class="book-stars">${stars(b.rating)}</div>
    </div>
  `).join('');

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
  const rows = blog.map(p => `
    <div class="blog-row" onclick="openPost('${esc(p.id)}')">
      <div class="blog-meta">
        <span>${esc(p.category)}</span>
        <span>${esc(p.date)}</span>
        <span>${esc(p.readTime)} lectura</span>
      </div>
      <div class="blog-row-title">${esc(p.title)}</div>
      <div class="blog-excerpt">${esc(p.excerpt)}</div>
    </div>
  `).join('');

  $content.innerHTML = `
    <div class="page-in">
      <p class="page-eyebrow">Escritos</p>
      <h1 class="page-title" style="font-size:clamp(1.8rem,4vw,3rem);">Blog</h1>
      <div class="blog-list" style="margin-top:2rem;">${rows || '<p style="color:var(--fg-3);font-size:.83rem;">Sin entradas publicadas.</p>'}</div>
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
  const obj = document.querySelector('.cad-object-wrap');
  if (!vp || !obj) return;
  
  vp.addEventListener('mousemove', (e) => {
    obj.style.animation = 'none';
    const rect = vp.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    const rotX = -(y / rect.height) * 85;
    const rotY = (x / rect.width) * 85;
    obj.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    
    const $rx = document.getElementById('cad-rx');
    const $ry = document.getElementById('cad-ry');
    if ($rx) $rx.textContent = Math.round(rotX);
    if ($ry) $ry.textContent = Math.round(rotY);
  });
  
  vp.addEventListener('mouseleave', () => {
    obj.style.transform = '';
    obj.style.animation = 'rotateCad 15s linear infinite';
    const $rx = document.getElementById('cad-rx');
    const $ry = document.getElementById('cad-ry');
    if ($rx) $rx.textContent = 'AUTO';
    if ($ry) $ry.textContent = 'AUTO';
  });
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
