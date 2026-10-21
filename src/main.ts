import './style.css';
import { CardRenderer, type ControlKey, type OpticalControls, type OpticalPreset } from './engine/CardRenderer';
import { PRESETS, normControl, pointerUV, presetSettings } from './core-optics.js';

const mount = document.querySelector<HTMLElement>('#canvasMount');
const fallback = document.querySelector<HTMLElement>('#webglFallback');
const output = document.querySelector<HTMLOutputElement>('#angleValue');
const status = document.querySelector<HTMLOutputElement>('#statusMessage');
const exportButton = document.querySelector<HTMLButtonElement>('#exportButton');
if (!mount || !fallback || !output || !status || !exportButton) throw new Error('App root is incomplete.');

let renderer: CardRenderer | null = null;
let activePreset: OpticalPreset = 'aurora';
const controls = ['foil', 'glare', 'glitter', 'border', 'metal', 'detail'] as const;

function getControls(): OpticalControls {
  const data = {} as OpticalControls;
  for (const key of controls) {
    const field = document.querySelector<HTMLInputElement>(`#${key}`);
    if (!field) throw new Error(`Missing control: ${key}`);
    data[key] = normControl(field.value);
  }
  return data;
}

function showStatus(message: string, error = false): void {
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-error', error);
}

function setSliders(values: Record<ControlKey, number>): void {
  for (const key of controls) {
    const slider = document.querySelector<HTMLInputElement>(`#${key}`);
    const label = document.querySelector<HTMLOutputElement>(`#${key}Output`);
    if (slider) slider.value = String(values[key]);
    if (label) label.value = `${values[key]}%`;
  }
  renderer?.setControls(getControls());
}

function choosePreset(key: OpticalPreset): void {
  activePreset = key;
  document.querySelectorAll<HTMLButtonElement>('.preset-option').forEach((button) => {
    const current = button.dataset.preset === key;
    button.classList.toggle('is-selected', current);
    button.setAttribute('aria-pressed', String(current));
  });
  const preset = PRESETS[key];
  renderer?.setPreset(key);
  setSliders(presetSettings(key));
  showStatus(`已载入 ${preset.label} 配方`);
}

for (const key of controls) {
  document.querySelector<HTMLInputElement>(`#${key}`)?.addEventListener('input', (event) => {
    const source = event.currentTarget as HTMLInputElement;
    const label = document.querySelector<HTMLOutputElement>(`#${key}Output`);
    if (label) label.value = `${source.value}%`;
    renderer?.setControls(getControls());
  });
}

document.querySelectorAll<HTMLButtonElement>('.preset-option').forEach((button) => {
  button.addEventListener('click', () => choosePreset(button.dataset.preset as OpticalPreset));
});
document.querySelector('#resetControls')?.addEventListener('click', () => {
  setSliders(presetSettings(activePreset));
  showStatus('参数已恢复为配方默认值');
});

// Pointer events work for both mouse and touch; keyboard is also available.
mount.tabIndex = 0;
mount.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch' && event.buttons === 0) return;
  const uv = pointerUV(event.clientX, event.clientY, mount.getBoundingClientRect());
  renderer?.setPointer(uv.x, uv.y);
});
mount.addEventListener('pointerdown', (event) => {
  mount.setPointerCapture(event.pointerId);
  const uv = pointerUV(event.clientX, event.clientY, mount.getBoundingClientRect());
  renderer?.setPointer(uv.x, uv.y);
});
mount.addEventListener('pointerup', (event) => {
  if (mount.hasPointerCapture(event.pointerId)) mount.releasePointerCapture(event.pointerId);
});
mount.addEventListener('pointerleave', () => renderer?.setPointer(0.5, 0.5));
mount.addEventListener('keydown', (event) => {
  const positions: Record<string, [number, number]> = {
    ArrowLeft: [0.08, 0.5], ArrowRight: [0.92, 0.5], ArrowUp: [0.5, 0.92], ArrowDown: [0.5, 0.08], Home: [0.5, 0.5],
  };
  const target = positions[event.key];
  if (target) {
    event.preventDefault();
    renderer?.setPointer(target[0], target[1]);
  }
});

exportButton.addEventListener('click', async () => {
  if (!renderer || !exportButton) return;
  exportButton.disabled = true;
  showStatus('正在渲染高清 PNG…');
  try {
    const png = await renderer.exportPng();
    const url = URL.createObjectURL(png);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `holo-card-${activePreset}-${Date.now()}.png`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    // Release the temporary URL after browsers have processed the click.
    setTimeout(() => URL.revokeObjectURL(url), 8000);
    showStatus(`PNG 已生成 · ${(png.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('PNG export failed:', error);
    showStatus('导出失败：请检查浏览器图形功能。', true);
  } finally {
    exportButton.disabled = false;
  }
});

(async () => {
  try {
    renderer = await CardRenderer.create(mount);
    renderer.onTilt = (x, y) => {
      const signed = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}°`;
      output.value = `X ${signed(x)} · Y ${signed(y)}`;
    };
    choosePreset('aurora');
    showStatus('光学渲染已就绪。试着移动鼠标。');
  } catch (error) {
    console.error('WebGL initialization failed:', error);
    fallback.hidden = false;
    exportButton.disabled = true;
    showStatus('无法初始化 WebGL2。', true);
  }
})();

window.addEventListener('pagehide', () => renderer?.dispose(), { once: true });
