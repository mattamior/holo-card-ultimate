import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const frag = readFileSync(new URL('../src/engine/card.frag.glsl', import.meta.url), 'utf8');
const vert = readFileSync(new URL('../src/engine/card.vert.glsl', import.meta.url), 'utf8');

test('shader exposes every optical control as an independent uniform', () => {
  for (const key of ['uArt','uBackgroundMask','uCharacterMask','uPointer','uFoilShift','uTilt','uFoil','uGlare','uGlitter','uBorder','uMetal','uDetail','uMode','uSeed']) {
    assert.match(frag, new RegExp(`uniform\\s+\\w+\\s+${key}\\s*;`), `Missing shader uniform ${key}`);
  }
});

test('character masking, rim and sparkle are separate effects', () => {
  assert.match(frag, /uMode == 0 \? 1\.0 : background/);
  assert.match(frag, /float rim = edgeBand\(uv\)/);
  assert.match(frag, /contourSparkle\(uv, uTilt\)/);
  assert.match(frag, /scatteredSparkle\(uv, uGlitter/);
});

test('front-facing shader includes correct input UV and sRGB output handling', () => {
  assert.match(vert, /vUv = uv/);
  assert.match(frag, /texture2D\(uArt, uv\)/);
  assert.match(frag, /#include <colorspace_fragment>/);
});


test('v0.2 narrow spectral flash, antialiased grating, metallic undercoat and vintage stamps are independent', () => {
  assert.match(frag, /float fineGrooves\(/);
  assert.match(frag, /fwidth\(phase\)/);
  assert.match(frag, /float starEmboss\(/);
  assert.match(frag, /float metalAmount = metalMask \* uMetal/);
  assert.match(frag, /float foilMask = clamp\(uFoil \* zone/);
  assert.match(frag, /float highlight = .* uGlare \* glareMask/);
  assert.match(frag, /if \(uMode == 3\)/);
});
