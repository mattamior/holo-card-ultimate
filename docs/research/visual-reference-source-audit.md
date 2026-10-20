# 核心视觉参考项目源码审计（第一轮）

日期：2026-10-20。范围仅限三个已获 Principal 认可的视觉参考项目；本次为 GitHub 静态源码阅读，**未克隆构建、未在浏览器运行或进行视觉/性能实测**。

## 0. 固定源码版本（避免把未来变更误认为本次结论）

| 项目 | 本次审计的 main HEAD | 上游许可（仓库 LICENSE） |
| --- | --- | --- |
| simeydotme/pokemon-cards-css | acb1197633e749a1fba4412231db2f6581586d00 | GPL-3.0 |
| simeydotme/pokemon-cards-151 | 98030f941cdc4919b648457200277e29b60d5f5a | GPL-3.0 |
| selop/pokebox | 7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80 | MIT |

来源为 GitHub 原仓库、package.json、LICENSE、源码树及实际文件内容，而非第三方转载。源码链接分别：

- [CSS repo pinned](https://github.com/simeydotme/pokemon-cards-css/tree/acb1197633e749a1fba4412231db2f6581586d00)
- [151 repo pinned](https://github.com/simeydotme/pokemon-cards-151/tree/98030f941cdc4919b648457200277e29b60d5f5a)
- [Pokebox pinned](https://github.com/selop/pokebox/tree/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80)

## 1. Pokémon Cards CSS：以 CSS 合成模拟镭射材质

**源码证据**

1. [Card.svelte 61–145](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/src/lib/components/Card.svelte#L61-L145)：相对鼠标坐标转换为卡片倾角、背景纹理偏移、反光位置和不透明度；更新经 requestAnimationFrame 合并，并使用 Svelte motion spring 形成惯性。
2. [Card.svelte 270–365](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/src/lib/components/Card.svelte#L270-L365)：实时输出 CSS 自定义属性 pointer-x/y、background-x/y、pointer-from-center、rotate-x/y、card-opacity；方向传感器作另一种输入。背景坐标不是原指针坐标，通常限制到 37%–63% 与 33%–67%。
3. [Card.svelte 426–471](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/src/lib/components/Card.svelte#L426-L471)：前图、shine、glare 作为重叠 DOM 层，同时注入 foil 和 mask 资源地址。
4. [regular-holo.css](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/public/css/cards/regular-holo.css)：多重 repeating-linear-gradient / radial-gradient，加 background-blend-mode、mix-blend-mode、filter；反射层随 pointer/background 参数变化。
5. [reverse-holo.css](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/public/css/cards/reverse-holo.css)：背景光泽叠加与纹理，按卡牌分类对亮度调整。
6. [rainbow-holo.css](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/public/css/cards/rainbow-holo.css)：移动彩虹色带、不同方向混色、foil 纹理和局部 glare。
7. [CardProxy.svelte 97–234](https://github.com/simeydotme/pokemon-cards-css/blob/acb1197633e749a1fba4412231db2f6581586d00/src/lib/components/CardProxy.svelte#L97-L234)：基于具体卡牌 set、rarity、number 构建云端 mask / foil 素材路径；并不是通用用户素材编辑器。

**原理抽象**

观察状态 P = (pointer.x, pointer.y, rotationX, rotationY, centerDistance)，材质响应中再派生背景滚动 B 与反射中心 G。多层纹理颜色分别以 overlay、hard-light、color-dodge、screen 等模式合成，最后叠到清晰的卡片底图。这是**依赖输入与光学层联动的视觉仿真**，不是物理精确的波动光学求解，也不是只有 CSS transform 的简单卡片翻转。

**适合借鉴**：角度相关的虹彩/条纹节律、混合模式分层、稀有卡视觉分类、互动阻尼、固定观察角度截图。**不要照搬**：以某一 IP 的 rarity / set 命名卡面材质；运行时必须联网加载的卡牌专属材质资产。

## 2. Pokémon Cards 151：材质层进一步细分

**源码证据**

1. [Card.svelte 229–258](https://github.com/simeydotme/pokemon-cards-151/blob/98030f941cdc4919b648457200277e29b60d5f5a/src/lib/components/Card.svelte#L229-L258)：继续保持独立的 pointer、background、rotation、opacity 变量，并增加 rotate-delta。
2. [Card.svelte 350–395](https://github.com/simeydotme/pokemon-cards-151/blob/98030f941cdc4919b648457200277e29b60d5f5a/src/lib/components/Card.svelte#L350-L395)：同一 front 内同时出现 shine、glitter、glare、glare2 的容器。
3. [base.css 245–280](https://github.com/simeydotme/pokemon-cards-151/blob/98030f941cdc4919b648457200277e29b60d5f5a/public/css/cards/base.css#L245-L280)： shine 和 glitter 独立层，依靠滤镜与 mix-blend-mode 复合。
4. [ex-special-illustration-rare.css 80–143](https://github.com/simeydotme/pokemon-cards-151/blob/98030f941cdc4919b648457200277e29b60d5f5a/public/css/cards/ex-special-illustration-rare.css#L80-L143)：glitter 使用 --iri9 / --iri8 / --iri7 等不同纹理；mask-image 依据 --mask 控制，两个伪元素纹理向相反方向偏移，可生成丰富微闪颗粒。
5. [poke-ball-holo.css 19–125](https://github.com/simeydotme/pokemon-cards-151/blob/98030f941cdc4919b648457200277e29b60d5f5a/public/css/cards/poke-ball-holo.css#L19-L125)：特定球纹依赖内外分开的图样贴图，加两套不同方向的彩虹条纹、噪声和局部亮度控制，是「材质纹理 + 几何局部区域」组合的例子。
6. [CardProxy.svelte 92–124](https://github.com/simeydotme/pokemon-cards-151/blob/98030f941cdc4919b648457200277e29b60d5f5a/src/lib/components/CardProxy.svelte#L92-L124)：素材仍以卡牌编号与类型来选择远程 foil/etches/mask，并非自由编辑。

**原理抽象**

「镭射基础膜」与「闪粉」「浮雕纹理」「镜面高光」可以是不同配置层。反光方向与粒子纹理偏移可不一致，甚至相反。特定图样（如重复球形）本质是遮罩/纹理设计，不应与产品全局的卡片数据模型绑定。

**适合借鉴**：多效果复合、纹理粒径/随机种子、闪粉独立遮罩、纹理朝向/位移、可叠加预设。**不要照搬**：151 专属素材和基于稀有度的条件分支。

## 3. Pokebox：Three.js、GLSL 与视点驱动

**源码证据**

1. [package.json](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/package.json)：Vue 3、Three.js、Pinia、TypeScript、Vite、MediaPipe；Vitest / Playwright 测试工具。
2. [useThreeScene.ts 408–435](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/composables/useThreeScene.ts#L408-L435)：离轴投影。以观测眼点 (ex, ey, ez)、屏幕左右上下界和 near/ez 分别计算 left/right/bottom/top，再写入 camera.projectionMatrix.makePerspective。这比只扭转贴图更接近「透过一个固定窗口看场景」。
3. [useThreeScene.ts 483–491](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/composables/useThreeScene.ts#L483-L491)：对眼点进行平滑插值，再同步离轴相机。
4. [useFaceTracking.ts](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/composables/useFaceTracking.ts)：MediaPipe 检测人脸、估计相对眼点，通过 targetEye 驱动场景；摄像头可选。
5. [useGyroscope.ts](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/composables/useGyroscope.ts) 与 [useMouseTilt.ts](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/composables/useMouseTilt.ts)：设备姿态（含权限与校准）及鼠标移动均可产生倾角；并保持视点位置与卡片朝向两类信号。
6. [buildCard.ts 43–58, 100–177](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/three/buildCard.ts#L100-L177)：选择不同片元 Shader；将 card、back、mask、foil、glitter、noise 等纹理及多种 uniform 送给 ShaderMaterial。
7. [ShaderUniformUpdater.ts 27–70](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/three/ShaderUniformUpdater.ts#L27-L70)：通过世界空间的眼点/卡片中心方向，投影成卡面局部 (0..1) UV 坐标，再设置 uPointer、uBackground、uPointerFromCenter 等 uniform。
8. [shaderRegistry.ts](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/data/shaderRegistry.ts)：集中维护 Shader 参数名与配置路径对应关系，供创建材质及响应式更新共同使用。
9. [regular-holo.frag](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/shaders/regular-holo.frag)：纹理采样、灰度 mask、角度驱动虹彩、重复斜线、高光、图层合成，属于程序化实现的 CSS 外观迁移。
10. [special-illustration-rare.frag 149–252](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/shaders/special-illustration-rare.frag#L149-L252)：独立处理银色基底、虹彩 wash、三组闪粉纹理，并以 dFdx/dFdy 对 foil 纹理近似表面梯度，依据倾斜方向强化浮雕轮廓边缘闪光。
11. [common/holo-shine.glsl](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/src/shaders/common/holo-shine.glsl)：可复用的按遮罩与角度合成彩虹反光函数。
12. [docs/SHADER-TESTING.md](https://github.com/selop/pokebox/blob/7f6b1b4b6bb4684f80b49d1318b2a1c90a357b80/docs/SHADER-TESTING.md)：测试分为静态 uniform 检查与 Shader Material / WebGL 验证；测试文档的断言强度仍须通过实际执行核实。

**原理抽象**

- 光学信息分为**观察点/相机**、**表面方向/卡片姿态**、**材质采样与混色**三条通道。单纯 pointer 不等同真实 3D 观察点。
- Renderer 应支持独立的 Shader 风格与 Uniform 注册，并能在同一项目中组合多种材质区域。
- 浮雕/碎纹边缘反光可用纹理梯度 + 倾斜方向近似，不必全局真实建模。
- **边界**：该项目是观看/展示程序。没有发现通用拖拽卡面编辑器、用户创建的遮罩画笔、保存可编辑项目的完整工作流、可确定复现效果的多帧导出。
- **资产依赖**：数据层从 front/holo-mask/etch-foil 等 URL 加载图片；部署文档还描述大量独立资产，复现效果前须取得独立可使用的素材，不能假定 git clone 后资产完整。
- **Shader 代码审计注意**：regular-holo.frag 的「effect 不存在」提前返回路径在源码里采用卡背纹理，需在构建、实际渲染与测试中检查是否符合预期；目前只是静态风险提示，不能断定运行中已出现缺陷。

## 4. 交叉对比：共同光学机制 vs 实现差异

| 机制 | #1 CSS | #2 CSS 151 | #6 Pokebox | 我们的抽象建议 |
| --- | --- | --- | --- | --- |
| 卡片基础图 | DOM img | DOM img | GPU Texture | 基础 artwork layer |
| 彩虹偏移 | CSS gradients | CSS gradients | GLSL sampling | angle-response material |
| 遮罩 | CSS mask / 远程贴图 | 细分 mask / foil | uMaskTex / uFoilTex | 用户可编辑 grayscale mask |
| 闪粉 | 多数通过材质纹理模拟 | 明确 glitter 层 | 程序和纹理混合 | 独立粒子/纹理 layer |
| 高光 | glare DOM 叠层 | glare + glare2 | GLSL 合成 | 光照/高光 layer |
| 输入 | pointer + orientation | pointer + orientation | pointer + gyro + face | 统一 InputState |
| 空间观察 | 3D CSS tilt | 3D CSS tilt | off-axis perspective | 可插拔 ViewModel |
| 运行架构 | Svelte3/CSS | Svelte3/CSS | Vue3/Three/GLSL | 独立编辑器 + 渲染器 |
| 制作编辑 | 无完整 workflow | 无完整 workflow | 无完整 workflow | 自主开发 |

**重要区分**：以上三者都以“表现光学视觉”为目标，不是严格的物理衍射仿真，也未构成真正多视角光栅变图工作流。真实 2–N 帧光栅切换、DPI/LPI 的实体输出，应单独成为可选模块，不能标称现有 Shader 已实现。

## 5. 合规与工程风险（优先处理）

1. #1 / #2 的 LICENSE 为 GPL-3.0。研究其运行原理和重新独立实现通用思想，不等于可以把 CSS/JS、纹理或卡片素材直接复制到闭源产品。是否采取 GPL 兼容许可、申请授权或独立实现需作明确选择；此处不是法律意见。
2. #6 仓库主代码 LICENSE 为 MIT，但不代表宝可梦角色卡图、第三方纹理、字体、云端资产均按 MIT 授权。须逐个建立资产 provenance 清单。
3. 远程纹理加载涉及断网、CORS、许可证、数据源稳定性和截图/视频导出 Canvas 污染风险。MVP 必须以可合法打包的原创测试素材完成首套离线验收。
4. 多 pass、高分辨率贴图、DOF/Bloom、设备像素比会影响移动端性能；要按设备能力降级。**当前未实测 FPS，不应给出数字化性能结论。**
5. 摄像头、陀螺仪需用户明确授权/浏览器权限；首版不能依赖这些输入才能使用。
6. 要测试多种混合模式下的 alpha / sRGB / linear 混色一致性，避免 CSS 预览与 WebGL 导出差异。
7. 记录固定源码 commit；后续引用上游新功能时必须标注重新审计版本。

## 6. 第一轮结论与明确未完成项

**源码已支持的判断**：#1/#2 提供最有价值的外观设计与分层规律；#6 的 GPU 材质管线、参数注册、世界空间视角转换和 Shader 测试结构更适合参考产品架构。三者皆需经过适配与许可审查，不能直接替代零代码制卡产品。

**尚未完成**：运行三上游 Demo 的对照录屏；分析各材质的逐像素色彩偏差；移动端 FPS、显存、CORS 和离线测试；原创 Shader 原型；实体光栅实物测试。不要把本审计称为这些测试的通过证明。

下一步的可执行架构建议另见 [../architecture/optical-engine-proposal.md](../architecture/optical-engine-proposal.md)。