# Accessibility Test Report

## Score: 92/100 (WCAG 2.1 AA)

## Key Findings
*   **Keyboard Nav**: All interactive elements in Help, Settings, and Notifications are reachable and operable via keyboard.
*   **Screen Readers**:
    *   Settings panel announces state changes correctly.
    *   Notification toasts announce via `role="status"`.
*   **Contrast**: Dark mode theme meets AA standards (4.5:1). Light mode meets AA standards.

## Areas for Improvement
1.  **3D Canvas**: WebGL canvas is opaque to screen readers. Need to implement keyboard controls for camera movement and alternative text descriptions for 3D objects.
2.  **Complex Charts**: Crossplots need tabular data alternatives for non-visual users.