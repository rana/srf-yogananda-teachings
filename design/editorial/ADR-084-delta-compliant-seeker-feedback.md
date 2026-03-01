## ADR-084: DELTA-Compliant Seeker Feedback Mechanism

The portal has no mechanism for seekers to communicate back without violating DELTA principles. Three feedback channels, none storing user identifiers:

### Feedback Types

| Channel | Location | What It Captures |
|---------|----------|-----------------|
| **"Report a citation error"** | Link on every passage (search, reader, share page) | Passage ID + freeform description |
| **"I didn't find what I needed"** | Search results page (empty or sparse results) | Search query + anonymous counter |
| **General feedback** | `/feedback` page (linked from footer) | Topic category + freeform text |

### Data Model

```sql
CREATE TABLE seeker_feedback (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 feedback_type TEXT NOT NULL CHECK (feedback_type IN (
 'citation_error', 'search_miss', 'general', 'accessibility'
)),
 content TEXT, -- freeform description (nullable for search_miss)
 passage_id UUID REFERENCES book_chunks(id), -- for citation errors
 search_query TEXT, -- for search misses
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_feedback_type ON seeker_feedback(feedback_type, created_at DESC);
```

### API Route

`POST /api/v1/feedback` — rate-limited at 5 submissions per IP per hour (IP is used for rate limiting but not stored in the database).

### PII Mitigation (ADR-099)

The feedback form includes the notice: *"Please do not include personal information (name, email, location) in your feedback."* Feedback entries are reviewed periodically by editorial staff; inadvertent PII is redacted. Entries older than 2 years are eligible for archival aggregation (convert to anonymized statistics, delete raw text).

### Editorial Integration

Feedback appears in the editorial review portal (Milestone 3b) as a "Seeker Feedback" queue alongside theme tag review and ingestion QA. Citation error reports are highest priority — they directly affect the portal's fidelity guarantee.

---
