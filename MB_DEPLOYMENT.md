# Material Balance Pro - Deployment Guide

## Overview
Material Balance Pro is a React-based single-page application (SPA) integrated into the Geoscience Suite. It uses client-side calculations for privacy and speed, with optional IndexedDB persistence for large projects.

## Prerequisites
- Node.js v18+
- NPM v9+
- Modern Browser (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+)

## Environment Variables
The application requires the following environment variables for build and runtime configuration:

\`\`\`env
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_SUPABASE_URL=your_supabase_url (Optional for Cloud Sync)
VITE_SUPABASE_ANON_KEY=your_supabase_key (Optional for Cloud Sync)
\`\`\`

## Build Process
1. **Install Dependencies:**
   \`npm install\`

2. **Run Tests:**
   \`npm test\`
   Ensure all core engine tests pass (MaterialBalanceEngine, WaterInfluxModel).

3. **Build Production Bundle:**
   \`npm run build\`
   This uses Vite to bundle the application. Code splitting is configured to separate heavy calculation engines and plotting libraries.

## Deployment Checklist
- [ ] Verify `MBDataPersistence` is configured for the target environment (IndexedDB vs Cloud).
- [ ] Check that all `lazy()` imports are working correctly.
- [ ] Verify Error Boundaries catch rendering crashes.
- [ ] Ensure `idb-keyval` is included in the vendor bundle.
- [ ] Test export functionality in the deployed environment.

## Troubleshooting
- **White Screen on Load:** Check console for syntax errors or missing polyfills. Ensure `MBErrorBoundary` is catching exceptions.
- **Data Not Saving:** Verify IndexedDB quota or permissions. Clear browser data if schema versions conflict.
- **Slow Calculations:** Large datasets (>10k points) should be processed in Web Workers. Check `PerformanceOptimization` settings.

## Performance Tuning
- The application uses `react-window` or virtualization for large tables.
- Calculation engines are pure functions and can be moved to Web Workers if main thread blocking occurs.
- Charts use `recharts` with `optimize` flags for large datasets.

## Support
For support, contact the Geoscience Digital Transformation Team.