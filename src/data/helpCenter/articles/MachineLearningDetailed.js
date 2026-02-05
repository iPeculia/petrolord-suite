export const machineLearningDetailed = [
  {
    id: 'ml-detailed-1',
    title: 'Machine Learning Basics',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    lastUpdated: '2025-12-05',
    content: `
# Machine Learning in EarthModel Pro

ML automates complex interpretation tasks using data-driven patterns.

## Supervised Learning
- You provide "Training Data" (e.g., labeled facies in key wells).
- The algorithm learns the relationship between Logs and Facies.
- It applies this logic to predict facies in uncored wells.

## Unsupervised Learning
- The algorithm finds natural clusters in the data without labels.
- Useful for identifying Electrofacies or Flow Units.
    `
  },
  {
    id: 'ml-detailed-2',
    title: 'Facies Prediction',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    lastUpdated: '2025-11-18',
    content: `
# Facies Prediction Workflow

## 1. Training Data Selection
- Select wells with high-quality Core descriptions or expert manual interpretation.
- Ensure balanced representation of all facies types.

## 2. Feature Engineering
- Select inputs: GR, NPHI, RHOB, DT, PEF.
- Compute derivatives if needed (e.g., spatial position X, Y).

## 3. Algorithm Selection
- **Random Forest:** Robust, handles non-linear data well.
- **XGBoost:** Often higher performance.
- **Neural Networks:** Good for very large datasets.

## 4. Train & Validate
- Split data into Training (70%) and Blind Test (30%).
- Check the **Confusion Matrix** to see accuracy per facies.
    `
  },
  {
    id: 'ml-detailed-3',
    title: 'Property Prediction',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    lastUpdated: '2025-11-30',
    content: `
# Property Prediction (Regression)

Predicting continuous curves like Permeability or Shear Velocity ($V_s$) where measurement is missing.

## Workflow
1.  **Input:** Standard logs (GR, Res, Density).
2.  **Target:** Core Permeability or Dipole Shear log.
3.  **Train:** Use Gradient Boosting Regressor.
4.  **Apply:** Generate synthetic Perm/Shear curves for all wells in the field.

## QC
- Compare predicted vs. actual in the blind test wells.
- Look for "hallucinations" (predictions that look physically impossible).
    `
  },
  {
    id: 'ml-detailed-4',
    title: 'Fault Detection',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    lastUpdated: '2025-10-15',
    content: `
# Automated Fault Detection

Using Deep Learning (CNNs) on 3D Seismic volumes.

## Process
1.  **Input:** 3D Seismic Amplitude volume.
2.  **Pre-processing:** Noise reduction (structural smoothing).
3.  **Inference:** The pre-trained CNN scans the volume for discontinuity patterns characteristic of faults.
4.  **Extraction:** Output is a "Fault Probability" cube.
5.  **Skeletonization:** Convert probability clouds into discrete fault planes (surfaces).

## Advantages
- Detects subtle faults often missed by human eye.
- Massive time saving compared to manual picking of every slice.
    `
  },
  {
    id: 'ml-detailed-5',
    title: 'Well Placement Optimization',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    lastUpdated: '2025-12-06',
    content: `
# Well Placement Optimization

Using ML to find the best drilling targets.

## Objectives
- Maximize: Contact with Reservoir (Net Pay).
- Maximize: Distance from Water Contact.
- Minimize: Cost (Trajectory length).

## The Algorithm
- **Genetic Algorithm:** Simulates "evolution".
- Generates 100s of potential trajectories.
- Evaluates them against the 3D Property Model.
- "Breeds" the best solutions to find the optimal path.

## Result
- A set of proposed well trajectories ranked by Net Present Value (NPV) potential.
    `
  }
];