// Prépare la version publiée : copie de coreen/ dans dist/, JavaScript et CSS minifiés (mêmes chemins, mêmes fichiers).
// Les outils (tools/), les tests et les fichiers de contrôle des voix ne sont pas publiés.
// Usage (depuis coreen/) : node tools/build.mjs [dossier de sortie]   — nécessite esbuild (npm i --no-save esbuild)
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { transformSync } from 'esbuild';

const SRC = process.cwd();
const OUT = process.argv[2] || join(SRC, '..', 'dist');
const SKIP = new Set(['tools', 'tests', 'README.md']);

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, {
  recursive: true,
  filter: (p) => {
    const rel = relative(SRC, p);
    return !rel || (!SKIP.has(rel.split('/')[0]) && !rel.endsWith('qa.json'));
  },
});

let before = 0;
let after = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    const loader = name.endsWith('.js') ? 'js' : name.endsWith('.css') ? 'css' : null;
    if (!loader) continue;
    const code = readFileSync(p, 'utf8');
    const out = transformSync(code, { loader, minify: true, charset: 'utf8', target: loader === 'js' ? 'es2022' : undefined, format: loader === 'js' && name !== 'sw.js' ? 'esm' : undefined }).code;
    before += Buffer.byteLength(code);
    after += Buffer.byteLength(out);
    writeFileSync(p, out);
  }
}
walk(OUT);
console.log(`Minifié : ${Math.round(before / 1024)} Ko → ${Math.round(after / 1024)} Ko (JavaScript et CSS)`);
