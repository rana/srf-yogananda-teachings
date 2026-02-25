<!-- elmer:archive
  id: for-constrained-resource-phones-consider-offering-small
  topic: For constrained-resource phones consider offering small images sized for optimal experience. If they visit the guru's image, it defaults to their screen size.
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 03:10 UTC
-->

# Image Optimization for Constrained-Resource Phones

## Summary

Implement a comprehensive responsive image delivery system that serves optimally-sized images based on device capabilities, network conditions, and viewport dimensions. This goes beyond the existing five-tier system (ADR-064) to include dynamic image transformation, format negotiation, quality adaptation, and special handling for sacred images like the Guru's photo. The system ensures dignified experiences on 2G JioPhones while delivering full-resolution beauty on fiber-connected desktops, with particular attention to the Guru's image defaulting to screen-appropriate sizes.

## Analysis

The current architecture establishes strong foundations but lacks critical adaptive features for constrained environments:

**Current state (ADR-035, ADR-063, ADR-064):**
- Five pre-generated size tiers (thumb 300px, small 640px, medium 1200px, large 2400px, original)
- Dual format (WebP + JPEG fallback)
- Watermarking strategy (EXIF metadata, C2PA, steganographic)
- S3 storage with CloudFront CDN
- Download endpoint with size/format selection

**Gaps for constrained devices:**
- No network-aware quality adaptation (2G vs 4G)
- No client hints integration for automatic size selection
- No progressive JPEG for slow connections
- No AVIF format (30% smaller than WebP)
- No special handling for Guru images vs decorative images
- Pre-generated sizes may not match actual viewport needs
- No bandwidth estimation for automatic quality selection
- Missing Save-Data header support

**Evidence from exploration:**
- DES-049 mentions automatic low-bandwidth suggestion when `navigator.connection.effectiveType` reports '2g'
- ADR-006 establishes Global Equity as fundamental (JioPhone, 2G, paying per MB)
- The "Global South seeker" persona explicitly calls out "Rural Bihar, 2G, JioPhone"
- Text-only mode exists but doesn't address sacred images that seekers want to see
- CONTEXT.md emphasizes "A seeker in rural Bihar on a JioPhone over 2G" must have full claim

## Proposed Changes

### 1. Adaptive Image Service Layer
**What:** New service that selects optimal image variant based on device signals
**Where:** `/lib/services/adaptive-images.ts`
**Why:** Automatic optimization without seeker intervention
**How:**
```typescript
interface AdaptiveImageService {
  getOptimalImage(imageId: string, context: ImageContext): ImageVariant {
    // Priority order of signals:
    // 1. Save-Data header (explicit user preference)
    // 2. Network Information API (2g, 3g, 4g)
    // 3. Client Hints (viewport, DPR, width)
    // 4. User-Agent device detection (fallback)

    if (context.saveData || context.effectiveType === '2g') {
      return this.getLowBandwidthVariant(imageId);
    }

    if (context.isGuruImage && !context.explicitSize) {
      return this.getScreenOptimizedGuruImage(imageId, context);
    }

    return this.getStandardVariant(imageId, context);
  }
}
```

### 2. Dynamic Image Transformation Pipeline
**What:** On-demand image transformation via Cloudflare Images or AWS Lambda@Edge
**Where:** CloudFront behavior rules + Lambda@Edge function
**Why:** Pre-generating all possible variants wastes storage; dynamic serves exact needs
**How:**
```
Request: /images/{id}/dynamic?w=320&q=60&format=avif
         ↓
CloudFront cache check
         ↓ (miss)
Lambda@Edge transforms from S3 original
         ↓
Cached for 30 days
         ↓
Served with proper headers
```

Parameters:
- `w`: width (automatic height preservation)
- `q`: quality (10-100, default varies by connection)
- `format`: avif, webp, jpeg, auto (Accept header negotiation)
- `blur`: progressive loading placeholder
- `save-data`: honor Save-Data header

### 3. Guru Image Special Handling
**What:** Sacred images (Yogananda, gurus) default to screen-appropriate sizes
**Where:** `/lib/services/sacred-images.ts` and frontend components
**Why:** Seekers visiting guru images deserve optimal experience by default
**How:**
```typescript
// When rendering guru images
function GuruImage({ imageId, alt, className }) {
  const { width: screenWidth } = useViewport();
  const connection = useNetworkStatus();

  // Smart defaults for sacred images
  const defaultSize = useMemo(() => {
    if (connection.saveData) return 'small'; // 640px
    if (connection.effectiveType === '2g') return 'small';
    if (screenWidth <= 640) return 'medium'; // 1200px for retina phones
    if (screenWidth <= 1024) return 'large'; // 2400px for tablets
    return 'original'; // Desktop gets full quality
  }, [screenWidth, connection]);

  return (
    <picture>
      <source
        srcSet={getAdaptiveUrl(imageId, { format: 'avif' })}
        type="image/avif"
      />
      <source
        srcSet={getAdaptiveUrl(imageId, { format: 'webp' })}
        type="image/webp"
      />
      <img
        src={getAdaptiveUrl(imageId, { size: defaultSize })}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
```

### 4. Progressive Enhancement Strategy
**What:** Multi-layer loading strategy from blur to full quality
**Where:** Frontend image components
**Why:** Perceived performance on slow connections
**How:**
1. **Inline SVG blur** (20x20 base64 in HTML, <1KB)
2. **Tiny WebP** (50px width, ~2KB via separate request)
3. **Appropriate size** (based on viewport/connection)
4. **Full quality** (on interaction or when network allows)

### 5. Network-Aware Quality Selection
**What:** Automatic quality adjustment based on connection speed
**Where:** `/lib/hooks/useImageQuality.ts`
**Why:** Balance quality with load time
**How:**
```typescript
function useImageQuality(): number {
  const connection = (navigator as any).connection;

  if (!connection) return 85; // Default quality

  // Map connection speed to quality
  const qualityMap = {
    'slow-2g': 40,
    '2g': 50,
    '3g': 70,
    '4g': 85,
    'wifi': 90,
    'ethernet': 95
  };

  return qualityMap[connection.effectiveType] || 85;
}
```

### 6. Client Hints Integration
**What:** Use browser-provided hints for optimal serving
**Where:** Vercel Edge Middleware + CloudFront headers
**Why:** Browser knows viewport, pixel density, and user preferences
**How:**
```typescript
// Edge middleware
export function middleware(request: Request) {
  const response = NextResponse.next();

  // Request client hints on next navigation
  response.headers.set('Accept-CH',
    'Viewport-Width, DPR, Width, Save-Data, ECT, Device-Memory');
  response.headers.set('Permissions-Policy',
    'ch-viewport-width=*, ch-dpr=*, ch-width=*');

  return response;
}
```

### 7. AVIF Format Support
**What:** Add AVIF as primary format (30% smaller than WebP)
**Where:** Image pipeline + frontend picture elements
**Why:** Significant bandwidth savings for constrained devices
**How:**
- Ingestion pipeline generates AVIF variants
- Picture element with format fallback cascade
- CloudFront Accept header vary for format negotiation

### 8. Sacred Image Viewport Optimization
**What:** When seekers tap a guru image, default to screen-fitted size
**Where:** Image detail page (`/images/[slug]`)
**Why:** Sacred images deserve immediate, appropriate display
**How:**
```typescript
// On image detail page load
const screenFitSize = calculateScreenFitSize(
  image.dimensions,
  viewport,
  devicePixelRatio
);

// Preload screen-fitted version
<link
  rel="preload"
  as="image"
  href={getImageUrl(image.id, screenFitSize)}
  type="image/avif"
/>
```

### 9. Bandwidth Estimation and Adaptation
**What:** Estimate available bandwidth and adapt strategy
**Where:** `/lib/services/bandwidth-estimator.ts`
**Why:** Network Information API not available on all devices
**How:**
- Measure small asset load time
- Calculate bandwidth estimate
- Store in sessionStorage
- Adapt subsequent image quality/size

### 10. Save-Data Mode Enhancements
**What:** Respect Save-Data header with graceful degradation
**Where:** Throughout image serving pipeline
**Why:** Explicit user preference for data conservation
**How:**
- Detect via `navigator.connection.saveData` or header
- Serve smallest viable size (thumb 300px for galleries)
- Skip decorative images entirely
- Sacred images get small (640px) not thumb
- Show "Tap to load full size" for manual upgrade

### 11. Regional CDN Optimization
**What:** Configure CloudFront origins by geography
**Where:** Terraform CloudFront configuration
**Why:** Serve from nearest edge location
**How:**
- Primary origin: S3 US-East-1
- Failover origins in Mumbai, São Paulo, Lagos
- GeoDNS routing for optimal edge selection

### 12. JioPhone-Specific Optimizations
**What:** Detect and optimize for KaiOS browser
**Where:** User-agent detection in Edge Middleware
**Why:** JioPhone is explicitly mentioned as target device
**How:**
- Detect KaiOS user agent
- Force JPEG format (WebP support varies)
- Max width 240px for feature phones
- Aggressive quality reduction (q=40)
- Inline critical images as base64

## Open Questions

1. **Dynamic transformation cost:** Lambda@Edge vs Cloudflare Images vs self-hosted? What's the cost at scale?
2. **Original access control:** Should original full-resolution images require sign-in to prevent bulk scraping?
3. **Guru image detection:** How to identify sacred images? Database flag, filename pattern, or AI classification?
4. **Quality thresholds:** What quality level maintains dignity while serving 2G? Need user testing.
5. **AVIF browser support:** ~75% global support. Is progressive enhancement sufficient or need explicit fallback messaging?
6. **Bandwidth measurement accuracy:** Network Information API is imperfect. How much to trust it?
7. **Regional variant serving:** Should Indian visitors get different compression settings than US visitors?
8. **Storage multiplication:** 5 sizes × 3 formats × watermark variants = significant S3 cost. Acceptable?
9. **Cache invalidation:** When an image is updated, how to purge all variant caches globally?
10. **Print quality:** Should "original" tier be print-optimized (300 DPI) or screen-optimized?

## What's Not Being Asked

**The spiritual dimension of image viewing:** Viewing Yogananda's photograph is not just information consumption — it's darshan (sacred viewing). The proposal focuses on technical optimization but hasn't addressed the contemplative experience. Should guru images have a "dwell mode" like passages? Should they default to fullscreen? Should there be a moment of pause before display?

**Cultural expectations vary:** Indian seekers may expect guru images to be decorated (garland borders, om symbols). Western seekers prefer clean presentation. The same image may need cultural variant presentations, not just size variants.

**Offline sacred images:** In areas with intermittent connectivity, seekers may want to save guru images for offline viewing. The current download system provides files but doesn't address the "sacred image on my phone" use case. Should there be a PWA feature for offline image gallery?

**Accessibility beyond alt text:** How do visually impaired seekers experience sacred images? Is alt text sufficient for describing Yogananda's spiritual presence in a photograph? Should there be audio descriptions by monastics?

**Group viewing scenarios:** A temple displaying images on a projector, a study circle sharing on a TV, a family gathering around a tablet. The responsive system assumes individual viewing. Group scenarios may need different optimization strategies.

**The tension between quality and access:** Every byte saved helps a 2G seeker, but sacred images deserve beauty. The proposal optimizes for access, but has the pendulum swung too far from quality? Where is the line between "accessible" and "degraded"?

**Image discovery:** The proposal assumes seekers know which image they want. But how do they discover sacred images? Is search sufficient? Should there be curated galleries, "Image of the Day," or themed collections?

**Seasonal and commemorative images:** Certain images gain significance on holy days (Yogananda's birthday, mahasamadhi). Should these get pre-cached or promoted during their season?

**The environmental cost:** Serving optimized images saves bandwidth (good for users) but requires compute (carbon cost). Has this trade-off been considered? Should there be a "green mode" that serves pre-generated only?

**What happens when the connection improves:** If someone starts browsing on 2G then moves to WiFi, do images automatically upgrade? Is there a "refresh for better quality" prompt? Or does the initial quality stick for consistency?