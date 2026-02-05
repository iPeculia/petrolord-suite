# Track Configuration Quick Start Guide

This guide provides a quick overview of how to use the Track Configuration features in the Well Correlation Tool.

## 1. Adding a Track
To add a new track to your well visualization:
1. Open the **Tracks** tab in the right sidebar.
2. Click the **Add** button at the top.
3. A new track will appear in the list and on the correlation panel.
4. Expand the track accordion to configure its properties.

## 2. Adjusting Track Width
You can adjust the width of any track using multiple methods:
- **Drag Handle:** Hover over the right edge of any track in the correlation panel until the cursor changes, then drag to resize.
- **Numeric Input:** In the Track Configuration sidebar, enter a precise pixel value in the Width input field.
- **Slider:** Use the slider control in the sidebar for quick visual adjustment.
- **Presets:** Use the "Narrow", "Normal", or "Wide" preset buttons for standard sizes.

## 3. Configuring Curves
To manage curves within a track:
1. Expand the track in the configuration sidebar.
2. In the **CURVES** section, click the **+** icon to add a curve.
3. Select the curve mnemonic (e.g., GR, RES, NPHI) from your data.
4. Click the settings icon next to a curve to change its color, line width, or style.

## 4. Applying Curve Filling
Curve filling helps visualize lithology or hydrocarbons:
1. Expand the track configuration.
2. In the **FILLINGS** section, click **+**.
3. Select a fill type:
   - **Left/Right:** Fills from the curve to the track edge.
   - **Between:** Fills the area between two curves (e.g., neutron-density crossover).
4. Choose a color and opacity for the fill.

## 5. Grid Settings & Layer Management
Control the visibility and appearance of grid lines and layers:
1. Switch to the **Layers** tab in the right sidebar.
2. Use the **Grid Configuration** section to:
   - Toggle vertical and horizontal grid lines.
   - Change grid opacity and line style (dashed/dotted).
3. Use the **Layer Visibility** list to toggle visibility for Curves, Fillings, Markers, or Horizons globally.

## 6. Log Scale
To switch between Linear and Logarithmic scales:
1. Expand the track configuration.
2. Toggle the **Log Scale** switch.
   - **Linear:** Good for Gamma Ray, Density, Neutron.
   - **Log:** Essential for Resistivity logs.

## Troubleshooting
- **Curves not showing?** Ensure the curve mnemonic matches your data and the track scale range covers the data values.
- **Fillings incorrect?** Check if the fill type matches the relationship you want to show (e.g., use "Between" for crossover).
- **Performance issues?** Try reducing the number of active tracks or visible layers if working with very large datasets.