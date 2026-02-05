# Browser Compatibility Report

## Verified Browsers
| Browser | Version | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Chrome** | 120+ | ✅ Supported | Primary dev target. |
| **Firefox** | 115+ | ✅ Supported | 3D performance slightly lower. |
| **Edge** | 120+ | ✅ Supported | Same as Chrome. |
| **Safari** | 17+ | ✅ Supported | |
| **Mobile Safari** | iOS 17 | ✅ Supported | Responsive layout verified. |
| **Mobile Chrome** | Android 14 | ✅ Supported | |

## Known Issues
*   **Safari (Desktop)**: Backdrop blur effect in `Header.jsx` can be resource intensive on older Macs. Fallback solid color recommended for low-power mode.
*   **Firefox**: Scrollbars in `ScrollArea.jsx` look default instead of custom styled (cosmetic only).