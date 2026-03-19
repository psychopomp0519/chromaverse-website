# 크로마버스 이미지 에셋 — AI별 최적화 최종 프롬프트

> A, B → **Gemini** | C → **Leonardo.ai** | D → **GPT (DALL-E)**
>
> 각 AI의 공식 프롬프트 가이드에 맞춰 최적화됨
> - Gemini: 카메라/사진 용어 + 감정 키워드 + 간결 시작 후 반복 정제
> - Leonardo: 서술형 명령어 (대화체 금지) + 네거티브 프롬프트 + 명시적 스타일
> - GPT/DALL-E: 5-7 핵심 디스크립터 + ChatGPT 자동 확장 활용 + 간결

---

## ==============================
## A. Landing (Gemini — 5개)
## ==============================

> **Gemini 팁**: 1-2문장 핵심 → 결과 확인 → 세부사항 추가로 반복 정제.
> 아래는 "첫 프롬프트"와 "정제용 후속 프롬프트"를 함께 제공.

### A-1. hero.webp (1920x1080)

**첫 프롬프트:**
```
A colossal sphere of pure white crystalline light shattering into millions of red, green, and blue fragments against a deep indigo cosmic void. Divine creation event, epic scale. Shot with a wide-angle lens, cinematic 16:9 composition, volumetric god rays, concept art quality.
```

**정제용 (결과가 부족하면 이어서):**
```
Make the explosion more dramatic — concentric rings of prismatic energy radiating outward like ripples in space. Add thin tendrils of primordial dark navy darkness seeping between the light fragments. The fragments should vary from large crystalline shards to microscopic luminous dust. More particle effects, like fireflies of color. No text, no characters. Painterly brushwork style.
```

### A-2. genesis.webp (1920x1080)

**첫 프롬프트:**
```
A cosmic duality scene split vertically. Left half: a radiant white-gold aurora entity emanating prismatic light, warm and solitary. Right half: an ancient primordial darkness of deep navy with crimson undertones, patient and meditative. They meet at a turbulent center line where light and dark spiral together. A diamond-shaped star hovers above. Wide-angle, 16:9 cinematic, symmetrical composition, creation myth aesthetic.
```

**정제용:**
```
Make the left side warmer — more gold, rainbow refractions streaming outward. Make the right side cooler — swirling slow tendrils of shadow, not evil but ancient. The center meeting line should have double-helix spirals with sparks flying outward. Background is deep space gradient from warm (left) to cool (right). No characters, no text.
```

### A-3. prismafall.webp (800x800, 정방형)

**첫 프롬프트:**
```
Close-up of a perfect sphere of white light cracking open like an egg, releasing cascading streams of crimson red, emerald green, and cerulean blue light downward. Golden cracks run through the sphere surface. Within each color stream, tiny humanoid-shaped motes of light are born. Square 1:1 format, macro lens feel, centered composition, dark indigo background, painterly, radiant glow effects.
```

### A-4. novel-silhouettes.webp (1920x1080)

**첫 프롬프트:**
```
Four silhouetted figures on a rocky hilltop at twilight, backs to camera, gazing at a vast fantasy landscape. Left to right: (1) tall lean man with ponytail holding a book, blue-gray glow edge, (2) broad-shouldered older man with arms crossed, green glow edge, (3) small tense androgynous teen with messy hair, left side red glow and right side void-black absorption, (4) very frail girl sitting on ground hugging knees, nearly invisible translucent glow. Twilight sky amber-to-indigo with faint prismatic aurora. 85mm telephoto lens, cinematic 16:9, low angle, backlit silhouettes, melancholic atmosphere.
```

**정제용:**
```
The silhouettes should be pure black against the sunset. Each figure's colored glow outline should be subtle — like a faint aura, not neon. The third figure's right side should be DARKER than the silhouette itself — absorbing light. The fourth figure should look almost transparent. Add a distant city with faint lights on the horizon. No faces visible. Mood: quiet before the storm.
```

### A-5. cta-prismafall.webp (1920x1080)

**첫 프롬프트:**
```
Bird's-eye aerial view of a fantasy continent with distinct color-coded biomes. Center: brilliant white-gold city radiating light. Northeast: volcanic red-orange desert with lava rivers. East: vast emerald forest with silver rivers. Southeast: crystalline blue mountains with frozen glowing lakes. Between zones: golden plains, purple floating islands, cyan bioluminescent coast. Outer edges: dark chaotic border zone transitioning to near-black darkness. Multi-colored lightning storms at borders. 45-degree aerial camera, drone shot, painterly fantasy cartography, 16:9, rich saturated colors. No text labels.
```

---

## ==============================
## B. World 히어로 (Gemini — 12개)
## ==============================

> **Gemini 팁**: B시리즈는 같은 세션에서 연속 생성하면 스타일 일관성 유지.
> 모든 B 프롬프트 끝에 항목 추가: `Ultrawide 21:9 crop, approximately 1200x630 proportions.`

### B-1. creation.webp

```
Looking UP from newly formed ground at a shattering white sphere in the sky — red, green, blue light raining down like divine waterfalls. Where red light touches ground, stone turns volcanic. Where green touches, plants sprout instantly. Where blue touches, crystals form. Dark tendrils of void curl between the light. Wide-angle upward shot, dramatic foreshortening, concept art, ultrawide 21:9 crop. No text.
```

### B-2. races.webp

```
Two groups of humanoid beings facing each other across a luminous divide. Left group: three figures with glowing vein-like patterns on their skin pulsing in red, green, blue — their eyes glow faintly. Right group: three figures with INVERTED dark patterns in deep navy, crimson, amber — their patterns absorb light, eyes like deep voids. A child with BOTH pattern types stands between them, reaching toward both sides. Dramatic side-lighting, group portrait composition, ultrawide 21:9 crop. No text.
```

### B-3. power.webp

```
Abstract energy diagram as fine art. Upper half: three ascending beams — red (fire, physical force), green (vines, healing), blue (neural networks, wave patterns) — converging into a white point above. Lower half: four descending streams — cyan (ice, chains), magenta (decay, wilting), amber (distortion, mirrors), black (void, hole in reality) — converging into a black singularity below. Where they intersect: crackling energy sparks. Symmetric vertical composition, dark charcoal gradient background, ultrawide 21:9 crop. No text.
```

### B-4. society.webp

```
Grand circular amphitheater in a white marble fantasy city showing visible social hierarchy through GLOW INTENSITY. Top tier: 2-3 figures with brilliant glowing skin patterns, golden clothes, radiating light. Middle tier: groups with moderate glow, ordinary clothing. Bottom tier: figures with barely visible ash-gray patterns, worn clothes, sitting in shadows cast by the brilliant ones above. Center stage: an official holding a prismatic measuring instrument. Classical architecture with crystal inlays. Ultrawide 21:9 crop. No text.
```

### B-5. religion.webp

```
Three fantasy temples side by side at sunset. Left: soaring white marble spire with golden light from stained glass, triumphant cathedral. Center: yin-yang circular structure of interweaving light and dark stone, trees growing through it, modest and harmonious. Right: dark obsidian pyramid descending INTO the earth, deep indigo bioluminescent glow from within, mysterious and meditative. Shared sacred plaza between them. Sunset light creates warm/neutral/cool zones. Ultrawide 21:9 crop. No text.
```

### B-6. geography.webp

```
Fantasy continent viewed from high altitude — painted satellite view. Center: brilliant white-gold city. NE: volcanic red-orange desert. E: dense emerald forest. SE: crystalline blue mountains. Between zones: golden grasslands, purple floating islands, cyan bioluminescent coast. Outer ring: chaotic scarred border zone. Far edges: near-black darkness. Painterly fantasy cartography style. Ultrawide 21:9 crop. No text labels, no map UI.
```

### B-7. history.webp

```
Vertical timeline as a single painting, time flowing top to bottom. Top: brilliant white explosion (world birth). Upper: cities forming, white city taking shape. Middle-upper: golden age with grand architecture. Middle: darkening era — void expanding, color-clash wars. Middle-lower: uneasy peace, rebuilt cities with scars. Bottom: four tiny silhouetted figures look upward at the entire history. East Asian scroll painting meets fantasy concept art. Ultrawide 21:9 crop. No text.
```

### B-8. glossary.webp

```
Ancient circular library — walls covered floor-to-ceiling in crystalline tablets glowing red, green, blue, navy, amber. Tablets display flowing fantasy script. High arched windows with prismatic light refracting through hanging crystal prisms, creating rainbow patterns on the floor. A lone scholar at a cluttered desk surrounded by floating holographic text projections and a warm desk lamp. Scholarly, warm atmosphere. Ultrawide 21:9 crop. No text.
```

### B-9. economy.webp

```
Bustling fantasy marketplace centered around glowing color-shifting crystal pillars. Market stalls with red-glowing weapons, green-luminescent herbs, blue-tinged tools. Currency: small crystalline coins that glow in different colors. Prism-powered machines assess value. Background: a massive colored-smoke refinery. Diverse crowd — some people glow brightly (wealthy), others dimly (workers). Vibrant, busy market scene. Ultrawide 21:9 crop. No text.
```

### B-10. growth.webp

```
A humanoid figure meditating, surrounded by five concentric layers of chromatic energy — innermost barely visible, each layer progressively brighter and more complex, outermost brilliant with geometric patterns. Above: a vertical spectrum gauge from dark (0) to brilliant (255). Background: gradient from dim gray (bottom) to prismatic brilliance (top). The figure's glowing skin patterns are visibly growing like time-lapse vines. Centered composition. Ultrawide 21:9 crop. No text.
```

### B-11. chromastorm.webp

```
A catastrophic color storm ravaging a landscape — the sky is a violent maelstrom of red, green, blue light crashing against cyan, magenta, amber, black darkness. Multi-colored lightning forks. The storm cloud has alive, tendril-like extensions reaching groundward. Central eye is absolute black void. Trees crystallizing into colored glass, buildings distorting, ground cracking with colored energy. Tiny fleeing figures in foreground. Storm fills 70% of sky. Apocalyptic beauty. Ultrawide 21:9 crop. No text.
```

### B-12. special-beings.webp

```
Three extraordinary beings in a void-like abstract space. Left: a humanoid whose body is a living crystal prism, refracting light into rainbows, semi-transparent, serene. Center: a glitch-like entity — their form shifts, reality fractures around them in visible cracks, colors clash on their body like a corrupted image file. Right: a child surrounded by floating orbs of impossible color combinations, eyes shifting between seven colors, both light and dark energy orbiting peacefully. Floating geometric shapes around them. Ultrawide 21:9 crop. No text.
```

---

## ==============================
## C. Characters (Leonardo.ai — 4개)
## ==============================

> **Leonardo 설정**:
> - Model: **Leonardo Phoenix** 또는 **DreamShaper v8**
> - Preset: **Illustration**
> - Dimensions: **768x1024** (3:4 세로)
> - Guidance Scale: **7**
> - 대화체 사용 금지 — 서술형 키워드 나열
> - 각 캐릭터 3장 생성 후 베스트 선택

### C-1. kai.webp — 기록관

**Prompt:**
```
upper body portrait, 28-year-old male scholar, lean build, shoulder-length messy dark brown-black hair in loose low ponytail, strands framing face, angular intelligent features, slight eyebags, dull matte blue-gray eyes without any glow, dry self-deprecating half-smile, light stubble, dark charcoal long coat with many pockets holding scrolls and tools, worn dark shirt underneath, leather satchel strap across chest, one hand holding thin metallic instrument with faint blue tip glow, extremely faint ash-gray calligraphic line patterns on neck and hands like fading ink barely visible, dimly lit archive room background with warm lantern sidelight and faint colored crystal tablets on shelves, Korean web novel illustration, semi-realistic anime, professional light novel cover art, painterly details, atmospheric lighting
```

**Negative Prompt:**
```
glowing eyes, bright skin patterns, muscular, action pose, armor, wings, horns, excessive accessories, chibi, cartoon, low quality, blurry, text, watermark
```

### C-2. coda.webp — 수호자

**Prompt:**
```
upper body portrait, 41-year-old male warrior protector, broad-shouldered stocky functional build, short-cropped dark hair with premature gray at temples, strong weathered square-jaw face, thin scar from left cheekbone to jaw, deep forest green eyes with subtle steady ember-like glow, calm watchful protective expression, reinforced leather armor with green-tinted dark metal shoulder and chest plates showing wear scratches and dents, exposed scarred forearms with clearly visible wave-pattern sound-wave-like glowing green vein markings pulsing rhythmically, large calloused hands, twilight forest clearing background with warm campfire glow from right and cool twilight from left, floating green particles, Korean web novel illustration, semi-realistic anime, professional light novel cover art, warm melancholic atmosphere
```

**Negative Prompt:**
```
young face, clean new armor, pretty boy, flashy effects, excessive glow, clean shaven, chibi, cartoon, low quality, blurry, text, watermark
```

### C-3. nix.webp — 이단자

**Prompt:**
```
upper body portrait, 19-year-old androgynous figure, small tense underweight stray-cat build, messy dark red-black hair falling heavily over right side of face partially hiding right eye, sharp thin fox-like angular features pointed chin, perpetually guarded defensive expression, HETEROCHROMIA critical detail left eye dull reddish-brown right eye PURE BLACK VOID absorbing light no visible iris no reflection like a hole in reality, black hoodie under worn dark red-brown jacket, right arm wrapped in dark bandages wrist to elbow, left hand fingerless gloves, LEFT side of body has faint irregular reddish glowing vein-like patterns like sputtering candle, RIGHT side has DARK VOID-BLACK inverse patterns that consume nearby light creating darkness-crack appearance on skin, the two pattern types meet at center body in jagged fault line border, shadowy night alley background wet cobblestones warm streetlight from left side cold void-darkness on right side, split lighting dramatic, Korean web novel illustration, semi-realistic anime, dramatic unsettling beauty
```

**Negative Prompt:**
```
cute, friendly, smiling, symmetrical face, both eyes same color, clean clothes, bright background, confident pose, chibi, cartoon, low quality, blurry, text, watermark
```

### C-4. ray.webp — 수수께끼

**Prompt:**
```
upper body portrait, late teens female extremely frail nearly translucent, very long almost-colorless platinum hair floating weightlessly in zero gravity, extremely pale almost-translucent skin with blue veins barely visible underneath, delicate porcelain breakable features, eyes so light almost TRANSPARENT like clear glass barely any iris pigmentation ghostly, gentle automatic reflex smile masking confusion and displacement not-quite-present feeling, simple clean slightly-too-large off-white long-sleeved shirt hanging loose borrowed appearance, hunched inward posture making herself smaller, IMPOSSIBLY COMPLEX beautiful intricate geometric fractal patterns covering visible skin hands neck collarbone like masterwork blueprint but ZERO GLOW completely non-luminous only visible as slightly raised embossed texture same pale color as skin, soft overexposed dreamlike background diffused warm light like standing in a cloud or memory, faint ghostly prismatic afterimages floating nearby, even soft lighting plus-one-exposure-stop minimal shadows, backlighting creating faint hair halo, Korean web novel illustration, semi-realistic anime, ethereal heartbreaking fragility
```

**Negative Prompt:**
```
dark background, strong shadows, glowing eyes, glowing skin patterns, muscular, confident expression, saturated colors, dark clothing, action pose, chibi, cartoon, low quality, blurry, text, watermark
```

---

## ==============================
## D. UI 장식 (GPT/DALL-E — 4개)
## ==============================

> **GPT 팁**: ChatGPT가 자동으로 프롬프트를 확장해줌. 간결하게 핵심만 전달.
> 결과가 부족하면 "Make it more subtle" 등으로 반복 요청.

### D-1. divider-light.webp (1200x40)

```
A minimal horizontal decorative divider, 1200 pixels wide and 40 pixels tall. A single thin glowing line that fades in from transparent on the left, peaks in the center with warm gold-to-amber-to-rose-gold gradient, then fades back to transparent on the right. Very soft glow aura. Light beige (#F5F0E8) or transparent background. Elegant, barely-there, like a golden thread of light.
```

### D-2. divider-dark.webp (1200x40)

```
A minimal horizontal decorative divider, 1200 pixels wide and 40 pixels tall. A single thin glowing line that fades in from transparent, peaks in the center with cool blue (#60A5FA) to cyan (#34D399) gradient, then fades out. Subtle neon glow aura, bioluminescent feeling. Dark navy (#0B0B14) or transparent background. Like a strand of starlight against void.
```

### D-3. pattern-light.svg

> ChatGPT에게 코드 작성 요청:

```
Write complete SVG code for a seamless tileable 60x60 pixel pattern. Very faint crystal/prism facet geometry — hexagons, triangles, diamonds in a grid. Background: #F5F0E8 warm beige. Lines: rgba(180, 160, 120, 0.05) with occasional rgba(180, 160, 120, 0.08) highlights. Line width 0.5px. Must tile seamlessly. Almost invisible at normal distance — just a hint of crystalline texture.
```

### D-4. pattern-dark.svg

> ChatGPT에게 코드 작성 요청:

```
Write complete SVG code for a seamless tileable 60x60 pixel pattern. Same crystal facet geometry as before but for dark theme. Background: #0B0B14 dark navy. Lines: rgba(96, 165, 250, 0.04) with occasional rgba(96, 165, 250, 0.06) highlights. Line width 0.5px. Seamlessly tileable. Almost invisible — subtle digital crystal texture.
```

---

## 파일 체크리스트

| # | 파일명 | 크기 | 도구 | 상태 |
|---|--------|------|:----:|:----:|
| A-1 | `public/images/landing/hero.webp` | 1920x1080 | Gemini | ⬜ |
| A-2 | `public/images/landing/genesis.webp` | 1920x1080 | Gemini | ⬜ |
| A-3 | `public/images/landing/prismafall.webp` | 800x800 | Gemini | ⬜ |
| A-4 | `public/images/landing/novel-silhouettes.webp` | 1920x1080 | Gemini | ⬜ |
| A-5 | `public/images/landing/cta-prismafall.webp` | 1920x1080 | Gemini | ⬜ |
| B-1 | `public/images/world/creation.webp` | 1200x630 | Gemini | ⬜ |
| B-2 | `public/images/world/races.webp` | 1200x630 | Gemini | ⬜ |
| B-3 | `public/images/world/power.webp` | 1200x630 | Gemini | ⬜ |
| B-4 | `public/images/world/society.webp` | 1200x630 | Gemini | ⬜ |
| B-5 | `public/images/world/religion.webp` | 1200x630 | Gemini | ⬜ |
| B-6 | `public/images/world/geography.webp` | 1200x630 | Gemini | ⬜ |
| B-7 | `public/images/world/history.webp` | 1200x630 | Gemini | ⬜ |
| B-8 | `public/images/world/glossary.webp` | 1200x630 | Gemini | ⬜ |
| B-9 | `public/images/world/economy.webp` | 1200x630 | Gemini | ⬜ |
| B-10 | `public/images/world/growth.webp` | 1200x630 | Gemini | ⬜ |
| B-11 | `public/images/world/chromastorm.webp` | 1200x630 | Gemini | ⬜ |
| B-12 | `public/images/world/special-beings.webp` | 1200x630 | Gemini | ⬜ |
| C-1 | `public/images/characters/kai.webp` | 600x800 | Leonardo | ⬜ |
| C-2 | `public/images/characters/coda.webp` | 600x800 | Leonardo | ⬜ |
| C-3 | `public/images/characters/nix.webp` | 600x800 | Leonardo | ⬜ |
| C-4 | `public/images/characters/ray.webp` | 600x800 | Leonardo | ⬜ |
| D-1 | `public/images/ui/divider-light.webp` | 1200x40 | GPT | ⬜ |
| D-2 | `public/images/ui/divider-dark.webp` | 1200x40 | GPT | ⬜ |
| D-3 | `public/images/ui/pattern-light.svg` | 60x60 tile | GPT | ⬜ |
| D-4 | `public/images/ui/pattern-dark.svg` | 60x60 tile | GPT | ⬜ |

## 생성 순서 추천

1. **C (Leonardo)** — 캐릭터 먼저. 각 3장씩 생성 후 베스트 선택
2. **A-1, A-4** (Gemini) — 랜딩 핵심 2개
3. **B 전체** (Gemini) — 같은 세션에서 연속 생성으로 스타일 통일
4. **나머지 A** (Gemini)
5. **D** (GPT) — SVG는 코드 생성 요청
