<!-- elmer:archive
  id: book-read-to-me-mode-toggle-displayed-next-to-book-text
  topic: Book read-to-me mode toggle displayed next to book text. Human reading of the book for illiterate, young people, or anyone. Perhaps option of man or woman. Read by monastics. Have reading in each language. Can start reading from any paragraph, start of book, chapter, etc. Note estimate illiterate, and who it might reach on Earth.
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 03:46 UTC
-->

# Read-to-Me Mode for SRF Online Teachings Portal

## Summary

Implement a human-narrated audio feature enabling illiterate, visually impaired, young, and other seekers to access Yogananda's teachings through monastic-read audio recordings. This feature would provide gender-choice narration in each supported language, with paragraph-level playback control. Reaching an estimated 771 million illiterate adults globally (UNESCO 2022), plus millions of young readers, elderly seekers with vision challenges, and those who learn better through listening.

## Analysis

### Global Literacy Context
- **771 million adults** lack basic literacy skills globally (UNESCO 2022)
- **122 million youth** (15-24 years) cannot read or write
- **Two-thirds of illiterate adults are women** — gender-choice narration becomes essential
- **Regional concentration:** Sub-Saharan Africa (34% illiteracy), South Asia (27%), Arab states (20%)
- **India alone:** 287 million illiterate adults (world's largest population)
- **Digital divide overlap:** Many illiterate populations also have limited internet — requires low-bandwidth audio

### Accessibility Beyond Illiteracy
- **Visual impairment:** 295 million with moderate-severe vision loss globally
- **Dyslexia:** 5-10% of global population
- **Elderly seekers:** Age-related vision decline affects 1.8 billion over 65
- **Young seekers:** Children 6-12 who can understand but not yet read complex spiritual texts
- **Auditory learners:** ~30% prefer audio learning modality
- **Commuters/workers:** Listen while driving, walking, doing manual labor

### Theological Alignment
- **Sacred voice transmission:** Yogananda emphasized the power of the human voice in spiritual transmission
- **Monastic reading:** Preserves the devotional quality lost in TTS
- **Gender inclusivity:** Women monastics reading for women seekers creates spiritual kinship
- **Oral tradition:** Returns to India's ancient oral transmission heritage

### Technical Architecture Impact
This feature intersects with multiple ADRs and design sections:
- **ADR-057:** Audio as first-class content type (Phase 12)
- **ADR-003:** Accessibility as Phase 1 foundation
- **ADR-006:** Global Equity principle
- **ADR-075:** Multi-language architecture
- **ADR-078:** Human translation review (applies to narration quality)
- **DES-025:** Accessibility requirements
- **ADR-072:** Cognitive accessibility

## Proposed Changes

### 1. New ADR-124: Human Narration Architecture
**What:** Create comprehensive decision record for read-to-me mode
**Where:** Add to DECISIONS.md after ADR-123 in Seeker Experience group
**Why:** Major feature requiring architectural commitment
**How:**
```markdown
## ADR-124: Read-to-Me Mode — Human Narration for Global Accessibility

### Context
771 million illiterate adults cannot access written teachings. Millions more have visual impairments, dyslexia, or prefer audio learning. TTS exists but lacks devotional quality.

### Decision
Implement human-narrated audio by SRF/YSS monastics:
- Paragraph-level playback granularity
- Gender choice (male/female monastic voices)
- Per-language recordings (not dubbed)
- Toggle appears inline with book text
- Synchronized highlighting during playback
- Download for offline listening

### Rationale
- Reaches 10% of humanity currently excluded
- Preserves sacred transmission through human voice
- Gender choice respects cultural preferences
- Monastic reading maintains devotional quality

### Implementation Phases
- Phase 2a: UI/UX framework, controls, player
- Phase 3a: English recordings (Autobiography)
- Phase 10a: Multilingual recordings with translation
- Phase 12: Full integration with audio content type
```

### 2. Update Phase 2 (Read) with Audio UI Components
**What:** Add read-to-me UI deliverables to Phase 2
**Where:** ROADMAP.md Phase 2 deliverables table
**Why:** Reader experience includes audio controls
**How:**
- 2.9: Read-to-me toggle component (speaker icon next to paragraphs)
- 2.10: Audio player bar (bottom-docked, minimizable)
- 2.11: Playback speed controls (0.75x, 1x, 1.25x, 1.5x)
- 2.12: Synchronized text highlighting
- 2.13: Continue reading memory (localStorage)

### 3. Create Phase 3a: Record
**What:** New sub-phase for recording infrastructure
**Where:** Insert between Phase 3 and 4 in ROADMAP.md
**Why:** Recording requires separate workflow from ingestion
**How:**
```markdown
## Phase 3a: Record

**Goal:** Establish recording pipeline and create English narrations

### Deliverables
| # | Deliverable | Description |
|---|-------------|-------------|
| 3a.1 | Recording standards | Audio specs (48kHz, mono, -16 LUFS), room requirements |
| 3a.2 | Monastic recording workflow | Scripts, pronunciation guides, review process |
| 3a.3 | Audio processing pipeline | Noise reduction, leveling, compression, segmentation |
| 3a.4 | Paragraph alignment | Force-align audio to text paragraphs (Whisper + Aeneas) |
| 3a.5 | Gender voice selection | Male + female monastics record Autobiography |
| 3a.6 | Storage architecture | S3 for audio files, CDN distribution |
| 3a.7 | Progressive download | Chunked delivery for low-bandwidth |
```

### 4. Database Schema Extensions
**What:** Add audio tables to initial schema
**Where:** Phase 0a.2 deliverable (001_initial_schema.sql)
**Why:** Audio is first-class content from the beginning
**How:**
```sql
CREATE TABLE narrations (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  chapter_id INTEGER REFERENCES chapters(id),
  language VARCHAR(10) NOT NULL,
  narrator_gender VARCHAR(10) CHECK (narrator_gender IN ('male', 'female')),
  narrator_name VARCHAR(255), -- "Brother X" or "Sister Y" if disclosed
  recording_date DATE,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE narration_segments (
  id SERIAL PRIMARY KEY,
  narration_id INTEGER REFERENCES narrations(id),
  chunk_id INTEGER REFERENCES book_chunks(id),
  start_time_ms INTEGER NOT NULL,
  end_time_ms INTEGER NOT NULL,
  transcript TEXT, -- For search within audio
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_narration_segments_timing ON narration_segments(narration_id, start_time_ms);
```

### 5. API Endpoints
**What:** Audio streaming and progress APIs
**Where:** /app/api/v1/audio/ routes
**Why:** Enable playback control and progress tracking
**How:**
- `GET /api/v1/audio/narrations?book_id=X&language=Y&gender=Z`
- `GET /api/v1/audio/stream/[narration_id]` (range requests)
- `POST /api/v1/audio/progress` (save playback position)

### 6. UI Component Design
**What:** Audio player interface components
**Where:** /components/audio/ directory
**Why:** Consistent audio experience across pages
**How:**
```typescript
// /components/audio/ReadToMeToggle.tsx
- Speaker icon button per paragraph
- Tooltip: "Listen to this passage"
- Gender selector dropdown (if both available)

// /components/audio/AudioPlayer.tsx
- Bottom dock design (like podcast players)
- Play/pause, 15s skip, speed control
- Progress bar with chapter markers
- Currently reading text display
- Download button for offline

// /components/audio/TextHighlight.tsx
- Synchronized highlighting during playback
- Smooth scroll to keep current paragraph visible
```

### 7. Low-Bandwidth Optimization
**What:** Audio delivery for 2G/3G networks
**Where:** /lib/services/audio.ts
**Why:** Serve illiterate populations often on slow connections
**How:**
- Opus codec at 24 kbps (acceptable for speech)
- 30-second chunked progressive download
- Preload only next chunk
- Quality selector (low/normal/high)
- Service worker caching for offline replay

### 8. Content Guidelines for Narrators
**What:** Monastic recording instructions
**Where:** /docs/operational/narration-guide.md
**Why:** Ensure consistent, devotional quality
**How:**
```markdown
## Narration Guidelines for Monastics

### Preparation
- Read full chapter before recording for context
- Mark difficult Sanskrit pronunciations
- Note emotional passages requiring special care

### Recording Principles
- Contemplative pace (140-160 words/minute)
- Clear enunciation without theatrical emotion
- Pause at paragraph breaks (2 seconds)
- Natural emphasis on Yogananda's italicized words
- Consistent Sanskrit pronunciation per SRF guidelines

### Technical Requirements
- Quiet room (< 30 dB noise floor)
- Consistent distance from microphone
- Record full chapters in single sessions
- Provide pronunciation notes for review
```

### 9. Update CONTEXT.md Open Questions
**What:** Add narration-related stakeholder questions
**Where:** CONTEXT.md § Open Questions Tier 2
**Why:** Requires SRF decisions before implementation
**How:**
- [ ] Which monastics are available/willing to record?
- [ ] Should narrator identities be disclosed ("Read by Brother X")?
- [ ] Recording location: Mother Center studio or distributed?
- [ ] Compensation/recognition for monastic narrators?
- [ ] Review process for narration quality/pronunciation?

### 10. Metrics and Impact Tracking
**What:** Measure read-to-me adoption and impact
**Where:** DESIGN.md § Observability, ADR-095
**Why:** Understand global accessibility impact
**How:**
- Anonymous audio starts by country/language
- Completion rates by chapter
- Speed preferences distribution
- Gender voice selection patterns
- Download counts for offline use
- Search queries leading to audio playback

## Open Questions

### Technical Questions
1. **Force alignment tool:** Aeneas vs. gentle vs. Whisper timestamps?
2. **Audio codec:** Opus (modern, efficient) vs. MP3 (universal compatibility)?
3. **Streaming protocol:** HLS vs. simple range requests?
4. **Offline storage:** Service worker vs. native app download?
5. **Multi-voice chapters:** How to handle quoted dialogues?

### Stakeholder Questions
1. **Monastic availability:** How many hours can monastics dedicate to recording?
2. **Language priorities:** Which languages after English?
3. **Young seekers:** Separate youth-oriented narration style?
4. **Music/chanting:** Include musical interludes between chapters?
5. **Existing recordings:** Does SRF have archival audio to digitize?

### Cultural Questions
1. **Gender preferences by culture:** Research needed per locale?
2. **Reading speed preferences:** Vary by language/culture?
3. **Pronunciation variants:** American vs. British English?
4. **Sacred language handling:** Special treatment for Sanskrit verses?

## What's Not Being Asked

### Unstated Assumptions
- **Assuming monastic availability** — What if monastics cannot commit to 500+ hours of recording? Need backup plan: dedicated lay practitioners? Professional voice actors with SRF training?
- **Assuming gender binary** — Some seekers may prefer non-binary or mixed-gender narration options
- **Assuming paragraph-level is sufficient** — Some users may want sentence-level control
- **Assuming separate recording per language** — Could English narration + translated subtitles work for some languages?

### Blind Spots
- **Dialect variations:** Hindi has 50+ dialects; which accent for narration?
- **Emotional accessibility:** Some seekers with trauma need trigger warnings before certain passages
- **Partial literacy:** Many can read simple text but struggle with complex passages — hybrid read-along mode?
- **Sign language:** Deaf seekers also deserve access — video with sign interpretation?

### Adjacent Concerns
- **Audio-first seekers:** Some may never engage with text at all — design accordingly
- **Podcast distribution:** These narrations could reach millions via podcast platforms
- **Smart speaker integration:** "Alexa, read Yogananda on meditation"
- **Assisted reading:** Dyslexic readers benefit from synchronized audio+text
- **Study groups:** Audio enables group listening in centers without readers

### Hidden Dependencies
- **Copyright complexity:** Audio rights may differ from text rights
- **Monastic schedules:** Recording conflicts with existing duties
- **Studio quality:** Mother Center may lack professional recording facilities
- **Long-term narrator consistency:** What if a beloved narrator leaves the order?
- **AI voice cloning ethics:** If a beloved narrator passes away, do we preserve their voice?

This feature transforms the portal from a library into a **living voice** — honoring both the oral tradition of Indian spirituality and the modern reality that nearly one billion people cannot access written teachings. It's not just an accessibility feature; it's a return to the fundamental way spiritual teachings have been transmitted for millennia.