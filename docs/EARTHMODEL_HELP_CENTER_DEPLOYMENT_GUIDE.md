# Deployment Guide: EarthModel Pro Help Center

## Overview
The Help Center is deployed as an integrated part of the main React application bundle. It does not require separate server infrastructure, as content is embedded/static or fetched from standard API endpoints.

## Pre-Deployment Checklist
1.  Run `npm run test src/__tests__/help` to ensure all unit tests pass.
2.  Verify that `src/data/helpCenter/` contains all required data files.
3.  Ensure `public/assets/` contains referenced images and PDFs.
4.  Check `src/config/applicationConfig.js` to ensure the Help module is enabled.

## Deployment Steps
1.  **Build:** Execute `npm run build` to generate the production bundle.
    *   *Note:* The build script will automatically optimize the large JSON data files.
2.  **Assets:** Sync the `dist/assets` folder to your CDN/Storage bucket (Supabase Storage).
3.  **Deploy:** Push the `dist/` folder to the hosting provider.

## Post-Deployment Verification
1.  Log in to the production environment.
2.  Click the "Help" icon in the top navigation.
3.  Verify the Help Center sheet slides out.
4.  Perform a test search (e.g., "Porosity").
5.  Open an article and verify formatting.
6.  Check browser console for any 404 errors regarding images/resources.

## Rollback Procedures
If critical issues are found (e.g., Help Center crashes the app):
1.  Revert the git commit to the previous stable tag.
2.  Re-run the build pipeline.
3.  Deploy the reverted build.
4.  *Alternative (Hotfix):* Disable the Help feature flag in `src/config/applicationConfig.js` and redeploy quickly.

## Support
For deployment issues, contact the DevOps lead or the assigned Frontend Architect.