# 闪卡究极版：可组合光学特效引擎设计草案（非已批准架构）

日期：2026-10-20。此文为基于[三项目源码审计](../research/visual-reference-source-audit.md)提出的研发建议，尚未完成技术选型评审或 POC。

## 1. 目标与非目标

目标：普通用户可导入原创角色素材，制作多层卡面，为全卡、背景、角色与边框分配各自独立的镭射/闪粉/金属效果，实时通过鼠标或触控改变观察角度，保存可重新编辑的项目，并按指定姿态输出 PNG 或可重复的动画。

阶段一非目标：高精度波动光学、实物透镜精确仿真、实时摄像头必选、AI 自动制卡、多人协作、商业模板商城。

必须覆盖三种验证卡：A 全卡彩虹镭射；B 角色保持清晰，背景镭射与闪边各自可调；C 多帧变图与独立闪边组合（后续单独验收）。

## 2. 核心模块与数据流

1. AssetStore：本地图片/纹理/遮罩的文件与元数据，附来源/使用许可；不将云端 URL 当作项目的唯一数据源。
2. CardDocument：尺寸、图层树、文案、图像变换、效果参数、版本；与预览角度分离。
3. MaskEditor：通用灰度/alpha 遮罩、笔刷、边框区域与自动角色分割结果的修正。
4. InputAdapter：鼠标、触控、可选 deviceorientation / face tracking 输入统一转到 ViewState；包含校准/阻尼。
5. MaterialEngine：由区域遮罩、材质配方、纹理、view/light state 生成可控结果；独立 foil、glitter、glare、metal、etch、lenticular 模块。
6. CardRenderer：先使用一个稳定的 GPU 卡片复合管线，不将整个编辑器附属到现成展示 App；同一数据输入提供预览与导出。
7. Exporter：指定时间/角度/画布尺寸的确定性渲染；静态 PNG、后续动画帧/WebM；用户工程文档与资源打包分离于观赏图。
8. Tests：Shader 编译 / uniform 合同 / mask 边界 / 多角度截图差分 / 重新打开一致性 / 浏览器导出 / 性能预算。

建议第一轮优先尝试 TypeScript + WebGL2/Three.js 的 ShaderMaterial 以降低同时开发 shader 管理与 3D 输入的成本；编辑器 2D 画布层使用独立技术。**React/Vue/Svelte 仍待 PoC 选型**；不可把目前源码参考自动当作用户已经批准的框架决策。CSS 镭射方案作为视觉对照与可能的轻量预览备选，不依赖被排除的仓库 #3/#4/#5。

## 3. 最小数据契约（草案）

- Document: schemaVersion, cardSize, assets, layers, effects, presets, exportSettings。
- Layer: id, type(image/text/vector/group), transform, opacity, blendMode, zOrder, sourceAssetId。
- Effect: id, kind(foil/glitter/glare/metal/etch/lenticular), enabled, maskAssetId, shaderPreset, uniformParams, blendMode, strength, seed。
- ViewState: pointerUV(x,y), cardRotation(x,y), eyePosition(optional), lightDirection, time; **属于运行时输入，不强制写入工程文档**。
- RenderContext: document, assetRegistry, viewState, outputResolution, colorSpace, qualityTier。
- ExportRequest: format, resolution, frameCount, deterministicViewPath, backgroundMode, assetsEmbedded。

推荐对材质参数做 schema 校验，令编辑器控制面板与 Uniform Registry 从同一声明表生成。对材料的 RGB 值和纹理资源做授权标记，避免误把第三方演示贴图打包。

## 4. 图层与合成顺序

先按用户编辑图层得到 BaseColor；按 region mask 分别求取 Foil、Glitter、Etch、Glare、Metal 的 contribution，再依确定顺序混合。最终输出边缘 alpha、色彩空间转换及合适的抗锯齿。

场景参考：

A. 底图 1 层 + 全幅 mask 1 层 + rainbow foil 与 glare 两层。
B. 背景与角色独立资源 + 背景 mask + 独立的 rim/border mask + 各自 foil shader；角色区域不因背景光泽而泛白。
C. 多帧视图层根据 view angle 选择/混合画面（与 holographic foil 算法不同）+ 镭射边框 + glare。真实光栅 interlacing/DPI/LPI 印刷是独立输出管线。

不要把 cardRotation、foilPhase、glarePosition、texturePan 锁成同一数值：按每种材质的 ResponseFunction 设计独立映射。

## 5. 推荐的一组最小 Shader 合同

每个基础材质共享：

- common: baseTex, maskTex, cardUV, viewDirection, lightDirection, pointerUV, time, intensity, seed。
- foil: spectrumPalette, bandFrequency, bandAngle, angularShift, spatialScale。
- glitter: particleDensity, particleSize, threshold, angularFalloff, scatterSeed。
- glare: hotspotCenter, hotspotRadius, softness, glareStrength。
- edge: borderMask, borderWidth, rimStrength, directionality。
- lenticular: viewTextures[], viewCount, angleRange, switchMode, phase。

Renderer 必须提供缺失纹理 fallback（不是简单地在无 mask 时把正面换成背面），并验证每个 shader preset 在 mask=0、mask=1、edge alpha 条件下的输出。

## 6. 建议 PoC 次序与验收

**PoC 0：纯原创基础素材与角度信号**
- 实现导入任意 JPG/PNG、本地持有资产、卡片姿态/镜面反光分离；鼠标/触控平滑。提供 0°, 左右/上下 ±15° 的姿态快照。
- 验收：静止时不同帧结果一致；同一预设相同 seed 和角度输出一致；无源端网络依赖。

**PoC 1：材质独立组合**
- 全卡 foil；背景 foil+独立闪边 mask；局部 glitter。
- 验收：关闭任一层不改变其他层的编辑数据；遮罩外效果为零；角色边缘无明显光晕/露白；导出快照与浏览器预览结构一致。

**PoC 2：高保真 Shader**
- 程序化彩虹条纹、局部晶粒、etched contour sparkle，参考 CSS 与 Pokebox 做原创实现，逐角度比对；添加 Shader uniform 自动检测与 GPU 编译回归。
- 验收：至少三种光学观感主观评审通过；WebGL2 不可用时显示明确退化预览，不白屏。

**PoC 3：多视图**
- 2–5 帧视角导入与离散切换、光栅/边框独立控制。
- 验收：切换次序可预测；不把单帧伪视差冒充完整的物理光栅立体；明确区分数字卡与实物打印要求。

**最后：编辑器闭环**
- 图层面板、可视遮罩、素材导入、参数面板、Undo/Redo、保存/重开、导出；浏览器端性能预算和许可证检查纳入发布门槛。

## 7. 实施门槛与待决事项

- GPL 项目的算法思想可在独立实现中参考，但代码/纹理是否复用须先定版权及发布策略。
- Pokebox MIT 的源代码授权与角色/图片/云端素材授权不可混为一谈。
- 目标运行设备最低规格、可接受的移动端 FPS / 纹理内存、导出分辨率尚未由 Principal 决定；第一轮 POC 测试后再建立数字阈值。
- 是否需要实体光栅印刷、是否制作完整的立体变图编辑器，是后续阶段独立产品范围判断。
- 不将排除的 cards-css、hover-tilt、Card Animation React 列为技术候选或基础依赖。

**研发建议（待批准）：先做独立、可确定重现的 WebGL 光学材质最小内核，然后接可编辑的卡片文档；切勿先 Fork 全套 Pokémon 展示 UI。**
