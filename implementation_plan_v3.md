# Fixing LCP Regression

The switch to `<img>` tag combined with CSS transitions likely caused the browser to delay the "Finished Loading" signal for LCP.

## Root Cause Analysis
- **LCP Increase (4.1s -> 5.3s)**: `transition: opacity 1s` on the Hero image causes the browser to wait for the transition to complete (or for the paint to stabilize) before recording LCP.
- **Render Blocking**: Still high.

## Proposed Changes
### 1. Disable Animation for Initial Slide
#### [MODIFY] [Hero.css](file:///c:/test_ai/pj-residence/src/components/Hero/Hero.css)
- Add a specific class or rule to **disable transition** for the first active slide immediately upon load.
- Ensure `opacity: 1` is set by default for the first item without transition.

### 2. Verify Image Size
- Double check that `hero-1.webp` is indeed the optimized version (~140KB) and not the original (3MB+).

## Verification
- Expect LCP to drop back down significantly as the image will paint immediately without animation delay.
