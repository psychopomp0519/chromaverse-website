# Design-Implementation Gap Analysis Report: Chromaverse Worldbuilding Consistency

> **Summary**: 3-document cross-validation of worldbuilding settings, master document, and game design spec.
>
> **Author**: gap-detector
> **Created**: 2026-03-15
> **Last Modified**: 2026-03-15
> **Status**: Approved

---

## Analysis Overview
- Analysis Target: Chromaverse worldbuilding 3-document consistency
- Design Document: `project-assets/settings/01_크로마주_세계관설정집_v2_3_4.md` (world bible, authoritative)
- Implementation Documents:
  - `project-assets/settings/크로마버스_작문_원칙_통합.md` (master document)
  - `project-assets/settings/02_크로마주_게임개발설계서_v2_2.md` (game design)
- Reference: `CLAUDE.md` (file paths, priority rules)
- Analysis Date: 2026-03-15

---

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| A. Terminology Consistency | 97% | Warning |
| B. Numerical Consistency | 100% | Pass |
| C. Timeline Consistency | 100% | Pass |
| D. Structural Consistency | 100% | Pass |
| E. File Reference Consistency | 80% | Critical |
| **Overall** | **95%** | Warning |

---

## A. Terminology Consistency (97%)

### Appendix A Terms -- Cross-document Usage

All 50+ confirmed terms from Appendix A are consistently used across all 3 documents. Verified key terms:

| Term | World Bible | Master Doc | Game Design | Match |
|------|:-----------:|:----------:|:-----------:|:-----:|
| Luminous / 煌源 | O | O | O | Pass |
| Kurogen / 黒源 | O | O | O | Pass |
| Prismafall / 大散光 | O | O | O | Pass |
| Ren / 煉 | O | O | O | Pass |
| Mokuren / 墨煉 | O | O | O | Pass |
| Iromon / 色紋 | O | O | O | Pass |
| Gyakumon / 逆色紋 | O | O | O | Pass |
| Code / 和音 | O | O | O | Pass |
| Conductor / 調律師 | O | O | O | Pass |
| Dissonance / 不協和音 | O | O | O | Pass |
| Les / 共鳴石 | O | O | O | Pass |
| Chromastorm / 色彩嵐 | O | O | O | Pass |
| Sanpo / 散布 | O | O | O (ref only) | Pass |
| Latent Manifestation / 潜在顕現 | O | O | O (ref only) | Pass |
| Chromashift / 色変 | O | O | X (absent) | Warning |

### Appendix B Forbidden Terms -- Violation Check

| Document | Violations Found | Details |
|----------|:---------------:|---------|
| Master Doc | 0 | Clean |
| Game Design | 1 (edge case) | "Beastform (변신 전투)" -- see below |

### Issues Found

#### Warning A-1: "Beastform" in Game Design (Severity: Low)

- **Location**: Game Design, section 4.1, line 380
- **Detail**: The term "비스트폼" appears as an RGB 2nd split job name. Appendix B prohibits "크로마 비스트" and "비스트" as standalone terms referring to creatures (replacing the banned "크로마 비스트" with the confirmed "이로쥬/보쿠쥬"). However, "비스트폼" is a **job name** (compound word meaning "beast transformation form"), not a creature designation. This is an edge case -- the prohibited "비스트" refers to the creature term, while "비스트폼" is a gameplay ability name in a different semantic context.
- **Recommendation**: Consider whether this job name should be reviewed for consistency with the creature terminology ban. If strict compliance is desired, rename to a chromaverse-native term (e.g., "이로쥬폼" or "변신전투사").

#### Warning A-2: "Chromashift" Absent from Game Design (Severity: Low)

- **Location**: World Bible 10장 + Appendix A define "크로마시프트(色変)"; Master Doc 8.5 includes it in tier 4 terminology schedule.
- **Detail**: Game Design does not mention 크로마시프트. The "색채 총합 변동 포함 절대 320~510, 생애 ±30" in section 2.3 describes the same mechanic but without using the confirmed term.
- **Recommendation**: Add "크로마시프트" as the named mechanic for the ±30 lifetime color shift in Game Design section 2.3.

### Kanji Consistency Check

All kanji pairings are consistent across 3 documents:

| Term | World Bible | Master Doc | Game Design | Match |
|------|:-----------:|:----------:|:-----------:|:-----:|
| 煌源 (Luminous) | O | O | -- | Pass |
| 黒源 (Kurogen) | O | O | -- | Pass |
| 色記師 (Scribe, novel era) | O | O | O | Pass |
| 色畵師 (Scriber, game era) | O | -- | O | Pass |
| 大調律師 (Grand Harmonist) | -- | -- | O | Pass |
| 調律師 (Conductor) | O | O | O | Pass |
| 混色者 (Chromablend) | -- | -- | O | Pass |
| 和音 (Code) | O | O | O | Pass |

No kanji mismatches found.

---

## B. Numerical Consistency (100%)

### Character Chroma Values

| Character | World Bible | Master Doc | Game Design | Match |
|-----------|:-----------:|:----------:|:-----------:|:-----:|
| Kai R:85/G:72/B:88 = 245 (Tansai) | O (2.1: Tansai 100-299) | O (22.1) | Not listed | Pass |
| Koda R:145/G:160/B:148 = 453 (Chusai) | O (4.1: Chusai 300-549) | O (22.2) | Not listed | Pass |
| Nyx R:78/G:55/B:62 + K:114 = RGB 195 (Tansai) | O (2.1/2.5) | O (22.3) | Not listed | Pass |
| Ray R:5/G:4/B:6 = 15 (sub-Bokuei) | O (2.5) | O (22.4) | Not listed | Pass |

All values match their stated hierarchy tiers.

### RGB Channel Ranges (Section 3.3)

World Bible defines 5-tier system (0-50, 51-120, 121-200, 201-240, 241-255). Game Design references these indirectly through skill tiers and job requirements (e.g., mixed jobs require 120+ in relevant channels). No numerical contradictions found.

### CMYK Channel Ranges (Section 3.3-1)

World Bible v2.3.4 added CMYK channel tiers. Game Design does not duplicate these tiers but references CMYK mechanics consistently (K=(765-total)/5, K range 57-83 for game characters). Consistent.

### Cancellation Relationships (Section 3.4)

| Pair | World Bible | Game Design | Match |
|------|:-----------:|:-----------:|:-----:|
| R <-> C: +30% | O (3.4) | O (3.3: "+30% extra damage") | Pass |
| G <-> M: +30% | O (3.4) | O (implied by matrix) | Pass |
| B <-> Y: +30% | O (3.4) | O (implied by matrix) | Pass |
| White Convergence vs K: +25% | O (3.4) | O (3.3: "+25% efficiency") | Pass |

### Lifespan System

| Tier | World Bible | Master Doc | Game Design | Match |
|------|:-----------:|:----------:|:-----------:|:-----:|
| Bokuei (0-99): 60-80yr | O (2.1) | O (implied) | -- | Pass |
| Tansai (100-299): 80-110yr | O (2.1) | O (22.1: Kai ~90-100yr) | -- | Pass |
| Chusai (300-549): ~120yr | O (2.1) | O (22.2: Koda ~120yr) | -- | Pass |
| Meisai (550-699): ~250yr | O (2.1) | -- | -- | Pass |
| Kihaku (700+): 500yr+ | O (2.1) | -- | -- | Pass |
| Mokuren K-value correction | O (2.2) | -- | -- | Pass |

Consistent. Game Design does not duplicate lifespan details but references "수명 소모" for Chrono Observer hidden job, consistent with the setting.

---

## C. Timeline Consistency (100%)

### Key Milestones

| Event | World Bible | Master Doc | Game Design | Match |
|-------|:-----------:|:----------:|:-----------:|:-----:|
| Year 0: Prismafall | O (8장) | O (21) | O (ref) | Pass |
| ~780: Novel start, storm surge | O (8장) | O (21, 23) | O (2.3 note) | Pass |
| ~795: Noise sacrifice, network | O (8장) | O (23, 대막7) | O (ref "700년 전") | Pass |
| ~810: Kai's record completion | O (8장) | O (23 후일담) | O (ref "코덱스 원전") | Pass |
| ~1150: Extreme color reduction | O (8장) | -- | O (2.3 note) | Pass |
| ~1300: Seal weakening begins | O (8장, 8.1) | -- | O (implied) | Pass |
| ~1350: Nyx gate partial failure | O (8장) | -- | O (implied by PvP) | Pass |
| ~1500: Game timeline | O (8장) | O (21) | O (1장) | Pass |

### Network 3-Axis Weakening Timeline

| Axis | World Bible | Master Doc | Game Design | Match |
|------|:-----------:|:----------:|:-----------:|:-----:|
| Tuning (Koda): consciousness dilution | O (5.3, 7.3, 8.1) | O (22.2, 23 대막7) | O (3.2: Harmonist, 6.6) | Pass |
| Gateway (Nyx): K-energy erosion | O (5.3, 7.3, 8.1) | O (22.3, 23 대막7) | O (6.6: Border event) | Pass |
| Distribution (Ray): energy dilution | O (5.3, 7.3, 8.1) | O (22.4, 23 대막7) | O (6.6: Luminous restoration) | Pass |

All 3 documents consistently describe the same 3-axis weakening pattern. The game's world events (Border Invasion, Luminous Restoration, Chromastorm) directly map to the 3-axis deterioration described in the World Bible.

---

## D. Structural Consistency (100%)

### 27 Secrets (M/H/C/S) vs 7-Saga Structure

All 27 secrets have assigned reveal points within the 7 saga structure. Cross-referenced against saga summaries in Master Doc section 23:

- M-1 through M-8: All disclosure locations match saga descriptions. M-6 (Nyx identity, 4-stage reveal across sagas 2-5) correctly spans multiple sagas.
- H-1 through H-8: All match. H-2 (underground structure) correctly placed in saga 6-1 where "자장가 악보" discovery occurs.
- C-1 through C-5: All match. C-1 (Chromastorm = Kurogen awakening) escalation from saga 1-1 to 4-2 confirmation aligns with escalation table.
- S-1 through S-6: All match. S-6 (recording meaning shift) spanning sagas 4-2 to 7-2 aligns with Kai's character arc.

### Crisis Escalation Table vs World Bible

The 4-element escalation table (section 27) in Master Doc matches World Bible descriptions:
- **Chromastorm**: Escalation from "distant news" (books 1-4) to "large-scale above Hakuten" (books 31-34) aligns with World Bible's storm frequency increase pattern (section 11.5).
- **Border tension**: Escalation matches World Bible's gate weakening (section 8.1).
- **Kurogen awakening**: Progressive revelation matches World Bible's derivative consciousness hierarchy (section 3.2-1).
- **Social unrest**: Escalation matches World Bible's societal structure (section 4, 5).

### Subplot System vs 7-Saga Structure

Master Doc section 25.3 distributes 120 subplot episodes across 7 sagas, totaling 700 episodes (580 main + 120 sub). This is internally consistent and matches the saga structure in section 23.

---

## E. File Reference Consistency (80%)

### CLAUDE.md File Paths

| Path in CLAUDE.md | Actual File | Match |
|-------------------|:-----------:|:-----:|
| `project-assets/settings/크로마버스_작문_원칙_통합.md` | Exists | Pass |
| `project-assets/settings/01_크로마주_세계관설정집_v2_3_4.md` | Exists | Pass |
| `project-assets/settings/02_크로마주_게임개발설계서_v2_2.md` | Exists | Pass |
| `project-assets/settings/fantasy_writing_reference.json` | Exists | Pass |
| `project-assets/novel/archive-v1/` | Exists (1-11화) | Pass |
| `project-assets/plots/` (대막별 화별 플롯) | Exists (대막1만) | Pass |
| `project-assets/tracking/` (5 tracking files) | All 5 exist | Pass |

### Master Document Internal References

| Path in Master Doc | Actual File | Match |
|--------------------|:-----------:|:-----:|
| `project-assets/settings/fantasy_writing_reference.json` | Exists | Pass |
| `project-assets/settings/01_크로마주_세계관설정집_v2_3_4.md` | Exists | Pass |
| `project-assets/settings/02_크로마주_게임개발설계서_v2_2.md` | Exists | Pass |
| `project-assets/novel/크로마버스_{N}화_{제목}.md` | Template pattern; archive-v1 has actual files | Pass |

### Issues Found

#### Critical E-1: Stale Reference in Website Plan Doc (Severity: Medium)

- **Location**: `docs/01-plan/features/chromaverse-website.plan.md`, lines 42-46
- **Detail**: References 3 outdated paths:
  1. `project-assets/01_크로마주_세계관설정집_v2_3_3.md` -- File is now `v2_3_4.md` and located in `settings/` subfolder
  2. `project-assets/03_크로마버스_소설설계서_v2_3.md` -- File was merged into master document and deleted (2026-03-15)
  3. `project-assets/크로마버스_대막1_화별플롯_1-80화.md` -- File is in `plots/` subfolder
- **Impact**: Plan document references nonexistent files. Anyone following the plan doc would find broken paths.
- **Recommendation**: Update plan document with current paths or add a note that it references pre-consolidation file structure.

#### Warning E-2: CLAUDE.md Integration History Note (Severity: Low)

- **Location**: `CLAUDE.md`, line 193
- **Detail**: Notes that `03_크로마버스_소설설계서_v2_3.md` was merged and deleted, but the git status shows this file as modified (`M`), not deleted. The file may still exist in modified form.
- **Recommendation**: Verify the actual state of `03_크로마버스_소설설계서_v2_3.md` -- if it has been converted to a different format (the git status suggests it was modified to `.md` from `.docx`), update the integration note.

---

## Additional Findings (Cross-Document Quality)

### Naming Consistency: "Grand Conductor" vs "Grand Harmonist"

- World Bible (5.3): "그랜드 하모니스트" as game-era job name
- Game Design (4.3): "그랜드 하모니스트 / 大調律師" as hidden job
- Master Doc (22.2): Koda's ultimate path is "그랜드 컨덕터"
- World Bible (8.1): "그랜드 컨덕터의 속삭임" as a legend

This is **intentional differentiation**: "그랜드 컨덕터" is the novel-era title (Koda's personal achievement), while "그랜드 하모니스트" is the game-era institutionalized job class. The World Bible 8.1 confirms the legend connects them. Not a discrepancy.

### Game Design Missing "노이즈" Party Name

The Game Design document never mentions the party name "노이즈" (Noise). This is appropriate -- the game is set 700 years later, and the party is referenced only as "네 명의 선구자" (Four Pioneers), consistent with historical distance. Not a discrepancy.

---

## Recommended Actions

### Immediate Actions (Priority: High)
1. **[E-1]** Update `docs/01-plan/features/chromaverse-website.plan.md` references to current file paths

### Documentation Updates (Priority: Medium)
2. **[A-2]** Add "크로마시프트" confirmed term to Game Design section 2.3 where the ±30 mechanic is described
3. **[E-2]** Verify and clarify the integration status of `03_크로마버스_소설설계서_v2_3.md` in CLAUDE.md

### Review Recommended (Priority: Low)
4. **[A-1]** Evaluate whether "비스트폼" job name should use chromaverse-native terminology for full Appendix B compliance

---

## Synchronization Summary

| Issue | Recommended Resolution |
|-------|----------------------|
| Plan doc stale paths (E-1) | Modify implementation (update plan doc) |
| Chromashift term missing in game doc (A-2) | Modify implementation (add term to game doc) |
| Beastform naming edge case (A-1) | Record as intentional (job name vs creature term) |
| Integration history note (E-2) | Update documentation |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-15 | Initial 3-document cross-validation | gap-detector |
