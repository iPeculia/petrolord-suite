export const visualizationDetailed = [
  {
    id: 'vis-detailed-1',
    title: '3D Visualization Basics',
    category: 'Visualization',
    difficulty: 'Beginner',
    lastUpdated: '2025-11-05',
    content: `
# 3D Visualization Basics

The 3D Canvas is your window into the subsurface.

## Navigation Controls
- **Rotate:** Left-click + Drag.
- **Pan:** Right-click + Drag (or Shift + Left-click).
- **Zoom:** Scroll Wheel.
- **Center:** Double-click an object to center the camera on it.

## The Tree View
- Located in the Sidebar.
- Toggle the **Eye Icon** to show/hide objects (Wells, Surfaces, Grids).
- Right-click an object in the tree to access its **Display Settings** (Color, Transparency, Style).
    `
  },
  {
    id: 'vis-detailed-2',
    title: 'View Controls & Lighting',
    category: 'Visualization',
    difficulty: 'Intermediate',
    lastUpdated: '2025-10-25',
    content: `
# View Controls & Lighting

Enhance your view for better interpretation.

## Vertical Exaggeration (Z-Scale)
- Subsurface features are often thin but wide.
- Use the **Z-Scale** slider in the toolbar to exaggerate the vertical axis (typically 5x or 10x) to see structural details.

## Lighting
- **Sun Direction:** Rotate the virtual sun to cast shadows on surfaces, highlighting faults and roughness.
- **Ambient Light:** Increase to see into shadowed areas.

## Projections
- **Perspective:** Standard 3D view (distant objects look smaller).
- **Orthographic:** No perspective distortion. Best for technical QC and precise alignment checks.
    `
  },
  {
    id: 'vis-detailed-3',
    title: 'Object Selection & Filtering',
    category: 'Visualization',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-18',
    content: `
# Object Selection & Filtering

## Selection Modes
- **Pick:** Click to select a single cell, well, or point.
- **Box Select:** Drag a box to select multiple items.
- **Polygon Select:** Draw a shape to select irregular areas.

## Filtering (The Filter Tab)
Use filters to strip away data and see inside the reservoir.
- **Value Filter:** Show only cells where \`Porosity > 0.15\`.
- **Index Filter:** Show only specific I, J, or K layers.
- **Discrete Filter:** Show only specific Facies (e.g., hide Shale, show Sand).
    `
  },
  {
    id: 'vis-detailed-4',
    title: 'Cross-Section Views',
    category: 'Visualization',
    difficulty: 'Intermediate',
    lastUpdated: '2025-12-02',
    content: `
# Working with Cross-Sections

Cross-sections allow you to slice through the 3D model.

## Creating a Section
1.  Click the **Section Tool** in the toolbar.
2.  **General Section:** Draw a line on the map to create a vertical slice.
3.  **Well Section:** Select a list of wells to create a "Fence Diagram" connecting them.

## Interactive Slicing
- Enable **Intersection Plane** in the view properties.
- Drag the plane along the X, Y, or Z axis to dynamically slice through the volume.
- This is useful for chasing channels or faults through the volume.
    `
  },
  {
    id: 'vis-detailed-5',
    title: 'Visualization Export',
    category: 'Visualization',
    difficulty: 'Beginner',
    lastUpdated: '2025-11-28',
    content: `
# Exporting Visualizations

Share your insights with high-quality exports.

## Screenshot
- Click the **Camera Icon** in the viewer.
- Saves a high-res PNG of the current view.

## Animation
- Use the **Movie Maker** tool.
- Set keyframes (start view, mid view, end view).
- The software interpolates the camera path.
- Export as MP4.

## 3D Object Export
- Export the currently visible scene as **GLTF** or **OBJ** for use in presentation software (like PowerPoint 3D) or web viewers.
    `
  }
];