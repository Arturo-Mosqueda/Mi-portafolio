/**
 * kinematics.js
 * 3-DOF Robotic Arm Forward & Inverse Kinematics
 * Link lengths: L1 (upper arm), L2 (forearm), L3 (gripper)
 */

/* ===== roundRect polyfill (Chrome < 99, Firefox < 112) ===== */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'undefined') r = 0;
    if (typeof r === 'object') r = r[0] || 0;
    r = Math.min(r, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y,     x + w, y + h, r);
    this.arcTo(x + w, y + h, x,     y + h, r);
    this.arcTo(x,     y + h, x,     y,     r);
    this.arcTo(x,     y,     x + w, y,     r);
    this.closePath();
    return this;
  };
}


const ARM = {
  L1: 110, // upper arm length
  L2: 90,  // forearm length
  COLUMN: 45, // fixed column height
};

/** Convert degrees to radians */
function toRad(deg) { return deg * Math.PI / 180; }
/** Convert radians to degrees */
function toDeg(rad) { return rad * 180 / Math.PI; }
/** Clamp value between min and max */
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

/** Forward Kinematics 2D — kept for reference, not used in 3D renderer */
function forwardKinematics2D(theta1_deg, theta2_deg, theta3_deg, origin) {
  const t2 = toRad(theta2_deg);
  const t3 = toRad(theta3_deg);
  const j0 = { x: origin.x, y: origin.y };
  const a1 = -Math.PI / 2 + t2;
  const j1 = { x: j0.x + ARM.L1 * Math.cos(a1), y: j0.y + ARM.L1 * Math.sin(a1) };
  const a2 = a1 + t3;
  const j2 = { x: j1.x + ARM.L2 * Math.cos(a2), y: j1.y + ARM.L2 * Math.sin(a2) };
  return { j0, j1, j2, j3: j2, a1, a2 };
}

/**
 * 3D Forward Kinematics — 2-arm + column model
 * p0 = base center (ground, rotates θ₁)
 * p1 = shoulder = top of fixed column
 * p2 = elbow = end of upper arm (θ₂)
 * p3 = end-effector = end of forearm (θ₃ relative to θ₂)
 */
function forwardKinematics3D(theta1_deg, theta2_deg, theta3_deg) {
  const t1 = toRad(theta1_deg);
  const t2 = toRad(theta2_deg);
  const t3 = toRad(theta2_deg + theta3_deg); // absolute forearm angle

  const p0 = { x: 0, y: 0, z: 0 };
  const p1 = { x: 0, y: 0, z: ARM.COLUMN }; // shoulder

  const p2 = {
    x: p1.x + ARM.L1 * Math.cos(t2) * Math.cos(t1),
    y: p1.y + ARM.L1 * Math.cos(t2) * Math.sin(t1),
    z: p1.z + ARM.L1 * Math.sin(t2),
  };
  const p3 = {
    x: p2.x + ARM.L2 * Math.cos(t3) * Math.cos(t1),
    y: p2.y + ARM.L2 * Math.cos(t3) * Math.sin(t1),
    z: p2.z + ARM.L2 * Math.sin(t3),
  };
  return { p0, p1, p2, p3 };
}

/**
 * Isometric projection: world 3D → canvas 2D
 */
function isoProject(x, y, z, cx, cy, scale = 1.0) {
  const angle = Math.PI / 6; // 30 degrees
  const px = (x - y) * Math.cos(angle) * scale;
  const py = (x + y) * Math.sin(angle) * scale - z * scale;
  return { x: cx + px, y: cy + py };
}

/**
 * Inverse Kinematics (2D geometric, then adds θ1 from X/Y projection)
 * Target: 3D point (tx, ty, tz)
 * Returns { theta1, theta2, theta3 } in degrees, or null if unreachable
 */
/**
 * Inverse Kinematics — 2R planar (elbow-down, consistent with FK)
 * FK: t3_abs = theta2 + theta3  →  EE = shoulder + L1*(cos t2) + L2*(cos t3_abs)
 * Elbow-down: q1 = atan2(z,r) + atan2(k2, k1)  ; theta3 = -q2  (negative)
 */
function inverseKinematics(tx, ty, tz) {
  const L1 = ARM.L1, L2 = ARM.L2;

  // θ₁: base yaw
  const theta1 = toDeg(Math.atan2(ty, tx));

  // Vertical plane relative to shoulder
  const r = Math.sqrt(tx * tx + ty * ty);
  const z = tz - ARM.COLUMN;

  const dist2 = r * r + z * z;
  const dist  = Math.sqrt(dist2);
  if (dist > L1 + L2 - 0.5) { console.warn('IK: fuera de alcance, dist=' + dist.toFixed(1)); return null; }
  if (dist < Math.abs(L1 - L2) + 0.5) { console.warn('IK: muy cerca'); return null; }

  // Elbow angle magnitude (always >= 0)
  const cosQ2 = (dist2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const q2 = Math.acos(clamp(cosQ2, -1, 1));

  // Elbow-DOWN shoulder angle: use + atan2
  const k1 = L1 + L2 * Math.cos(q2);
  const k2 = L2 * Math.sin(q2);
  const q1 = Math.atan2(z, r) + Math.atan2(k2, k1);  // ← + for elbow-down

  const theta2 = toDeg(q1);
  const theta3 = -toDeg(q2);  // negative = elbow bends down

  return {
    theta1: clamp(theta1, -180, 180),
    theta2: clamp(theta2, -90, 90),
    theta3: clamp(theta3, -90, 90),
  };
}


/**
 * Generate trajectory waypoints
 */
function generateTrajectory(type) {
  const points = [];
  switch (type) {
    case 'wave':
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI * 2;
        points.push({ theta1: toDeg(t) - 180, theta2: 30 + 20 * Math.sin(t * 2), theta3: -20 });
      }
      break;
    case 'circle':
      for (let i = 0; i <= 24; i++) {
        const t = (i / 24) * Math.PI * 2;
        const r = 120, h = 60;
        const tx = r * Math.cos(t), ty = r * Math.sin(t), tz = h;
        const ik = inverseKinematics(tx, ty, tz);
        if (ik) points.push(ik);
      }
      break;
    case 'pick':
      points.push({ theta1: 0, theta2: 60, theta3: -40 });
      points.push({ theta1: 0, theta2: -20, theta3: -60 });
      points.push({ theta1: 0, theta2: -20, theta3: 0 });
      points.push({ theta1: 90, theta2: 30, theta3: -30 });
      points.push({ theta1: 90, theta2: -20, theta3: -60 });
      points.push({ theta1: 0, theta2: 30, theta3: -20 });
      break;
    case 'home':
      points.push({ theta1: 0, theta2: 30, theta3: -20 });
      break;
  }
  return points;
}

/**
 * Angle to PWM microseconds (SG90 servo: 500–2400 µs)
 */
function angleToPWM(angleDeg, minDeg = -90, maxDeg = 90) {
  const norm = (angleDeg - minDeg) / (maxDeg - minDeg);
  return Math.round(500 + norm * 1900);
}

/**
 * End-effector 3D position from FK
 */
function getEndEffectorPos(theta1, theta2, theta3) {
  const pts = forwardKinematics3D(theta1, theta2, theta3);
  return pts.p3;
}
