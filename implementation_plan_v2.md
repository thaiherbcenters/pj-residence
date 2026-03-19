# Deep Performance Optimization Plan

This plan focuses on fixing the LCP bottleneck (4.1s) by refactoring the Hero component and optimizing large image assets.

## Proposed Changes

### 1. Fix LCP (Largest Contentful Paint)
#### [MODIFY] [Hero.jsx](file:///c:/test_ai/pj-residence/src/components/Hero/Hero.jsx)
- **Current**: Uses `backgroundImage` in a `div`. This is slow because the browser waits for CSS/JS before loading the image.
- **Change**: Render the **first slide** as a standard `<img>` tag with `fetchpriority="high"`.
- **Benefit**: Browser preload scanner detects `<img>` immediately, starting the download much earlier.

### 2. Optimize Images (Bandwidth)
#### [MODIFY] [public/images/hero-1.webp](file:///c:/test_ai/pj-residence/public/images/hero-1.webp)
- The current image might be too large (e.g., 4k resolution).
- **Action**: Resize heavily used assets to max 1920px width.

## Verification Plan

### Manual Verification
- **LCP Test**: Open Network tab, check `hero-1.webp`. It should have "High" or "Highest" priority.
- **Visual Check**: Ensure the new `<img>` tag looks identical to the previous background image version (object-fit: cover).
