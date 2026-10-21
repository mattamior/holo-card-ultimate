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
uniform float uMetal;
uniform float uDetail;
uniform int uMode;
uniform float uSeed;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

vec3 rainbow(float phase) {
  // Direction-dependent approximation of a narrow-band interference spectrum.
  float t = fract(phase);
  vec3 a = vec3(0.49, 0.48, 0.50);
  vec3 b = vec3(0.49, 0.47, 0.49);
  return clamp(a + b * cos(TAU * (t + vec3(0.02, 0.34, 0.68))), 0.0, 1.0);
}

vec3 screenBlend(vec3 base, vec3 top) {
  return 1.0 - (1.0 - base) * (1.0 - top);
}

float edgeBand(vec2 uv) {
  vec2 nearEdge = min(uv, vec2(1.0) - uv);
  float d = min(nearEdge.x * 0.714, nearEdge.y);
  float outer = smoothstep(0.006, 0.014, d);
  float inner = 1.0 - smoothstep(0.030, 0.040, d);
  return outer * inner;
}

float scatteredSparkle(vec2 uv, float density, vec2 tilt, float seed) {
  vec2 grid = uv * vec2(180.0, 252.0);
  vec2 cell = floor(grid);
  vec2 offset = vec2(hash21(cell + seed), hash21(cell + seed + 41.0));
  vec2 local = fract(grid) - (0.2 + 0.6 * offset);
  float dist = length(local);
  float occupancy = step(1.0 - (0.008 + density * 0.062), hash21(cell + seed + 131.0));
  float anglePhase = hash21(cell + 27.0) * TAU;
  float twinkle = pow(max(0.0, cos(anglePhase + tilt.x * 3.8 + tilt.y * 2.9)), 16.0);
  float star = 1.0 - smoothstep(0.012, 0.115, dist);
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

float fineGrooves(vec2 uv, vec2 tilt, float detail) {
  // Pixel-width aware groove attenuation: avoid aliasing on lower resolution previews.
  vec2 axis = normalize(vec2(0.86, 0.51));
  float phase = dot(uv, axis) * mix(48.0, 170.0, detail) * TAU
    + sin(uv.y * 19.0 + tilt.x * 2.0) * 0.35;
  float pixelWidth = fwidth(phase);
  float fade = 1.0 - smoothstep(1.7, 6.0, pixelWidth);
  return (0.5 + 0.5 * cos(phase)) * fade;
}

float starEmboss(vec2 uv, vec2 tilt, float seed) {
  // Dense but deliberately non-random-looking stamped vintage star field.
  vec2 grid = uv * vec2(43.0, 60.0);
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float marked = step(0.83, hash21(cell + seed + 19.0));
  float phase = hash21(cell + seed * 3.0) * TAU;
  float catchLight = pow(max(0.0, cos(phase + tilt.x * 4.1 - tilt.y * 3.8)), 8.0);
  float armH = (1.0 - smoothstep(0.012, 0.075, abs(local.y))) * (1.0 - smoothstep(0.02, 0.33, abs(local.x)));
  float armV = (1.0 - smoothstep(0.012, 0.075, abs(local.x))) * (1.0 - smoothstep(0.02, 0.33, abs(local.y)));
  return max(armH, armV) * marked * catchLight;
}

void main() {
  vec2 uv = vUv;
  vec4 art = texture2D(uArt, uv);
  if (art.a < 0.005) { discard; }
  float background = clamp(texture2D(uBackgroundMask, uv).r, 0.0, 1.0);
  float character = clamp(texture2D(uCharacterMask, uv).r, 0.0, 1.0);
  float zone = uMode == 0 ? 1.0 : background;
  float rim = edgeBand(uv);
  float tiltAmount = clamp(length(uTilt) * 0.70, 0.0, 1.0);

  // Metallic undercoat is separate from the rainbow layer and respects masks.
  // Keep dark artwork ink/detail legible instead of flooding it with a color screen.
  float metalMask = uMode == 0 ? 0.92 : background;
  if (uMode == 2) metalMask = mix(background, character, 0.13);
  vec3 result = art.rgb;
  float brushed = 0.5 + 0.5 * sin(uv.y * 330.0 + uv.x * 47.0);
  vec3 silver = mix(vec3(0.44, 0.49, 0.56), vec3(0.82, 0.84, 0.85), brushed * 0.26);
  float metalAmount = metalMask * uMetal * (0.16 + 0.08 * tiltAmount);
  result = mix(result, screenBlend(result * 0.82, silver * 0.45), metalAmount);

  // Fine grating + angled diffraction: spectral phase and brightness envelope
  // shift at different rates and directions with tilt.
  vec2 foilAxis = normalize(vec2(0.85, 0.53));
  float coordinate = dot(uv, foilAxis);
  float angularPhase = dot(uFoilShift, vec2(1.75, -1.28))
    + dot(uTilt, vec2(0.25, -0.17));
  float spectralPhase = coordinate * 5.1 + angularPhase * 0.95 + sin(uv.y * 17.0) * 0.016;
  vec3 foilSpectrum = rainbow(spectralPhase);
  float grating = fineGrooves(uv, uTilt, uDetail);
  float facet = pow(max(0.0, cos((coordinate * 8.6 + angularPhase * 1.75) * TAU)), 12.0);
  float secondaryFacet = pow(max(0.0, cos((uv.y * 2.15 - uv.x * 2.9 - angularPhase * 0.48) * TAU)), 18.0);
  float foilMask = clamp(uFoil * zone, 0.0, 1.0);
  float lightEnvelope = 0.18 + 0.74 * facet + 0.45 * secondaryFacet;
  float grooveContrast = 0.52 + (grating - 0.5) * mix(0.08, 0.70, uDetail);
  vec3 foilColor = foilSpectrum * lightEnvelope * grooveContrast;
  // Keep printed character ink; the foil flashes are not a translucent rainbow blanket.
  result = screenBlend(result, foilColor * foilMask * (0.36 + 0.36 * uMetal));
  result *= 1.0 - foilMask * (0.055 + 0.075 * (1.0 - facet)) * uMetal;

  // Sharp view-dependent light reflection independent of diffraction phase.
  vec2 lightUV = vec2(0.5) + (uPointer - vec2(0.5)) * 1.34;
  vec2 delta = uv - lightUV;
  float spot = exp(-dot(delta * vec2(1.2, 1.7), delta * vec2(1.2, 1.7)) * 36.0);
  float streak = exp(-abs(dot(delta, normalize(vec2(-0.78, 0.63)))) * 40.0);
  float razor = exp(-abs(dot(delta, normalize(vec2(0.71, 0.70)))) * 150.0);
  float glareMask = uMode == 0 ? 1.0 : clamp(background + rim * 0.8, 0.0, 1.0);
  float highlight = (spot * 0.8 + streak * 0.36 + razor * 0.16) * uGlare * glareMask;
  result = screenBlend(result, vec3(0.98, 0.99, 1.0) * highlight * 0.79);

  // Separate rim optical response: metallic edge base plus fast angular flash.
  vec3 edgeSpectrum = rainbow(uv.y * 3.5 - uv.x * 1.8 - angularPhase * 1.6 + 0.32);
  float edgeBeam = pow(max(0.0, cos((uv.x * 1.8 + uv.y * 2.8 + uTilt.x * 0.7 - uTilt.y * 1.1) * TAU)), 9.0);
  float edgeMetal = (0.24 + edgeBeam * 1.2) * uBorder * rim;
  result = screenBlend(result, mix(vec3(0.90, 0.92, 0.95), edgeSpectrum, 0.73) * edgeMetal);

  float scatterMask = uMode == 0 ? 0.38 : (uMode == 1 ? background * 0.26 : 0.47 + character * 0.33);
  float particle = scatteredSparkle(uv, uGlitter, uTilt, uSeed) * scatterMask * uGlitter;
  result = screenBlend(result, vec3(0.94, 0.98, 1.0) * particle * 2.1);

  if (uMode == 2 || uMode == 3) {
    float relief = contourSparkle(uv, uTilt);
    result = screenBlend(result, vec3(0.92, 0.98, 1.0) * relief * uGlitter * 1.25);
  }
  if (uMode == 2) {
    float cosmos = 0.08 * sin(uv.y * 34.0 + uTilt.y * 9.0);
    result = screenBlend(result, vec3(0.33, 0.25, 0.55) * (0.5 + cosmos) * background);
  }
  if (uMode == 3) {
    // Vintage snack-pack insert: stamped stars + halftone guilloché only on foil regions.
    float embossed = starEmboss(uv, uTilt, uSeed) * uGlitter * (background * 0.8 + rim * 0.6);
    vec3 starTint = mix(vec3(0.96, 0.84, 0.42), rainbow(spectralPhase + 0.17), 0.34);
    result = screenBlend(result, starTint * embossed * 1.5);
    vec2 halftone = fract(uv * vec2(84.0, 117.0)) - 0.5;
    float dots = 1.0 - smoothstep(0.06, 0.29, length(halftone));
    float dotPhase = 0.5 + 0.5 * sin(angularPhase * TAU * 2.0 + uv.y * 22.0);
    result = screenBlend(result, vec3(0.71, 0.80, 1.0) * dots * dotPhase * background * uDetail * 0.14);
  }

  gl_FragColor = vec4(clamp(result, 0.0, 1.0), art.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
