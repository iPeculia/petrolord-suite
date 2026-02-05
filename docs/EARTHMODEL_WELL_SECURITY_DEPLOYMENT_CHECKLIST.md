# Deployment Checklist: Well Security Fix

## Pre-Deployment
- [x] **Code Review:** Verified changes in `useWells.js` and `WellSecurityGuard.jsx`.
- [x] **Database:** Confirmed `user_id` column exists on `em_wells`.
- [x] **Policies:** Verified RLS policy `Users can insert own EM wells` is active.
- [x] **Build:** `npm run build` passes without errors.
- [x] **Tests:** All unit tests for well validation pass.

## Deployment Steps
1.  **Backup:** Create a snapshot of the `em_wells` table.
2.  **Deploy SQL:** Run the migration script to update RLS policies (if not auto-synced).
3.  **Deploy Frontend:** Push the new React build to production.
4.  **Verify:** Log in as a standard user and create a test well.

## Post-Deployment Verification
- [ ] **Well Creation:** Can a user add a well?
- [ ] **Ownership:** Does the new well have the correct `user_id` in Supabase?
- [ ] **Security:** Can a user see wells belonging to others? (Should be NO).
- [ ] **Navigation:** Does `Alt+B` work?

## Rollback Plan
*   **Trigger:** If users report "Permission Denied" on ALL actions.
*   **Action:** Revert the frontend commit `git revert <hash>`.
*   **Database:** Restore previous RLS policies using `migrations/rollback_rls.sql`.
*   **Time Estimate:** 5 minutes.