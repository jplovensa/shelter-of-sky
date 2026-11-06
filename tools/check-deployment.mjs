// Dependency-free preflight for the committed static deployment.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(dist);
function required(path) {
  const full = join(dist, path.split(/[?#]/)[0]);
  if (!statSync(full).isFile() || !statSync(full).size) throw new Error(`Missing or empty deployment asset: ${path}`);
  return full;
}
const html = readFileSync(required('index.html'), 'utf8');
required('style.css');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (!/^(?:#|data:|https?:)/.test(match[1])) required(match[1]);
}
const imports = JSON.parse(html.match(/<script type="importmap">([\s\S]*?)<\/script>/)[1]).imports;
for (const path of Object.values(imports)) if (!path.endsWith('/')) required(path);
for (const full of files.filter(path => path.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', full], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  const source = readFileSync(full, 'utf8');
  for (const match of source.matchAll(/^\s*(?:import\s+(?:[\w*{},\s]+?\s+from\s*)?|export\s+(?:\*|{[^}]+})\s+from\s*)['"]([^'"]+)['"]/gm)) {
    const spec = match[1];
    let target;
    if (spec.startsWith('.')) target = resolve(dirname(full), spec);
    else {
      const key = Object.keys(imports).sort((a,b) => b.length-a.length).find(key => spec === key || (key.endsWith('/') && spec.startsWith(key)));
      if (!key) throw new Error(`Unmapped module: ${spec}`);
      target = resolve(dist, imports[key] + spec.slice(key.length));
    }
    if (!statSync(target).isFile()) throw new Error(`Missing module: ${target}`);
  }
}
for (const model of ['shelter', 'doors']) {
  const bytes = readFileSync(required(`assets/${model}.glb`));
  if (bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) throw new Error(`Invalid GLB: ${model}`);
  const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)).trim());
  for (const item of [...(json.buffers || []), ...(json.images || [])]) if (item.uri && !item.uri.startsWith('data:')) required(`assets/${item.uri}`);
}
required('assets/fjall-group-logo-transparent.png');
required('assets/catalogue-exterior.jpg');
required('assets/modern-tropical-moodboard.jpg');
required('assets/realism/tropical-interior.hdr');
for (const name of ['teak', 'linen', 'plaster']) for (const kind of ['color','normal','roughness']) required(`assets/realism/${name}-${kind}.jpg`);
for (const name of ['microcement','lava','terrazzo','zellige','rattan']) for (const kind of ['color','normal','roughness']) required(`assets/materials/${name}-${kind}.jpg`);
for (const [scheme, finishes] of Object.entries({mediterranean:['wall','stone','oak','cane','concrete','linen','bronze','walnut','marble'],scandi:['wall','stone','oak','cane','concrete','linen','black','glass','brass']})) {
  required(`assets/schemes/${scheme}-board.jpg`);
  for (const finish of finishes) for (const kind of ['color','normal']) required(`assets/schemes/${scheme}/${finish}-${kind}.jpg`);
}
console.log(`Deployment ready: ${files.length} static files, both GLB models, all three collections, local module imports and JavaScript syntax verified.`);
