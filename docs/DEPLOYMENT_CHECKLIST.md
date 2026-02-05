# Deployment Checklist

## Pre-Deployment
- [ ] **Build Verification**: Run `npm run verify` to ensure no missing imports.
- [ ] **Clean Install**: Ensure `node_modules` are fresh (`npm ci`).
- [ ] **Environment Variables**: Verify `.env.production` variables are set in the dashboard.

## Build Process
- [ ] **Optimization**: Confirm `vite.config.optimized.js` is being used.
- [ ] **Size Check**: Ensure no single chunk exceeds 2MB.
- [ ] **Source Maps**: Confirm source maps are DISABLED for production.

## Post-Deployment
- [ ] **Health Check**: Visit the `/` and `/login` routes.
- [ ] **Performance**: Check console for any "chunk load error".
- [ ] **Monitoring**: Run `npm run deploy:monitor`.