/** app.js — Sequential movement + Replay + Spring slow */

const State = {
  theta1: 0, theta2: 30, theta3: -20,
  connected: false, mcu: 'arduino', activeTab: 'arduino', activeModalTab: 'arduino',
  targetPt: null, animating: false, trajQueue: [], trajIndex: 0,
};

const SimTarget = { t1: 0, t2: 30, t3: -20 };
const Spr = { t1: 0, t2: 30, t3: -20, v1: 0, v2: 0, v3: 0 };
const SPR_K = 0.04, SPR_D = 0.87; // slow, smooth

/* ===== SEQUENTIAL MOVEMENT ===== */
const Seq = { phase: 'idle', steps: [], idx: 0 };
const SEQ_THRESH = 1.2;

function startSeqMove(t1, t2, t3) {
  Seq.steps = [
    { t1, t2: Spr.t2, t3: Spr.t3 },
    { t1, t2, t3: Spr.t3 },
    { t1, t2, t3 },
  ];
  Seq.idx = 0; Seq.phase = 'moving';
  _pushSeqStep();
}

function _pushSeqStep() {
  const s = Seq.steps[Seq.idx];
  SimTarget.t1 = s.t1; SimTarget.t2 = s.t2; SimTarget.t3 = s.t3;
  const names = ['Base θ₁', 'Hombro θ₂', 'Codo θ₃'];
  logSerial(`[${Seq.idx+1}/3] ${names[Seq.idx]}: ${s.t1.toFixed(0)}°, ${s.t2.toFixed(0)}°, ${s.t3.toFixed(0)}°`, 'traj');
  document.getElementById('status-text').textContent = `PASO ${Seq.idx+1}/3`;
}

function tickSeq() {
  if (Seq.phase !== 'moving') return;
  const s = Seq.steps[Seq.idx];
  const done = Math.abs(s.t1 - Spr.t1) < SEQ_THRESH &&
               Math.abs(s.t2 - Spr.t2) < SEQ_THRESH &&
               Math.abs(s.t3 - Spr.t3) < SEQ_THRESH;
  if (done) {
    Seq.idx++;
    if (Seq.idx < Seq.steps.length) _pushSeqStep();
    else { Seq.phase = 'idle'; logSerial('Secuencia completada ✓', 'sys'); document.getElementById('status-text').textContent = 'LISTO'; }
  }
}

/* ===== REPLAY LOG ===== */
const ExecLog = [];
let replayIdx = -1;

function recordExec(t1, t2, t3) {
  ExecLog.push({ t1, t2, t3 });
  document.getElementById('replay-count').textContent = ExecLog.length;
  document.getElementById('btn-replay').disabled = false;
}

function startReplay() {
  if (!ExecLog.length) return;
  replayIdx = 0;
  _doReplayStep();
  logSerial(`Replay: ${ExecLog.length} movimientos`, 'traj');
}

function _doReplayStep() {
  if (replayIdx >= ExecLog.length) { replayIdx = -1; logSerial('Replay completado', 'sys'); return; }
  const m = ExecLog[replayIdx];
  syncSliders(m.t1, m.t2, m.t3);
  startSeqMove(m.t1, m.t2, m.t3);
  // advance after estimated time
  const est = ExecLog.length > 0 ? 2200 : 1500;
  setTimeout(() => { replayIdx++; _doReplayStep(); }, est);
}

/* ===== SPRING ===== */
function tickSpring() {
  ['t1','t2','t3'].forEach((k, i) => {
    const vk = 'v' + (i+1);
    Spr[vk] += (SimTarget[k] - Spr[k]) * SPR_K;
    Spr[vk] *= SPR_D;
    Spr[k]  += Spr[vk];
  });
}

function sprDist() {
  return Math.abs(SimTarget.t1-Spr.t1)+Math.abs(SimTarget.t2-Spr.t2)+Math.abs(SimTarget.t3-Spr.t3);
}

/* ===== CANVAS REFS ===== */
const controlCanvas   = document.getElementById('control-canvas');
const simCanvas       = document.getElementById('sim-canvas');
const schematicCanvas = document.getElementById('schematic-canvas');
const pwmCanvas       = document.getElementById('pwm-canvas');

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  initSliders(); initTargetInput(); initTrajectoryButtons();
  initConnectionButton(); initExecuteButton(); initReplayButton();
  initSerialMonitor(); initCodeTabs(); initMCUSelect();
  initCodeModal(); initSchematicClick();
  initOrbitControls(controlCanvas, ctrlView, onControlCanvasClick);
  initOrbitControls(simCanvas, simView, null);
  render();
  drawSchematic(schematicCanvas, State.mcu);
  updateCode();
  logSerial('Sistema iniciado. MCU: Arduino UNO', 'sys');
  logSerial('Click en el chip del esquematico para ver codigo', 'sys');
});

/* ===== RENDER LOOP ===== */
function render() {
  tickSpring();
  tickSeq();
  const { theta1, theta2, theta3, targetPt } = State;
  drawControlArm(controlCanvas, theta1, theta2, theta3, targetPt);
  drawSimArm(simCanvas, Spr.t1, Spr.t2, Spr.t3);
  drawPWM(pwmCanvas, Spr.t1, Spr.t2, Spr.t3);
  updateIKFlow(theta1, theta2, theta3);
  updateServoStatus(Spr.t1, Spr.t2, Spr.t3);
  updateEEPos(Spr.t1, Spr.t2, Spr.t3);

  if (State.animating && sprDist() < 4) {
    State.trajIndex++;
    if (State.trajIndex < State.trajQueue.length) {
      const wp = State.trajQueue[State.trajIndex];
      syncSliders(wp.theta1, wp.theta2, wp.theta3);
      SimTarget.t1 = wp.theta1; SimTarget.t2 = wp.theta2; SimTarget.t3 = wp.theta3;
    } else {
      State.animating = false;
      document.querySelectorAll('.btn-traj').forEach(b => b.classList.remove('active'));
      document.getElementById('status-text').textContent = 'LISTO';
    }
  }
  requestAnimationFrame(render);
}

/* ===== CANVAS CLICK ===== */
function onControlCanvasClick(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const cx = canvas.width/2, cy = canvas.height/2+15;
  const mx = (e.clientX - rect.left) * (canvas.width/rect.width) - cx;
  const my = cy - (e.clientY - rect.top) * (canvas.height/rect.height);
  State.targetPt = { x: mx*1.2, y: 0, z: Math.max(0, my*1.1) };
  document.getElementById('target-x').value = Math.round(State.targetPt.x);
  document.getElementById('target-y').value = 0;
  document.getElementById('target-z').value = Math.round(State.targetPt.z);
  solveIK();
}

/* ===== SLIDERS ===== */
function initSliders() {
  ['theta1','theta2','theta3'].forEach((id, i) => {
    const sl = document.getElementById(id);
    sl.value = [State.theta1, State.theta2, State.theta3][i];
    sl.addEventListener('input', () => {
      State[id] = parseFloat(sl.value);
      document.getElementById(id+'-val').textContent = State[id]+'°';
      syncIKDisplay(); updateCode();
    });
    document.getElementById(id+'-val').textContent = State[id]+'°';
  });
}

function syncSliders(t1, t2, t3) {
  State.theta1=t1; State.theta2=t2; State.theta3=t3;
  ['theta1','theta2','theta3'].forEach((id,i)=>{
    const v=[t1,t2,t3][i];
    document.getElementById(id).value=v;
    document.getElementById(id+'-val').textContent=v.toFixed(1)+'°';
  });
  syncIKDisplay(); updateCode();
}

function syncIKDisplay() {
  const ee = getEndEffectorPos(State.theta1, State.theta2, State.theta3);
  document.getElementById('ik-coords').textContent = `X=${ee.x.toFixed(0)} Y=${ee.y.toFixed(0)} Z=${ee.z.toFixed(0)}`;
  document.getElementById('ik-angles').textContent = `θ₁=${State.theta1.toFixed(0)}° θ₂=${State.theta2.toFixed(0)}° θ₃=${State.theta3.toFixed(0)}°`;
}

/* ===== IK FLOW ===== */
function updateIKFlow(t1,t2,t3) {
  const ee = getEndEffectorPos(t1,t2,t3);
  document.getElementById('ik-coords').textContent = `X=${ee.x.toFixed(0)} Y=${ee.y.toFixed(0)} Z=${ee.z.toFixed(0)}`;
  document.getElementById('ik-angles').textContent = `θ₁=${t1.toFixed(0)}° θ₂=${t2.toFixed(0)}° θ₃=${t3.toFixed(0)}°`;
  document.getElementById('ik-serial').textContent = `${State.mcu==='pic'?'COM3':'COM4'} 9600bd`;
}

function animateIKFlow() {
  const steps=['ik-step-1','ik-step-2','ik-step-3','ik-step-4'];
  const arrows=['arrow-1','arrow-2','arrow-3'];
  steps.forEach(s=>document.getElementById(s).classList.remove('active'));
  arrows.forEach(a=>document.getElementById(a).classList.remove('lit'));
  let i=0;
  (function next(){if(i<steps.length){document.getElementById(steps[i]).classList.add('active');if(i>0)document.getElementById(arrows[i-1]).classList.add('lit');i++;setTimeout(next,250);}})();
}

/* ===== IK SOLVE ===== */
function initTargetInput() {
  document.getElementById('btn-solve-ik').addEventListener('click', solveIK);
}

function solveIK() {
  const tx=parseFloat(document.getElementById('target-x').value)||0;
  const ty=parseFloat(document.getElementById('target-y').value)||0;
  const tz=parseFloat(document.getElementById('target-z').value)||0;
  State.targetPt={x:tx,y:ty,z:tz};
  const overlay=document.getElementById('ik-overlay');
  overlay.style.display='flex';
  setTimeout(()=>{
    overlay.style.display='none';
    const r=inverseKinematics(tx,ty,tz);
    if(r){
      syncSliders(r.theta1,r.theta2,r.theta3);
      animateIKFlow();
      const ee=getEndEffectorPos(r.theta1,r.theta2,r.theta3);
      logSerial(`IK → θ₁=${r.theta1.toFixed(1)}° θ₂=${r.theta2.toFixed(1)}° θ₃=${r.theta3.toFixed(1)}°`,'ik');
      logSerial(`   EE: X=${ee.x.toFixed(0)} Y=${ee.y.toFixed(0)} Z=${ee.z.toFixed(0)}`,'sys');
    } else {
      logSerial(`IK: fuera de alcance (max ${(ARM.L1+ARM.L2).toFixed(0)}mm desde hombro)`,'err');
    }
  },600);
}

/* ===== TRAJECTORIES ===== */
function initTrajectoryButtons() {
  document.querySelectorAll('.btn-traj').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.btn-traj').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const wps=generateTrajectory(btn.dataset.traj);
      if(!wps.length) return;
      State.animating=true; State.trajQueue=wps; State.trajIndex=0;
      document.getElementById('status-text').textContent='EJECUTANDO';
      const wp=wps[0]; syncSliders(wp.theta1,wp.theta2,wp.theta3);
      SimTarget.t1=wp.theta1; SimTarget.t2=wp.theta2; SimTarget.t3=wp.theta3;
      logSerial(`Trayectoria "${btn.dataset.traj}" (${wps.length} pts)`,'traj');
    });
  });
}

/* ===== CONNECTION ===== */
function initConnectionButton() {
  document.getElementById('btn-connect').addEventListener('click',()=>{
    State.connected=!State.connected;
    const btn=document.getElementById('btn-connect');
    const dot=document.querySelector('.status-dot');
    if(State.connected){
      btn.textContent='DESCONECTAR'; btn.style.cssText='background:rgba(16,185,129,0.12);border-color:#10b981;color:#10b981';
      document.getElementById('status-text').textContent='CONECTADO'; dot.style.background='#10b981';
      logSerial('Conectado @ 9600 baud','sys');
    } else {
      btn.textContent='CONECTAR'; btn.style.cssText='';
      document.getElementById('status-text').textContent='LISTO'; dot.style.background='';
      logSerial('Desconectado','sys');
    }
  });
}

/* ===== EXECUTE ===== */
function initExecuteButton() {
  document.getElementById('btn-execute').addEventListener('click',()=>{
    executeAngles(State.theta1, State.theta2, State.theta3);
    animateIKFlow();
  });
}

function executeAngles(t1,t2,t3) {
  startSeqMove(t1,t2,t3);
  recordExec(t1,t2,t3);
  const p1=angleToPWM(t1,-180,180), p2=angleToPWM(t2,-90,90), p3=angleToPWM(t3,-90,90);
  logSerial(`>> S:${t1.toFixed(1)},${t2.toFixed(1)},${t3.toFixed(1)}`,'send');
  logSerial(`   PWM: ${p1}µs | ${p2}µs | ${p3}µs`,'pwm');
  setTimeout(()=>logSerial('<< ACK: OK','recv'),180);
}

/* ===== REPLAY ===== */
function initReplayButton() {
  document.getElementById('btn-replay').addEventListener('click', startReplay);
  document.getElementById('btn-clear-replay').addEventListener('click',()=>{
    ExecLog.length=0; replayIdx=-1;
    document.getElementById('replay-count').textContent='0';
    document.getElementById('btn-replay').disabled=true;
    logSerial('Log borrado','sys');
  });
}

/* ===== SERIAL MONITOR ===== */
function initSerialMonitor() {
  document.getElementById('btn-serial-send').addEventListener('click', sendCmd);
  document.getElementById('serial-input').addEventListener('keydown',e=>{if(e.key==='Enter')sendCmd();});
}
function sendCmd() {
  const inp=document.getElementById('serial-input');
  const cmd=inp.value.trim(); if(!cmd) return;
  logSerial(`>> ${cmd}`,'send'); processCmd(cmd); inp.value='';
}
function processCmd(cmd) {
  if(cmd.startsWith('S:')){
    const p=cmd.slice(2).split(',').map(Number);
    if(p.length===3&&p.every(v=>!isNaN(v))){syncSliders(p[0],p[1],p[2]);executeAngles(p[0],p[1],p[2]);logSerial('<< ACK','recv');}
    else logSerial('<< ERR: formato S:t1,t2,t3','err');
  } else if(cmd==='HOME'){syncSliders(0,30,-20);executeAngles(0,30,-20);logSerial('<< Home OK','recv');}
  else if(cmd==='STATUS'){logSerial(`<< T:${State.theta1.toFixed(1)},${State.theta2.toFixed(1)},${State.theta3.toFixed(1)}`,'recv');}
  else if(cmd==='REPLAY'){startReplay();}
  else if(cmd==='HELP'){logSerial('Cmds: S:t1,t2,t3 | HOME | STATUS | REPLAY','sys');}
  else logSerial(`<< ERR: desconocido "${cmd}"`,'err');
}

const LOG_COL={sys:'#64748b',send:'#00d4ff',recv:'#10b981',err:'#ef4444',ik:'#7c3aed',traj:'#f59e0b',pwm:'#a78bfa'};
function logSerial(msg,type='sys'){
  const log=document.getElementById('serial-log');
  const div=document.createElement('div');
  const ts=new Date().toLocaleTimeString('es-MX',{hour12:false});
  div.style.cssText=`color:${LOG_COL[type]||'#64748b'};font-size:10px;padding-bottom:1px;`;
  div.textContent=`[${ts}] ${msg}`;
  log.appendChild(div); log.scrollTop=log.scrollHeight;
}

/* ===== SERVO STATUS ===== */
function updateServoStatus(t1,t2,t3){
  [[1,t1,-180,180],[2,t2,-90,90],[3,t3,-90,90]].forEach(([i,a,mn,mx])=>{
    const pct=(a-mn)/(mx-mn)*100;
    document.getElementById(`servo-bar-${i}`).style.width=pct.toFixed(1)+'%';
    document.getElementById(`servo-deg-${i}`).textContent=a.toFixed(1)+'°';
  });
}
function updateEEPos(t1,t2,t3){
  const ee=getEndEffectorPos(t1,t2,t3);
  document.getElementById('ee-x').textContent=ee.x.toFixed(1);
  document.getElementById('ee-y').textContent=ee.y.toFixed(1);
  document.getElementById('ee-z').textContent=ee.z.toFixed(1);
}

/* ===== CODE GENERATION ===== */
function initCodeTabs(){
  document.querySelectorAll('#panel-sim .code-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('#panel-sim .code-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active'); State.activeTab=tab.dataset.tab; updateCode();
    });
  });
  document.getElementById('btn-copy-code').addEventListener('click',()=>{
    navigator.clipboard.writeText(document.getElementById('code-output').textContent)
      .then(()=>logSerial('Codigo copiado','sys')).catch(()=>{});
  });
}
function updateCode(){
  const {theta1:t1,theta2:t2,theta3:t3}=State;
  const p1=angleToPWM(t1,-180,180),p2=angleToPWM(t2,-90,90),p3=angleToPWM(t3,-90,90);
  document.getElementById('code-output').textContent=State.activeTab==='arduino'?genArduino(t1,t2,t3,p1,p2,p3):genPIC(t1,t2,t3,p1,p2,p3);
}
function genArduino(t1,t2,t3,p1,p2,p3){
  return `#include <Servo.h>\n// ROBOARM 3-DOF — θ₁=${t1.toFixed(0)}° θ₂=${t2.toFixed(0)}° θ₃=${t3.toFixed(0)}°\nServo s1, s2, s3;\nfloat curT1, curT2, curT3;\n\nvoid setup() {\n  Serial.begin(9600);\n  s1.attach(9); s2.attach(10); s3.attach(11);\n  setAngles(${t1.toFixed(1)}, ${t2.toFixed(1)}, ${t3.toFixed(1)});\n}\n\nvoid loop() {\n  if (Serial.available()) {\n    String cmd = Serial.readStringUntil('\\n');\n    cmd.trim();\n    if (cmd == "HOME") { setAngles(0, 30, -20); Serial.println("ACK"); }\n    else if (cmd == "STATUS") {\n      Serial.print("T:"); Serial.print(curT1);\n      Serial.print(","); Serial.print(curT2);\n      Serial.print(","); Serial.println(curT3);\n    } else if (cmd.startsWith("S:")) {\n      float a1, a2, a3;\n      sscanf(cmd.c_str()+2, "%f,%f,%f", &a1, &a2, &a3);\n      setAngles(a1, a2, a3); Serial.println("ACK");\n    }\n  }\n}\n\nint anglePWM(float a, float mn, float mx) {\n  return 500 + (int)((a-mn)/(mx-mn)*1900);\n}\nvoid setAngles(float a1, float a2, float a3) {\n  // Sequential: base first, then shoulder, then elbow\n  s1.writeMicroseconds(anglePWM(a1,-180,180)); delay(600); // ${p1}µs\n  s2.writeMicroseconds(anglePWM(a2,-90,90));   delay(600); // ${p2}µs\n  s3.writeMicroseconds(anglePWM(a3,-90,90));   delay(400); // ${p3}µs\n  curT1=a1; curT2=a2; curT3=a3;\n}`;
}
function genPIC(t1,t2,t3,p1,p2,p3){
  return `// ROBOARM 3-DOF — PIC18F4550\n// θ₁=${t1.toFixed(0)}° θ₂=${t2.toFixed(0)}° θ₃=${t3.toFixed(0)}°\n#include <18F4550.h>\n#fuses HSPLL,NOWDT\n#use delay(clock=48MHz)\n#use rs232(baud=9600,xmit=PIN_C6,rcv=PIN_C7)\nfloat curT1=${t1.toFixed(1)},curT2=${t2.toFixed(1)},curT3=${t3.toFixed(1)};\nvoid setServo(int ch, int16 us) { /* CCP1/CCP2/RC0 */ }\nvoid setAngles(float a1,float a2,float a3) {\n  setServo(1,500+(int16)((a1+180)/360.0*1900)); delay_ms(600); // ${p1}µs\n  setServo(2,500+(int16)((a2+90)/180.0*1900));  delay_ms(600); // ${p2}µs\n  setServo(3,500+(int16)((a3+90)/180.0*1900));  delay_ms(400); // ${p3}µs\n  curT1=a1; curT2=a2; curT3=a3;\n}\nvoid main() {\n  setup_ccp1(CCP_PWM); setup_ccp2(CCP_PWM);\n  setup_timer_2(T2_DIV_BY_16,234,1);\n  setAngles(${t1.toFixed(1)},${t2.toFixed(1)},${t3.toFixed(1)});\n  char buf[32];\n  while(1){\n    if(kbhit()){gets(buf);\n      if(strcmp(buf,"HOME")==0){setAngles(0,30,-20);printf("ACK\\r\\n");}\n      else if(buf[0]=='S'&&buf[1]==':'){\n        float a1,a2,a3; sscanf(buf+2,"%f,%f,%f",&a1,&a2,&a3);\n        setAngles(a1,a2,a3); printf("ACK\\r\\n");}}\n  }\n}`;
}
function genProto(){return `/* PROTOCOLO SERIAL ROBOARM 3-DOF\n   Baud:9600 8N1 Terminador:\\n\n\n   COMANDOS:\n   S:θ1,θ2,θ3  Mover secuencial (base→hombro→codo)\n   HOME         Posicion inicial\n   STATUS       Leer angulos actuales\n   REPLAY       Repetir ultimo movimiento\n\n   NOTA: Movimiento secuencial = realista\n   delay 600ms entre θ₁→θ₂, 600ms θ₂→θ₃\n*/`;}

/* ===== MCU SELECT ===== */
function initMCUSelect(){
  document.getElementById('mcu-select').addEventListener('change',e=>{
    State.mcu=e.target.value; drawSchematic(schematicCanvas,State.mcu); updateCode(); updateCodeModal();
    logSerial(`MCU: ${State.mcu==='arduino'?'Arduino UNO':'PIC18F4550'}`,'sys');
  });
}

/* ===== CODE MODAL ===== */
function initCodeModal(){
  document.getElementById('code-modal-close').addEventListener('click',()=>{document.getElementById('code-modal').style.display='none';});
  document.getElementById('code-modal-copy').addEventListener('click',()=>{navigator.clipboard.writeText(document.getElementById('code-modal-body').textContent).catch(()=>{});});
  document.getElementById('code-modal').addEventListener('click',e=>{if(e.target===document.getElementById('code-modal'))document.getElementById('code-modal').style.display='none';});
  document.querySelectorAll('[data-mtab]').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('[data-mtab]').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active'); State.activeModalTab=tab.dataset.mtab; updateCodeModal();
    });
  });
}
function updateCodeModal(){
  const {theta1:t1,theta2:t2,theta3:t3}=State;
  const p1=angleToPWM(t1,-180,180),p2=angleToPWM(t2,-90,90),p3=angleToPWM(t3,-90,90);
  const tab=State.activeModalTab;
  document.getElementById('code-modal-body').textContent=
    tab==='arduino'?genArduino(t1,t2,t3,p1,p2,p3):tab==='pic'?genPIC(t1,t2,t3,p1,p2,p3):genProto();
}
function showCodeModal(){updateCodeModal();document.getElementById('code-modal').style.display='flex';}

/* ===== SCHEMATIC CLICK ===== */
function initSchematicClick(){
  schematicCanvas.addEventListener('click',e=>{
    const rect=schematicCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(schematicCanvas.width/rect.width);
    const my=(e.clientY-rect.top)*(schematicCanvas.height/rect.height);
    if(mx>=50&&mx<=160&&my>=38&&my<=178) showCodeModal();
  });
  schematicCanvas.style.cursor='pointer';
  schematicCanvas.title='Click en el chip para ver el codigo completo';
}
