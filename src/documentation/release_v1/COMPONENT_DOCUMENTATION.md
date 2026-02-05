# Component Documentation

## UI Primitives (`src/components/ui/`)
Built on Radix UI primitives and styled with Tailwind.
*   `Button`: Standard button with variants (default, secondary, destructive, outline, ghost).
*   `Card`: Container for content with Header, Content, Footer sections.
*   `Dialog`: Modal overlay.
*   `Toast`: Temporary notification.

## Subsurface Core (`src/components/subsurface-studio/`)
*   `ThreeDWindow.jsx`: The main R3F canvas. Handles camera controls, lighting, and rendering of `WellPath`, `HorizonMesh`, and `SeismicVolume`.
*   `WellCorrelationView.jsx`: 2D log visualization using D3.js. Supports drag-and-drop tracks and ghost curve shifting.
*   `ProjectTreePanel.jsx`: Recursive tree structure for managing project assets and visibility state.

## Mobile (`src/components/subsurface-studio/mobile/`)
*   `ResponsiveLayoutManager.jsx`: Context provider that detects screen size and orientation.
*   `TouchGestureHandler.jsx`: Wrapper for Framer Motion gesture detection (swipe, pinch).

## Enterprise (`src/components/subsurface-studio/enterprise/`)
*   `RoleBasedAccessControl.jsx`: Matrix UI for assigning permissions to roles.
*   `AuditLogging.jsx`: Data table for viewing system logs with filtering.