export const structuralModelingDetailed = [
  {
    id: 'sm-detailed-1',
    title: 'Structural Modeling Basics',
    category: 'Structural Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-12-02',
    content: `
# Structural Modeling Basics

The structural model is the skeleton of your subsurface reservoir. It defines the geometry, compartments, and boundaries.

## Key Components
1.  **Faults:** Planar discontinuities. Modeled first as they displace horizons.
2.  **Horizons:** Surfaces representing stratigraphic boundaries.
3.  **Zones:** The rock volume between two horizons.
4.  **Layers:** Subdivisions of zones into simulation cells.

## Workflow Strategy
- **Faults First:** Always model major faults first. They define the structural compartments.
- **Seismic to Wells:** Use seismic for inter-well geometry and tie to hard data (well tops) at well locations.
- **Watertight:** Ensure faults truncate properly against each other and boundaries to create closed compartments for volume calculation.
    `
  },
  {
    id: 'sm-detailed-2',
    title: 'Creating Horizons',
    category: 'Structural Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-15',
    content: `
# Creating Horizons

Horizons are created by interpolating point data (Well Tops) or by using seismic interpretation surfaces.

## Methods
- **Convergent Interpolation:** Good for dense data.
- **Kriging:** Best for capturing geological trends with sparse data.
- **Minimum Curvature:** Smooths surfaces, good for regional trends.

## Step-by-Step
1.  Go to **Structural > Horizons > Create**.
2.  Select input data (e.g., "Top_Sand_A" markers).
3.  Choose an algorithm (default: Convergent).
4.  Set the **Grid Increment** (resolution).
5.  Click **Generate**.

## QC Tips
- Display the surface in 3D with the well tops.
- Use the **Residual Map** tool to see the difference between the surface and the input points.
    `
  },
  {
    id: 'sm-detailed-3',
    title: 'Creating Faults',
    category: 'Structural Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-10-30',
    content: `
# Creating Faults

Faults can be modeled from "Fault Sticks" picked on seismic or generated automatically.

## Fault Modeling Process
1.  **Import Sticks:** Load fault sticks from seismic interpretation.
2.  **Generate Fault Planes:** The software triangulates surfaces from sticks.
3.  **Truncation:** Define relationships (e.g., Fault A stops at Fault B). This is crucial for "sealed" frameworks.

## Fault Properties
- **Dip & Azimuth:** Calculated automatically.
- **Throw:** Can be calculated if horizon cut-offs are defined.

## Best Practices
- Start with the largest (regional) faults.
- Group related fault sticks before generating planes to avoid "spaghetti" surfaces.
    `
  },
  {
    id: 'sm-detailed-4',
    title: 'Surface Generation',
    category: 'Structural Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-01',
    content: `
# Surface Generation Techniques

Generating robust surfaces is key to a good grid.

## Handling Faults
- **Faulted Surfaces:** Use the "Structural Modeling" workflow which respects fault cuts. Standard interpolation will smooth over faults.
- **Heave:** The horizontal gap created by a fault. Ensure your algorithm respects this.

## Editing Surfaces
- **Smoothing:** Remove spikes or noise.
- **Calculator:** Perform math on surfaces (e.g., \`Top_Surface - 100\`).
- **Isopach:** Create thickness maps and add them to a base surface to generate a top surface.
    `
  },
  {
    id: 'sm-detailed-5',
    title: 'Grid Building',
    category: 'Structural Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-05',
    content: `
# Building the 3D Grid

The 3D Grid (Corner Point Geometry) allows property distribution and fluid flow simulation.

## Steps
1.  **Define Skeleton:** Uses top, base, and boundary faults.
2.  **Pillar Gridding:** Creates the vertical lines (pillars) that form the corners of cells. Align these with faults.
3.  **Make Horizons:** Insert the stratigraphic horizons into the grid.
4.  **Layering:** Subdivide zones.
    - *Proportional:* Constant number of layers (cells stretch/squeeze).
    - *Top/Base Parallel:* Layers preserve thickness from top/base (good for erosion/onlap).

## Validation
- Check for **Negative Volume Cells** (inverted geometry).
- Check **Cell Orthogonality** (cells shouldn't be too twisted).
    `
  }
];