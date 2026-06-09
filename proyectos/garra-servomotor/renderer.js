/**
 * renderer.js — Orbit camera + 3D arm + workspace objects
 */

/* ===== ORBIT VIEW STATE ===== */
const ctrlView = { az: -0.5, el: 0.55, dragging: false };
const simView  = { az:  0.5, el: 0.50, dragging: false };

/* ===== ORBIT PROJECTION ===== */
function orbitProj(x, y, z, cx, cy, view, sc) {
  const cA = Math.cos(view.az), sA = Math.sin(view.az);
  const cE = Math.cos(view.el), sE = Math.sin(view.el);
  const sx = x * (-sA) + y * cA;
  const sy = x * (-sE * cA) + y * (-sE * sA) + z * cE;
  return { x: cx + sx * sc, y: cy - sy * sc };
}

/* ===== ORBIT CONTROLS ===== */
function initOrbitControls(canvas, view, onClickCB) {
  let startX = 0, startY = 0, moved = false;
  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    startX = e.clientX; startY = e.clientY; moved = false; view.dragging = true;
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('mousemove', e => {
    if (!view.dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    if (moved) {
      view.az -= dx * 0.009;
      view.el = Math.max(0.08, Math.min(1.45, view.el + dy * 0.009));
      startX = e.clientX; startY = e.clientY;
    }
  });
  window.addEventListener('mouseup', e => {
    if (view.dragging && !moved && onClickCB) onClickCB(e, canvas);
    view.dragging = false; canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    moved = false; view.dragging = true; e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (!view.dragging) return;
    const dx = e.touches[0].clientX - startX, dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    if (moved) {
      view.az -= dx * 0.009; view.el = Math.max(0.08, Math.min(1.45, view.el + dy * 0.009));
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchend', () => { view.dragging = false; });
  canvas.style.cursor = 'grab';
}

/* ===== PALETTES ===== */
const CTRL_PAL = { col:'#1e4060', arm1:'#00d4ff', arm2:'#7c3aed', grip:'#10b981', ee:'#f59e0b' };
const SIM_PAL  = { col:'#3a2800', arm1:'#f59e0b', arm2:'#ef4444', grip:'#10b981', ee:'#ffffff' };

/* ===== WORKSPACE OBJECTS (3D boxes + platform) ===== */
const WS_OBJECTS = [
  { x: 100, y:  20, z: 0, w: 22, d: 22, h: 22, color: '#ef4444', label: 'A' },
  { x: -75, y:  65, z: 0, w: 18, d: 18, h: 18, color: '#10b981', label: 'B' },
  { x:  65, y: -70, z: 0, w: 20, d: 20, h: 28, color: '#f59e0b', label: 'C' },
];
const TABLE = { x: -110, y: -110, w: 220, d: 220 };

/* ===== PUBLIC API ===== */
function drawControlArm(canvas, t1, t2, t3, targetPt) {
  _drawArm(canvas, t1, t2, t3, CTRL_PAL, ctrlView, false);
  if (targetPt) _drawTarget(canvas, targetPt, ctrlView);
}
function drawSimArm(canvas, t1, t2, t3) {
  _drawArm(canvas, t1, t2, t3, SIM_PAL, simView, true);
}

/* ===== CORE RENDERER ===== */
function _drawArm(canvas, t1, t2, t3, pal, view, isSimulator) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 + 15, sc = 0.88;
  const P = (x, y, z) => orbitProj(x, y, z, cx, cy, view, sc);

  const { p0, p1, p2, p3 } = forwardKinematics3D(t1, t2, t3);
  const q0 = P(p0.x, p0.y, p0.z), q1 = P(p1.x, p1.y, p1.z);
  const q2 = P(p2.x, p2.y, p2.z), q3 = P(p3.x, p3.y, p3.z);

  _drawFloor(ctx, cx, cy, view, sc);
  _drawTable(ctx, cx, cy, view, sc, pal);
  _drawWorkspaceObjects(ctx, cx, cy, view, sc, isSimulator);
  _drawAxes(ctx, cx, cy, view, sc);
  _drawRotDisc(ctx, q0, t1, cx, cy, view, sc, pal.arm1);

  // Links
  _link(ctx, q0, q1, pal.col, 7);
  _link(ctx, q1, q2, pal.arm1, 11);
  _link(ctx, q2, q3, pal.arm2, 9);
  _gripper(ctx, q2, q3, t3, pal.grip);

  // Joints
  _joint(ctx, q0, 13, pal.arm1);
  _joint(ctx, q1, 10, pal.arm1);
  _joint(ctx, q2, 8, pal.arm2);

  // EE
  ctx.save();
  ctx.fillStyle = pal.ee; ctx.shadowColor = pal.ee; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(q3.x, q3.y, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Labels
  ctx.save();
  ctx.font = 'bold 9px "JetBrains Mono"';
  ctx.fillStyle = pal.arm1; ctx.fillText(`θ₁=${t1.toFixed(0)}°`, 6, 14);
  ctx.fillStyle = pal.arm2; ctx.fillText(`θ₂=${t2.toFixed(0)}°`, 6, 26);
  ctx.fillStyle = pal.grip; ctx.fillText(`θ₃=${t3.toFixed(0)}°`, 6, 38);
  ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.font = '8px Inter';
  ctx.fillText('⟳ Arrastrar para rotar', 6, H - 8);
  ctx.restore();
}

/* ===== TABLE / BASE PLATFORM ===== */
function _drawTable(ctx, cx, cy, view, sc, pal) {
  const { x, y, w, d } = TABLE;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  const corners = [
    orbitProj(x, y, 0, cx, cy, view, sc),
    orbitProj(x+w, y, 0, cx, cy, view, sc),
    orbitProj(x+w, y+d, 0, cx, cy, view, sc),
    orbitProj(x, y+d, 0, cx, cy, view, sc),
  ];
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  corners.forEach(c => ctx.lineTo(c.x, c.y));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/* ===== WORKSPACE OBJECTS ===== */
function _drawWorkspaceObjects(ctx, cx, cy, view, sc, isSimulator) {
  WS_OBJECTS.forEach(obj => {
    _drawBox3D(ctx, cx, cy, view, sc, obj.x, obj.y, obj.z, obj.w, obj.d, obj.h, obj.color, obj.label, isSimulator);
  });
  // Cylinder target point
  _drawCylinder3D(ctx, cx, cy, view, sc, 0, 110, 0, 12, 25, '#7c3aed');
}

function _drawBox3D(ctx, cx, cy, view, sc, bx, by, bz, bw, bd, bh, color, label, isSimulator) {
  const P = (x, y, z) => orbitProj(x, y, z, cx, cy, view, sc);
  // 8 corners
  const c = [
    P(bx,    by,    bz),   P(bx+bw, by,    bz),
    P(bx+bw, by+bd, bz),   P(bx,    by+bd, bz),
    P(bx,    by,    bz+bh), P(bx+bw, by,    bz+bh),
    P(bx+bw, by+bd, bz+bh), P(bx,   by+bd, bz+bh),
  ];
  const hex = color + '30';
  ctx.save();
  // Top face
  ctx.fillStyle = color + '50'; ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.shadowColor = color; ctx.shadowBlur = 6;
  [
    [4,5,6,7], // top
    [0,1,5,4], // front
    [1,2,6,5], // right
  ].forEach(face => {
    ctx.beginPath();
    ctx.moveTo(c[face[0]].x, c[face[0]].y);
    face.forEach(i => ctx.lineTo(c[i].x, c[i].y));
    ctx.closePath(); ctx.fill(); ctx.stroke();
  });
  // Label
  const top = c[4]; ctx.shadowBlur = 0;
  ctx.fillStyle = color; ctx.font = 'bold 8px "JetBrains Mono"';
  ctx.fillText(label, top.x - 4, top.y - 4);
  ctx.restore();
}

function _drawCylinder3D(ctx, cx, cy, view, sc, ox, oy, oz, r, h, color) {
  const P = (x, y, z) => orbitProj(x, y, z, cx, cy, view, sc);
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.shadowColor = color; ctx.shadowBlur = 8;
  ctx.fillStyle = color + '30';
  // Top circle
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.2) {
    const p = P(ox + r * Math.cos(a), oy + r * Math.sin(a), oz + h);
    a === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Side lines
  [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach(a => {
    const bot = P(ox + r * Math.cos(a), oy + r * Math.sin(a), oz);
    const top = P(ox + r * Math.cos(a), oy + r * Math.sin(a), oz + h);
    ctx.beginPath(); ctx.moveTo(bot.x, bot.y); ctx.lineTo(top.x, top.y); ctx.stroke();
  });
  ctx.fillStyle = color; ctx.font = 'bold 8px "JetBrains Mono"';
  const lbl = P(ox, oy, oz + h + 8);
  ctx.fillText('TGT', lbl.x - 10, lbl.y);
  ctx.restore();
}

/* ===== TARGET POINT ===== */
function _drawTarget(canvas, tp, view) {
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2, cy = canvas.height / 2 + 15;
  const p = orbitProj(tp.x || 0, tp.y || 0, tp.z || 0, cx, cy, view, 0.88);
  ctx.save();
  ctx.strokeStyle = '#f59e0b'; ctx.fillStyle = 'rgba(245,158,11,0.15)';
  ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/* ===== FLOOR GRID ===== */
function _drawFloor(ctx, cx, cy, view, sc) {
  ctx.save();
  ctx.strokeStyle = 'rgba(0,212,255,0.04)'; ctx.lineWidth = 0.5;
  const N = 5, step = 30;
  for (let i = -N; i <= N; i++) {
    const a = orbitProj(i*step, -N*step, 0, cx, cy, view, sc);
    const b = orbitProj(i*step,  N*step, 0, cx, cy, view, sc);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    const c = orbitProj(-N*step, i*step, 0, cx, cy, view, sc);
    const d = orbitProj( N*step, i*step, 0, cx, cy, view, sc);
    ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.stroke();
  }
  ctx.restore();
}

/* ===== AXES ===== */
function _drawAxes(ctx, cx, cy, view, sc) {
  const o = orbitProj(0, 0, 0, cx, cy, view, sc);
  const L = 50;
  [
    { e: orbitProj(L,0,0,cx,cy,view,sc), col:'rgba(239,68,68,0.6)',  lb:'X' },
    { e: orbitProj(0,L,0,cx,cy,view,sc), col:'rgba(16,185,129,0.6)', lb:'Y' },
    { e: orbitProj(0,0,L,cx,cy,view,sc), col:'rgba(0,212,255,0.6)',  lb:'Z' },
  ].forEach(({ e, col, lb }) => {
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(e.x, e.y); ctx.stroke();
    ctx.fillStyle = col; ctx.font = '9px Orbitron'; ctx.fillText(lb, e.x+3, e.y+4);
    ctx.restore();
  });
}

/* ===== BASE ROTATION DISC ===== */
function _drawRotDisc(ctx, q0, t1_deg, cx, cy, view, sc, color) {
  const t1 = toRad(t1_deg);
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = 0.28;
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.12) {
    const p = orbitProj(22 * Math.cos(a), 22 * Math.sin(a), 0, cx, cy, view, sc);
    a === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath(); ctx.stroke();
  ctx.globalAlpha = 1;
  const dEnd = orbitProj(34 * Math.cos(t1), 34 * Math.sin(t1), 0, cx, cy, view, sc);
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(dEnd.x, dEnd.y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = color + '28'; ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = 1;
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) {
    const p = orbitProj(18 * Math.cos(a), 18 * Math.sin(a), 2, cx, cy, view, sc);
    a === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/* ===== LINK ===== */
function _link(ctx, a, b, color, w) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = 14;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.restore();
}

/* ===== JOINT ===== */
function _joint(ctx, pos, r, color) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = color; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = '#050810';
  ctx.beginPath(); ctx.arc(pos.x, pos.y, r - 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/* ===== GRIPPER ===== */
function _gripper(ctx, from, to, t3, color) {
  const spread = 6 + Math.abs(t3) / 90 * 10;
  const dx = to.x - from.x, dy = to.y - from.y;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const nx = -dy / len, ny = dx / len;
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.shadowColor = color; ctx.shadowBlur = 8;
  [1, -1].forEach(s => {
    const tip  = { x: to.x + nx * spread * s, y: to.y + ny * spread * s };
    const tipE = { x: tip.x + dx * 0.36, y: tip.y + dy * 0.36 };
    ctx.beginPath(); ctx.moveTo(to.x, to.y); ctx.lineTo(tip.x, tip.y); ctx.lineTo(tipE.x, tipE.y); ctx.stroke();
  });
  ctx.restore();
}

/* ===== PWM ===== */
function drawPWM(canvas, t1, t2, t3) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const rows = [
    { angle: t1, color: '#00d4ff', label: 'S1', min: -180, max: 180 },
    { angle: t2, color: '#7c3aed', label: 'S2', min: -90,  max: 90  },
    { angle: t3, color: '#10b981', label: 'S3', min: -90,  max: 90  },
  ];
  const rowH = H / 3, period = W - 68;
  rows.forEach((s, i) => {
    const y = i * rowH;
    const pwm = angleToPWM(s.angle, s.min, s.max);
    const hw = (pwm / 20000) * period;
    ctx.fillStyle = i % 2 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.01)';
    ctx.fillRect(0, y, W, rowH);
    ctx.save();
    ctx.font = 'bold 9px "JetBrains Mono"';
    ctx.fillStyle = s.color; ctx.fillText(s.label, 4, y + rowH/2 + 4);
    ctx.fillStyle = 'rgba(100,116,139,0.8)'; ctx.fillText(pwm+'µs', 24, y + rowH/2 + 4);
    const ylo = y + rowH - 5, yhi = y + 5, x0 = 68;
    ctx.strokeStyle = s.color; ctx.lineWidth = 1.5;
    ctx.shadowColor = s.color; ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(x0, ylo); ctx.lineTo(x0, yhi); ctx.lineTo(x0+hw, yhi);
    ctx.lineTo(x0+hw, ylo); ctx.lineTo(x0+period, ylo); ctx.stroke();
    ctx.restore();
  });
}

function isoProject(x, y, z, cx, cy, scale) {
  return orbitProj(x, y, z, cx, cy, { az: Math.PI/6, el: Math.PI/5 }, scale);
}
