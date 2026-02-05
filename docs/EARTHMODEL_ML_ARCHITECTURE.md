# EarthModel Pro - ML Architecture

## Overview
The Machine Learning architecture in EarthModel Pro is designed for hybrid execution: lightweight inference and interactive learning happen client-side (browser), while heavy training jobs are offloaded to server-side Edge Functions.

## Components

### 1. Frontend Layer (React + TensorFlow.js)
*   **ML Hub**: Orchestrates model state and user interaction.
*   **Local Inference**: Uses `tfjs` for real-time predictions on small datasets (e.g., single well log curves).
*   **Visualization**: Plotly and D3.js for interactive charts (convergence plots, confusion matrices).

### 2. Service Layer (Abstraction)
*   `mlService.js`: Generic interface for model CRUD operations.
*   `optimizationService.js`: Encapsulates algorithms like Genetic Algorithms and PSO.
*   `calibrationPredictor.js`: specialized service for BasinFlow auto-calibration.

### 3. Backend Layer (Supabase)
*   **Database**: PostgreSQL stores model metadata, training history, and serialized model artifacts (JSON).
*   **Storage**: Large datasets and binary model files are stored in Supabase Storage buckets.
*   **Edge Functions**: (Planned Phase 5) Python/Deno runtimes for training complex Deep Learning models.

## Data Flow
1.  **Input**: User selects data from `DataManager`.
2.  **Preprocessing**: Data is normalized and cleaned via `DataCleaning` utilities.
3.  **Training**: 
    *   *Light*: Executed in browser web worker.
    *   *Heavy*: Request sent to `ml-training` Edge Function.
4.  **Storage**: Trained model weights saved to Model Registry.
5.  **Inference**: Model loaded from Registry; predictions generated and visualized.

## Security
*   All model artifacts are row-level secured (RLS) based on Project ID.
*   API calls to Edge Functions are protected via JWT authentication.