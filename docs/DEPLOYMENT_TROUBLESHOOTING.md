# Deployment Troubleshooting

## Common Issues

### 1. 524 A Timeout Occurred
**Cause:** The build process took longer than the hosting provider allows (usually 15-20 minutes).
**Solution:**
- We have disabled source map generation in `vite.config.optimized.js`.
- We have implemented chunk splitting to parallelize uploading.
- Use `npm run deploy:retry` to handle transient network slowness.

### 2. "JavaScript heap out of memory"
**Cause:** Node.js ran out of memory during minification of large 3D/Mapping libraries.
**Solution:**
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`.
- Ensure unused large assets are removed.

### 3. Missing Assets in Production
**Cause:** Assets were not included in the `dist` folder or paths are incorrect.
**Solution:**
- Check `vite.config.optimized.js` `base` path settings.
- Verify assets exist in `public/` directory.

## Support
For critical deployment failures, contact the DevOps lead.