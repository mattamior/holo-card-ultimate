import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, pointerUV, opticalState, linearResponse, PRESETS, normControl, presetSettings } from '../src/core-optics.js';

test('pointerUV handles boundaries and inverted screen y', () => {
  const rect = { left: 100, top: 80, width: 300, height: 400 };
  assert.deepEqual(pointerUV(100, 80, rect), { x: 0, y: 1 });
  assert.deepEqual(pointerUV(400, 480, rect), { x: 1, y: 0 });
  assert.deepEqual(pointerUV(250, 280, rect), { x: 0.5, y: 0.5 });
  assert.deepEqual(pointerUV(-100, 900, rect), { x: 0, y: 0 });
  assert.deepEqual(pointerUV(250, 280, { ...rect, width: 0 }), { x: 0.5, y: 0.5 });
});

test('tilt, highlight and foil phase respond independently', () => {
  const center = opticalState({ x: 0.5, y: 0.5 });
  assert.ok(Math.abs(center.tiltX) < 1e-12);
  assert.equal(center.tiltY, 0);
  assert.equal(center.highlightX, 0.5);
  assert.equal(center.foilX, 0);
  const right = opticalState({ x: 1, y: 0.5 });
  assert.equal(right.tiltY, 13);
  assert.notEqual(right.highlightX, right.foilX);
  assert.equal(right.foilX, 0.28);
});

test('controls are finite clamped values', () => {
  assert.equal(normControl(-10), 0);
  assert.equal(normControl(50), 0.5);
  assert.equal(normControl(150), 1);
  assert.equal(normControl(NaN), 0);
  assert.equal(clamp(8, 2, 6), 6);
});

test('motion filter converges and is framerate-aware', () => {
  assert.equal(linearResponse(0, 1, 0), 0);
  assert.ok(linearResponse(0, 1, 0.1) > 0);
  assert.ok(Math.abs(linearResponse(linearResponse(0,1,0.05), 1, 0.05) - linearResponse(0,1,0.1)) < 1e-12);
});

test('presets are complete and cloned, not aliased', () => {
  for(const [key, preset] of Object.entries(PRESETS)) {
    assert.equal(typeof preset.mode, 'number');
    const copy = presetSettings(key);
    assert.ok(Object.values(copy).every(value => value >= 0 && value <= 100));
    copy.foil = 0;
    assert.notEqual(PRESETS[key].foil, 0);
  }
});
