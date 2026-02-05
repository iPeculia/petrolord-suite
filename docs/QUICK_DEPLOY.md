# Quick Deployment Reference

## Commands

| Action | Command | Description |
|--------|---------|-------------|
| **Build** | `npm run build` | Runs optimized production build |
| **Analyze** | `npm run build:analyze` | Builds and reports bundle size |
| **Retry** | `npm run deploy:retry` | Builds with automatic retry on failure |
| **Monitor** | `npm run deploy:monitor` | Checks health of deployment |

## Emergency Checklist
- [ ] Check `package.json` versions
- [ ] Run `npm run verify`
- [ ] Clear `node_modules` and reinstall if build fails repeatedly
- [ ] Check Cloudflare/Vercel status page