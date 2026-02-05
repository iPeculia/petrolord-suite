# Detailed Troubleshooting Guide

## Issue: Sidebar won't hide
**Symptom**: You are in EarthModel Pro, but the Dashboard sidebar is still visible.

**Steps**:
1.  **Check URL**: Does the browser URL match the `path` defined in `src/config/applicationRoutes.js`?
2.  **Check Console**: Open DevTools (F12). Are there errors from `SidebarVisibilityController`?
3.  **Clear Cache**: Sometimes old JS bundles persist. Hard refresh (Ctrl+F5).

## Issue: Sidebar won't come back
**Symptom**: You navigated back to Dashboard, but the sidebar is missing.

**Steps**:
1.  **Force Navigation**: Click the browser "Back" button again or manually type `/dashboard`.
2.  **State Reset**: The system is designed to auto-reset on unmount. If it stuck, it might mean the Application component didn't unmount properly.
3.  **Emergency**: Reload the page. The default state for the sidebar is `Visible`.

## Issue: White Screen / Crash
**Symptom**: App crashes when switching modes.

**Steps**:
1.  **Check Safety Boundary**: The `SafetyBoundary` should catch this and show a red error box.
2.  **Logs**: Check if `ApplicationContext` is undefined. Ensure `DashboardLayout` is wrapping the content correctly.