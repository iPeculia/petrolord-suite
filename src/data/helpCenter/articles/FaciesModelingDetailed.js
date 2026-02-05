export const faciesModelingDetailed = [
  {
    id: 'fm-detailed-1',
    title: 'Facies Modeling Basics',
    category: 'Facies Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-10',
    content: `
# Facies Modeling Basics

Facies modeling populates the grid with discrete rock types (e.g., Sand, Shale, Limestone).

## Why Facies?
Properties like Porosity and Permeability behave differently in different rock types. Modeling facies first allows us to condition these properties correctly (e.g., "Only populate high perm in Sand facies").

## Inputs
- **Upscaled Logs:** Discrete facies curves (0=Shale, 1=Sand) averaged into grid cells.
- **Trends:** 2D probability maps or 3D cubes.
- **Variograms:** Spatial continuity definitions.
    `
  },
  {
    id: 'fm-detailed-2',
    title: 'Defining Facies',
    category: 'Facies Modeling',
    difficulty: 'Beginner',
    lastUpdated: '2025-10-20',
    content: `
# Defining Facies Schemes

Before modeling, you must define what your codes represent.

## Creating a Global Scheme
1.  Go to **Project Settings > Facies Definitions**.
2.  Add new items:
    - **Code 0:** Shale (Color: Green)
    - **Code 1:** Sand (Color: Yellow)
    - **Code 2:** Cemented Sand (Color: Blue)
3.  Assign this scheme to your well logs to ensure consistency across the project.

## Tips
- Keep it simple. 3-5 facies are usually sufficient for simulation.
- Ensure colors match industry standards for easy recognition.
    `
  },
  {
    id: 'fm-detailed-3',
    title: 'Assigning Facies (Algorithms)',
    category: 'Facies Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-03',
    content: `
# Algorithms for Facies Assignment

EarthModel Pro offers several geostatistical algorithms:

## Sequential Indicator Simulation (SIS)
- Most common method.
- Stochastic (random seed based).
- Honors input data (wells) and variogram.
- **Use case:** Complex, heterogeneous reservoirs.

## Object-Based Modeling (Boolean)
- Places discrete shapes (channels, lobes) into the background.
- **Use case:** Fluvial channels, Deltaic lobes.
- *Note:* Can be harder to condition to dense well data.

## Truncated Gaussian Simulation (TGS)
- Uses a continuous Gaussian field truncated by thresholds.
- **Use case:** Prograding sequences, transition zones (Shoreface).
    `
  },
  {
    id: 'fm-detailed-4',
    title: 'Facies Statistics',
    category: 'Facies Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-25',
    content: `
# Facies Statistics & Analysis

Understanding your input data proportions is critical for realistic modeling.

## Global Proportions
- **Upscaled Cells:** What % of Sand is in the wells? (e.g., 25%).
- **Target:** The model should usually respect this 25% unless geological knowledge suggests wells are biased (e.g., drilled only on structural highs).

## Vertical Proportion Curve (VPC)
- Shows the proportion of facies layer by layer.
- Identify trends (e.g., "Fining Upward" or "Coarsening Upward").
- Use the VPC to guide the simulation trend.
    `
  },
  {
    id: 'fm-detailed-5',
    title: 'Facies Validation',
    category: 'Facies Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-06',
    content: `
# Validating the Facies Model

Once realized, how do you know it's "good"?

## Visual Checks
- Does it look geological? (e.g., continuous sand bodies vs. random noise).
- Do facies match at the well locations?

## Statistical Checks
- **Histogram Comparison:** Input Log vs. Upscaled Log vs. 3D Model.
- **VPC Validation:** Does the model's vertical trend match the input data's trend?
- **Connectivity:** Analyze connected volumes. Are the sands connected from injector to producer?
    `
  }
];