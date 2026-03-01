## DES-052: Outbound Webhook Event System

The portal publishes content lifecycle events to registered HTTP subscribers via a lightweight outbound webhook system (ADR-106). This decouples content pipelines from distribution channels — new consumers (Zapier workflows, internal bots, partner integrations) subscribe to events without modifying content code.

### Architecture

```
Content Lifecycle (book published, passage rotated, asset approved)
      │
      ▼
┌─────────────────────┐
│ Event Emitter        │  Fires event to webhook_deliveries table
│ (in content service) │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Delivery Worker      │  Vercel cron (Milestone 5a) or Lambda (Milestone 5b+)
│ (background job)     │  Reads pending deliveries, POSTs to subscribers
└────────┬────────────┘
         │
    ┌────┴────┬──────────┬──────────────┐
    ▼         ▼          ▼              ▼
 Zapier    Slack Bot   RSS Regen    CDN Pre-warm
```

### Event Catalog Summary

| Event | Trigger | Key Consumers |
|-------|---------|---------------|
| `daily_passage.rotated` | Midnight UTC | Zapier → email, WhatsApp broadcast |
| `content.published` | New book/chapter/audio/video | Sitemap regen, CRM update, RSS regen |
| `content.updated` | Content correction | CDN cache purge, RSS regen |
| `social_asset.approved` | Staff approves quote image | Social scheduling tools |
| `portal_update.published` | New portal changelog entry | Internal Slack, RSS regen |

Full catalog, envelope format, delivery semantics, and schema in ADR-106.

### Admin UI (Milestone 5a, editorial portal)

- Subscriber list with event subscriptions and active/suspended status
- Delivery log (30-day rolling) with success/failure and response codes
- "Test" button per subscriber to verify connectivity
- Suspend/Resume controls for failing endpoints

### DELTA Compliance

Events describe content lifecycle only — never seeker behavior. No PII in any payload. The `email.dispatched` event reports `subscriber_count` (aggregate), not individual addresses.

*Section added: 2026-02-22, ADR-106*

---
