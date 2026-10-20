precision highp float;
varying vec2 vUv;

uniform sampler2D uArt;
uniform sampler2D uBackgroundMask;
uniform sampler2D uCharacterMask;
uniform vec2 uPointer;
uniform vec2 uFoilShift;
uniform vec2 uTilt;
uniform float uFoil;
uniform float uGlare;
uniform float uGlitter;
uniform float uBorder;
uniform int uMode;
uniform float uSeed;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

vec3 rainbow(float phase) {
  // Three independent channels of a hand-tuned spectral palette.
  float t = fract(phase);
  vec3 a = vec3(0.54, 0.52, 0.56);
  vec3 b = vec3(0.38, 0.43, 0.39);
  return clamp(a + b * cos(TAU * (t + vec3(0.05, 0.38, 0.70))), 0.0, 1.0);
}

vec3 screenBlend(vec3 base, vec3 top) {
  return 1.0 - (1.0 - base) * (1.0 - top);
}

float edgeBand(vec2 uv) {
  // Independent rim reflection, not tied to the background effect mask.
  vec2 nearEdge = min(uv, vec2(1.0) - uv);
  float d = min(nearEdge.x * 0.714, nearEdge.y);
  float outer = smoothstep(0.007, 0.016, d);
  float inner = 1.0 - smoothstep(0.028, 0.040, d);
  return outer * inner;
}

float scatteredSparkle(vec2 uv, float density, vec2 tilt, float seed) {
  vec2 grid = uv * vec2(180.0, 252.0);
  vec2 cell = floor(grid);
  vec2 offset = vec2(hash21(cell + seed), hash21(cell + seed + 41.0));
  vec2 local = fract(grid) - (0.2 + 0.6 * offset);
  float dist = length(local);
  float occupancy = step(1.0 - (0.012 + density * 0.066), hash21(cell + seed + 131.0));
  float anglePhase = hash21(cell + 27.0) * TAU;
  float twinkle = pow(max(0.0, cos(anglePhase + tilt.x * 2.5 + tilt.y * 2.1)), 10.0);
  float star = 1.0 - smoothstep(0.02, 0.15, dist);
  return occupancy * twinkle * star;
}

float contourSparkle(vec2 uv, vec2 tilt) {
  vec2 dx = vec2(2.0 / 720.0, 0.0);
  vec2 dy = vec2(0.0, 2.0 / 1008.0);
  float leftMask = texture2D(uCharacterMask, uv - dx).r;
  float rightMask = texture2D(uCharacterMask, uv + dx).r;
  float bottomMask = texture2D(uCharacterMask, uv - dy).r;
  float topMask = texture2D(uCharacterMask, uv + dy).r;
  vec2 grad = vec2(rightMask - leftMask, topMask - bottomMask);
  float strength = clamp(length(grad) * 1.7, 0.0, 1.0);
  vec2 direction = normalize(tilt + vec2(0.001, 0.002));
  float catchLight = pow(max(0.0, dot(normalize(grad + vec2(0.0001)), direction)), 3.0);
  return strength * catchLight;
}

void main() {
  vec2 uv = vUv;
  vec4 art = texture2D(uArt, uv);
  if (art.a < 0.005) { discard; }

  float background = texture2D(uBackgroundMask, uv).r;
  float character = texture2D(uCharacterMask, uv).r;
  float zone = uMode == 0 ? 1.0 : background;
  float rim = edgeBand(uv);

  float diagonal = dot(uv, normalize(vec2(0.67, 0.74)));
  float theta = diagonal * 3.75 + uFoilShift.x * 0.82 + uFoilShift.y * 0.67;
  float interference = sin(theta * TAU * 1.5 + sin(diagonal * 13.0) * 0.7);
  vec3 foilSpectrum = rainbow(theta + interference * 0.038);
  float darkStripe = 0.72 + 0.28 * cos(theta * TAU * 2.8);
  float foilStrength = uFoil * zone * (0.45 + 0.25 * darkStripe);
  if (uMode == 2) foilStrength *= 0.82;

  // Luminance-preserving application: the original illustration stays legible.
  vec3 result = art.rgb;
  vec3 foilColor = screenBlend(result * 0.78, foilSpectrum * (0.62 + 0.16 * darkStripe));
  result = mix(result, foilColor, clamp(foilStrength, 0.0, 0.85));

  // Light hotspot travels differently from the rainbow interference bands.
  vec2 elliptical = (uv - uPointer) * vec2(0.95, 1.4);
  float hotspot = exp(-dot(elliptical, elliptical) * 11.0);
  float sheath = exp(-abs(dot(uv - uPointer, normalize(vec2(0.69, -0.72)))) * 16.0);
  float glareMask = uMode == 0 ? 1.0 : mix(background, rim, 0.22);
  float glare = (hotspot * 0.47 + sheath * 0.20) * uGlare * glareMask;
  result = screenBlend(result, vec3(0.85, 0.93, 1.0) * glare);

  // Independently controllable foil rim; variable response opposite to main spectrum.
  vec3 edgeSpectrum = rainbow(uv.y * 3.0 - uv.x * 2.1 - uFoilShift.x * 1.3 + uFoilShift.y * 0.9 + 0.32);
  float edgeReflection = 0.28 + 0.72 * pow(0.5 + 0.5 * sin((uv.x + uv.y) * 15.0 - uTilt.x * 4.0 + uTilt.y * 2.0), 2.0);
  result = screenBlend(result, edgeSpectrum * rim * uBorder * (0.40 + edgeReflection * 0.60));

  // Sparse deterministic micro-particles, confined to material-eligible regions.
  float scatterMask = uMode == 0 ? 0.50 : (uMode == 1 ? background * 0.22 : 0.62 + character * 0.26);
  float particle = scatteredSparkle(uv, uGlitter, uTilt, uSeed) * scatterMask * uGlitter;
  result = screenBlend(result, vec3(0.82, 0.93, 1.0) * particle * 1.8);

  // Simulated contour relief for the cosmic preset only; independent foil control.
  if (uMode == 2) {
    float relief = contourSparkle(uv, uTilt);
    result = screenBlend(result, vec3(0.72, 0.92, 0.93) * relief * uGlitter * 0.7);
    float cosmosWash = 0.06 + 0.04 * sin(uv.y * 24.0 + uTilt.y * 5.0);
    result = mix(result, screenBlend(result, vec3(0.28, 0.18, 0.34)), cosmosWash * background);
  }

  gl_FragColor = vec4(clamp(result, 0.0, 1.0), art.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
