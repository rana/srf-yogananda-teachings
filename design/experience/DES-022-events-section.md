## DES-022: Events Section

The portal connects seekers to SRF's gatherings without duplicating existing event properties. This is a signpost, not a destination. See ADR-069.

### Content

| Element | Content | Source | Update Frequency |
|---------|---------|--------|-----------------|
| **World Convocation** | SRF's annual gathering of seekers from around the world, offered free of charge. Held each August in Los Angeles and simultaneously online, Convocation includes classes on Yogananda's teachings, group meditations, devotional chanting (kirtan), pilgrimage tours to sacred SRF sites, and fellowship with monastics and seekers worldwide. Anyone may attend — no membership required. Hero image, next year's dates. | Static text + link to `convocation.yogananda.org` | Annual |
| **Commemorations** | Christmas meditation, Mahasamadhi (March 7), Janmashtami, Founder's Day, etc. | Static list with dates and links to SRF event pages | Annual |
| **Online events** | "Join a live meditation" — SRF's Online Meditation Center offers live group meditations, guided meditations led by SRF monastics, and devotional chanting sessions from the convenience of home. | Link to `onlinemeditation.yogananda.org` | Static |
| **Retreats** | "Experience a retreat" | Link to SRF retreat information | Static |
| **Monastic visits** | SRF monastics visit meditation centers worldwide throughout the year for classes, meditations, and fellowship. | Link to SRF events page (`yogananda.org/events`) | Static |
| **Youth & young adult programs** | SRF offers dedicated programs for young seekers. | Link to SRF youth/young adult pages (`yogananda.org/events`) | Static |

### Page Design

Located at `/events` (dedicated page — consistent with the routes table in § Frontend Design § Pages and the nav structure).

```
┌─────────────────────────────────────────────┐
│ Gatherings & Events │
│ │
│ ┌─────────────────────────────────────┐ │
│ │ 🌅 World Convocation 2027 │ │
│ │ │ │
│ │ SRF's annual gathering of seekers │ │
│ │ from around the world — free and │ │
│ │ open to all. Classes, meditations, │ │
│ │ kirtan, pilgrimage tours to sacred │ │
│ │ SRF sites, and fellowship with │ │
│ │ monastics. In Los Angeles & online. │ │
│ │ │ │
│ │ Register free → convocation.yoga.. │ │
│ │ Explore the sacred places → /places │ │
│ └─────────────────────────────────────┘ │
│ │
│ Upcoming Commemorations │
│ ───────────────────────── │
│ March 7 · Mahasamadhi of │
│ Paramahansa Yogananda │
│ August · Janmashtami │
│ December · Christmas Meditation │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Join a Live │ │ Experience a │ │
│ │ Meditation → │ │ Retreat → │ │
│ └──────────────────┘ └──────────────────┘ │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Monastic Visits │ │ Youth & Young │ │
│ │ Worldwide → │ │ Adult Programs → │ │
│ └──────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────┘
```

### Implementation

- **Milestone 5a:** Static content. MDX or hardcoded in a Next.js page. No CMS needed.
- **Production:** Contentful entry type `event` with fields: `title`, `date`, `description`, `externalUrl`, `image`. Editors update annually.
- **No dynamic event data.** The portal does not fetch from SRF's event systems. It links to them.
- **Lightweight calendar awareness (Milestone 5a):** The Convocation hero card displays the next Convocation date. Since Convocation is always in August, a simple date comparison promotes the card from "annual event" to "upcoming event" when the current date is within a configurable window (e.g., April–August). During this window, the card's description adds "Registration is open" with link. Outside the window: "Held each August." This is not the full DES-028 calendar-aware surfacing system — it's a single date check on a static page. Commemorations can use similar lightweight date proximity when full DES-028 ships (Milestone 3b+).

---
