# EarthModel Pro - Object Modeling Workflows

## Overview
This document outlines standard workflows for creating and managing stochastic geological objects within EarthModel Pro.

## 1. Channel Modeling Workflow
**Objective**: Create a sinuous fluvial channel system.

1.  **Initialize**: Navigate to **Object Modeling > Channel**.
2.  **Define Geometry**:
    *   Set `Width` (e.g., 250m) and `Thickness` (e.g., 12m).
    *   Adjust `Sinuosity` (1.0 = straight, >1.5 = highly meandering).
    *   Set `Azimuth` to align with paleocurrent direction.
3.  **Stacking**:
    *   Select `Vertical Aggregation` for incised valleys.
    *   Select `Lateral Migration` for point bars.
4.  **Preview**: Click `Preview` to generate a 3D mesh representation.
5.  **Save**: Store the object in the project library.

## 2. Lobe Modeling Workflow
**Objective**: Model a distal turbidite fan lobe.

1.  **Initialize**: Navigate to **Object Modeling > Lobe**.
2.  **Define Dimensions**:
    *   Set `Radial Length` and `Max Width`.
    *   Lobes are typically teardrop or fan-shaped.
3.  **Orientation**: Set the flow direction azimuth.
4.  **Properties**: Assign a high net-to-gross (sand rich) property to the lobe core, fining outward to the fringe.

## 3. Salt Dome Modeling
**Objective**: Insert a salt diapir into the structural framework.

1.  **Initialize**: Navigate to **Object Modeling > Salt Dome**.
2.  **Shape**: Choose `Circular` or `Elliptical`.
3.  **Dimensions**: Set `Diameter` and `Height`.
4.  **Overhang**: Adjust `Overhang` parameter to create a mushroom cap shape if required (typical for mature diapirs).
5.  **Interaction**: Define how the salt body truncates sediment layers (piercement).

## Best Practices
*   **Conditioning**: Wherever possible, condition object placement to well data (hard data) where facies have been observed.
*   **Trends**: Use seismic attribute maps (e.g., RMS amplitude) as soft probability trends for object location.
*   **Overlap**: Define rules for object collision (erode, stack, or merge) to maintain volumetric realism.