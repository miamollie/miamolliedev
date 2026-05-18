// Shared wave animation code for miamollie sites
// Configuration should be provided as a global object before importing this script

const TEAL = [148, 185, 178];
const TEAL2 = [122, 162, 168];
const SAGE = [138, 175, 165];
const MUSTARD = [192, 158, 80];
const MAUVE = [180, 148, 138];

const canvas = document.getElementById("wave-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  t = 0;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Layer configuration
const layers = [
  {
    r: 148,
    g: 185,
    b: 178,
    a: 0.2,
    amp: 40,
    freq: 0.0022,
    speed: 0.14,
    yBase: 0.65,
    lw: 1.6,
  },
  {
    r: 122,
    g: 162,
    b: 168,
    a: 0.24,
    amp: 30,
    freq: 0.003,
    speed: 0.1,
    yBase: 0.73,
    lw: 1.3,
  },
  {
    r: 138,
    g: 175,
    b: 165,
    a: 0.28,
    amp: 22,
    freq: 0.0038,
    speed: 0.17,
    yBase: 0.8,
    lw: 1.1,
  },
  {
    r: 100,
    g: 145,
    b: 158,
    a: 0.32,
    amp: 16,
    freq: 0.0048,
    speed: 0.12,
    yBase: 0.87,
    lw: 0.9,
  },
  {
    r: 128,
    g: 162,
    b: 152,
    a: 0.3,
    amp: 11,
    freq: 0.006,
    speed: 0.2,
    yBase: 0.93,
    lw: 0.7,
  },
];

function drawLayer(l, t) {
  const yMid = H * l.yBase;
  const pts = [];
  for (let x = 0; x <= W; x += 2) {
    const y =
      yMid +
      Math.sin(x * l.freq + t * l.speed) * l.amp +
      Math.sin(x * l.freq * 1.9 + t * l.speed * 0.6) * l.amp * 0.35 +
      Math.sin(x * l.freq * 0.7 + t * l.speed * 1.3) * l.amp * 0.2;
    pts.push({ x, y });
  }
  ctx.beginPath();
  ctx.moveTo(0, H);
  pts.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.lineTo(W, H);
  ctx.closePath();
  const topY = Math.min(...pts.map((p) => p.y)) - 20;
  const grad = ctx.createLinearGradient(0, topY, 0, H);
  grad.addColorStop(0, `rgba(${l.r},${l.g},${l.b},0)`);
  grad.addColorStop(0.3, `rgba(${l.r},${l.g},${l.b},${l.a * 0.4})`);
  grad.addColorStop(1, `rgba(${l.r},${l.g},${l.b},${l.a})`);
  ctx.fillStyle = grad;
  ctx.fill();
  for (let pass = 0; pass < 3; pass++) {
    const offY = (pass - 1) * 1.2;
    const alpha = [0.06, 0.18, 0.08][pass];
    ctx.beginPath();
    pts.forEach((p, i) => {
      i === 0 ? ctx.moveTo(p.x, p.y + offY) : ctx.lineTo(p.x, p.y + offY);
    });
    ctx.strokeStyle = `rgba(${l.r},${l.g},${l.b},${alpha})`;
    ctx.lineWidth = l.lw + pass * 1.5;
    ctx.stroke();
  }
}

function drawSun() {
  const cx = W * 0.01;
  const cy = H * -0.02;
  const r = Math.min(W, H) * 0.18;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, "rgba(220,175,110,0.38)");
  g.addColorStop(0.5, "rgba(210,158,88,0.18)");
  g.addColorStop(1, "rgba(210,158,88,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
}

function drawConstellation(t) {
  // Get configuration from global scope if available
  const config = window.animationConfig || { nodes: [], edges: [] };
  const nodes = config.nodes || [];
  const edges = config.edges || [];

  // Draw edges first (behind nodes)
  edges.forEach(([ai, bi, col]) => {
    const a = nodes[ai];
    const b = nodes[bi];
    if (!a || !b) return;
    const ax = a.px * W;
    const ay = a.py * H;
    const bx = b.px * W;
    const by = b.py * H;
    const alpha = 0.3 + Math.sin(t * 0.4 + ai * 0.7) * 0.08;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([]);
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach((n, i) => {
    const x = n.px * W;
    const y = n.py * H;
    const pulse = Math.sin(t * 0.5 + n.phase) * 0.5 + 0.5;
    const r = n.r + pulse * 1.4;
    const alpha = n.hollow ? 0.22 + pulse * 0.12 : 0.28 + pulse * 0.18;

    if (n.hollow) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${alpha})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${alpha * 0.7})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r + 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${alpha * 0.25})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  });
}

function drawAccentDots(t) {
  const config = window.animationConfig || { accentDots: [] };
  const accentDots = config.accentDots || [];

  accentDots.forEach((d, i) => {
    const pulse = Math.sin(t * 0.6 + i * 1.1) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(d.px * W, d.py * H, d.r + pulse * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${d.col[0]},${d.col[1]},${d.col[2]},${0.22 + pulse * 0.12})`;
    ctx.fill();
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawSun();
  drawConstellation(t);
  drawAccentDots(t);
  layers.forEach((l) => drawLayer(l, t));
  t += 0.013;
  requestAnimationFrame(draw);
}

draw();
