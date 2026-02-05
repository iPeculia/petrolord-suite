# Deployment Checklist

## 1. Pre-Deployment
- [ ] **Environment Variables**: Verify `.env.production` matches target environment.
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
- [ ] **Database Migrations**: Ensure all SQL migrations in `supabase/migrations` are applied.
- [ ] **Storage Buckets**: Verify buckets exist (`ss-assets`, `seismic`, `reports`) and are private.
- [ ] **CORS Policies**: Update Supabase Config to allow only the production domain.

## 2. Build & Package
- [ ] Run **Linting**: `npm run lint` (Must pass with 0 errors).
- [ ] Run **Tests**: `npm run test` (Unit and Integration).
- [ ] Run **Build**: `npm run build`.
    - Verify `dist/` folder is created.
    - Check bundle size warnings.

## 3. Deployment Steps
1.  **Push Code**: Push `main` branch to source control (GitHub/GitLab).
2.  **CI/CD Trigger**: Ensure pipeline triggers build and deploy.
3.  **Edge Functions**: Deploy updated Deno functions: `supabase functions deploy`.
4.  **Cache Invalidation**: Purge CDN cache (Cloudflare/Vercel/Netlify).

## 4. Post-Deployment Verification
- [ ] **Sanity Check**: Log in as Admin.
- [ ] **Critical Path**: Create a new Project -> Upload a Well -> View in 3D.
- [ ] **Realtime**: Open project in two tabs/devices and verify cursor sync.
- [ ] **API Check**: Verify Edge Functions respond correctly.

## 5. Rollback Plan
In case of critical failure:
1.  Revert Git commit to previous stable tag.
2.  Trigger redeployment of the stable build.
3.  If database schema changed, run down-migrations manually via CLI.