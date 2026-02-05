# EarthModel Pro - Machine Learning Guide (Phase 4)

## Overview

Phase 4 of EarthModel Pro introduces a powerful suite of integrated Machine Learning (ML) tools designed to augment the geoscientist's workflow. This guide provides an overview of the key components and how to use them.

## Key Components

### 1. ML Hub
The **ML Hub** is the central dashboard for all ML operations. It provides:
- **Model Registry**: A list of all trained models, their status (ready, training), type (classification, regression), and key performance metrics like accuracy.
- **System Health**: Mock monitoring of ML system resources, such as training queue status and API health.
- **Quick Actions**: Entry points to start new training jobs or use existing models.

### 2. Facies Prediction
This module allows users to train a model (e.g., Random Forest) to automatically classify lithofacies based on well log curves.

- **Workflow**:
    1.  **Configure**: Select the algorithm and input features (e.g., Gamma Ray, Density).
    2.  **Train**: Click "Start Training" to begin the (currently simulated) training process. The UI shows real-time progress and mock metrics.
    3.  **Analyze**: View results, including a feature importance chart to understand which logs contributed most to the prediction.

### 3. Property Prediction
This module is for predicting continuous reservoir properties like porosity or permeability.

- **Workflow**:
    1. Select a target property (e.g., Porosity).
    2. Choose a regression model (e.g., XGBoost).
    3. Train the model on available log and core data.

### 4. Well Placement Optimization
This advanced module uses a Genetic Algorithm (GA) to find the optimal drilling locations within a defined area.

- **Workflow**:
    1.  **Configure GA**: Set parameters like Population Size, Generations, and Mutation Rate.
    2.  **Run Optimization**: Execute the algorithm. The UI visualizes the population of candidate wells converging towards the "sweet spot" over generations.
    3.  **View Results**: The best location and its fitness score are displayed upon completion.

## Backend Architecture (Mocked)

For this phase, all ML operations are simulated client-side via services in `src/services/ml/`.
- `mlService.js`: Handles general model listing and mock training progress.
- `optimizationService.js`: Contains the logic for the Genetic Algorithm simulation.

In a production environment, these services would make calls to a scalable backend (like Supabase Edge Functions) to perform the heavy computations.

## Getting Started

1.  Navigate to the **Machine Learning** section in the EarthModel Pro sidebar.
2.  Start at the **ML Hub** to get an overview.
3.  Select **Well Placement** to run the optimization demo. Adjust the sliders and click "Run Optimization" to see the algorithm in action.