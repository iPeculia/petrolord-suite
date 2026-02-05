# Release Notes - EarthModel Pro v4.0.0

**Date**: December 05, 2025

## 🌟 Highlights
*   **Machine Learning Hub**: A new dedicated workspace for managing your AI models.
*   **Well Placement Optimizer**: Let AI find the sweet spot with our new Genetic Algorithm engine.
*   **Smart Basin Modeling**: BasinFlow Genesis now includes auto-calibration and parameter optimization.

## 🚀 New Features
*   **Facies Prediction UI**: Train classifiers on your well logs with zero coding.
*   **Sensitivity Analysis**: Automated tornado charts and parameter sweeping in BasinFlow.
*   **Model Registry**: Version control for your machine learning assets.

## 🛠️ Improvements
*   **Performance**: Significant optimization of React rendering for large datasets using `useMemo` and virtualization.
*   **Visualization**: Upgraded plotting libraries for smoother interaction with high-density data.
*   **Documentation**: Complete overhaul of help guides and API docs.

## 🐛 Bug Fixes
*   Fixed an issue where the heatmap color scale would reset on tab switch.
*   Resolved a layout glitch in the multi-well manager sidebar on mobile devices.
*   Corrected unit conversion errors in the Heat Flow calculator.

## ⚠️ Known Issues
*   Fault Detection module is currently in Preview and may be unstable with large seismic volumes.
*   Deep Learning training requires a connection to the optional GPU backend (not included in standard install).