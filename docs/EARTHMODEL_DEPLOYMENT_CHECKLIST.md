# EarthModel Pro - Phase 4 Deployment Checklist

## Pre-Deployment
- [ ] **Code Review**: Ensure all new ML components adhere to coding standards.
- [ ] **Dependencies**: Verify `package.json` has `@tensorflow/tfjs` and updated version (4.0.0).
- [ ] **Environment**: Check that Supabase URL and Anon Key are set in production environment variables.
- [ ] **Tests**: Run `npm run test` (if configured) or manual verification of ML Hub.

## Deployment
- [ ] **Build**: Run `npm run build` and check for errors.
- [ ] **Database**: Run SQL migrations for `ml_models` tables in Supabase.
- [ ] **Assets**: Verify that large static assets (if any) are accessible.

## Post-Deployment
- [ ] **Smoke Test**: Log in and navigate to **Machine Learning > ML Hub**.
- [ ] **Functionality**: Run a quick test on **Well Placement Optimization** (should visualize in < 5s).
- [ ] **Integrations**: Check that **BasinFlow Genesis** loads and shows sensitivity analysis tools.
- [ ] **Logs**: Check browser console for any unhandled exceptions.

## Rollback Plan
- [ ] Keep the previous build artifact (v3.5.0) available.
- [ ] If critical blocking bugs are found in ML modules, revert the frontend deployment.