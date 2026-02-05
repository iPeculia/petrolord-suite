# EarthModel Pro - Machine Learning User Guide

## 1. Getting Started
Access the Machine Learning tools via the **Machine Learning** category in the main sidebar. The entry point is the **ML Hub**, which provides a high-level view of your organization's AI assets.

## 2. Workflows

### Facies Prediction
**Goal**: Predict lithofacies (e.g., Sandstone, Shale) from wireline logs.
1.  **Select Data**: Choose a target well and reference wells for training.
2.  **Configure**: Select input curves (Gamma Ray, Neutron, Density) and the target facies curve.
3.  **Train**: Choose an algorithm (Random Forest is recommended for beginners) and click "Start Training".
4.  **QC**: Review the confusion matrix and feature importance chart to validate the model.
5.  **Predict**: Apply the trained model to uncored wells.

### Well Placement Optimization
**Goal**: Find the optimal surface and target location for a new well.
1.  **Define Area**: Set the boundaries of the reservoir sector.
2.  **Set Constraints**: Define minimum distance from existing wells and geological hazards.
3.  **Configure Algorithm**: Adjust population size and generations for the Genetic Algorithm. Higher numbers yield better results but take longer.
4.  **Run**: Watch the visualization as the algorithm "evolves" the well location towards the highest fitness zone.

### Property Prediction
**Goal**: Populate a 3D grid with porosity or permeability.
1.  **Input**: Load upscaled well logs and 3D seismic attributes.
2.  **Correlation**: Use the tool to find strong correlations between seismic attributes and log properties.
3.  **Predict**: Train a regression model and apply it to the full 3D volume.

## 3. Tips and Tricks
*   **Data Quality**: ML models are only as good as the input data. Always perform normalization and outlier removal in the **Data QC** module first.
*   **Start Simple**: Begin with simple algorithms (Linear Regression, Decision Trees) to establish a baseline before moving to Neural Networks.
*   **Save Often**: Use the "Save Scenario" feature in BasinFlow Genesis and other apps to checkpoint your work before running complex optimizations.