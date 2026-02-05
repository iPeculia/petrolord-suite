# Object Modeling User Guide

## 1. Overview
The Object Modeling module allows you to populate your 3D grid with discrete geological bodies. Unlike pixel-based methods (SIS/SGS), object modeling preserves the geometric integrity of depositional features.

## 2. Getting Started
1.  Navigate to **EarthModel Pro > Property > Object Modeling**.
2.  You will see the **Object Modeling Hub** showing existing objects and statistics.

## 3. Creating a Channel
1.  Click **New Object** or select **Channel** from the Hub.
2.  **Geometry**:
    *   **Width**: Average channel width.
    *   **Thickness**: Maximum thickness at the thalweg.
    *   **Sinuosity**: 1.0 is straight; >1.5 is highly meandering.
    *   **Amplitude/Wavelength**: Controls the meander shape.
3.  **Properties**: Assign properties for the channel fill (e.g., Porosity=0.25) and potentially levees.
4.  **Preview**: Use the 3D preview to verify the shape.
5.  **Save**: Click Save to add it to the library.

## 4. Placing Objects
*   **Stochastic**: Let the engine place objects based on a probability trend map (e.g., from seismic attributes).
*   **Deterministic**: Use the **3D Editor** to manually position an object at specific X,Y,Z coordinates. This is useful when you know exactly where a channel exists from high-quality seismic.

## 5. Interaction Rules
Define what happens when two objects intersect:
*   **Erode**: The younger object removes the older one (typical for channels).
*   **Stack**: The younger object drapes over the older one (typical for lobes).

## 6. Export
Export your realization as a 3D Grid Property (Facies Code) which can then be used to constrain Porosity/Permeability modeling.