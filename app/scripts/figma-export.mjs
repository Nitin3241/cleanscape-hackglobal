// Exports every CleanScape screen from Figma: PNG screenshot + text + prototype links.
// Usage (Node 18+):  FIGMA_TOKEN=xxxx node scripts/figma-export.mjs
// Token: Figma → Settings → Security → Personal access tokens (scope: File content, read-only).
import fs from 'node:fs/promises';
import path from 'node:path';

const FILE = '6Jc3DgUuXJDOdc5Z4IC4Lm';
const PAGE = 'Rain Ready (UAE)';
const SECTION_PREFIX = '🌿 CleanScape';
const OUT = 'design';
const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) { console.error('Set FIGMA_TOKEN first.'); process.exit(1); }

const api = async (p) => {
  for (let i = 0; i < 5; i++) {
    const r = await fetch('https://api.figma.com/v1' + p, { headers: { 'X-Figma-Token': TOKEN } });
    if (r.status === 429) { await new Promise((s) => setTimeout(s, 3000 * (i + 1))); continue; }
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return r.json();
  }
  throw new Error('Rate limited too many times');
};
const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
const slug = (s) => s.normalize('NFKD').replace(/[^\w\s·-]/g, '').replace(/[·\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();

const file = await api(`/files/${FILE}?depth=3`);
const page = file.document.children.find((p) => p.name === PAGE);
const section = page.children.find((n) => n.name.startsWith(SECTION_PREFIX));
const isScreen = (n) => n.type === 'FRAME' && n.absoluteBoundingBox &&
  n.absoluteBoundingBox.width >= 300 && n.absoluteBoundingBox.width <= 430 && n.absoluteBoundingBox.height >= 600;
const screens = section.children.filter(isScreen);
const rowLabels = section.children
  .filter((n) => n.type === 'TEXT' && /^Row label|^Story label/.test(n.name))
  .map((n) => ({ y: n.absoluteBoundingBox.y, x: n.absoluteBoundingBox.x, title: n.characters }))
  .sort((a, b) => a.y - b.y);
const rowSubs = section.children.filter((n) => n.type === 'TEXT' && /^Row sub|^Story sub/.test(n.name))
  .map((n) => ({ y: n.absoluteBoundingBox.y, x: n.absoluteBoundingBox.x, text: n.characters }));
const nameById = Object.fromEntries(screens.map((s) => [s.id, s.name]));
// Frames that are animation or loading states of another screen, not screens to build.
const STATE_RE = /· enter [A-Z]$|· Skeleton$|Motion \d|Pre-animate|\(pre\)$|\(before [^)]*\)$|— out$/i;
const motionOf = (t) => {
  if (!t) return 'instant';
  const e = t.easing?.easingFunctionCubicBezier;
  const ease = e ? `bezier(${[e.x1, e.y1, e.x2, e.y2].map((v) => +v.toFixed(2)).join(',')})` : (t.easing?.type ?? '').toLowerCase();
  return `${t.type.toLowerCase()}${t.direction ? ' ' + t.direction.toLowerCase() : ''} ${Math.round((t.duration ?? 0) * 1000)}ms ${ease}`.trim();
};

const rowFor = (s) => {
  const b = s.absoluteBoundingBox;
  const above = rowLabels.filter((l) => l.y <= b.y && l.x <= b.x + 10);
  const l = above.sort((a, c) => (c.y - a.y) || (c.x - a.x))[0];
  if (!l) return { title: 'Ungrouped', sub: '' };
  const sub = rowSubs.filter((r) => r.y > l.y && r.y - l.y < 80 && Math.abs(r.x - l.x) < 20)[0];
  return { title: l.title, sub: sub ? sub.text : '' };
};

const result = [];
for (const ids of chunk(screens.map((s) => s.id), 25)) {
  const data = await api(`/files/${FILE}/nodes?ids=${encodeURIComponent(ids.join(','))}`);
  for (const id of ids) {
    const root = data.nodes[id].document;
    const fb = root.absoluteBoundingBox;
    const texts = []; const links = [];
    const walk = (n) => {
      if (n.visible === false) return;
      if (n.type === 'TEXT' && n.characters?.trim()) texts.push({ y: n.absoluteBoundingBox.y - fb.y, x: n.absoluteBoundingBox.x - fb.x, t: n.characters.replace(/\s+/g, ' ').trim() });
      for (const it of n.interactions ?? []) {
        for (const a of it.actions ?? []) {
          const trigger = it.trigger?.type === 'AFTER_TIMEOUT' ? `auto after ${it.trigger.timeout}s` : n.name;
          if (a.type === 'BACK') links.push({ from: trigger, to: 'BACK' });
          else if (a.destinationId) links.push({ from: trigger, to: nameById[a.destinationId] ?? a.destinationId, transition: motionOf(a.transition) });
        }
      }
      (n.children ?? []).forEach(walk);
    };
    walk(root);
    texts.sort((a, b) => Math.round(a.y / 6) - Math.round(b.y / 6) || a.x - b.x);
    const s = screens.find((x) => x.id === id);
    result.push({
      id, name: s.name, row: rowFor(s), file: `screens/${slug(s.name)}.png`,
      x: s.absoluteBoundingBox.x, y: s.absoluteBoundingBox.y,
      dark: (root.fills?.[0]?.color?.r ?? 1) < 0.3,
      state: STATE_RE.test(s.name),
      text: [...new Set(texts.filter((t) => !/^\d{1,2}:\d{2}$/.test(t.t)).map((t) => t.t))],
      links,
    });
  }
}

await fs.mkdir(path.join(OUT, 'screens'), { recursive: true });
for (const ids of chunk(result.map((r) => r.id), 40)) {
  const { images } = await api(`/images/${FILE}?ids=${encodeURIComponent(ids.join(','))}&format=png&scale=2`);
  await Promise.all(ids.map(async (id) => {
    if (!images[id]) return;
    const buf = Buffer.from(await (await fetch(images[id])).arrayBuffer());
    await fs.writeFile(path.join(OUT, result.find((r) => r.id === id).file), buf);
  }));
  process.stdout.write('.');
}

result.sort((a, b) => a.y - b.y || a.x - b.x);
await fs.writeFile(path.join(OUT, 'screens.json'), JSON.stringify(result, null, 2));

let md = `# CleanScape screens (auto-exported ${new Date().toISOString().slice(0, 10)})\n\n${result.length} screens. Figma file \`${FILE}\`. Screenshots in \`design/screens/\`.\n`;
let row = '';
for (const r of result) {
  if (r.row.title !== row) { row = r.row.title; md += `\n## ${row}\n${r.row.sub ? `_${r.row.sub}_\n` : ''}`; }
  md += `\n### ${r.name}${r.state ? ' (MOTION STATE: animate, do not build as a screen)' : ''}\n- Figma node: \`${r.id}\`${r.dark ? ' · dark screen' : ''}\n- Screenshot: \`design/${r.file}\`\n`;
  md += `- Text: ${r.text.slice(0, 40).join(' | ')}\n`;
  md += `- Navigation: ${r.links.length ? [...new Set(r.links.map((l) => `${l.from} → ${l.to}${l.transition && l.to !== 'BACK' ? ` [${l.transition}]` : ''}`))].join('; ') : 'none'}\n`;
}
await fs.writeFile(path.join(OUT, 'SCREENS.md'), md);
console.log(`\nDone: ${result.length} screens → design/SCREENS.md, design/screens.json, design/screens/*.png`);
