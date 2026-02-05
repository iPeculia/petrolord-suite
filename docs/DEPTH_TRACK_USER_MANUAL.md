# DEPTH TRACK SYSTEM - USER MANUAL
- Date: 2025-12-06
- Status: COMPLETE ✅

## QUICK START GUIDE

**Getting Started with Depth Tracks:**

1. Open Well Correlation Tool
2. Select a demo well (Well-01 to Well-05)
3. Click "Add Track" button in TrackConfiguration panel
4. Select depth track type:
   - Depth Track - MD (Measured Depth)
   - Depth Track - TVD (True Vertical Depth)
   - Depth Track - TVDSS (True Vertical Depth Sub-Sea)
5. Depth track appears in well view
6. Configure settings in depth track panel

## DEPTH TRACK TYPES EXPLAINED

### A. MD (Measured Depth) - Blue Track
   **What is it?**
   - Actual distance along the wellbore
   - Starts at 0 at the surface
   - Increases as you go deeper
   
   **When to use:**
   - Well planning and design
   - Drilling operations
   - Casing and tubing design
   - Completion design
   
   **Example:**
   - Vertical well: MD = TVD (same values)
   - Deviated well: MD > TVD (MD is longer)
   - Horizontal well: MD >> TVD (much longer)
   
   **Color:** Blue (#3B82F6)
   **Units:** meters (m)

### B. TVD (True Vertical Depth) - Green Track
   **What is it?**
   - Vertical distance from surface to point
   - Starts at 0 at the surface
   - Increases as you go deeper vertically
   
   **When to use:**
   - Pressure calculations
   - Fluid contact identification
   - Hydrocarbon column height
   - Regional correlation
   
   **Example:**
   - Vertical well: TVD = MD (same values)
   - Deviated well: TVD < MD (shorter than MD)
   - Horizontal well: TVD << MD (much shorter)
   
   **Color:** Green (#10B981)
   **Units:** meters (m)

### C. TVDSS (True Vertical Depth Sub-Sea) - Purple Track
   **What is it?**
   - TVD measured below sea level
   - Negative values above sea level
   - Positive values below sea level
   - Sea level reference: -1000m
   
   **When to use:**
   - Seismic interpretation
   - Regional correlation
   - Pressure prediction
   - Fluid contact identification
   
   **Example:**
   - Above sea level: -1000 to 0 (negative)
   - Below sea level: 0 to 2500 (positive)
   - Sea level reference line shown in red
   
   **Color:** Purple (#A855F7)
   **Units:** meters (m)
   **Sea Level Reference:** Red line at -1000m

## DEPTH TRACK CONTROLS

### A. Adding a Depth Track
   Step 1: Click "Add Track" button
   Step 2: Select track type from dropdown
   Step 3: Choose depth type:
           - Depth Track - MD
           - Depth Track - TVD
           - Depth Track - TVDSS
   Step 4: Click to add
   Step 5: Depth track appears in well view

### B. Depth Interval Slider
   **What it does:**
   - Controls spacing between depth markers
   - Range: 100m to 1000m
   - Default: 500m
   
   **How to use:**
   1. Find "Depth Interval" slider in settings
   2. Drag slider left (smaller intervals) or right (larger intervals)
   3. Depth markers update in real-time
   4. Smaller intervals = more markers (more detail)
   5. Larger intervals = fewer markers (cleaner view)

### C. Show/Hide Depth Labels
   **What it does:**
   - Shows or hides depth value labels
   
   **How to use:**
   1. Find "Show Depth Labels" toggle
   2. Click to toggle on/off
   3. Labels appear/disappear in depth track

### D. Show/Hide Depth Grid
   **What it does:**
   - Shows or hides horizontal grid lines
   
   **How to use:**
   1. Find "Show Depth Grid" toggle
   2. Click to toggle on/off
   3. Grid lines appear/disappear in depth track

### E. Show/Hide Sea Level Reference (TVDSS only)
   **What it does:**
   - Shows or hides red line at sea level
   - Only available for TVDSS tracks
   
   **How to use:**
   1. Find "Show Sea Level Reference" toggle
   2. Click to toggle on/off
   3. Red line appears/disappears at -1000m

### F. Show/Hide Deviation Angle
   **What it does:**
   - Shows or hides deviation angle visualization
   
   **How to use:**
   1. Find "Show Deviation Angle" toggle
   2. Click to toggle on/off
   3. Deviation angle appears/disappears

### G. Show/Hide Well Trajectory
   **What it does:**
   - Shows or hides well trajectory visualization
   
   **How to use:**
   1. Find "Show Well Trajectory" toggle
   2. Click to toggle on/off
   3. Well trajectory appears/disappears

### H. Depth Color Picker
   **What it does:**
   - Allows customization of depth track color
   
   **How to use:**
   1. Find "Depth Color" picker
   2. Click to open color selector
   3. Choose desired color
   4. Track color updates

## DEMO WELLS DEPTH DATA

**Well-01: Vertical Well**
- MD: 0 to 3500m (straight down)
- TVD: 0 to 3500m (same as MD)
- TVDSS: -1000 to 2500m
- Deviation: 0-5 degrees (nearly vertical)
- Trajectory: Straight vertical line
- MD/TVD Ratio: 1.0 (equal)

**Well-02: Slightly Deviated Well**
- MD: 0 to 3800m (slightly curved)
- TVD: 0 to 3500m (shorter than MD)
- TVDSS: -1000 to 2500m
- Deviation: 5-15 degrees (slight angle)
- Trajectory: Slight curve
- MD/TVD Ratio: 1.09 (9% longer)

**Well-03: Moderately Deviated Well**
- MD: 0 to 4200m (noticeably curved)
- TVD: 0 to 3500m (shorter than MD)
- TVDSS: -1000 to 2500m
- Deviation: 15-35 degrees (moderate angle)
- Trajectory: Moderate curve
- MD/TVD Ratio: 1.20 (20% longer)

**Well-04: Highly Deviated Well**
- MD: 0 to 5000m (significantly curved)
- TVD: 0 to 3500m (much shorter than MD)
- TVDSS: -1000 to 2500m
- Deviation: 35-60 degrees (steep angle)
- Trajectory: Significant curve
- MD/TVD Ratio: 1.43 (43% longer)

**Well-05: Horizontal Well**
- MD: 0 to 6000m (very long)
- TVD: 0 to 3500m (much shorter than MD)
- TVDSS: -1000 to 2500m
- Deviation: 60-90 degrees (nearly horizontal)
- Trajectory: Nearly horizontal
- MD/TVD Ratio: 1.71 (71% longer)

## INTERPRETING DEPTH TRACKS

### A. Understanding MD vs TVD
   **Vertical Well:**
   - MD and TVD are the same
   - Well goes straight down
   - No deviation
   
   **Deviated Well:**
   - MD is longer than TVD
   - Well curves as it goes down
   - Deviation angle increases with depth
   
   **Horizontal Well:**
   - MD is much longer than TVD
   - Well curves significantly
   - Deviation angle approaches 90 degrees

### B. Understanding TVDSS
   **Above Sea Level:**
   - TVDSS values are negative
   - Example: -1000m to 0m
   - Shown above the red sea level line
   
   **Below Sea Level:**
   - TVDSS values are positive
   - Example: 0m to 2500m
   - Shown below the red sea level line
   
   **Sea Level Reference:**
   - Red line at -1000m
   - Marks the sea level
   - Helps identify above/below sea level

### C. Understanding Deviation Angle
   **What it shows:**
   - Angle from vertical
   - 0 degrees = vertical well
   - 90 degrees = horizontal well
   
   **How to interpret:**
   - 0-5 degrees: Nearly vertical
   - 5-15 degrees: Slightly deviated
   - 15-35 degrees: Moderately deviated
   - 35-60 degrees: Highly deviated
   - 60-90 degrees: Horizontal

## COMMON USE CASES

### A. Well Planning
   **Use:** MD depth track
   **Why:** Shows actual wellbore length
   **Example:** Plan casing and tubing sizes

### B. Pressure Calculations
   **Use:** TVD depth track
   **Why:** Pressure depends on vertical depth
   **Example:** Calculate pore pressure at depth

### C. Seismic Interpretation
   **Use:** TVDSS depth track
   **Why:** Seismic data is in TVDSS
   **Example:** Correlate well logs with seismic

### D. Fluid Contact Identification
   **Use:** TVD or TVDSS depth track
   **Why:** Fluid contacts are at specific depths
   **Example:** Identify oil-water contact

### E. Regional Correlation
   **Use:** TVDSS depth track
   **Why:** Regional data is in TVDSS
   **Example:** Correlate wells across region

### F. Deviated Well Analysis
   **Use:** All three depth tracks
   **Why:** Compare MD, TVD, and TVDSS
   **Example:** Analyze well trajectory

## TIPS AND TRICKS

**Tip 1: Use Multiple Depth Tracks**
- Add all three depth track types
- Compare MD, TVD, and TVDSS
- Better understanding of well geometry

**Tip 2: Adjust Depth Interval**
- Use smaller intervals (100m) for detail
- Use larger intervals (1000m) for overview
- Adjust based on your needs

**Tip 3: Use Sea Level Reference**
- Helps identify above/below sea level
- Important for TVDSS interpretation
- Red line is easy to spot

**Tip 4: Compare with Log Tracks**
- Add log tracks alongside depth tracks
- See logs at correct depths
- Better interpretation

**Tip 5: Use Deviation Angle**
- Shows well trajectory
- Helps understand well geometry
- Important for deviated wells

**Tip 6: Use Well Trajectory**
- Visual representation of well path
- Helps understand well geometry
- Important for deviated wells

## TROUBLESHOOTING

**Q: Depth values don't look right**
A: Check that you selected the correct depth type
   Verify well data is loaded
   Check sea level reference for TVDSS

**Q: Sea level reference line not showing**
A: Make sure you're using TVDSS depth track
   Check "Show Sea Level Reference" toggle
   Verify sea level value is set correctly

**Q: Depth labels are overlapping**
A: Increase depth interval (use slider)
   Decrease font size in settings
   Increase track width

**Q: Deviation angle not showing**
A: Check "Show Deviation Angle" toggle
   Verify well has deviation data
   Check well trajectory data

**Q: Performance is slow**
A: Reduce number of depth tracks
   Increase depth interval
   Disable deviation angle visualization
   Disable well trajectory visualization

## KEYBOARD SHORTCUTS

**Coming Soon:**
- Ctrl+D: Add depth track
- Ctrl+M: Add MD track
- Ctrl+T: Add TVD track
- Ctrl+S: Add TVDSS track
- Ctrl+Z: Undo
- Ctrl+Y: Redo

## ACCESSIBILITY

**Keyboard Navigation:**
✅ Tab through controls
✅ Enter to activate buttons
✅ Arrow keys for sliders
✅ Space to toggle switches

**Screen Reader Support:**
✅ ARIA labels on all controls
✅ Descriptive button text
✅ Form labels
✅ Error messages

**Color Contrast:**
✅ All text meets WCAG AA standards
✅ Color not only means of identification
✅ Sufficient contrast ratios

## SUPPORT AND FEEDBACK

**Having issues?**
- Check troubleshooting section
- Review demo wells
- Check documentation
- Contact support team

**Have suggestions?**
- Share feedback with team
- Suggest new features
- Report bugs
- Help improve the tool

## CONCLUSION

The Depth Track system provides professional depth visualization
with support for MD, TVD, and TVDSS depth types. Use this manual
to understand and effectively use the depth track features.

For more information, see:
- DEPTH_TRACK_SYSTEM_DOCUMENTATION.md
- DEPTH_TRACK_IMPLEMENTATION_VERIFICATION.md
- COMPLETE_TRACK_SYSTEM_SUMMARY.md