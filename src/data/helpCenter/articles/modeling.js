export const modelingArticles = [
  {
    id: 'sm-1',
    title: 'Structural Modeling Basics',
    category: 'Structural Modeling',
    content: `
# Structural Modeling Basics

Structural modeling creates the geometric framework of your reservoir. It defines the container into which rock properties will be distributed.

## Key Concepts
- **Horizons:** Surfaces representing layer boundaries (e.g., Top Reservoir, Base Reservoir).
- **Faults:** Discontinuities in the rock volume that displace horizons.
- **Grid:** The 3D mesh that discretizes the volume for property modeling and simulation.

## The Workflow
1. **Import Data:** Bring in seismic horizons, fault sticks, and well tops.
2. **Build Fault Network:** Model the fault planes and their intersections.
3. **Create Horizons:** Interpolate well tops guided by seismic surfaces.
4. **Generate Grid:** Construct the 3D grid (Skeleton) conforming to faults and horizons.
5. **Layering:** Subdivide the zones between horizons into layers (Proportional, Top-down, etc.).
    `,
    tags: ['structure', 'framework', 'grid'],
    difficulty: 'Intermediate',
    lastUpdated: '2025-10-20'
  },
  {
    id: 'fm-1',
    title: 'Facies Modeling Basics',
    category: 'Facies Modeling',
    content: `
# Facies Modeling Basics

Facies modeling involves distributing discrete geological categories (e.g., Sand, Shale) throughout the 3D grid.

## Methods
- **Deterministic:** Manually painting facies or using simple region-based assignments.
- **Stochastic:** Using geostatistical algorithms like Sequential Indicator Simulation (SIS) or Object-Based Modeling to populate the grid based on probabilities and variograms.

## Workflow
1. **Scale Up Well Logs:** Upscale discrete facies logs to the grid resolution.
2. **Data Analysis:** Calculate vertical and horizontal facies proportions and variograms.
3. **Run Simulation:** Configure the algorithm (e.g., SIS) and generate realizations.
4. **Validation:** Check that the global facies proportions in the model match the input data.
    `,
    tags: ['facies', 'geostatistics', 'sis'],
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-05'
  },
  {
    id: 'pm-1',
    title: 'Property Modeling Basics',
    category: 'Property Modeling',
    content: `
# Property Modeling Basics

Once facies are modeled, continuous properties like Porosity and Permeability are distributed within each facies.

## Common Algorithms
- **Sequential Gaussian Simulation (SGS):** Standard for continuous variables.
- **Kriging:** Deterministic estimation, good for trends but smooths extreme values.
- **Co-Kriging:** Uses a secondary variable (e.g., Seismic Impedance) to guide the property distribution.

## Dependencies
Property modeling is often **facies-dependent**. For example, you might define a Porosity distribution for "Sand" facies that is different from "Shale" facies. Ensure your Facies Model is finalized before running Property Modeling.
    `,
    tags: ['petrophysics', 'geostatistics', 'sgs'],
    difficulty: 'Advanced',
    lastUpdated: '2025-11-10'
  }
];