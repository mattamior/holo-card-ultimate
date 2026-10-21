/**
 * Bundle Vite dist into one portable HTML document with inline JS/CSS and SVG assets.
 * Run after npm run build. No CDN, Pages or external runtime dependencies.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const dist = resolve('dist');
const assetDir = join(dist, 'assets');
let html = readFileSync(join(dist, 'index.html'), 'utf8');
const jsPath = html.match(/<script type="module" crossorigin src="\/holo-card-ultimate\/(assets\/[^"]+\.js)"><\/script>/)?.[1];
const cssPath = html.match(/<link rel="stylesheet" crossorigin href="\/holo-card-ultimate\/(assets\/[^"]+\.css)">/)?.[1];
if (!jsPath || !cssPath) throw new Error('Expected Vite production JS and CSS tags were not found.');
let js = readFileSync(join(dist, jsPath), 'utf8');
const css = readFileSync(join(dist, cssPath), 'utf8');

for (const filename of readdirSync(assetDir).filter(name => name.endsWith('.svg'))) {
  const original = '/holo-card-ultimate/assets/' + filename;
  if (!js.includes(original)) throw new Error('Unreferenced built artwork asset: ' + filename);
  const data = readFileSync(join(assetDir, filename)).toString('base64');
  js = js.replaceAll(original, 'data:image/svg+xml;base64,' + data);
}
if (js.includes('/holo-card-ultimate/assets/')) {
  throw new Error('Unresolved asset path in inline JavaScript.');
}
if (js.includes('</script>')) {
  throw new Error('Unsafe script end tag in inline bundle.');
}
const favicon = readFileSync(join(dist, 'favicon.svg')).toString('base64');
html = html.replace('href="./favicon.svg"', 'href="data:image/svg+xml;base64,' + favicon + '"');
html = html.replace(
  '<link rel="stylesheet" crossorigin href="/holo-card-ultimate/' + cssPath + '">',
  () => '<style>\n' + css + '\n</style>',
);
html = html.replace(
  '<script type="module" crossorigin src="/holo-card-ultimate/' + jsPath + '"></script>',
  () => '<script type="module">\n' + js + '\n</script>',
);
if (html.includes('/holo-card-ultimate/assets/') || html.includes('src="/src/main.ts"')) {
  throw new Error('Standalone HTML still references external build/source files.');
}
const output = join(dist, 'holo-card-ultimate-standalone.html');
writeFileSync(output, html, 'utf8');
console.log('Self-contained HTML written:', basename(output), Buffer.byteLength(html, 'utf8'), 'bytes');
