# Monitoring Plan

## Metrics to Monitor

### 1. State Stability
*   **Metric**: `ApplicationContext` state changes.
*   **Method**: `useSidebarLogging` hook outputs state transitions to console in DEV. In PROD, these could be piped to a logging service (e.g., Sentry, LogRocket).
*   **Success Criteria**: State should strictly flip between `true` (in app) and `false` (dashboard) without rapid flickering.

### 2. Route Detection Latency
*   **Metric**: Time taken to execute `detectLayoutConfig`.
*   **Threshold**: < 5ms.
*   **Action**: If high, review `applicationRoutes.js` for inefficient regex or large lists.

### 3. Error Boundaries
*   **Metric**: `SafetyBoundary` catches.
*   **Alert**: Immediate notification if the sidebar boundary triggers, as this indicates the navigation structure has failed.

## Logging Plan

*   **Level**: Info/Debug
*   **Events**:
    *   `[Sidebar] Entering Application Mode: {appId}`
    *   `[Sidebar] Exiting Application Mode`
    *   `[Sidebar] Route Change Detected: {pathname}`

## Schedule

*   **First 24h**: High alert. Watch for user sessions stuck in "Application Mode".
*   **Weekly**: Review `applicationRoutes.js` to ensure new apps added to the platform are correctly registered.