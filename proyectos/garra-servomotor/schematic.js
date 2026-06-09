/**
 * schematic.js — Protoboard-style electronic schematic
 * Canvas: 420 x 280
 */

function drawSchematic(canvas, mcuType) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Dark background
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  drawProtoboard(ctx, W, H);
  drawPowerRails(ctx);
  drawHoleGrid(ctx);

  if (mcuType === 'pic') {
    drawPICChipOnBoard(ctx);
  } else {
    drawArduinoOnBoard(ctx);
  }

  drawServoHeaders(ctx);
  drawBoardWires(ctx, mcuType);
  drawPCBlock(ctx);
  drawBoardLegend(ctx, W, H, mcuType);
}

/* ===== PROTOBOARD BASE ===== */
function drawProtoboard(ctx, W, H) {
  // Board body
  ctx.save();
  const brd = { x: 10, y: 12, w: 400, h: 220, r: 8 };
  ctx.fillStyle = '#d4b896';
  ctx.strokeStyle = '#b89a6a';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12;
  _rrect(ctx, brd.x, brd.y, brd.w, brd.h, brd.r);
  ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;

  // Board texture overlay
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  _rrect(ctx, brd.x, brd.y, brd.w, brd.h, brd.r);
  ctx.fill();

  // Center gap separator
  ctx.fillStyle = '#b89a6a';
  ctx.fillRect(30, 112, 360, 8);

  // Board label
  ctx.fillStyle = 'rgba(100,70,30,0.5)';
  ctx.font = '7px "JetBrains Mono"';
  ctx.fillText('PROTOBOARD 830pts', 14, 245);
  ctx.restore();
}

/* ===== POWER RAILS ===== */
function drawPowerRails(ctx) {
  ctx.save();
  // VCC rail (top)
  ctx.fillStyle = 'rgba(220,38,38,0.25)';
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1;
  ctx.fillRect(30, 18, 360, 14);
  ctx.strokeRect(30, 18, 360, 14);
  // Rail dots
  for (let x = 38; x < 390; x += 10) {
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath(); ctx.arc(x, 25, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 8px "JetBrains Mono"';
  ctx.fillText('+5V', 396, 29);

  // GND rail (bottom)
  ctx.fillStyle = 'rgba(30,58,138,0.25)';
  ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1;
  ctx.fillRect(30, 198, 360, 14);
  ctx.strokeRect(30, 198, 360, 14);
  for (let x = 38; x < 390; x += 10) {
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath(); ctx.arc(x, 205, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 8px "JetBrains Mono"';
  ctx.fillText('GND', 396, 209);
  ctx.restore();
}

/* ===== HOLE GRID ===== */
function drawHoleGrid(ctx) {
  ctx.save();
  ctx.fillStyle = '#8a7050';
  // Top half: rows 1-5 (y 40-105)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 30; col++) {
      const x = 38 + col * 12;
      const y = 42 + row * 13;
      ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Bottom half: rows 6-10 (y 122-165)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 30; col++) {
      const x = 38 + col * 12;
      const y = 124 + row * 13;
      ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

/* ===== ARDUINO CHIP ON BOARD ===== */
function drawArduinoOnBoard(ctx) {
  // DIP-style chip straddling the gap
  ctx.save();
  const cx = 55, cy = 42, cw = 100, ch = 130;

  // Chip body
  ctx.fillStyle = '#1a2a1a';
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5;
  ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 8;
  _rrect(ctx, cx, cy, cw, ch, 4);
  ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

  // Chip notch
  ctx.fillStyle = '#1a2a1a'; ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx + cw / 2, cy, 5, 0, Math.PI); ctx.fill(); ctx.stroke();

  // Label
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 8px Orbitron';
  ctx.fillText('ARDUINO', cx + 10, cy + 20);
  ctx.fillStyle = 'rgba(34,197,94,0.6)'; ctx.font = '7px Orbitron';
  ctx.fillText('UNO R3', cx + 10, cy + 32);

  // Pin labels (right side = outputs D9,D10,D11)
  const rPins = [
    { label: 'D9',  color: '#00d4ff', y: cy + 50 },
    { label: 'D10', color: '#7c3aed', y: cy + 66 },
    { label: 'D11', color: '#10b981', y: cy + 82 },
    { label: 'TX',  color: '#f59e0b', y: cy + 98 },
    { label: 'RX',  color: '#f59e0b', y: cy + 114 },
  ];
  rPins.forEach(p => {
    ctx.fillStyle = p.color; ctx.font = '7px "JetBrains Mono"';
    ctx.fillText(p.label, cx + cw - 22, p.y + 4);
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(cx + cw + 4, p.y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  });

  // USB port on left
  ctx.fillStyle = '#2a3a2a'; ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1;
  _rrect(ctx, cx - 14, cy + 52, 14, 20, 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(34,197,94,0.5)'; ctx.font = '6px "JetBrains Mono"';
  ctx.fillText('USB', cx - 13, cy + 66);

  ctx.restore();
}

/* ===== PIC CHIP ON BOARD ===== */
function drawPICChipOnBoard(ctx) {
  ctx.save();
  const cx = 55, cy = 42, cw = 100, ch = 130;

  ctx.fillStyle = '#1a1030';
  ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5;
  ctx.shadowColor = '#7c3aed'; ctx.shadowBlur = 8;
  _rrect(ctx, cx, cy, cw, ch, 4);
  ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

  ctx.fillStyle = '#1a1030'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx + cw / 2, cy, 5, 0, Math.PI); ctx.fill(); ctx.stroke();

  ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 7px Orbitron';
  ctx.fillText('PIC18F4550', cx + 6, cy + 18);

  const rPins = [
    { label: 'CCP1', color: '#00d4ff', y: cy + 50 },
    { label: 'CCP2', color: '#7c3aed', y: cy + 66 },
    { label: 'RC0',  color: '#10b981', y: cy + 82 },
    { label: 'TX',   color: '#f59e0b', y: cy + 98 },
    { label: 'D+',   color: '#0ea5e9', y: cy + 114 },
  ];
  rPins.forEach(p => {
    ctx.fillStyle = p.color; ctx.font = '7px "JetBrains Mono"';
    ctx.fillText(p.label, cx + cw - 26, p.y + 4);
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(cx + cw + 4, p.y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Crystal
  ctx.fillStyle = '#2a2020'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1;
  _rrect(ctx, cx + 10, cy + 135, 60, 14, 3);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f59e0b'; ctx.font = '7px "JetBrains Mono"';
  ctx.fillText('20MHz XTAL', cx + 12, cy + 145);

  ctx.restore();
}

/* ===== SERVO HEADERS (3-pin blocks) ===== */
function drawServoHeaders(ctx) {
  const servos = [
    { y: 45,  color: '#00d4ff', label: 'SV1', name: 'θ₁ Base' },
    { y: 105, color: '#7c3aed', label: 'SV2', name: 'θ₂ Brazo' },
    { y: 160, color: '#10b981', label: 'SV3', name: 'θ₃ Garra' },
  ];

  servos.forEach(s => {
    ctx.save();
    const x = 300;

    // Servo body (motor illustration)
    ctx.fillStyle = '#1a1a2e';
    ctx.strokeStyle = s.color; ctx.lineWidth = 1.5;
    ctx.shadowColor = s.color; ctx.shadowBlur = 6;
    _rrect(ctx, x, s.y, 90, 50, 5);
    ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

    // Servo horn circle
    ctx.fillStyle = s.color; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(x + 18, s.y + 14, 10, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.strokeStyle = s.color; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x + 18, s.y + 14, 10, 0, Math.PI * 2); ctx.stroke();

    // Labels
    ctx.fillStyle = s.color; ctx.font = 'bold 7px Orbitron';
    ctx.fillText(s.label, x + 32, s.y + 12);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '7px "JetBrains Mono"';
    ctx.fillText(s.name, x + 32, s.y + 22);

    // 3-pin connector
    const pins = [
      { dx: 4,  color: '#ef4444',  tip: 'VCC' },
      { dx: 14, color: '#64748b',  tip: 'GND' },
      { dx: 24, color: s.color,    tip: 'SIG' },
    ];
    pins.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(x + p.dx, s.y + 38, 8, 12);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.5;
      ctx.strokeRect(x + p.dx, s.y + 38, 8, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '5px "JetBrains Mono"';
      ctx.fillText(p.tip, x + p.dx - 1, s.y + 62);
    });

    ctx.restore();
  });
}

/* ===== CONNECTING WIRES ===== */
function drawBoardWires(ctx, mcuType) {
  // MCU pin x position (right edge of chip)
  const mcuPinX = 159;
  const servoX = 304; // servo signal pin x

  const signals = [
    { mcuY: 92,  svY: 55,  svPinX: 316, color: '#00d4ff' }, // S1 signal
    { mcuY: 108, svY: 115, svPinX: 316, color: '#7c3aed' }, // S2 signal
    { mcuY: 124, svY: 170, svPinX: 316, color: '#10b981' }, // S3 signal
  ];

  ctx.save();
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  signals.forEach(s => {
    // Signal wire (follows board column paths)
    ctx.strokeStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 4;
    _wire(ctx, mcuPinX, s.mcuY, s.svPinX, s.svY);
    // Signal label along wire
    ctx.fillStyle = s.color; ctx.font = '7px "JetBrains Mono"'; ctx.shadowBlur = 0;
    ctx.fillText('PWM', mcuPinX + 14, s.mcuY - 3);
  });

  // VCC wires (red — from rail y=25 to servo VCC)
  ctx.strokeStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 3;
  [55, 115, 170].forEach(svY => {
    _wire(ctx, 80, 25, 304, svY + 43);
  });

  // GND wires (dark blue)
  ctx.strokeStyle = '#3b82f6'; ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 3;
  [55, 115, 170].forEach(svY => {
    _wire(ctx, 110, 205, 314, svY + 43);
  });

  // USB wire from PC to MCU
  ctx.strokeStyle = '#0ea5e9'; ctx.shadowColor = '#0ea5e9'; ctx.shadowBlur = 4;
  ctx.setLineDash([4, 3]);
  _wire(ctx, 18, 248, 68, 108);
  ctx.setLineDash([]);

  ctx.restore();
}

/* ===== PC BLOCK ===== */
function drawPCBlock(ctx) {
  ctx.save();
  _rrect(ctx, 10, 238, 56, 32, 4);
  ctx.fillStyle = '#0d1526'; ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 1;
  ctx.shadowColor = '#0ea5e9'; ctx.shadowBlur = 6;
  ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#0ea5e9'; ctx.font = 'bold 8px Orbitron';
  ctx.fillText('PC', 30, 252);
  ctx.fillStyle = 'rgba(14,165,233,0.5)'; ctx.font = '7px "JetBrains Mono"';
  ctx.fillText('USB 9600bd', 12, 264);
  ctx.restore();
}

/* ===== LEGEND ===== */
function drawBoardLegend(ctx, W, H, mcu) {
  ctx.save();
  const items = [
    { color: '#ef4444', label: '+5V' },
    { color: '#3b82f6', label: 'GND' },
    { color: '#00d4ff', label: 'PWM θ₁' },
    { color: '#7c3aed', label: 'PWM θ₂' },
    { color: '#10b981', label: 'PWM θ₃' },
    { color: '#0ea5e9', label: 'USB/Serial' },
  ];
  const lx = 175, ly = 240;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(lx - 4, ly - 10, 230, 28);
  items.forEach((it, i) => {
    const x = lx + i * 38;
    ctx.fillStyle = it.color;
    ctx.fillRect(x, ly - 4, 14, 5);
    ctx.font = '6px "JetBrains Mono"'; ctx.fillText(it.label, x, ly + 8);
  });
  ctx.restore();
}

/* ===== HELPERS ===== */
function _rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

function _wire(ctx, x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
  ctx.stroke();
}
