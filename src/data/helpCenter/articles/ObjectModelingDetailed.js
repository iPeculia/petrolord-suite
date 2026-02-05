export const objectModelingDetailed = [
  {
    id: 'om-detailed-1',
    title: 'Object Modeling Basics',
    category: 'Object Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-08',
    content: `
# Object Modeling Basics

Object-based modeling (Boolean simulation) places defined geometric shapes into a background matrix. This preserves geological shapes better than pixel-based methods (like SIS) for certain environments.

## Best For:
- **Fluvial Channels:** Meandering river systems.
- **Deepwater Lobes:** Fan-shaped deposits.
- **Salt Domes:** Intrusive bodies.
- **Karst:** Caves and dissolution features.

## The Concept
1.  Define a background (e.g., Shale).
2.  Define an object shape (e.g., Sand Channel).
3.  The algorithm "drops" these shapes into the grid until target proportions (e.g., 20% Sand) are met.
    `
  },
  {
    id: 'om-detailed-2',
    title: 'Channel Modeling',
    category: 'Object Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-04',
    content: `
# Channel Modeling

Modeling river or deepwater channels.

## Parameters
- **Width & Thickness:** Define distributions (e.g., Width = Normal Dist, Mean 200m, StdDev 50m).
- **Amplitude & Wavelength:** Controls the meandering (sinuosity).
- **Orientation:** The general direction of flow (Azimuth).

## Conditioning
- **Hard Data:** The channel *must* pass through wells where "Channel Sand" facies is observed.
- **Soft Data:** Use a probability map to guide channels into "high probability" zones.
    `
  },
  {
    id: 'om-detailed-3',
    title: 'Lobe Modeling',
    category: 'Object Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-11-22',
    content: `
# Lobe Modeling

Modeling deltaic or fan lobes.

## Geometry
- **Radius:** Length of the lobe.
- **Angle:** Width of the fan spread.
- **Thickness:** Maximum thickness (usually at the proximal end).

## Rules
- **Stacking Patterns:** Do lobes stack on top of each other (compensational stacking) or cluster together?
- **Connectivity:** Lobes can be connected to feeder channels if using a hierarchical workflow.
    `
  },
  {
    id: 'om-detailed-4',
    title: 'Salt Dome Modeling',
    category: 'Object Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-10-18',
    content: `
# Salt Dome Modeling

Salt bodies often have complex, intrusive shapes.

## Parametric Shapes
- Define a central axis (spine).
- Define radius varying with depth (e.g., mushroom shape).

## Interactive Editing
- Use the **Sculpt Tool** to push/pull the salt boundary mesh to match seismic interpretation.
- Boolean operations allow you to "subtract" the salt volume from the sedimentary grid layers.
    `
  },
  {
    id: 'om-detailed-5',
    title: 'Object Placement Strategy',
    category: 'Object Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-05',
    content: `
# Object Placement Strategy

Achieving a realistic distribution involves tuning the placement rules.

## Erosion Rules
- **Remove:** New objects erode (cut into) older objects.
- **Preserve:** New objects fill around existing ones.

## Repulsion vs. Attraction
- **Repulsion:** Channels avoid each other (high net-to-gross scenarios).
- **Attraction:** Channels stack (low accommodation space).

## Tuning for Convergence
- If the algorithm fails to match well data, relax the geometric constraints (e.g., allow wider range of channel widths) to give the solver more flexibility.
    `
  }
];