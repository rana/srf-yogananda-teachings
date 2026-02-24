<!-- elmer:archive
  id: focused-reader-mode-the-reader-and-the-book-nothing-else-no
  topic: Focused reader mode. The reader and the book, nothing else. No website distractions, no related teachings, etc. A reading mode to enter into. Optional mouse-over paragraph to enter dwell mode or similar. Expand text scale and to foreground. Background blur darkens. Easy reading. Could call it easy reading mode. Easy read-to-me mode. Toggle on. Mouse over paragraph reads to me. Can be combined with easy reading mode. Use SRF UX of navy background, have golden halo rays similar to third eye glow around text for dwell/focus of paragraph. Use subtle, gentle experience, timings, etc.
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 03:00 UTC
-->

## Summary

A focused reader mode that creates an immersive, distraction-free reading experience where the seeker and Yogananda's words become the only elements in the visual field. The mode combines three interaction patterns: a toggle-activated focused reading environment, paragraph-level dwell mode with mouse-over triggers, and optional read-aloud capability. The visual treatment uses the portal's existing spiritual eye symbolism (navy background with golden halo effects) to create a contemplative atmosphere that honors the sacred nature of the texts.

## Analysis

The current design includes several reading-focused features but lacks a unified immersive reading mode:

**Existing foundations:**
- DES-009 describes "Dwell mode" for individual paragraph contemplation (long-press/click activated)
- DES-011 introduces "Meditation Mode" with deeper navy backgrounds for `/quiet` and optional reader mode
- ADR-072 mentions a "Simplified reading mode ('Focus')" planned for Phase 2
- ADR-073 establishes screen reader emotional quality principles
- The visual design system already incorporates spiritual eye symbolism (navy/gold/cream palette)

**Gaps identified:**
- No unified "focused reader mode" that combines immersive reading with dwell interaction
- Dwell mode requires explicit activation (long-press or click) rather than natural mouse-over
- No progressive disclosure from reading → dwelling → audio
- Limited use of the spiritual eye visual metaphor beyond color palette
- No integration between visual focus and audio narration

**User journey analysis:**
- Seekers arrive with varying needs: quick reference, deep study, or contemplative reading
- Current reader supports all modes but doesn't optimize for deep immersion
- The portal's mission of "becoming unnecessary" suggests creating spaces where technology fades completely
- Mouse-over interactions feel more natural for desktop contemplative reading than click-based activation

## Proposed Changes

### 1. Unified Focused Reader Mode
**What:** A new reading mode that progressively removes UI elements to create pure text immersion
**Where:** `/app/components/BookReader/FocusedReaderMode.tsx` and reader header toggle
**Why:** Unifies disparate focus features (dwell, meditation mode, simplified reading) into coherent experience
**How:**
- Add mode toggle in reader header: Standard → Focus → Immerse
- Standard: Current full-featured reader
- Focus: Hides Related Teachings panel, breadcrumbs, keeps navigation
- Immerse: Only text and subtle navigation hints, navy background gradient

### 2. Mouse-Over Dwell Enhancement
**What:** Natural paragraph focusing through mouse movement instead of explicit clicks
**Where:** Modify existing DES-009 dwell mode implementation in `/app/components/BookReader/DwellMode.tsx`
**Why:** Creates fluid, contemplative interaction matching physical reading's natural eye movement
**How:**
- Mouse enters paragraph area → 300ms delay → paragraph begins to highlight
- Stationary for 800ms → full dwell mode activates with golden halo effect
- Visual: Radial gradient from paragraph center, `--srf-gold` at 10-20% opacity
- Other paragraphs dim to 15% opacity (as currently designed)
- Mouse movement cancels or transfers focus naturally

### 3. Golden Halo Visual Treatment
**What:** Spiritual eye-inspired visual focus effect using golden radial gradients
**Where:** CSS custom properties in `/app/styles/reader.css` and React transitions
**Why:** Connects visual metaphor to contemplative practice (third eye meditation)
**How:**
```css
.paragraph-dwell {
  position: relative;
  background: radial-gradient(
    ellipse at center,
    rgba(220, 189, 35, 0.08) 0%,    /* --srf-gold at 8% */
    rgba(220, 189, 35, 0.04) 40%,   /* Gradual fade */
    transparent 70%
  );
  transition: all 600ms ease-out;
}

.immerse-mode {
  background: linear-gradient(
    180deg,
    var(--portal-bg) 0%,
    var(--portal-bg-alt) 20%,
    #f5f0eb 50%,
    #e8e2d9 80%,
    var(--srf-navy) 100vh
  );
}
```

### 4. Read-Aloud Integration
**What:** Optional text-to-speech for focused paragraphs
**Where:** `/app/components/BookReader/ReadAloud.tsx` using Web Speech API
**Why:** Serves visually impaired seekers and enables eyes-closed contemplation
**How:**
- Toggle appears when paragraph dwells for 2+ seconds
- Uses browser's SpeechSynthesis API (no external service needed)
- Reading rate: 0.85x (slower than default for contemplative pace)
- Voice selection: System default with option to choose
- Visual indicator: Subtle pulse animation on speaking word
- Keyboard: 'R' to start/stop reading current paragraph

### 5. Progressive Interaction Depth
**What:** Layered engagement from reading → focusing → dwelling → listening
**Where:** Unified state machine in `/app/components/BookReader/ReaderState.tsx`
**Why:** Natural progression matches deepening attention without forcing modes
**How:**
```
State progression:
1. READING: Full UI, normal scroll
2. FOCUSING: Mouse hovering, paragraph warming (300ms)
3. DWELLING: Stationary mouse, full highlight (800ms)
4. LISTENING: Read-aloud activated (user choice)

Each state incrementally simplifies the interface.
```

### 6. Keyboard Navigation Enhancements
**What:** Extended shortcuts for focused reading mode
**Where:** Update DES-013 keyboard navigation in `/app/components/BookReader/KeyboardNav.tsx`
**Why:** Power users and accessibility need full keyboard control
**How:**
- `f` - Toggle focused reader mode (cycle through three states)
- `m` - Activate mouse-over dwell (for keyboard users)
- `r` - Read current paragraph aloud
- `Shift+R` - Read from current paragraph to chapter end
- `.` - Increase reading speed / `,` - Decrease reading speed

### 7. Mobile Adaptation
**What:** Touch-optimized focused reading for phones/tablets
**Where:** Responsive behavior in reader components
**Why:** Mobile readers need immersion without hover states
**How:**
- Tap paragraph to focus (replaces mouse-over)
- Swipe up/down between paragraphs in focused mode
- Two-finger pinch to exit focused mode
- Reading mode automatically activates landscape orientation lock

### 8. Smooth Transitions
**What:** Carefully timed animations between reading states
**Where:** Transition timing constants in `/lib/config.ts`
**Why:** Abrupt mode changes break contemplative atmosphere
**How:**
```typescript
export const READER_TRANSITIONS = {
  MODE_CHANGE: 400,        // Between standard/focus/immerse
  PARAGRAPH_WARM: 300,     // Mouse enter to highlight start
  PARAGRAPH_DWELL: 500,    // Highlight start to full dwell
  HALO_EXPAND: 600,        // Golden gradient animation
  TEXT_DIM: 400,           // Surrounding text opacity change
  NAVY_FADE: 800,          // Background color transition
} as const;
```

### 9. Persistence and Preferences
**What:** Remember reader preferences across sessions
**Where:** `localStorage` under `srf-portal:reader-preferences`
**Why:** Seekers shouldn't need to reconfigure each visit
**How:**
- Store: last mode, dwell sensitivity, read-aloud voice, reading speed
- Respect `prefers-reduced-motion` (instant transitions)
- Respect `prefers-color-scheme` (navy depth adjustment)
- Provide "Reset to defaults" in settings

### 10. Visual Polish Details
**What:** Subtle enhancements that create sacred atmosphere
**Where:** Reader CSS and component styling
**Why:** The divine is in the details
**How:**
- Lotus watermark at 3% opacity in immerse mode
- Text shadow: 0 0 20px rgba(220,189,35,0.1) on focused paragraph
- Cursor: custom lotus pointer in immerse mode (optional)
- Page margins increase by 20% in focused modes
- Line height increases to 1.9em (from 1.75em)

## Open Questions

1. **Audio voice selection:** Should we use system voices only, or integrate with higher-quality TTS services (Amazon Polly, Google Cloud TTS) for Phase 11+?

2. **Persistence granularity:** Should focused mode be remembered per-book, per-chapter, or globally?

3. **Mobile gesture vocabulary:** Is two-finger pinch intuitive for exiting focused mode, or should we use a different gesture?

4. **Dwell timing parameters:** The proposed 300ms/800ms delays are assumptions. These should be tunable via `/lib/config.ts` and validated in Phase 0a.8 testing.

5. **Navy gradient depth:** How dark should the immerse mode background become? Full `--portal-bg-deep` (#0a1633) or stop at `--srf-navy` (#1a2744)?

6. **Performance implications:** Will radial gradients and continuous hover tracking impact performance on low-end devices?

7. **Accessibility certification:** Does the progressive dimming in focused modes need WCAG exemption as an optional enhancement?

## What's Not Being Asked

**The reader as meditation tool:** The proposal treats focused reading as concentration enhancement, but there's an unexplored dimension of the reader as active meditation support. Could the reading pace synchronize with breathing cues? Could paragraph transitions include micro-pauses for reflection?

**Cultural assumptions about focus:** The "one paragraph at a time" model assumes Western linear reading. Some traditions emphasize whole-page contemplation or non-linear sacred text engagement. Should focused mode support alternative contemplation patterns?

**Integration with existing SRF practices:** SRF has specific reading practices for the Lessons. Should the public portal's focused mode align with or deliberately differ from Lessons reading patterns to maintain the distinction?

**The opposite need:** While this proposal emphasizes immersion, some seekers need the opposite — higher stimulation to maintain focus (ADHD, etc.). Should there be a "vibrant mode" with more visual anchors and interaction points?

**Embodiment beyond the screen:** The DELTA principle of Embodiment suggests the portal should encourage practice over screen time. Could focused mode include built-in reading timers or gentle suggestions to pause and practice what was just read?

**Sound design:** The proposal mentions visual treatments extensively but barely touches sound. Should there be subtle ambient tones (singing bowls, tampura) during focused reading? SRF has existing audio assets that could create contemplative atmosphere.

**Reader mode as API:** Other SRF digital properties might want to embed this focused reader. Should it be designed as a standalone component that could be distributed via npm or embedded via iframe?