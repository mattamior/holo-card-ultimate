import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { strict as assert } from 'node:assert';
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const PORT = 4173;
const baseUrl = `http://127.0.0.1:${PORT}/holo-card-ultimate/`;
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], { stdio: 'ignore' });
let browser;
let page;

const sleep = (n) => new Promise(resolve => setTimeout(resolve, n));

async function waitForServer() {
  for (let i = 0; i < 90; i++) {
    if (vite.exitCode !== null) throw new Error(`Vite preview exited with code ${vite.exitCode}`);
    try { const r = await fetch(baseUrl); if (r.ok) return; } catch {}
    await sleep(250);
  }
  throw new Error('Timed out waiting for Vite preview to start');
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, args: [
    '--no-sandbox', '--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--disable-web-security',
  ] });
  page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(`Page error: ${e.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && /shader|webgl|invalid|undefined|compile/i.test(message.text())) {
      pageErrors.push(message.text());
    }
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#statusMessage')?.textContent?.includes('就绪'), null, { timeout: 20000 });
  assert.equal(await page.locator('.three-canvas').count(), 1, 'GPU canvas must exist');
  const webgl2 = await page.locator('.three-canvas').evaluate((canvas) => Boolean(canvas.getContext('webgl2')));
  assert.ok(webgl2, 'Browser must render with WebGL2');
  const image = await page.locator('.three-canvas').screenshot();
  assert.ok(image.byteLength > 18000, `Unexpectedly empty canvas image: ${image.byteLength}`);
  assert.deepEqual(pageErrors, [], 'No JavaScript/Shader/WebGL errors expected');

  await page.locator('[data-preset="reverse"]').click();
  assert.equal(await page.locator('[data-preset="reverse"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-preset="cosmos"]').click();
  assert.equal(await page.locator('[data-preset="cosmos"]').getAttribute('aria-pressed'), 'true');
  await page.locator('#glitter').evaluate((el) => { el.value = '96'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  assert.equal(await page.locator('#glitterOutput').textContent(), '96%');
  const stage = page.locator('#canvasMount');
  const area = await stage.boundingBox();
  assert.ok(area, 'Stage bounds must exist');
  await page.mouse.move(area.x + area.width * 0.8, area.y + area.height * 0.25);
  await page.waitForTimeout(450);
  const tilt = await page.locator('#angleValue').textContent();
  assert.ok(tilt && tilt !== 'X +0.0° · Y +0.0°', `Expected angle response, saw ${tilt}`);

  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: join('artifacts', 'browser-smoke.png'), fullPage: true });
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.locator('#exportButton').click(),
  ]);
  const exportName = download.suggestedFilename();
  assert.ok(exportName.endsWith('.png'), `Unexpected export filename ${exportName}`);
  const savePath = join('artifacts', 'captured-pose.png');
  await download.saveAs(savePath);
  const png = await readFile(savePath);
  assert.equal(png.subarray(1,4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200, 'Exported width must be 1200');
  assert.equal(png.readUInt32BE(20), 1680, 'Exported height must be 1680');
  assert.ok(png.length > 50000, `PNG unexpectedly small (${png.length})`);
  assert.deepEqual(pageErrors, [], 'No runtime errors after export');
  console.log('PASS: WebGL2 card canvas, 3 presets, uniform sliders, angle response, and 1200x1680 PNG export');
} finally {
  await page?.close();
  await browser?.close();
  vite.kill('SIGTERM');
}
