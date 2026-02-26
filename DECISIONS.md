# SRF Online Teachings Portal — Architecture Decision Records

Each record captures architectural reasoning with full context — not just the direction chosen but *why*, and what alternatives were considered. In a pre-code project, "Accepted" means accepted as architectural direction. Implementation validates or revises. Foundational ADRs (Principles group) are immutable without full deliberation. Provisional ADRs (distant-arc groups) represent thorough thinking about future direction, not binding commitments. See ADR-098 for the maturity classification.

**ADR maturity:** Foundational (project identity, change requires deliberation) · Active (governing current/imminent implementation) · Provisional (thorough direction for future arcs, may be revised or suspended) · Suspended (moved to PROPOSALS.md, reasoning preserved here) · Implemented (validated through code).

**Arc navigation:** ADRs in the Foundational Constraints, Architecture & Platform, Content & Data Model, and Search & AI groups govern Arcs 1–3 and require close attention during implementation. ADRs in later groups (Cross-Media, Internationalization, Staff & Community, Brand & Communications) are Provisional — they represent thorough architectural thinking but their implementation is distant. Treat them as direction, not immediate specification.

*ADR numbers are stable identifiers, not sequence counters — do not renumber to fill gaps. Gaps at 028, 045, 102–103 exist from restructuring; 125–126 appeared in early explorations but were never adopted. New ADRs append after 124. A gap may be reused for a new ADR if thematically adjacent to its group (e.g., ADR-015 was reclaimed for a Foundational ADR).*

### Index by Concern

**Foundational Constraints**

Establishes the project's theological and ethical identity. The portal displays only Yogananda's verbatim words — Claude acts as librarian, never oracle — with personalization boundaries governed by the DELTA privacy framework. Verbatim media fidelity extends this commitment to all modalities: AI generation of voice, image, or video representing the gurus or reading sacred text is prohibited. Accessibility is a Milestone 2a requirement (not a retrofit), the architecture targets a 10-year horizon, and global equity ensures underserved seekers are never second-class users.

- ADR-001: Direct Quotes Only — No AI Synthesis
- ADR-002: Personalization with Restraint — DELTA-Aligned Feature Boundaries
- ADR-003: Accessibility Foundation
- ADR-004: Architecture Longevity — 10-Year Design Horizon
- ADR-005: Claude AI Usage Policy — Permitted Roles, Prohibited Uses, and Expansion Roadmap
- ADR-006: Global Equity — Serving Earth's Underserved Seekers
- ADR-007: Curation as Interpretation — The Fidelity Boundary and Editorial Proximity Standard
- ADR-015: Verbatim Media Fidelity — Cross-Modal Content Integrity
- ADR-121: DELTA-Relaxed Authenticated Experience

**Architecture & Platform**

Defines the technology stack and infrastructure topology. The frontend runs Next.js on Vercel; the database is Neon PostgreSQL with pgvector and pg_search (single-database, no DynamoDB); AI calls go through AWS Bedrock Claude with model tiering; infrastructure is Terraform-managed from Milestone 1a with GitHub Actions CI/CD, OIDC federation for AWS auth, S3 + DynamoDB state backend, and CI-agnostic deployment scripts. Also covers PWA strategy, content-addressable deep links, rate limiting, PDF generation, low-tech channel support, language URL design, Postgres-native graph intelligence, and three-tier suggestion caching (static JSON → pg_trgm → Vercel KV).

- ADR-008: Next.js + Vercel for Frontend
- ADR-009: Neon + pgvector for Vector Search
- ADR-010: Contentful as Editorial Source of Truth
- ADR-011: API-First Architecture for Platform Parity
- ADR-012: Progressive Web App as Mobile Intermediate Step
- ADR-013: Single-Database Architecture — No DynamoDB
- ADR-014: AWS Bedrock Claude with Model Tiering
- ADR-016: Infrastructure as Code (Terraform)
- ADR-017: Terraform-Native Lambda
- ADR-018: CI-Agnostic Deployment Scripts
- ADR-019: Database Backup and Recovery Strategy
- ADR-020: Multi-Tenant Infrastructure Design
- ADR-021: Redundancy, Failover, and Regional Distribution Strategy
- ADR-022: Content-Addressable Passage Deep Links
- ADR-023: Search API Rate Limiting and Abuse Prevention
- ADR-024: Native Share API as Primary Mobile Sharing
- ADR-025: PDF Generation Strategy — Resource-Anchored Exports
- ADR-026: Low-Tech and Messaging Channel Strategy
- ADR-027: Language API Design — Locale Prefix on Pages, Query Parameter on API
- ADR-117: Postgres-Native Graph Intelligence Layer
- ADR-120: Three-Tier Suggestion Cache Architecture

**Content & Data Model**

Specifies what content the portal holds and how it is structured in the database. Autobiography of a Yogi is the Arc 1 focus book; ingestion priority follows life-impact over scholarly significance; the data model is edition-aware with teaching topics taxonomy, exploration themes, a living glossary, a people library (including monastic lineage), and a canonical entity registry with Sanskrit normalization. Content integrity verification, sacred image guidelines, and a structured spiritual ontology ensure fidelity and machine-readability.

- ADR-029: Autobiography of a Yogi as Focus Book
- ADR-030: Book Ingestion Priority — Life-Impact Over Scholarly Significance
- ADR-031: Teaching Topics — Curated Thematic Entry Points
- ADR-032: Teaching Topics Multi-Category Taxonomy and Semi-Automated Tagging Pipeline
- ADR-033: Exploration Theme Categories — Persons, Principles, Scriptures, Practices, Yoga Paths
- ADR-034: Edition-Aware Content Model
- ADR-035: Image Content Type — Photographs as First-Class Content
- ADR-036: People Library — Spiritual Figures as First-Class Entities
- ADR-037: Monastic & Presidential Lineage in the People Library
- ADR-038: Living Glossary — Spiritual Terminology as User-Facing Feature
- ADR-039: Content Integrity Verification
- ADR-040: Magazine Integration — Self-Realization Magazine as First-Class Content
- ADR-041: Arc 1 Bootstrap
- ADR-042: Sacred Image Usage Guidelines
- ADR-043: Structured Spiritual Ontology — Machine-Readable Teaching Structure
- ADR-116: Canonical Entity Registry and Sanskrit Normalization

**Search & AI**

Governs how seekers find passages and how AI assists retrieval. Search uses hybrid vector + BM25 retrieval fused via Reciprocal Rank Fusion, with Voyage voyage-3-large embeddings, pg_search/ParadeDB for full-text, and an advanced pipeline adding HyDE query expansion and Cohere Rerank 3.5. Suggestions are corpus-derived (never behavior-derived), related teachings use pre-computed chunk relations and graph traversal, and a unified enrichment pipeline runs a single index-time pass per chunk. The terminology bridge maps modern phrasing to Yogananda's vocabulary across books.

- ADR-044: Hybrid Search (Vector + Full-Text)
- ADR-046: Embedding Model Versioning and Migration (updated by ADR-118)
- ADR-047: Multilingual Embedding Quality Strategy (updated by ADR-118)
- ADR-048: Chunking Strategy Specification
- ADR-049: Search Suggestions — Corpus-Derived, Not Behavior-Derived
- ADR-050: Related Teachings — Pre-Computed Chunk Relations and Graph Traversal
- ADR-051: Terminology Bridge Per-Book Evolution Lifecycle
- ADR-052: Passage Resonance Signals — Content Intelligence Without Surveillance
- ADR-053: "What Is Humanity Seeking?" — Anonymized Search Intelligence
- ADR-114: pg_search / ParadeDB BM25 for Full-Text Search
- ADR-115: Unified Enrichment Pipeline — Single Index-Time Pass per Chunk
- ADR-118: Voyage voyage-3-large as Primary Embedding Model
- ADR-119: Advanced Search Pipeline — HyDE, Cohere Rerank, Three-Path Retrieval

**Cross-Media**

Decides how video, audio, image, and cross-media content integrate into the portal. YouTube videos use hybrid RSS + API ingestion; transcripts are time-synced for passage-level linking; the video model is platform-agnostic to support future migration. Audio gets its own library with cross-media search; AI-generated audio is policy-controlled. The knowledge graph evolves to treat all content types as nodes, with visualization, digital watermarking for SRF images, and multi-size image serving.

- ADR-054: YouTube Integration via Hybrid RSS + API with ISR
- ADR-055: Video Transcript Time-Synced Architecture
- ADR-056: Platform-Agnostic Video Model and Documentary Integration
- ADR-057: Audio Library and Cross-Media Audio Search
- ADR-058: AI Audio Generation for Portal Audio Assets
- ADR-059: Chant Reader — Devotional Poetry with Deterministic Cross-Media Linking
- ADR-060: Unified Content Hub — Cross-Media Relations, Search, and Theming
- ADR-061: Knowledge Graph Visualization
- ADR-062: Knowledge Graph Cross-Media Evolution — All Content Types as Graph Nodes
- ADR-063: Digital Watermarking Strategy for SRF Images
- ADR-064: Multi-Size Image Serving and Download Options

**Seeker Experience**

Shapes how the portal feels and behaves for readers. The design system derives from SRF's visual identity with Calm Technology principles — quiet, unhurried, spiritually resonant. Features include lotus bookmarks (no account required), non-search discovery journeys, passage sharing as organic growth, events and sacred places as signposts, crisis resources as a gentle safety net, cognitive accessibility for all seekers, screen reader emotional quality, and micro-copy treated as ministry. Practice Bridge provides signpost enrichment linking teachings to spiritual practice.

- ADR-065: SRF-Derived Design System with Calm Technology Principles
- ADR-066: Lotus Bookmark — Account-Free Reading Bookmarks
- ADR-067: Non-Search Seeker Journeys — Equal Excellence for Every Path
- ADR-068: Passage Sharing as Organic Growth Mechanism
- ADR-069: Events and Sacred Places — Signpost, Not Destination
- ADR-070: Sacred Places — No Embedded Map, Street View Links Instead
- ADR-071: Crisis Resource Presence — Gentle Safety Net on Grief and Death Content
- ADR-072: Cognitive Accessibility — Reducing Complexity for All Seekers
- ADR-073: Screen Reader Emotional Quality — Warmth in Spoken Interface
- ADR-074: Micro-Copy as Ministry — Editorial Voice for UI Text
- ADR-104: Practice Bridge & Public Kriya Yoga Overview — Signpost Enrichment
- ADR-122: Crisis Query Detection — Safety Interstitial for Acute-Distress Searches

**Internationalization**

Architects the portal for worldwide multilingual access from the foundation up. Three-layer localization separates UI strings, content translations, and locale-specific formatting; CSS uses logical properties from Milestone 2a for RTL readiness. The core language set defines 10 languages (en, de, es, fr, it, pt, ja, th, hi, bn) — all non-English languages are Milestone 5b peers with no wave ordering. AI-assisted translation is permitted for UI and editorial text but never for Yogananda's words — only official SRF/YSS translations. Sanskrit display is normalized for search; YSS branding is locale-aware; content is machine-readable for AI citation with full crawler support. Content gating (DRM, FlipBook) is architecturally prohibited (§3a); `ai.txt` provides machine-parseable AI permissions (§3b); copyright asserted through metadata and legal layers, not technology walls.

- ADR-075: Multi-Language Architecture — Three-Layer Localization
- ADR-076: CSS Logical Properties
- ADR-077: Core Language Set
- ADR-078: AI-Assisted Translation Workflow
- ADR-079: YSS Organizational Branding and Locale Strategy
- ADR-080: Sanskrit Display and Search Normalization Policy
- ADR-081: Machine-Readable Content and AI Citation Strategy

**Staff & Community**

Defines editorial tools and community participation features. Staff get a five-layer editorial system (from bulk operations to AI-assisted enrichment); seekers get a study workspace with universal teaching tools that require no authentication. Feedback is DELTA-compliant (no user profiling), lessons integration is designed for future readiness, community collections use tiered visibility for public curation, and VLD editorial delegation enables a volunteer curation pipeline.

- ADR-082: Staff Experience Architecture — Five-Layer Editorial System
- ADR-083: Study Workspace — Universal Teaching Tools Without Authentication
- ADR-084: DELTA-Compliant Seeker Feedback Mechanism
- ADR-085: Lessons Integration Readiness
- ADR-086: Community Collections — Tiered Visibility Public Curation
- ADR-087: VLD Editorial Delegation — Volunteer Curation Pipeline

**Brand & Communications**

Governs the portal's public identity and outreach channels. SRF imagery follows specific usage guidelines; the AI search feature is branded as "The Librarian" to reinforce the non-oracle role; "What Is Humanity Seeking?" repurposes anonymized search intelligence as a communications asset. Distribution includes daily email with verbatim passage delivery, social media with portal-generated assets and human distribution, and a seeker-facing changelog for portal updates.

- ADR-088: SRF Imagery Strategy in the Portal
- ADR-089: "The Librarian" — AI Search Brand Identity
- ADR-090: "What Is Humanity Seeking?" as Strategic Communications Asset
- ADR-091: Daily Email — Verbatim Passage Delivery
- ADR-092: Social Media Strategy — Portal-Generated Assets, Human Distribution
- ADR-105: Portal Updates — Seeker-Facing Changelog

**Operations & Engineering**

Specifies how the portal is built, tested, and monitored. Engineering standards cover code quality and review; testing strategy spans unit through end-to-end with Neon branch-per-PR isolation and schema diff in CI; observability uses Sentry plus structured JSON logging with Amplitude for DELTA-compliant analytics. Neon platform governance (ADR-124) covers PostgreSQL version selection (PG18), tier selection, compute configuration, branch lifecycle, extension management, UUIDv7 schema convention, and database observability. MCP servers provide three-tier corpus access (development, internal editorial, external distribution). Also covers AI editorial workflow maturity with trust graduation, outbound webhooks for push-based syndication, timestamp filtering for incremental sync, and cross-API route rationalization for consistent identifiers.

- ADR-093: Engineering Standards for SRF Projects
- ADR-094: Testing Strategy
- ADR-095: Observability Strategy
- ADR-096: Design Tooling — Figma
- ADR-097: MCP Server Strategy — Development Tooling for AI Implementation
- ADR-100: AI Editorial Workflow Maturity — Trust Graduation and Feedback Loops
- ADR-101: MCP as Three-Tier Corpus Access Layer — Development, Internal, and External
- ADR-106: Outbound Webhook Events — Push-Based Content Syndication
- ADR-107: Timestamp Filtering on List Endpoints — Incremental Sync for Automation Consumers
- ADR-108: Magazine API Rationalization — Flat Resources, Single-Segment Slugs
- ADR-109: Cross-API Route Rationalization — Consistent Identifiers, Consolidated Namespaces, Complete CRUD

**Governance**

Controls how the project governs its own decisions, documents, and evolution. The thirteen-document system (CLAUDE.md, PRINCIPLES.md, CONTEXT.md, DESIGN.md + 3 arc files, DECISIONS.md index + 3 body files, PROPOSALS.md, ROADMAP.md) is designed for AI-first navigation with arc-gated loading and a three-tier maturity model (explorations → proposals → decisions). ADR maturity classification (Foundational, Active, Provisional, Suspended, Implemented) honestly reflects confidence levels. DELTA serves as the primary framework for global privacy. Arc 1 is split into prove-then-build stages. API response conventions, search result presentation, content versioning, and the principle-vs-parameter classification (ADR-123) round out the governance framework.

- ADR-098: Documentation Architecture — Thirteen-Document System with Arc/Milestone-Gated Loading
- ADR-099: Global Privacy Compliance — DELTA as Primary Framework
- ADR-110: API Response Conventions — Envelope, Naming, and Identifier Standards
- ADR-111: Search Result Presentation — Ranking, Display, and Intentional Non-Pagination
- ADR-112: Content Versioning Strategy — Editions, Translations, and Archive Policy
- ADR-113: Prove Before Foundation (Arc 1 Milestone Split)
- ADR-123: Principle vs. Parameter — Decision Classification and Governance Flexibility
- ADR-124: Neon Platform Governance — PostgreSQL Version, Tier, Compute, Branching, Extensions, and Observability

---

## ADR Body Files

ADR bodies are split across three files by concern group, mirroring the DESIGN file structure:

| File | Groups | ADRs | Arc Relevance |
|------|--------|------|---------------|
| [DECISIONS-core.md](DECISIONS-core.md) | Foundational, Architecture, Content, Search | ADR-001–027, 029–044, 046–053, 114–121 | Arc 1+ (implementation-critical) |
| [DECISIONS-experience.md](DECISIONS-experience.md) | Cross-Media, Seeker Experience, Internationalization | ADR-054–081, 104, 122 | Arc 2+ (experience design) |
| [DECISIONS-operations.md](DECISIONS-operations.md) | Staff, Brand, Operations, Governance | ADR-082–101, 105–113, 123–124 | Arc 1+ (governance, engineering standards); Arc 3+ (staff, brand, operations) |

