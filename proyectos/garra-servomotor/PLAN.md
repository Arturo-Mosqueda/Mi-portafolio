# Plan — v3 Completo

## Features a implementar
1. Objetos 3D en workspace (mesa + cajas + cilindro)
2. Movimiento secuencial en sim arm (θ₁ → θ₂ → θ₃)
3. Spring más lento (K=0.04, D=0.87)
4. Replay de movimientos ejecutados
5. UI Pro: glassmorphism, SVG icons, smooth transitions

## Workspace objects (renderer.js)
Dibujar en AMBOS canvas:
- Mesa/plataforma base: rectángulo en Z=0, x=[-80,80], y=[-80,80]
- Caja roja en (100, 20, 0) — 20x20x20
- Caja verde en (-80, 60, 0) — 20x20x20  
- Caja amarilla en (60, -70, 0) — 20x20x20
- Cilindro en (0, 100, 0) — radio 12, h=30

## Sequential movement (app.js)
```js
const Seq = { phase:'idle', steps:[], idx:0 };
const THRESH = 1.5; // degrees convergence

function startSeqMove(t1, t2, t3) {
  Seq.steps = [
    { t1, t2: Spr.t2, t3: Spr.t3 },  // 1) solo base
    { t1, t2, t3: Spr.t3 },            // 2) hombro
    { t1, t2, t3 },                    // 3) codo
  ];
  Seq.idx = 0; Seq.phase = 'moving';
  pushSeqStep();
}

function pushSeqStep() {
  const s = Seq.steps[Seq.idx];
  SimTarget.t1=s.t1; SimTarget.t2=s.t2; SimTarget.t3=s.t3;
  logSerial(`[${Seq.idx+1}/3] θ₁=${s.t1.toFixed(0)} θ₂=${s.t2.toFixed(0)} θ₃=${s.t3.toFixed(0)}`,'traj');
}

function tickSeq() {
  if(Seq.phase!=='moving') return;
  const s=Seq.steps[Seq.idx];
  const done = Math.abs(s.t1-Spr.t1)<THRESH && Math.abs(s.t2-Spr.t2)<THRESH && Math.abs(s.t3-Spr.t3)<THRESH;
  if(done){ Seq.idx++; if(Seq.idx<Seq.steps.length) pushSeqStep(); else { Seq.phase='idle'; logSerial('✓ Secuencia completada','sys'); }}
}
```

## Replay
```js
const ExecLog = []; // {t1,t2,t3}[]
// On execute: ExecLog.push({t1,t2,t3})
// Replay btn: iterate ExecLog with sequential moves
```

## Slow spring
SPR_K = 0.04, SPR_D = 0.87

## UI Pro (skill guidelines)
- Glassmorphism: backdrop-filter:blur(14px)
- Botones: transition all 200ms, border-radius:8px
- Cards: border + box-shadow glow
- Sin emojis: usar unicode symbols (⬡ ◈ ▷)
- Canvas borders: neon glow subtle
- Sliders: custom CSS width track/thumb
- Status pills: animated dot
