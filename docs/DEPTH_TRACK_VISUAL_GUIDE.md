# DEPTH TRACK SYSTEM - VISUAL GUIDE AND FEATURE SHOWCASE
- Date: 2025-12-06
- Status: FULLY IMPLEMENTED AND VISIBLE ✅

## WHAT YOU SHOULD SEE

When you open the Well Correlation Tool and select a demo well, you should
see the following features implemented and visible in the UI:

## FEATURE 1: "ADD TRACK" DROPDOWN MENU

**Location:** TrackConfiguration panel (right sidebar)

**What to look for:**
- "Add Track" button with dropdown arrow
- Click the button to see dropdown menu
- Menu options:
  1. Log Track
  2. Depth Track - MD
  3. Depth Track - TVD
  4. Depth Track - TVDSS

**Visual appearance:**
- Professional dropdown menu with distinct icons for each track type.
- Clear option labels.
- Easy to select.

**How to use:**
1. Click "Add Track" button.
2. Select "Depth Track - MD" (or TVD/TVDSS).
3. The newly added depth track will appear in the well view on the main Correlation Panel.

## FEATURE 2: MD (MEASURED DEPTH) TRACK

**Color:** Blue (`#3B82F6`)

**What you'll see:**
- A vertical track with a blue header on the left side of the well view.
- Depth values incrementing downwards (e.g., 0, 500, 1000m).
- Small tick marks are displayed at each depth interval.
- Depth labels are shown next to the tick marks, with "m" as the unit.
- Optional grid lines (horizontal) can be toggled on/off.
- Optional deviation angle visualization shows a filled area and a line indicating the well's deviation path within the track.

**Settings available (via track's header settings icon):**
- **Display Type:** Allows switching between MD, TVD, TVDSS.
- **Width (px):** Numeric input for exact track width.
- **Tick Interval (m):** Input field to control spacing between depth markers (e.g., 100, 500, 1000m).
- **Show Labels:** Toggle switch to show or hide depth value labels.
- **Show Grid:** Toggle switch to show or hide horizontal grid lines.
- **Show Deviation:** Toggle switch to show or hide the deviation angle visualization.
- **Track Color:** Color picker to customize the track's color.

**Example values (based on demo wells):**
- **Well-01 (Vertical):** 0-3500m
- **Well-02 (Slightly deviated):** 0-3800m
- **Well-03 (Moderately deviated):** 0-4200m
- **Well-04 (Highly deviated):** 0-5000m
- **Well-05 (Horizontal):** 0-6000m

## FEATURE 3: TVD (TRUE VERTICAL DEPTH) TRACK

**Color:** Green (`#10B981`)

**What you'll see:**
- A vertical track with a green header on the left side of the well view, often with a subtle "arrow up" icon.
- Depth values incrementing downwards (e.g., 0, 500, 1000m).
- Small tick marks at each depth interval.
- Depth labels are shown with "m" unit.
- Optional grid lines (horizontal) can be toggled on/off.
- Optional deviation angle visualization showing the well's path relative to true vertical.

**Settings available (via track's header settings icon):**
- **Display Type:** Allows switching between MD, TVD, TVDSS.
- **Width (px):** Numeric input for exact track width.
- **Tick Interval (m):** Input field to control spacing between depth markers.
- **Show Labels:** Toggle switch to show or hide depth value labels.
- **Show Grid:** Toggle switch to show or hide horizontal grid lines.
- **Show Deviation:** Toggle switch to show or hide the deviation angle visualization.
- **Track Color:** Color picker to customize the track's color.

**Key difference from MD:**
- TVD is always less than or equal to MD.
- For vertical wells: TVD = MD (same values).
- For deviated wells: TVD < MD (the vertical distance is shorter than the measured distance along the wellbore).

**Example values (based on demo wells):**
- All wells: 0-3500m (TVD range is consistent across all wells).

## FEATURE 4: TVDSS (TRUE VERTICAL DEPTH SUB-SEA) TRACK

**Color:** Purple (`#A855F7`)

**What you'll see:**
- A vertical track with a purple header on the left side of the well view, often with a subtle "waves" icon.
- Depth values, which can include negative numbers for depths above sea level (e.g., -1000, -500, 0, 500m).
- Small tick marks at each depth interval.
- Depth labels are shown with "m" unit.
- Optional grid lines (horizontal) can be toggled on/off.
- A **blue horizontal line** labeled "MSL (0m)" at 0m TVDSS, marking the Mean Sea Level.
- Optional deviation angle visualization.

**Settings available (via track's header settings icon):**
- **Display Type:** Allows switching between MD, TVD, TVDSS.
- **Width (px):** Numeric input for exact track width.
- **Tick Interval (m):** Input field to control spacing between depth markers.
- **Show Labels:** Toggle switch to show or hide depth value labels.
- **Show Grid:** Toggle switch to show or hide horizontal grid lines.
- **Show Deviation:** Toggle switch to show or hide the deviation angle visualization.
- **Show Sea Level Reference:** Toggle switch to show or hide the MSL reference line (unique to TVDSS).
- **Track Color:** Color picker to customize the track's color.

**Sea Level Reference:**
- A distinct blue horizontal line at 0m TVDSS, labeled "MSL (0m)".
- Clearly marks the sea level datum.
- Helps to easily identify formations above or below sea level.
- Can be toggled on/off from the track's settings.

**Example values (based on demo wells):**
- All wells: -1000 to 2500m TVDSS.
- Negative values indicate depths above Mean Sea Level.
- Positive values indicate depths below Mean Sea Level.

## FEATURE 5: DEPTH TRACK SETTINGS PANEL

**Location:** Accessed by clicking the <Settings2 className="w-3 h-3 inline mx-0.5" /> icon in the header of an individual Depth Track.

When you open the settings popover for a depth track, you'll see:

**A. Display Type Selector**
   - A dropdown menu to change the depth track type (MD, TVD, TVDSS) after it has been added.

**B. Width (px)**
   - A numeric input field to precisely set the track width.

**C. Tick Interval (m)**
   - An input field to set the desired interval for depth markers and labels (e.g., 100, 500, 1000m).

**D. Show/Hide Toggles (Visibility Section)**
   - **Labels:** Toggle to show or hide depth value labels.
   - **Grid:** Toggle to show or hide the horizontal grid lines.
   - **Deviation:** Toggle to show or hide the deviation angle visualization.
   - **Sea Level:** A toggle that appears *only* for TVDSS tracks, to show or hide the MSL reference line.

**E. Track Color Picker**
   - A row of pre-defined color buttons and a color swatch to customize the track's color.
   - Changes the track header color, tick/label color, and deviation fill color.

## FEATURE 6: DEPTH MARKERS AND LABELS

**What you'll see:**
- Small horizontal lines (tick marks) extending from the right edge of the depth track into the canvas area, indicating precise depth points.
- Numeric depth values displayed next to each tick mark.
- The unit "m" (meters) explicitly shown, usually at the bottom of the track.
- All markers, labels, and the unit are color-coded according to the track's chosen color.

**Example:**
**MD Track (Blue):**