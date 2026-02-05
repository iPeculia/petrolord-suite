export const analysisArticles = [
  {
    id: 'pt-1',
    title: 'Petrophysics Basics',
    category: 'Petrophysics',
    content: `
# Petrophysics Basics

The Petrophysics module allows for the interpretation of wireline logs to derive reservoir properties.

## Key Steps
1. **Pre-processing:** Depth matching, environmental corrections, and normalization.
2. **Volume of Shale (Vsh):** Calculate Vsh using Gamma Ray (GR) or SP logs.
3. **Porosity:** Derive porosity from Density, Neutron, or Sonic logs, correcting for shale volume.
4. **Water Saturation (Sw):** Use Archie's equation or Simandoux to calculate water saturation.
5. **Permeability:** Estimate permeability using porosity-permeability transforms or core data regression.

## Integration
Calculated curves (Phi, K, Sw) can be saved directly to the database and used as input for **Property Modeling**.
    `,
    tags: ['logs', 'interpretation', 'vsh'],
    difficulty: 'Intermediate',
    lastUpdated: '2025-09-15'
  },
  {
    id: 'ml-1',
    title: 'Machine Learning Basics',
    category: 'Machine Learning',
    content: `
# Machine Learning in EarthModel Pro

EarthModel Pro integrates ML to automate complex tasks and uncover hidden patterns in data.

## Applications
- **Facies Prediction:** Train a Random Forest or Neural Network on core-calibrated wells to predict facies in uncored wells using standard logs.
- **Property Prediction:** Predict Permeability or Shear Velocity using regression models.
- **Fault Detection:** Automatically extract fault planes from 3D seismic volumes using Convolutional Neural Networks (CNNs).

## Workflow
1. **Select Data:** Choose training wells and target curves.
2. **Feature Engineering:** Select input curves (features) like GR, RHOB, NPHI.
3. **Train Model:** Select an algorithm and train. Review the confusion matrix or regression metrics (R²).
4. **Apply:** Apply the trained model to the rest of the field.
    `,
    tags: ['ai', 'ml', 'automation'],
    difficulty: 'Advanced',
    lastUpdated: '2025-12-02'
  }
];