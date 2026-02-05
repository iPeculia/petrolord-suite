# Depth Track Quick Start Guide

This guide will help you get up and running with the new Depth Track system in the Well Correlation Tool.

## 1. Adding a Depth Track
To visualize depth data for a well:
1.  Navigate to the **Tracks** tab in the right sidebar.
2.  Click the **Add Track** button.
3.  Select one of the depth track types from the dropdown menu:
    *   **MD Track** (Measured Depth - Blue)
    *   **TVD Track** (True Vertical Depth - Green)
    *   **TVDSS Track** (True Vertical Depth Sub-Sea - Purple)
4.  A new depth track will appear in the correlation panel.

## 2. Selecting Depth Type
You can change the displayed depth type of an existing track:
1.  Click the **Settings** icon (gear) in the header of the depth track.
2.  In the settings popover, use the **Display Type** dropdown.
3.  Choose between **Measured Depth (MD)**, **True Vertical Depth (TVD)**, or **Sub-Sea TVD (TVDSS)**.
    *   *Note: The track title and color will update automatically to reflect your selection.*

## 3. Adjusting Depth Interval
To change how frequently depth numbers and ticks appear:
1.  Open the track settings.
2.  Locate the **Tick Interval** input field.
3.  Enter a value (e.g., `100` for every 100 meters, or `500` for less clutter).
    *   *Tip: Use larger intervals for zoomed-out views to prevent label overlap.*

## 4. Visual Toggles & Configuration
Customize the appearance of your depth track using the switches in the **DISPLAY OPTIONS** section of the settings panel:

*   **Labels:** Toggle to show or hide the numeric depth values.
*   **Grid:** Toggle horizontal grid lines extending across the track at each tick.
*   **Deviation:** Enable this to visualize the well's deviation angle. A shaded curve will appear showing how the well deviates from vertical (Orange).
*   **Sea Level:** (TVDSS Only) Toggle a dashed red reference line indicating Mean Sea Level (MSL).

## 5. Customizing Colors
To match your company's standards or personal preference:
1.  Open the track settings.
2.  Locate the **Color Theme** section at the bottom.
3.  Click on one of the colored circles to instantly apply that theme to the track header, ticks, and labels.

## Tips and Tricks
*   **Multiple Tracks:** You can add multiple depth tracks to the same well to compare MD vs TVD side-by-side.
*   **Placement:** Use the drag handle (grip icon) on the left of the track item in the sidebar to reorder tracks. Placing a Depth Track between Log Tracks can help correlate features across different depth references.
*   **Resizing:** Hover over the right edge of the track header in the panel to drag and resize the track width for better visibility.

## Common Use Cases
*   **Vertical Wells:** Use **MD** or **TVD** interchangeably (they are identical).
*   **Deviated Wells:** Use **MD** for drilling correlations and **TVD** for structural correlations (e.g., spotting fluid contacts).
*   **Regional Correlation:** Use **TVDSS** to correlate markers across wells with different Kelly Bushing (KB) elevations.

## Troubleshooting
*   **"Sea Level" option missing?** This option is only available when the track type is set to **TVDSS**.
*   **Deviation curve flat?** Ensure you are viewing a deviated well (e.g., Well-02 through Well-05). Well-01 is vertical, so no deviation will be shown.
*   **Grid lines not aligning?** Check if you have multiple depth tracks with different *Tick Intervals*. Aligning their intervals usually provides a cleaner view.