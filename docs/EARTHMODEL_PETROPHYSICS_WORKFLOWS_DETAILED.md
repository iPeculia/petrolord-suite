# Detailed Workflows: Petrophysics

## Workflow 1: Saturation Height Modeling
1.  **Data Prep**: Gather capillary pressure (Pc) lab data.
2.  **QC**: Convert Lab Pc to Reservoir Pc using IFT and Contact Angle.
3.  **Grouping**: Group samples by Rock Type (e.g., based on Porosity/Permeability bins).
4.  **Fitting**: For each rock type, fit a Brooks-Corey curve.
    *   Extract `Pd` (Entry Pressure).
    *   Extract `lambda` (Pore size distribution).
5.  **Function**: Create a height function: `Sw = f(Height, Porosity)`.
6.  **Validation**: Compare calculated Sw with log-derived Sw (Archie) at well locations.

## Workflow 2: Gassmann Fluid Substitution
1.  **Shear Log Prediction**: If Vs is missing, use Castagna's or Greenberg-Castagna relations to predict Vs from Vp and Density.
2.  **Elastic Moduli**: Calculate K_sat, Mu, and Rho from Vp, Vs, Rho.
3.  **K_dry Calculation**: Use the Gassmann equation inverted to find the Bulk Modulus of the dry frame.
4.  **Substitution**: Re-calculate K_sat using the properties of the new fluid (e.g., gas).
5.  **New Velocities**: Calculate new Vp, Vs, and Rho.
6.  **Synthetic**: Generate a synthetic seismogram to see the "Bright Spot" effect.