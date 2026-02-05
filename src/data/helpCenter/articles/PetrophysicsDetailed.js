export const petrophysicsDetailed = [
  {
    id: 'pp-detailed-1',
    title: 'Petrophysics Basics',
    category: 'Petrophysics',
    difficulty: 'Intermediate',
    lastUpdated: '2025-11-14',
    content: `
# Petrophysics Basics

Petrophysics connects well logs to reservoir properties.

## Key Outputs
- **Vsh (Volume of Shale):** Clean sand vs. shale.
- **Phi (Porosity):** Storage capacity.
- **Sw (Water Saturation):** Hydrocarbon vs. water fraction.
- **K (Permeability):** Flow capacity.

## Workflow
1.  **Pre-calculation:** Depth shift, environmental corrections.
2.  **Vsh Calculation:** Using Gamma Ray (GR).
3.  **Porosity:** Using Density/Neutron.
4.  **Saturation:** Using Resistivity (Archie).
5.  **Cutoffs:** Defining "Net Pay".
    `
  },
  {
    id: 'pp-detailed-2',
    title: 'Porosity Analysis',
    category: 'Petrophysics',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-01',
    content: `
# Porosity Analysis

Calculating Total vs. Effective Porosity.

## Methods
- **Density (RHOB):** $\\phi = (\\rho_{ma} - \\rho_{b}) / (\\rho_{ma} - \\rho_{fl})$
- **Neutron-Density Crossplot:** Corrects for lithology and gas effects.
- **Sonic:** Wyllie Time Average equation.

## Parameters
- **Matrix Density ($\\rho_{ma}$):** Sandstone (2.65), Limestone (2.71).
- **Fluid Density ($\\rho_{fl}$):** Water (1.0), Oil (0.8), Gas (variable).
    `
  },
  {
    id: 'pp-detailed-3',
    title: 'Permeability Analysis',
    category: 'Petrophysics',
    difficulty: 'Advanced',
    lastUpdated: '2025-11-20',
    content: `
# Permeability Analysis

Permeability is rarely measured directly by logs; it is estimated.

## Porosity-Permeability Transform
- Plot Core Porosity vs. Core Permeability (log scale).
- Fit a regression line: $K = 10^{(a \\cdot \\phi + b)}$.
- Apply this equation to the log porosity curve.

## Flow Zone Indicator (FZI)
- Group rocks by pore throat geometry using FZI.
- Create separate Perm transforms for each Hydraulic Flow Unit (HFU).
    `
  },
  {
    id: 'pp-detailed-4',
    title: 'Saturation Analysis',
    category: 'Petrophysics',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-03',
    content: `
# Saturation Analysis

Calculating water saturation ($S_w$).

## Archie's Equation
The foundation for clean sands.
$$S_w = \\left( \\frac{a \\cdot R_w}{\\phi^m \\cdot R_t} \\right)^{(1/n)}$$

- **$R_w$:** Formation water resistivity.
- **$R_t$:** True formation resistivity (Deep Induction).
- **$m$:** Cementation exponent (usually 2).
- **$n$:** Saturation exponent (usually 2).

## Shaly Sand Models
For rocks with clay:
- **Simandoux** or **Indonesia** equations correct for the conductivity of clay bound water.
    `
  },
  {
    id: 'pp-detailed-5',
    title: 'Rock Physics Modeling',
    category: 'Petrophysics',
    difficulty: 'Advanced',
    lastUpdated: '2025-10-28',
    content: `
# Rock Physics Modeling

Bridging the gap between Petrophysics and Seismic.

## Elastic Properties
- Calculate **P-Impedance ($I_p$)**, **S-Impedance ($I_s$)**, and **Density**.
- **Gassmann Fluid Substitution:** mathematically replace the fluid in the rock (e.g., "What if this Oil sand was Brine filled?").

## Synthetic Seismogram
- Generate a reflectivity series from Impedance.
- Convolve with a wavelet (Ricker).
- Compare the Synthetic trace with the actual Seismic trace at the well to tie the data (Time-Depth relationship).
    `
  }
];