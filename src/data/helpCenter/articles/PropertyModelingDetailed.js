export const propertyModelingDetailed = [
  {
    id: 'pm-detailed-1',
    title: 'Property Modeling Basics',
    category: 'Property Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-12',
    content: `
# Property Modeling Basics

Property modeling involves distributing continuous variables (Porosity, Permeability, Saturation) into the 3D grid.

## Dependencies
Property modeling is typically **Facies-Biased**.
- You create separate distributions for Sand and Shale.
- The Facies Model acts as a mask: "If cell is Sand, use Sand Porosity distribution."

## Workflow
1.  **Data Analysis:** Histograms and Variograms per facies.
2.  **Porosity Modeling:** Usually done first (SGS).
3.  **Permeability Modeling:** Often co-simulated or linked to Porosity (Cloud Transform).
4.  **Saturation Modeling:** Often calculated as a function of Height above contact and Permeability (J-Function).
    `
  },
  {
    id: 'pm-detailed-2',
    title: 'Defining Properties',
    category: 'Property Modeling',
    difficulty: 'Beginner',
    lastUpdated: '2025-10-22',
    content: `
# Defining Properties

Before simulation, setup your property definitions in **Project Settings**.

## Common Properties
- **PHIE:** Effective Porosity (v/v). Range: 0 - 0.4.
- **PERM:** Permeability (mD). Range: 0.01 - 10,000 (Log Scale).
- **SW:** Water Saturation (v/v). Range: 0 - 1.
- **NTG:** Net-to-Gross (Ratio).

## Settings
- **Min/Max:** Set hard limits (e.g., Porosity cannot be > 1.0 or < 0.0).
- **Null Value:** Define what represents "No Data" (typically -999.25).
    `
  },
  {
    id: 'pm-detailed-3',
    title: 'Assigning Properties (Algorithms)',
    category: 'Property Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-01',
    content: `
# Algorithms for Property Assignment

## Sequential Gaussian Simulation (SGS)
- The standard for continuous properties.
- Honors histogram and variogram.
- Preserves extreme values (highs and lows) which is good for heterogeneity.

## Kriging (Simple/Ordinary)
- Deterministic interpolation.
- Smooths the data (averages out extremes).
- Good for visualizing trends but bad for flow simulation (underestimates heterogeneity).

## Moving Average
- Very simple smoothing. Only use for quick visualizations or regional trends.
    `
  },
  {
    id: 'pm-detailed-4',
    title: 'Property Statistics',
    category: 'Property Modeling',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-30',
    content: `
# Property Statistics & Transformations

## Normal Score Transformation
Geostatistical algorithms (SGS) require data to be Gaussian (Bell Curve).
- EarthModel Pro automatically transforms your input data to a Normal distribution before simulation.
- After simulation, it back-transforms it to the original distribution.

## Bi-Modal Distributions
If your porosity histogram has two humps (e.g., tight sand and loose sand), treat them as separate facies or stationary regions to ensure statistical validity.
    `
  },
  {
    id: 'pm-detailed-5',
    title: 'Property Validation',
    category: 'Property Modeling',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-06',
    content: `
# Validating Property Models

## Quality Control Steps
1.  **Histogram Check:** Does the model histogram match the upscaled well log histogram? (They should overlay closely).
2.  **Variogram Check:** Calculate the variogram of the resulting model. Does it match the input variogram model?
3.  **Visual Inspection:** Do high porosity zones align with geological expectations (e.g., channel centers)?
4.  **Co-Kriging Check:** If using Seismic Impedance as a trend, do the porosity patterns follow the seismic amplitude patterns?
    `
  }
];