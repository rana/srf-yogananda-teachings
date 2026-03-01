## DES-023: Sacred Places — Contemplative Geography

A dedicated `/places` page presenting sites of biographical and spiritual significance, cross-referenced with book passages. See ADR-069.

### Data Model

```sql
-- Sacred places (SRF properties + biographical sites)
CREATE TABLE places (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 name TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 category TEXT NOT NULL CHECK (category IN ('srf_property', 'yss_property', 'biographical')),
 description TEXT NOT NULL,
 significance TEXT, -- Spiritual/historical significance
 address TEXT,
 city TEXT NOT NULL,
 region TEXT, -- State/province
 country TEXT NOT NULL,
 latitude DECIMAL(10, 7),
 longitude DECIMAL(10, 7),
 image_url TEXT, -- Contemplative header image
 visiting_info TEXT, -- Hours, access notes
 external_url TEXT, -- Link to SRF/YSS property page
 virtual_tour_url TEXT, -- SRF virtual pilgrimage tour URL (nullable; SRF offers tours of Mother Center, Lake Shrine, Hollywood Temple, Encinitas)
 is_active BOOLEAN NOT NULL DEFAULT true,
 display_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- Junction: which book passages mention which places
CREATE TABLE chunk_places (
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
 context_note TEXT, -- e.g., "Yogananda describes arriving at this ashram"
 PRIMARY KEY (chunk_id, place_id)
);

CREATE INDEX idx_chunk_places_place ON chunk_places(place_id);
CREATE INDEX idx_chunk_places_chunk ON chunk_places(chunk_id);
```

### Page Design

```
┌──────────────────────────────────────────────────┐
│ Sacred Places │
│ Where the teachings come alive │
│ │
│ ── SRF & YSS Centers ────────────────────────── │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ [contemplative photo] │ │
│ │ │ │
│ │ Lake Shrine │ │
│ │ Pacific Palisades, California │ │
│ │ │ │
│ │ A ten-acre sanctuary on Sunset Boulevard, │ │
│ │ home to the Gandhi World Peace Memorial │ │
│ │ and spring-fed lake surrounded by │ │
│ │ meditation gardens. │ │
│ │ │ │
│ │ 📖 Read about Lake Shrine → │ │
│ │ Autobiography, Chapter 49 │ │
│ │ │ │
│ │ Visit → srf.org/lake-shrine │ │
│ │ Take a Virtual Tour → │ │
│ │ Get Directions → │ │
│ │ See This Place (Street View) → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ [contemplative photo] │ │
│ │ │ │
│ │ Encinitas Retreat │ │
│ │ Encinitas, California │ │
│ │ │ │
│ │ The ocean-facing hermitage where │ │
│ │ Yogananda wrote much of the │ │
│ │ Autobiography of a Yogi. │ │
│ │ │ │
│ │ 📖 Read in context → │ │
│ │ Autobiography, Chapter 37 │ │
│ │ │ │
│ │ Visit → srf.org/encinitas │ │
│ │ Get Directions → │ │
│ │ See This Place (Street View) → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ── In the Footsteps of Yogananda ────────────── │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Gorakhpur, India │ │
│ │ Yogananda's birthplace │ │
│ │ │ │
│ │ "I find my earliest memories │ │
│ │ centering around the family home │ │
│ │ in Gorakhpur..." │ │
│ │ — Autobiography of a Yogi, Chapter 1 │ │
│ │ │ │
│ │ 📖 Read Chapter 1 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Ranchi, India │ │
│ │ Yogoda Satsanga Brahmacharya Vidyalaya │ │
│ │ │ │
│ │ "A school for boys where yoga was │ │
│ │ taught along with standard │ │
│ │ educational subjects." │ │
│ │ — Autobiography of a Yogi, Chapter 27 │ │
│ │ │ │
│ │ 📖 Read Chapter 27 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Serampore, India │ │
│ │ Sri Yukteswar's ashram │ │
│ │ │ │
│ │ "The hermitage... is a two-storied │ │
│ │ building with a courtyard..." │ │
│ │ — Autobiography of a Yogi, Chapter 12 │ │
│ │ │ │
│ │ 📖 Read Chapter 12 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ [Future: Street View links on place cards]   │
│ │
│ ── Find a Meditation Group Near You ─────────── │
│ External link → yogananda.org/center-locator │
└──────────────────────────────────────────────────┘
```

### The Book Cross-Reference

The unique value of Sacred Places on the teaching portal: each place links to the passages that describe it, and passages in the reader can link back to the place.

**Reader → Place:** When reading a chapter that mentions a significant location, a subtle card appears in the margin or below the passage:

```
┌──────────────────────────────┐
│ 📍 This passage describes │
│ Serampore, India │
│ View in Sacred Places → │
└──────────────────────────────┘
```

**Place → Reader:** Each Sacred Places entry lists passages with deep links:

```
Referenced in:
 • Autobiography of a Yogi, Chapter 12 — "My years with Sri Yukteswar"
 • Autobiography of a Yogi, Chapter 21 — "We visit Kashmir"
 • Autobiography of a Yogi, Chapter 42 — "Last days with my guru"
```

### Place Links Strategy (Distributed Across Arcs)

No embedded map library. Each place card links out to external maps services — zero map dependencies, zero tile servers, zero maintenance. See ADR-070.

| Link | Implementation | Rationale |
|------|---------------|-----------|
| **"Get Directions"** | `geo:` URI or Apple/Google Maps link (opens native maps app) | Delegates navigation to the user's preferred app |
| **"Take a Virtual Tour"** | SRF virtual pilgrimage tour URL (opens in new tab). Available for Mother Center, Lake Shrine, Hollywood Temple, Encinitas. Uses `virtual_tour_url` column — only displayed when non-null. | SRF's narrated virtual tours are warmer and richer than Street View; preferred when available. Requires SRF to confirm canonical tour URLs (see CONTEXT.md Q110). |
| **"See This Place"** | Google Maps Street View URL (opens in new tab) | Fallback virtual visit for places without SRF tours. No tracking scripts on the portal. |
| **Visit** | SRF/YSS property page URL | e.g., "Visit → srf.org/lake-shrine" |

**Street View URL format:** `https://www.google.com/maps/@{lat},{lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s...` — a plain link, no JavaScript, no API key. Only included for places where Street View coverage exists.

### API

```
GET /api/v1/places
Response:
{
 "places": [
 {
 "id": "uuid",
 "name": "Lake Shrine",
 "slug": "lake-shrine",
 "category": "srf_property",
 "city": "Pacific Palisades",
 "country": "US",
 "latitude": 34.0423,
 "longitude": -118.5248,
 "image_url": "...",
 "passage_count": 3
 },
 ...
 ]
}

GET /api/v1/places/[slug]
Response:
{
 "place": {
 "id": "uuid",
 "name": "Lake Shrine",
 "slug": "lake-shrine",
 "category": "srf_property",
 "description": "A ten-acre sanctuary...",
 "significance": "...",
 "address": "17190 Sunset Blvd",
 "city": "Pacific Palisades",
 "region": "California",
 "country": "US",
 "latitude": 34.0423,
 "longitude": -118.5248,
 "image_url": "...",
 "visiting_info": "Open Tuesday–Saturday, 9am–4:30pm",
 "external_url": "https://lakeshrine.org",
 "virtual_tour_url": "https://yogananda.org/...",
 "passages": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage...",
 "book_title": "Autobiography of a Yogi",
 "chapter_title": "...",
 "chapter_number": 49,
 "page_number": 512,
 "context_note": "Yogananda describes the dedication of Lake Shrine",
 "reader_url": "/books/autobiography-of-a-yogi/49#chunk-uuid"
 }
 ]
 }
}
```

### Phasing

| Milestone | Scope |
|-----------|-------|
| **5a** | Static Sacred Places page with SRF/YSS properties. Text + images + external links + "Get Directions." "Take a Virtual Tour" links for properties with SRF virtual pilgrimage tours (Mother Center, Lake Shrine, Hollywood Temple, Encinitas). Cross-references with Autobiography passages. Convocation cross-link on LA-area SRF property cards: "This site is part of the annual SRF World Convocation pilgrimage. Learn more → convocation.yogananda.org." No maps. |
| **Distributed** | Add biographical sites (Gorakhpur, Serampore, Puri, Varanasi, Dakshineswar). "See This Place" Street View links on place cards (ADR-070). Reader ↔ Place cross-reference cards. **Indian biographical site note:** Google Street View coverage in rural India (Gorakhpur, Serampore, Ranchi) is patchy or absent. Where Street View is unavailable, commissioned photography or editorial descriptions should be the primary experience, with maps as secondary. Query YSS for photographic archives of these sites (see CONTEXT.md § Open Questions). "Get Directions" for Indian sites serves a pilgrimage context more than a driving-directions context — consider "Visit this place" framing for Indian biographical sites. |
| **Future** | Dynamic center locator (if SRF provides data). Multi-language place descriptions (Milestone 5b). |

---
