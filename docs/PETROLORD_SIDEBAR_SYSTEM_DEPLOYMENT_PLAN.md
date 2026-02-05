# Deployment Plan: Sidebar Hiding System

## Phase 1: Pre-Deployment (Staging)
1.  **Backup**: Snapshot `src/layouts/DashboardLayout.jsx`, `src/components/DashboardSidebar.jsx`, and `src/pages/apps/EarthModelPro.jsx`.
2.  **Verify Tests**: Run `npm test src/__tests__/layout` to ensure all checks pass.
3.  **Audit**: Check `src/config/applicationRoutes.js` to ensure all desired apps are listed and paths are correct.

## Phase 2: Deployment (Production)
1.  **Deploy New Files**: Push all new context, hook, and utility files.
2.  **Apply Patches**: Update the 3 existing files (Layout, Sidebar, EarthModelPro) with the new logic.
3.  **Smoke Test**:
    *   Login to Dashboard. Verify Sidebar is visible.
    *   Navigate to EarthModel Pro. Verify Sidebar disappears.
    *   Navigate back to Dashboard (via browser back or home link). Verify Sidebar reappears.
    *   Refresh page while in EarthModel Pro. Verify Sidebar remains hidden.

## Phase 3: Post-Deployment
1.  **Monitoring**: Check browser console in production for any `[SidebarSystem]` logs or errors.
2.  **Feedback**: Listen for user reports of "missing navigation".

## Phase 4: Rollback (If needed)
*   **Trigger**: Critical navigation failure (Sidebar gone everywhere) or App crash loop.
*   **Action**: 
    1. Revert `src/layouts/DashboardLayout.jsx` to remove `ApplicationProvider`.
    2. Revert `src/components/DashboardSidebar.jsx` to remove conditional rendering.
    3. Revert `src/pages/apps/EarthModelPro.jsx`.
*   **Time Estimate**: < 5 minutes via git revert or restoring backups.