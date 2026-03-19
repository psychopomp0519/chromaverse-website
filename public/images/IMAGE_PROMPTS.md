# 크로마버스 이미지 에셋 — 도구별 최적화 프롬프트

> A, B → **Gemini** | C → **Leonardo.ai** | D → **GPT (DALL-E)**
>
> 모든 결과물은 최종적으로 WebP 변환 필요

---

## ==============================
## A. Landing (Gemini — 5개)
## ==============================

> **Gemini 설정**: 이미지 생성 모드, 가장 높은 해상도 선택
> **공통 접두사**: 아래 프롬프트 앞에 반드시 붙이기
>
> ```
> Generate a high-resolution fantasy digital painting in cinematic widescreen 16:9 aspect ratio. Style: AAA game concept art, rich saturated colors, dramatic volumetric lighting, painterly brushwork. NO text, NO watermarks, NO UI elements, NO logos.
> ```

### A-1. hero.webp (1920x1080)

```
Generate a high-resolution fantasy digital painting in cinematic widescreen 16:9 aspect ratio. Style: AAA game concept art, rich saturated colors, dramatic volumetric lighting, painterly brushwork. NO text, NO watermarks, NO UI elements, NO logos.

Scene: The Prismafall — the most important event in this fantasy world's creation myth. A colossal sphere of pure white crystalline light, roughly the size of a moon, is shattering apart at the exact moment of breaking. The sphere occupies the upper-center of the composition.

Details:
- Millions of light fragments explode outward in every direction from the sphere
- Each fragment glows in one of three colors: vivid crimson red (#E63946), deep emerald green (#2D6A4F), or cerulean blue (#457B9D)
- The fragments vary in size from large shards to microscopic dust particles
- Concentric rings of prismatic energy radiate from the explosion center, like ripples in space
- Between the light fragments, thin tendrils of primordial darkness seep through — deep navy (#1D3557) and near-black (#0B0B0B) ribbons that curl and twist
- The background is a deep indigo-violet cosmic void, not pure black
- The overall feeling is: divine, awe-inspiring, the birth of a world
- Luminous particle effects throughout, like fireflies of color
- The lighting should feel like looking directly at creation itself

Camera: Centered composition, slightly looking upward at the shattering sphere. The explosion should fill roughly 60% of the frame with the cosmic void visible around the edges.

Mood: Sacred, overwhelming beauty, the first moment of existence.
```

### A-2. genesis.webp (1920x1080)

```
Generate a high-resolution fantasy digital painting in cinematic widescreen 16:9 aspect ratio. Style: AAA game concept art, rich saturated colors, dramatic volumetric lighting, painterly brushwork. NO text, NO watermarks, NO UI elements, NO logos.

Scene: A cosmic duality — two primordial forces facing each other across the canvas, perfectly balanced.

LEFT HALF — LUMINOUS (the Light):
- A vast, radiant entity made of pure white-gold light
- Not humanoid, more like a living aurora or a galaxy-sized prism
- Emanates warm prismatic rays in red, green, blue that streak outward
- The feeling is: complete, perfect, but utterly alone
- Warm color temperature: golds, whites, soft rainbow refractions

RIGHT HALF — KUROGEN (the Darkness):
- An ancient presence made of layered darkness — not evil, primordial
- Deep navy (#1D3557) core with subtle crimson (#6B2737) and murky amber (#B5838D) undertones
- Has a patient, waiting quality — like an ocean at night
- Swirling, slow-moving tendrils of shadow, almost meditative
- Cool color temperature: deep blues, near-blacks, occasional deep purple

CENTER LINE — Where they meet:
- A turbulent vertical column where light and dark interweave in double-helix spiral patterns
- Neither dominates — they dance together
- Sparks of both light particles and dark motes fly outward from the contact zone
- A single brilliant diamond-shaped star hovers above the meeting point

Background: Deep space gradient from warm (left) to cool (right).
Composition: Perfect bilateral symmetry. The center line should be visually dynamic and energetic while the two halves are more serene.
Mood: Creation myth, cosmic balance, two halves of the same whole.
```

### A-3. prismafall.webp (800x800, 정방형)

```
Generate a high-resolution fantasy digital painting in SQUARE 1:1 aspect ratio. Style: AAA game concept art, rich saturated colors, dramatic volumetric lighting, painterly brushwork. NO text, NO watermarks, NO UI elements, NO logos.

Scene: Extreme close-up of the Prismafall moment — a perfect sphere of concentrated white light, about the size of a basketball in frame, cracking open.

Details:
- The sphere is made of compacted pure white light, with a crystalline surface texture
- Deep golden cracks run across its surface like a hatching egg — the cracks glow intensely
- From the largest crack at the top, three distinct streams of colored light pour out:
  - LEFT stream: Vivid crimson red (#E63946) — representing passion and physical force
  - CENTER stream: Rich emerald green (#2D6A4F) — representing life and healing
  - RIGHT stream: Deep cerulean blue (#457B9D) — representing knowledge and cognition
- The colored streams cascade downward like luminous waterfalls
- Within each stream, if you look closely, there are tiny humanoid-shaped motes of light — the first beings being born
- Below the sphere: a nascent, forming world is barely visible through mist — just enough to suggest a landscape taking shape
- Around the sphere: a halo of prismatic energy, like a solar corona

Camera: Dead center, looking straight at the sphere. Tight framing — the sphere fills about 40% of the image.
Background: Dark indigo void fading to deep blue at edges.
Mood: The most beautiful moment in creation — fragile, powerful, sacred.
```

### A-4. novel-silhouettes.webp (1920x1080)

```
Generate a high-resolution fantasy digital painting in cinematic widescreen 16:9 aspect ratio. Style: AAA game concept art, rich saturated colors, dramatic volumetric lighting, painterly brushwork. NO text, NO watermarks, NO UI elements, NO logos.

Scene: Four figures standing in silhouette on a rocky hilltop, their backs to us, gazing out at a vast fantasy landscape at twilight. This is a melancholic, cinematic "end of an era" feeling.

THE FOUR FIGURES (left to right, all in pure black silhouette, backlit):

1. LEFTMOST — KAI (28, male): Tall and lean, shoulder-length wavy hair loosely tied back. One hand holds a book against his hip, the other hand holds a thin quill-like instrument. Slightly relaxed posture but alert. He casts a faint blue-gray (#9CA3AF) glow outline on his silhouette edges.

2. CENTER-LEFT — CODA (41, male): The largest figure. Broad shoulders, stocky build, arms crossed over chest. Short cropped hair. Military/protector stance — steady, immovable. He casts a deep forest green (#2D6A4F) glow outline.

3. CENTER-RIGHT — NIX (19, ambiguous gender): Smallest standing figure, tense posture, slightly hunched with hands shoved in pockets. Messy hair falls over one side. The silhouette has an asymmetric quality — the left side casts a faint dark red glow, the right side seems to ABSORB light, creating a void-black edge that's darker than the silhouette itself. Unsettling.

4. RIGHTMOST — RAY (late teens, female): Sitting on the ground, knees pulled to chest, arms wrapped around herself. Very small and frail. Her silhouette is barely visible — almost translucent, as if she might fade away. She casts an almost invisible, ghostly white glow that's more of an absence of shadow than actual light.

THE LANDSCAPE they're looking at:
- Rolling hills and distant mountains under a twilight sky
- The sky transitions from warm amber-orange at the horizon to deep indigo-purple above
- Faint prismatic aurora streams across the sky in the far distance — subtle rainbow curtains
- A distant city with faint lights (Hakuten) barely visible on the horizon
- The landscape has a vast, empty quality — beautiful but lonely

Lighting: Strong backlight from the setting sun creates crisp silhouette edges. The colored glow outlines on each character should be subtle but visible — not neon, more like a faint aura.

Camera: Low angle, slightly looking up at the figures on the hilltop. Wide shot — figures occupy maybe 30% of the frame height, landscape and sky fill the rest.

Mood: Melancholic beauty. These four people will change the world, but right now they're just looking at what's ahead. Quiet before the storm. Nostalgic, like a memory being recalled.
```

### A-5. cta-prismafall.webp (1920x1080)

```
Generate a high-resolution fantasy digital painting in cinematic widescreen 16:9 aspect ratio. Style: AAA game concept art, rich saturated colors, dramatic volumetric lighting, painterly brushwork. NO text, NO watermarks, NO UI elements, NO logos.

Scene: Bird's-eye view of the fantasy continent CHROMARA, rendered as a painted landscape from very high altitude (like looking down from a mountaintop or flying creature). This is the entire world of the story.

REGIONS (distinct color-coded zones, visible from altitude):

NORTHEAST — ENJI (焰域): Volcanic red desert. Glowing lava rivers, red-orange sand dunes, smoke plumes. Dominant color: #FF6B35 orange-red.

EAST — SEIJI (生域): Vast emerald forests. Dense canopy, winding rivers, misty valleys. Dominant color: #43AA8B teal-green.

SOUTHEAST — MEICHI (明域): Crystalline blue mountains. Jagged peaks with quartz formations, frozen lakes that glow blue. Dominant color: #577590 steel-blue.

BETWEEN ENJI & SEIJI — KOJI (黄域): Golden plains and grasslands. Warm amber glow. Color: #F4A261.

BETWEEN ENJI & MEICHI — SHIJI (紫域): Floating rock formations in purple mist. Surreal, otherworldly. Color: #9B5DE5.

BETWEEN SEIJI & MEICHI — AOCHI (青域): Bioluminescent coastline and massive lakes. Cyan glow from water. Color: #00B4D8.

CENTER — HAKUTEN (白点): A brilliant white-marble city that radiates light. The jewel of the continent. All colors converge here. White-gold architecture.

OUTER EDGES — BORDER (墨境): Where RGB light zones transition into dark CMYK zones. The terrain becomes chaotic — colors clash, the ground cracks.

FAR EDGES — THE DEEP (深墨): Pure darkness zone. Deep navy to black. Barely visible structures. Ominous.

SKY: Dramatic cloud formations with prismatic lightning (Chromastorm) gathering at the borders between RGB and CMYK zones. The clouds themselves have unnatural colors — swirls of all seven hues.

Camera: 45-degree aerial view, slightly tilted. The continent fills the frame. Hakuten at center glows brightest.
Mood: Epic, inviting, "this is the world you're about to explore." Beautiful but with hints of danger at the edges.
```

---

## ==============================
## B. World 히어로 (Gemini — 12개)
## ==============================

> **공통 접두사** (모든 B 프롬프트 앞에 붙이기):
>
> ```
> Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.
> ```

### B-1. creation.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: The Prismafall from a different angle — viewed from below, as if you're standing on the newly forming world looking UP at the sky. The great white sphere is directly overhead, mid-shatter, with colored light raining down like divine rain. Red, green, blue light streams fall toward the viewer. Between the light, dark tendrils of void curl downward. The ground beneath is raw, newly formed earth being painted by the falling colors — where red light touches, stone turns warm; where green touches, plants sprout instantly; where blue touches, crystals form.

Mood: Witnessing creation from the ground level. Awe, vulnerability, beauty.
```

### B-2. races.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: Two groups facing each other across a luminous divide line on the ground.

LEFT GROUP — REN (빛의 존재, 3 figures):
- Humanoid beings with visible vein-like glowing patterns on their exposed skin
- The patterns (called iromon) pulse in their dominant colors: one figure's patterns glow red, another green, another blue
- Their eyes faintly glow with their dominant color
- They stand with confidence, their light illuminating the ground around them
- Clothing: practical but elegant, with metallic accents that catch the light

RIGHT GROUP — MUKREN (어둠의 존재, 3 figures):
- Similar humanoid build but with INVERTED dark patterns (called gyakumon)
- Their patterns are deep navy, dark crimson, murky amber — absorbing light rather than emitting it
- Their eyes are like deep voids — dark, but not hostile, more mysterious
- They stand with equal dignity, their darkness creating shadows around them
- Clothing: darker materials with obsidian-like accessories

BETWEEN THEM — A single child figure with BOTH types of patterns visible on different sides of their body, reaching toward both groups. The ground divide between them glows where both light and dark energy meet.

Lighting: Dramatic side-lighting. The Ren side is warmly lit, the Mukren side has cool shadows. The child in the center is lit by both.
Mood: "We are different, but we are the same species." Tension, but also recognition.
```

### B-3. power.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: An abstract, artistic visualization of the seven color channels of power in this world. Think "energy diagram as fine art."

UPPER HALF — THREE ASCENDING BEAMS OF LIGHT (RGB):
- LEFT beam: Vivid RED (#E63946) — within it, visual metaphors of heat, fire, physical force, muscles tensing
- CENTER beam: Rich GREEN (#2D6A4F) — within it, growing vines, healing hands, heartbeats, life energy
- RIGHT beam: Deep BLUE (#457B9D) — within it, neural networks, floating equations, third eyes, wave patterns
- The three beams converge upward into a brilliant white point

LOWER HALF — FOUR DESCENDING STREAMS OF DARKNESS (CMYK):
- CYAN stream (#1D3557): Cold, frozen, chains, suppression — the negation of heat
- MAGENTA stream (#6B2737): Decay, wilting, erosion — the negation of life
- YELLOW stream (#B5838D): Distortion, funhouse mirrors, illusions — the negation of cognition
- BLACK stream (#0B0B0B): Pure void, nothingness, a hole in reality — the primordial darkness itself
- The four streams converge downward into a black singularity

WHERE THEY INTERSECT (middle band): Energy crackles, sparks fly, the colors wrestle and merge in chaotic beauty.

Composition: Symmetric, vertical axis. Upper half bright, lower half dark, middle zone energetic.
Background: Dark charcoal gradient.
Mood: Educational but dramatic. "This is how power works in this world."
```

### B-4. society.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: A grand circular amphitheater in the white city of Hakuten, viewed from the side to show the vertical tier structure.

TOP TIER — THE BRILLIANT:
- 2-3 figures with intensely glowing iromon patterns covering their arms and faces
- Their auras are vibrant, saturated, almost painful to look at
- Rich clothing, golden accessories
- They literally shine, illuminating the space around them

MIDDLE TIERS — THE AVERAGE:
- Groups of figures with moderate glow — visible but not overwhelming
- Ordinary clothing, working tools
- Most populated tier, representing the majority

BOTTOM TIER — THE DIM:
- Figures with barely visible, almost extinct patterns
- Their iromon are like dying embers — ash gray, barely flickering
- Simple, worn clothing
- They sit in the shadows cast by the brilliant ones above

CENTER STAGE — A CONDUCTOR (official figure) stands at a podium, their role is to measure and assign tiers. They hold a prismatic measuring instrument that casts rainbow light.

Architecture: White marble with prismatic crystal inlays. Columns with color-gradient patterns. Classical amphitheater structure but with fantasy elements.
Lighting: Light literally comes from the top-tier people, creating a natural hierarchy of illumination.
Mood: Beautiful but disturbing. The hierarchy is literally visible — you can SEE who is "more" and who is "less."
```

### B-5. religion.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: Three temples of the three major religions, standing side by side in a row, each architecturally distinct but on the same sacred ground. Sunset light unifies the scene.

LEFT — TEMPLE OF LIGHT (광명회, Gwangmyeonghoe):
- Soaring white marble spire reaching toward the sky, impossibly tall and thin
- Golden light radiates from stained-glass windows depicting the Prismafall
- Triumphant, imposing, cathedral-like grandeur
- Banners of white and gold hang from balconies
- The architecture says: "Light is supreme, light is truth"

CENTER — TEMPLE OF BALANCE (균형파, Gyunhyeongpa):
- A yin-yang inspired circular structure where light stone and dark stone interweave naturally
- Modest in height, wide and grounded
- Trees and vines grow through the architecture as if nature is part of the design
- Both light and shadow play equally across its surface
- The architecture says: "Light and dark are two halves of one truth"

RIGHT — TEMPLE OF SILENCE (심묵교, Simmukgyo):
- A dark obsidian pyramid that DESCENDS into the earth — the peak points downward
- Deep indigo (#1D3557) glow emanates from within, like bioluminescence
- Mysterious but not threatening — reverent, meditative
- Steps lead downward into the earth
- The architecture says: "Darkness was here first, and deserves respect"

Sky: Dramatic sunset that creates warm light on the left temple, neutral light on the center, and cool shadow on the right — naturally reinforcing each temple's identity.
Ground: Shared sacred plaza with three paths converging to a central meeting point.
Mood: Respect for all three perspectives. None is presented as "correct" — each has dignity.
```

### B-6. geography.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: The fantasy continent of Chromara viewed from very high altitude — like a painted satellite view. The continent is roughly circular with distinct color-coded biomes.

CENTER — HAKUTEN: Brilliant white-gold city, radiating light. All roads converge here. Visible architecture even from altitude.

THREE PRIMARY ZONES (120° apart):
- NE sector: ENJI — Red-orange. Volcanic craters, lava flows visible as bright lines, desert sand. Smoke rises.
- E sector: SEIJI — Deep green. Dense forest canopy, river networks visible as silver threads, misty valleys.
- SE sector: MEICHI — Steel blue. Sharp mountain ranges, crystalline formations that catch light, frozen lakes.

THREE BLEND ZONES (between primaries):
- Between Enji & Seiji: KOJI — Golden-amber grasslands, warm glow.
- Between Enji & Meichi: SHIJI — Purple haze, floating rock formations, surreal.
- Between Seiji & Meichi: AOCHI — Cyan-teal, bioluminescent coastline, massive lake.

OUTER RING — BORDER: Chaotic zone where colors clash. Terrain is scarred and unstable.
FAR EDGES — THE DEEP: Darkness encroaching. Near-black terrain, barely visible.

Style: Painterly cartography — a map that's also a landscape painting. Rich, saturated colors.
No text labels, no compass rose, no map UI — pure artistic representation.
Mood: "Look at this beautiful, complex world."
```

### B-7. history.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: A vertical timeline of the world's history, rendered as a single dramatic painting. Time flows from top to bottom.

TOP (Year 0) — THE PRISMAFALL: Brilliant white explosion, prismatic fragments scattering.

UPPER SECTION (Early era) — FORMATION: Cities being built, the white city of Hakuten taking shape, first Ren communities forming. Warm, hopeful colors.

MIDDLE-UPPER — GOLDEN AGE: Prosperous civilization, grand architecture, the three religions establishing their temples. Rich, saturated.

MIDDLE — THE DARKENING: Void energy expanding from the edges, wars depicted as clashes of colored light, fear spreading. Colors desaturate slightly.

MIDDLE-LOWER — UNEASY PEACE: Rebuilt cities, but with visible scars. The border between light and dark zones becomes more defined. Mixed warm/cool colors.

BOTTOM (Year 780, present) — FOUR SMALL FIGURES: At the very bottom, four tiny silhouetted figures (Kai, Coda, Nix, Ray) look upward at the entire history above them. They're about to enter this story.

Visual style: East Asian scroll painting meets fantasy concept art. Each era section blends into the next smoothly.
Composition: Narrow and tall feeling even in widescreen — the vertical flow is key.
Mood: The weight of history. Everything that happened before our heroes arrived.
```

### B-8. glossary.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: An ancient library/archive room — the workplace of a chromatic record-keeper.

Environment:
- Circular room with walls covered floor-to-ceiling in crystalline tablets/screens
- Each tablet glows a different color: red, green, blue, dark navy, amber — organized by category
- The tablets display flowing script in an unknown language
- High arched windows let in prismatic light that refracts through crystal prisms hanging from the ceiling
- The light creates rainbow patterns on the floor and walls

Central figure: A lone record-keeper (resembling Kai) sits at a large wooden desk cluttered with:
- Open books with handwritten notes
- A specialized measuring quill that emits faint light
- Floating holographic text projections hovering above the desk
- Small crystalline reference stones in various colors

The desk has a warm lamp that creates a cozy pool of light in the larger, more mysterious room.

Mood: Scholarly, warm, alive with stored knowledge. The kind of place you'd want to spend hours exploring.
```

### B-9. economy.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: A bustling fantasy marketplace in Hakuten, centered around RESONANCE STONES (공명석) — the basis of the economy.

Center: A large market square with a massive resonance stone monolith in the center — a pillar of crystal that pulses with shifting colors, used as a pricing/exchange reference.

Market stalls:
- Merchants display goods that shimmer with chromatic energy: weapons with red glow, healing herbs with green luminescence, blue-tinged analysis tools
- Currency: Small crystalline coins that each contain captured color energy — they literally glow in your palm
- Some stalls have prism-powered machines that assess the value of goods by measuring their chromatic content

Background: A massive refinery/processing facility visible behind the market — industrial-scale chromatic ore processing, with colored smoke stacks.

People: Diverse crowd of Ren with varying levels of iromon glow — wealthy merchants with brilliant patterns, common folk with moderate glow, a few dim-patterned workers carrying heavy crates.

Mood: Vibrant, busy, alive. Fantasy economy that makes the color system tangible and practical.
```

### B-10. growth.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: A single figure sitting in meditation pose, surrounded by visible layers of chromatic energy representing their growth journey.

The figure: A Ren (humanoid) sitting cross-legged, eyes closed, centered in the frame.

Energy layers (from innermost to outermost):
- Layer 1 (closest): Very faint, nearly transparent — low saturation, barely any color. Like a ghostly outline.
- Layer 2: Slightly more visible — a soft warmth or coolness depending on their dominant channel.
- Layer 3: Moderate glow — colors become distinct (red/green/blue visible).
- Layer 4: Strong aura — vibrant, pulsing patterns.
- Layer 5 (outermost): Brilliant, complex geometric patterns in full color — the theoretical maximum.

Above the figure: A vertical spectrum gauge from 0 (bottom, dark) to 255 (top, brilliant white), showing where the figure currently sits (around the middle).

Background: Gradual transition from dim gray at the bottom to brilliant prismatic at the top — symbolizing the growth journey.

The figure's iromon patterns on their skin are actively growing/extending as we watch — like time-lapse of vines growing.

Mood: Aspirational, meditative. "This is how you become more."
```

### B-11. chromastorm.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: A CHROMASTORM — the most terrifying natural disaster in this world — ravaging a landscape.

The storm:
- The sky is a violent, churning maelstrom of ALL SEVEN COLORS colliding
- Red, green, blue light crashes against cyan, magenta, yellow, black darkness
- Where they collide: prismatic lightning bolts that fork in multiple colors simultaneously
- The storm cloud itself looks almost ALIVE — with tendril-like extensions reaching down toward the ground
- The central eye of the storm is a void of absolute black — pure Void energy

Ground effects:
- Trees are being crystallized mid-motion — bark turning to colored glass
- Buildings are distorting — walls bending, reality warping
- The ground itself cracks open with colored energy pouring out
- A river nearby has turned from water to liquid light

Foreground: 3-4 tiny figures fleeing toward the viewer, running from the storm. Their iromon patterns flicker chaotically — the storm is disrupting their very being.

Scale: The storm should feel MASSIVE — filling 70% of the sky. The landscape and figures emphasize its overwhelming size.

Mood: Apocalyptic, terrifying, beautiful in a destructive way. Natural disaster meets cosmic horror.
```

### B-12. special-beings.webp

```
[공통 접두사]
Generate a high-resolution fantasy digital painting in ultrawide 21:9 aspect ratio (approximately 1200x630 pixels proportions). Style: AAA game concept art, rich saturated colors, dramatic lighting, painterly. NO text, NO watermarks, NO UI elements.

Scene: Three extraordinary beings that transcend normal classification, standing in a mysterious void-like space.

LEFT — CONDUCTOR (컨덕터):
- A humanoid whose body is literally a living prism — light enters one side and refracts into rainbows on the other
- Their skin is semi-transparent, showing internal structures of pure light
- They appear serene, almost divine
- Around them, light bends and separates

CENTER — DISSONANCE (디소넌스):
- A glitch-like entity — their form keeps shifting between states
- Where they stand, reality FRACTURES — visible cracks in space around them
- Colors clash and conflict on their body — red fights blue, light fights dark
- They look like a corrupted image file made flesh — beautiful but wrong
- Their expression is pained

RIGHT — MANIFESTATION (잠재현현):
- A child-like figure, small and innocent-looking
- Surrounded by floating orbs of IMPOSSIBLE color combinations — colors that shouldn't exist together
- Their eyes shift between all seven colors rapidly
- They have an aura of potential — something not yet realized but terrifyingly powerful
- Both light and dark energy orbit them peacefully

Space around them: Not a physical location — more of an abstract void where the rules of reality are suspended. Floating geometric shapes, broken spatial grids.

Mood: Mysterious, otherworldly, cosmic. "These beings are beyond our understanding."
```

---

## ==============================
## C. Characters (Leonardo.ai — 4개)
## ==============================

> **Leonardo.ai 설정**:
> - Model: **Leonardo Phoenix** 또는 **DreamShaper v8** (한국 웹소설 스타일에 적합)
> - Preset: **Illustration** 또는 **Anime**
> - Dimensions: **768x1024** (3:4 세로, 나중에 600x800 크롭)
> - Guidance Scale: **7-8** (너무 높으면 과장됨)
> - 각 캐릭터 2-3장씩 생성 후 베스트 선택
>
> **스타일 고정 접두사** (모든 C 프롬프트 앞에 붙이기):
>
> ```
> Korean web novel illustration style, semi-realistic anime, upper body portrait, 3:4 vertical composition, detailed face and clothing, soft atmospheric background, professional light novel cover art quality, subtle rim lighting, painterly brushwork on clothing and hair details.
> ```

### C-1. kai.webp — 카이 (기록관)

```
Korean web novel illustration style, semi-realistic anime, upper body portrait, 3:4 vertical composition, detailed face and clothing, soft atmospheric background, professional light novel cover art quality, subtle rim lighting, painterly brushwork on clothing and hair details.

Character: KAI — 28-year-old male record-keeper/scribe.

Face & Hair:
- Shoulder-length messy dark brown-black hair, loosely tied back in a low ponytail with strands falling around his face
- Angular but not harsh face — intelligent features, slight eyebags from late nights working
- Eyes: DULL BLUE-GRAY (#9CA3AF), deliberately NOT glowing — matte, tired but observant
- Expression: A dry, self-deprecating half-smile — like he just made a joke about himself but means every word seriously underneath
- Light stubble on jaw

Body & Clothing:
- Lean, not muscular — a scholar's build
- Wears a dark charcoal-gray long coat with many visible pockets and loops for tools, scrolls, and writing instruments
- Under the coat: a simple dark shirt with slightly worn collar
- One hand holds a specialized chromatic measuring quill — a thin metallic instrument that glows faintly blue at the tip
- A leather satchel strap crosses his chest

Skin Patterns (IROMON):
- EXTREMELY FAINT, thin calligraphic lines running along his visible skin (neck, hands, near eyes)
- The color is ASH GRAY — like ink that's almost completely faded
- They look like dying brushstrokes or ancient writing that's being erased
- They should be barely noticeable — you might miss them at first glance
- This represents his very low chromatic power (total: 245, very low for his age)

Background:
- A dimly lit archive room — wooden bookshelves barely visible, warm lantern light from below-left
- Floating dust particles in the light
- A few colored crystal tablets glow softly on shelves behind him — red, blue, green

Lighting: Warm side-lighting from a lantern (left), cool ambient fill from crystal tablets (right). Creates dimensional shadows on his face.

Mood: "I'm just a record-keeper. I measure other people's light. Mine barely flickers. But I'll write every word of this story because someone has to."

NEGATIVE PROMPT: glowing eyes, bright iromon, muscular build, action pose, fantasy armor, wings, horns, excessive accessories
```

### C-2. coda.webp — 코다 (수호자)

```
Korean web novel illustration style, semi-realistic anime, upper body portrait, 3:4 vertical composition, detailed face and clothing, soft atmospheric background, professional light novel cover art quality, subtle rim lighting, painterly brushwork on clothing and hair details.

Character: CODA — 41-year-old male, the oldest and strongest of the party.

Face & Hair:
- Short-cropped dark hair with noticeable premature gray at the temples and scattered throughout
- Strong, weathered face with visible age — not old, but a man who's seen too much
- Square jaw, thick neck
- Eyes: DEEP FOREST GREEN (#2D6A4F) with a SUBTLE STEADY GLOW — not flashy, like a campfire ember
- Expression: Calm and watchful — protective but weary. A guardian who knows the cost of guarding.
- A thin scar runs from his left cheekbone to his jaw

Body & Clothing:
- Broad-shouldered, muscular but not bodybuilder — functional strength, a working warrior's build
- Wears reinforced leather armor with GREEN-TINTED dark metal plates on shoulders and chest
- The armor shows wear — scratches, repaired sections, dents that tell stories
- Forearms exposed: revealing both battle scars AND his iromon patterns
- Hands are large, calloused — a worker's hands that can also be gentle

Skin Patterns (IROMON):
- CLEARLY VISIBLE wave/sound-wave patterns flowing across his forearms and up his neck
- The patterns pulse with steady GREEN (#2D6A4F) light — rhythmic, like a heartbeat
- The pattern design looks like ECG heartbeat lines or sound wave oscillations
- His total chroma is 453 — firmly mid-tier, respectable but not elite

Background:
- Twilight forest clearing — tall dark trees with green-filtered light
- A campfire's warm glow from off-screen right provides the key light
- Fireflies or green-glowing particles float in the air

Lighting: Warm campfire light from the right, cool twilight from the left. His green iromon glow provides a subtle third light source on his forearms.

Mood: "I've carried secrets for 20 years. I've failed before. But not again. Not with these kids."

NEGATIVE PROMPT: young face, clean/new armor, pretty boy, flashy effects, excessive glow, clean shaven
```

### C-3. nix.webp — 닉스 (이단자)

```
Korean web novel illustration style, semi-realistic anime, upper body portrait, 3:4 vertical composition, detailed face and clothing, soft atmospheric background, professional light novel cover art quality, subtle rim lighting, painterly brushwork on clothing and hair details.

Character: NIX — 19-year-old of AMBIGUOUS GENDER, the most dangerous and unsettling member.

Face & Hair:
- Messy dark RED-BLACK hair that falls heavily over the RIGHT side of their face, partially hiding the right eye
- Sharp, thin features — fox-like, angular cheekbones, pointed chin
- Perpetually guarded expression — defensive, ready to bolt or bite
- CRITICAL FEATURE — HETEROCHROMIA (DIFFERENT COLORED EYES):
  - LEFT EYE: Dull reddish-brown (#8B4513) — a tired, warm color. This is the "normal" side.
  - RIGHT EYE: PURE BLACK VOID — not dark brown, not dark gray, but an actual VOID. This eye seems to ABSORB light. Looking at it feels like looking into a hole in reality. No visible iris, no reflection. Deeply unsettling.
- The right eye should be partially hidden by hair but still visible — the horror is in the glimpse, not the full reveal

Body & Clothing:
- Small frame, underweight — a stray cat's build. Tense, coiled energy.
- Wears dark layered clothes — a black hoodie under a worn dark red-brown jacket
- One arm (the right) is wrapped in dark bandages from wrist to elbow — hiding something
- The other hand has fingerless gloves
- Overall look: someone who wants to be invisible

Skin Patterns (IROMON + GYAKUMON — TWO TYPES):
- LEFT side of body: FAINT REDDISH iromon — normal Ren patterns, but weak and irregular. Like a sputtering candle.
- RIGHT side of body: DARK INVERSE PATTERNS (gyakumon) — deep void-black (#0B0B0B) markings that don't glow but instead CONSUME nearby light. Where these patterns are, the skin looks like it has cracks showing darkness underneath.
- The two pattern types meet at the center of their body (chest, neck, face) in a jagged border — like a seismic fault line.
- This duality is WRONG in this world — it shouldn't be possible. Nix is an anomaly.

Background:
- Shadowy alley at night — wet cobblestones, a single warm streetlight on the left
- The right side of the background is DARKER than it should be — as if Nix's void eye is draining light from that side of the scene
- A cold blue-black atmosphere on the right contrasts with the warm streetlight on the left

Lighting: Split lighting — warm amber streetlight from the left illuminating the "normal" side of their face, and cold/absent light on the right "void" side. The contrast should be dramatic but not cartoonish.

Mood: "Don't come near me. You'll get hurt. I'm not saying that as a threat — it's a warning, and also a plea."

NEGATIVE PROMPT: cute, friendly expression, symmetrical face, both eyes same color, clean clothes, bright background, confident pose
```

### C-4. ray.webp — 레이 (수수께끼)

```
Korean web novel illustration style, semi-realistic anime, upper body portrait, 3:4 vertical composition, detailed face and clothing, soft atmospheric background, professional light novel cover art quality, subtle rim lighting, painterly brushwork on clothing and hair details.

Character: RAY — appears late teens, female, the most mysterious and heartbreaking member.

Face & Hair:
- Very long, very pale hair — not white, not blonde, but an almost COLORLESS platinum that seems to float slightly as if in zero gravity. Weightless quality.
- Extremely pale skin — almost translucent. You can almost see blue veins underneath.
- Delicate, porcelain-like features — beautiful in a fragile, breakable way
- Eyes: SO LIGHT they're almost TRANSPARENT — like looking through clear glass. The iris has almost no pigmentation. In certain light, you can barely tell where the iris ends and the sclera begins. Ghostly.
- Expression: A gentle, automatic smile — the kind of smile that happens by reflex, not by feeling. It says "I'm okay. I'm okay." but the eyes say something very different. Confusion, displacement, not-quite-present.

Body & Clothing:
- Extremely frail, thin — gives the impression she might break if you held her hand too firmly
- Wears simple, clean white clothes that are SLIGHTLY TOO LARGE — a plain off-white long-sleeved shirt that hangs loose, as if borrowed from someone bigger
- She seems to take up less space than she should — like reality can't quite register her presence
- Her posture is slightly hunched inward, arms close to body — making herself smaller

Skin Patterns (IROMON — the paradox):
- Here's the key: her iromon patterns are IMPOSSIBLY COMPLEX AND BEAUTIFUL
- Intricate, masterwork-level geometric patterns cover her visible skin (hands, neck, collarbone area)
- The design is like a blueprint for something magnificent — perfect mathematical precision, layered fractals
- BUT THEY DON'T GLOW AT ALL — zero luminosity. They're visible only because they're slightly raised, like embossed paper
- Color: the same pale as her skin, maybe a shade lighter — you can only see them in the right light
- Her total chroma is 15 — the lowest value that can sustain life. This pattern SHOULD glow brilliantly but it's completely empty
- This is the "empty blueprint" — a masterwork vessel with nothing inside

Background:
- Soft, almost overexposed light — dreamlike, slightly blown-out
- No clear location — just diffused warm light, as if she's standing in a cloud or a memory
- A few faint, ghostly afterimages of prismatic patterns float in the air around her — echoes of the light that should be inside her

Lighting: Soft, even, slightly overexposed. Very few shadows — she's too translucent for strong shadows. Backlighting creates a faint halo around her hair. The whole image should feel like it's at +1 exposure stop — bright, ethereal, almost fading away.

Mood: "She was found in the center of a Chromastorm with nothing — no memory, no power, no name. She smiles and says she's okay. She's not okay. But no one knows what 'okay' would look like for her, because no one knows what she is."

NEGATIVE PROMPT: dark background, strong shadows, glowing eyes, glowing iromon, muscular build, confident expression, saturated colors, dark clothing, action pose
```

---

## ==============================
## D. UI 장식 (GPT/DALL-E — 4개)
## ==============================

> **GPT 설정**: DALL-E 3 모드, "Natural" 스타일 (Vivid 아님)
> 생성 후 PNG 다운로드 → WebP 변환 또는 SVG 직접 코딩 요청

### D-1. divider-light.webp (1200x40)

```
Create a thin, elegant horizontal decorative divider for a light-themed website. The image should be exactly 1200 pixels wide and 40 pixels tall.

Design:
- A single horizontal line that flows from left to right
- The line starts INVISIBLE (transparent) on the left, gradually becomes visible in the center, and fades to invisible again on the right
- The visible portion transitions through warm colors: soft gold → warm amber → rose gold → back to gold
- The line should have a subtle GLOW effect — as if it's a strand of warm light
- The line is thin — about 1-2 pixels thick — with a soft glow aura of about 8 pixels on each side
- The glow should be very soft, not neon

Background: Completely transparent (or very light beige #F5F0E8 if transparency isn't possible)
Style: Minimal, elegant, barely-there. Like a strand of golden thread floating in space.

This will be used as a section divider on a warm beige (#F5F0E8) background. It should complement, not dominate.
```

### D-2. divider-dark.webp (1200x40)

```
Create a thin, elegant horizontal decorative divider for a dark-themed website. The image should be exactly 1200 pixels wide and 40 pixels tall.

Design:
- A single horizontal line that flows from left to right
- The line starts INVISIBLE on the left, gradually becomes visible in the center, and fades to invisible again on the right
- The visible portion transitions through cool colors: deep blue (#60A5FA) → cyan (#34D399) → back to blue
- The line should have a subtle NEON GLOW effect — brighter than the light version but still elegant
- The line is thin — about 1-2 pixels thick — with a glow aura of about 12 pixels on each side
- The glow should feel like bioluminescence — organic, not harsh

Background: Completely transparent (or very dark navy #0B0B14 if transparency isn't possible)
Style: Minimal, elegant, luminous. Like a strand of starlight against the void.

This will be used as a section divider on a dark navy (#0B0B14) background. It should add subtle visual interest without being distracting.
```

### D-3. pattern-light.svg (타일링)

> GPT에게 SVG 코드를 직접 작성하도록 요청:

```
Write SVG code for a seamless tileable pattern designed for a light-themed website background. Requirements:

- Tile size: 60x60 pixels
- Design: Subtle geometric shapes inspired by crystal/prism facets — hexagons, triangles, and diamond shapes arranged in a regular grid
- Colors: Very faint lines on a warm beige base
  - Base/background: #F5F0E8
  - Line color: rgba(180, 160, 120, 0.05) — so faint it's barely visible
  - Occasional line highlight: rgba(180, 160, 120, 0.08)
- Line width: 0.5px
- The pattern should look like very subtle crystalline structure — think microscope view of quartz

The pattern should be almost invisible at normal viewing distance — it's meant to add just a hint of texture to prevent the background from feeling flat. At 5% opacity effective.

Output: Complete SVG code with proper viewBox and seamless tiling.
```

### D-4. pattern-dark.svg (타일링)

> GPT에게 SVG 코드를 직접 작성하도록 요청:

```
Write SVG code for a seamless tileable pattern designed for a dark-themed website background. Requirements:

- Tile size: 60x60 pixels
- Design: Same crystal/prism facet geometry as the light version — hexagons, triangles, diamonds
- Colors: Very faint lines on a dark navy base
  - Base/background: #0B0B14
  - Line color: rgba(96, 165, 250, 0.04) — extremely faint cool blue
  - Occasional line highlight: rgba(96, 165, 250, 0.06)
- Line width: 0.5px
- Same geometric structure as the light pattern but with inverted color scheme

The pattern should be almost invisible — just enough to give the dark background a subtle "digital crystal" texture. At 5% opacity effective.

Output: Complete SVG code with proper viewBox and seamless tiling.
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
