# DEPTH TRACK SYSTEM - QUICK REFERENCE CARD
- Date: 2025-12-06

## QUICK START (30 SECONDS)

1.  **Open Well Correlation Tool**
2.  **Select a demo well** from the left sidebar.
3.  **Click "Add Track" button** in the "Track Config" panel (right sidebar).
4.  **Select "Measured Depth (MD)"** (or TVD/TVDSS from the dropdown).
5.  **Depth track appears!** It will render on the main correlation panel.
6.  **Adjust settings** as needed via the gear icon (<Settings2 />) in the track's header.

## THREE DEPTH TRACK TYPES

**MD (Measured Depth) - BLUE**
└─  Actual distance measured along the wellbore.
└─  Range: 0 to total measured depth.
└─  Use for: Well planning, drilling operations, casing design.

**TVD (True Vertical Depth) - GREEN**
└─  Vertical distance from the surface.
└─  Range: 0 to maximum true vertical depth.
└─  Use for: Pressure calculations, fluid contact identification.

**TVDSS (True Vertical Depth Sub-Sea) - PURPLE**
└─  True Vertical Depth measured relative to mean sea level (0m).
└─  Range: Typically -1000m to 2500m (can show negative values above MSL).
└─  Use for: Seismic interpretation, regional correlation.
└─  Special: Features a distinct **blue** sea level reference line at 0m TVDSS.

## DEPTH TRACK CONTROLS (via track header's <Settings2 /> icon)

**Tick Interval Slider**
└─  Range: 100m to 1000m.
└─  Controls the spacing between depth markers and labels.
└─  Smaller values = more detail; Larger values = cleaner view.

**Show/Hide Toggles**
├─  **Depth Labels:** Toggle numeric depth values on/off.
├─  **Depth Grid:** Toggle horizontal grid lines on/off.
├─  **Deviation:** Toggle the visual representation of the well's deviation path on/off.
└─  **Sea Level:** (TVDSS only) Toggle the Mean Sea Level reference line on/off.

**Color Picker**
└─  Allows customization of the track's primary color (header, labels, ticks, deviation).
└─  Updates in real-time.

## DEMO WELLS AT A GLANCE

**Well-01: Vertical**
└─  MD: 0-3500m | TVD: 0-3500m | MD/TVD Ratio: 1.0 (MD = TVD)

**Well-02: Slightly Deviated**
└─  MD: 0-3800m | TVD: 0-3500m | MD/TVD Ratio: 1.09 (MD is ~9% longer than TVD)

**Well-03: Moderately Deviated**
└─  MD: 0-4200m | TVD: 0-3500m | MD/TVD Ratio: 1.20 (MD is ~20% longer than TVD)

**Well-04: Highly Deviated**
└─  MD: 0-5000m | TVD: 0-3500m | MD/TVD Ratio: 1.43 (MD is ~43% longer than TVD)

**Well-05: Horizontal**
└─  MD: 0-6000m | TVD: 0-3500m | MD/TVD Ratio: 1.71 (MD is ~71% longer than TVD)

## COLORS

**MD Track:** `#3B82F6` (Blue)
**TVD Track:** `#10B981` (Green)
**TVDSS Track:** `#A855F7` (Purple)
**Sea Level Reference Line:** `#3b82f6` (Blue - for MSL)
**Grid:** Track's configured color with 30% opacity

## COMMON TASKS

**Add MD Track**
1.  Click "Add Track" button.
2.  Select "Measured Depth (MD)".
3.  The track appears with default blue theme.

**Add TVD Track**
1.  Click "Add Track" button.
2.  Select "True Vertical Depth (TVD)".
3.  The track appears with default green theme.

**Add TVDSS Track**
1.  Click "Add Track" button.
2.  Select "Sub-Sea (TVDSS)".
3.  The track appears with default purple theme.

**Adjust Depth Interval**
1.  Click the <Settings2 /> icon in the header of the desired depth track.
2.  Adjust the "Tick Interval" slider to change marker spacing.
3.  The markers and labels update in real-time.

**Toggle Depth Labels**
1.  Click the <Settings2 /> icon in the header of the desired depth track.
2.  Toggle the "Labels" switch in the "Visibility" section.
3.  Depth labels appear/disappear instantly.

**Customize Color**
1.  Click the <Settings2 /> icon in the header of the desired depth track.
2.  Select a new color from the provided palette at the bottom of the popover.
3.  The track's elements update to the new color.

## KEYBOARD SHORTCUTS (COMING SOON)

-   `Ctrl+D`: Add a generic depth track
-   `Ctrl+M`: Add an MD track
-   `Ctrl+T`: Add a TVD track
-   `Ctrl+S`: Add a TVDSS track

## TROUBLESHOOTING

**Problem:** Can't find "Add Track" button.
**Solution:** Ensure you are in the "Track Config" panel on the right sidebar.

**Problem:** Depth values don't look right.
**Solution:** Verify that you selected the correct depth type (MD, TVD, or TVDSS) for the track.

**Problem:** Sea level line not showing.
**Solution:** This feature is only available for TVDSS tracks. Ensure you are using a TVDSS track and that the "Show Sea Level" toggle is enabled in its settings.

**Problem:** Depth labels overlapping.
**Solution:** Increase the "Tick Interval" using the slider in the track settings to reduce the number of visible labels.

## FILES CREATED / UPDATED

✅ `src/components/wellCorrelation/DepthTrackRenderer.jsx`
✅ `src/data/wellDepthData.js`
✅ `src/utils/depthTrackUtils.js`
✅ `src/contexts/WellCorrelationContext.jsx`
✅ `src/components/wellCorrelation/TrackConfiguration.jsx`
✅ `src/components/wellCorrelation/CorrelationPanel.jsx`
✅ `src/pages/apps/WellCorrelationTool.jsx` (wrapped in provider)

## FEATURES CHECKLIST

✅ MD depth tracks (blue themed).
✅ TVD depth tracks (green themed).
✅ TVDSS depth tracks (purple themed).
✅ Depth markers and labels at configurable intervals.
✅ Optional depth grid.
✅ Sea level reference (specific to TVDSS, togglable).
✅ Deviation angle visualization.
✅ Adjustable depth intervals from 100m to 1000m.
✅ Show/hide toggles for labels, grid, deviation, and sea level.
✅ Color customization for each track.
✅ All 5 demo wells supported with realistic depth data.
✅ Professional and modern appearance.
✅ Responsive design with resizable tracks.

## STATUS

Implementation: ✅ COMPLETE
Testing: ✅ VERIFIED
Visibility: ✅ VISIBLE IN UI
Ready for use: ✅ YES
Ready for production: ✅ YES