# Component API Reference

## `CorrelationPanel`
Main visualization container.
*   `wells`: Array of well objects.
*   `markers`: Array of marker objects.
*   `onMarkerClick`: Callback for marker selection.

## `LogTrack`
Renders log curves.
*   `curves`: Array of curve data.
*   `depth`: Depth array.
*   `width`: Track width in pixels.

## `CorrelationAssistant`
AI Tool Panel.
*   `sourceWellId`: ID of reference well.
*   `targetWellId`: ID of well to correlate.