import {
  Clock,
  Color,
  DoubleSide,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  UnsignedByteType,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import artUrl from '../assets/lunara.svg?url';
import bgMaskUrl from '../assets/background-mask.svg?url';
import characterMaskUrl from '../assets/character-mask.svg?url';
import vertexShader from './card.vert.glsl?raw';
import fragmentShader from './card.frag.glsl?raw';
import { linearResponse, opticalState } from '../core-optics.js';

export type OpticalPreset = 'aurora' | 'reverse' | 'cosmos';
export type ControlKey = 'foil' | 'glare' | 'glitter' | 'border';
export type OpticalControls = Record<ControlKey, number>;

type ShaderUniforms = {
  uArt: { value: Texture };
  uBackgroundMask: { value: Texture };
  uCharacterMask: { value: Texture };
  uPointer: { value: Vector2 };
  uFoilShift: { value: Vector2 };
  uTilt: { value: Vector2 };
  uFoil: { value: number };
  uGlare: { value: number };
  uGlitter: { value: number };
  uBorder: { value: number };
  uMode: { value: number };
  uSeed: { value: number };
};

const CARD_WIDTH = 2.4;
const CARD_HEIGHT = 3.36;
const FOV_DEGREES = 36;
const EXPORT_SIZE = { width: 1200, height: 1680 };

function requireWebGL2(): boolean {
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2'));
}

function loadTexture(url: string, srgb = false): Promise<Texture> {
  return new Promise((resolve, reject) => {
    new TextureLoader().load(url, (texture) => {
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.generateMipmaps = false;
      if (srgb) texture.colorSpace = SRGBColorSpace;
      resolve(texture);
    }, undefined, reject);
  });
}

export class CardRenderer {
  readonly canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(FOV_DEGREES, 1, 0.1, 100);
  private uniforms: ShaderUniforms;
  private material: ShaderMaterial;
  private mesh: Mesh;
  private textures: Texture[] = [];
  private resizeObserver: ResizeObserver;
  private animationFrame = 0;
  private clock = new Clock();
  private active = true;
  private targetPointer = { x: 0.5, y: 0.5 };
  private smooth = { x: 0.5, y: 0.5 };
  private lastTilt = { x: 0, y: 0 };
  private controls: OpticalControls = { foil: 0.78, glare: 0.55, glitter: 0.48, border: 0.66 };
  onTilt?: (x: number, y: number) => void;

  constructor(private mount: HTMLElement, artwork: Texture, backgroundMask: Texture, characterMask: Texture) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'three-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.mount.append(this.canvas);
    this.renderer = new WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.textures = [artwork, backgroundMask, characterMask];
    this.uniforms = {
      uArt: { value: artwork },
      uBackgroundMask: { value: backgroundMask },
      uCharacterMask: { value: characterMask },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uFoilShift: { value: new Vector2(0, 0) },
      uTilt: { value: new Vector2(0, 0) },
      uFoil: { value: this.controls.foil },
      uGlare: { value: this.controls.glare },
      uGlitter: { value: this.controls.glitter },
      uBorder: { value: this.controls.border },
      uMode: { value: 0 },
      uSeed: { value: 7.3 },
    };
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new Mesh(new PlaneGeometry(CARD_WIDTH, CARD_HEIGHT), this.material);
    this.scene.add(this.mesh);
    this.camera.position.z = this.distanceForAspect(1);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.mount);
    this.resize();
    this.clock.start();
    this.animate();
  }

  static async create(mount: HTMLElement): Promise<CardRenderer> {
    if (!requireWebGL2()) throw new Error('WebGL2 is not supported by this browser.');
    const textures = await Promise.all([
      loadTexture(artUrl, true),
      loadTexture(bgMaskUrl),
      loadTexture(characterMaskUrl),
    ]);
    return new CardRenderer(mount, textures[0]!, textures[1]!, textures[2]!);
  }

  private distanceForAspect(aspect: number): number {
    const minimumHeight = Math.max(4.13, 2.93 / Math.max(aspect, 0.1));
    return minimumHeight / (2 * Math.tan((FOV_DEGREES * Math.PI) / 360));
  }

  private resize(): void {
    const width = Math.max(this.mount.clientWidth, 1);
    const height = Math.max(this.mount.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.position.z = this.distanceForAspect(this.camera.aspect);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  setPointer(x: number, y: number): void {
    this.targetPointer = { x, y };
  }

  setPreset(preset: OpticalPreset): void {
    this.uniforms.uMode.value = preset === 'reverse' ? 1 : preset === 'cosmos' ? 2 : 0;
  }

  setControls(values: OpticalControls): void {
    this.controls = { ...values };
    this.uniforms.uFoil.value = values.foil;
    this.uniforms.uGlare.value = values.glare;
    this.uniforms.uGlitter.value = values.glitter;
    this.uniforms.uBorder.value = values.border;
  }

  private applyPose(dt: number): void {
    this.smooth.x = linearResponse(this.smooth.x, this.targetPointer.x, dt, 9);
    this.smooth.y = linearResponse(this.smooth.y, this.targetPointer.y, dt, 9);
    const optics = opticalState(this.smooth);
    this.lastTilt = { x: optics.tiltX, y: optics.tiltY };
    this.mesh.rotation.x = optics.tiltX * Math.PI / 180;
    this.mesh.rotation.y = optics.tiltY * Math.PI / 180;
    this.mesh.rotation.z = (this.smooth.x - 0.5) * -0.025;
    this.uniforms.uPointer.value.set(optics.highlightX, optics.highlightY);
    this.uniforms.uFoilShift.value.set(optics.foilX, optics.foilY);
    this.uniforms.uTilt.value.set(optics.tiltX / 13, optics.tiltY / 13);
    this.onTilt?.(optics.tiltX, optics.tiltY);
  }

  private animate = (): void => {
    if (!this.active) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.applyPose(dt);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  async exportPng(): Promise<Blob> {
    // Export the current *smoothed* pose without advancing simulation time.
    const { width, height } = EXPORT_SIZE;
    const target = new WebGLRenderTarget(width, height, { format: RGBAFormat, type: UnsignedByteType, depthBuffer: true });
    target.texture.colorSpace = SRGBColorSpace;
    const exportCam = new PerspectiveCamera(FOV_DEGREES, width / height, 0.1, 100);
    exportCam.position.z = this.distanceForAspect(exportCam.aspect);
    exportCam.updateProjectionMatrix();
    const previousTarget = this.renderer.getRenderTarget();
    const previousColor = this.renderer.getClearColor(new Color()).clone();
    const previousAlpha = this.renderer.getClearAlpha();
    const pixels = new Uint8Array(width * height * 4);
    try {
      this.renderer.setRenderTarget(target);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear(true, true, true);
      this.renderer.render(this.scene, exportCam);
      this.renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
    } finally {
      this.renderer.setRenderTarget(previousTarget);
      this.renderer.setClearColor(previousColor, previousAlpha);
      target.dispose();
    }
    // WebGL readback is bottom-up; image data is top-down.
    const surface = document.createElement('canvas');
    surface.width = width;
    surface.height = height;
    const ctx = surface.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is unavailable.');
    const image = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      const rowBytes = width * 4;
      image.data.set(pixels.subarray((height - 1 - y) * rowBytes, (height - y) * rowBytes), y * rowBytes);
    }
    ctx.putImageData(image, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => surface.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('PNG serialization failed.');
    return blob;
  }

  dispose(): void {
    this.active = false;
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.textures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
    this.canvas.remove();
  }
}
