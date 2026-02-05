# PP–FG Analyzer: Comprehensive Phased Upgrade Plan

## Executive Summary
This document outlines the strategic roadmap for evolving the **Petrolord Pore Pressure & Fracture Gradient (PP–FG) Analyzer** from a static calculation tool into an industry-leading, interactive, probabilistic, and real-time well safety platform. The plan is structured into 8 distinct phases, ensuring robust foundational data handling before advancing to complex AI-driven and real-time capabilities.

---

## PHASE 0: Foundation - Current State Assessment & Technical Debt
**Objective:** Stabilize the existing codebase, audit calculation engines for accuracy against textbook standards, and establish a robust testing framework.

*   **Objectives:**
    *   Audit `src/utils/ppfgEngine.js` for edge cases (e.g., missing log data, divide-by-zero).
    *   Verify Eaton and Matthews-Kelly implementations against known industry datasets (e.g., Gulf of Mexico, North Sea).
    *   Standardize component styling to strict Petrolord Dark Theme.
*   **Key Features:**
    *   Unit Test Suite for Engine functions.
    *   Code refactoring for modularity.
    *   Performance profiling of current chart rendering.
*   **UI/UX Enhancements:**
    *   Consistent loading states.
    *   Unified color palette for pressure curves (PP=Blue, FG=Red, OBG=Gray).
*   **Technical Implementation:**
    *   Jest/Vitest setup for `ppfgEngine`.
    *   Review React Context performance (`StudioContext`).
*   **Dependencies:** None.
*   **Success Metrics:** 100% Pass rate on unit tests; <200ms initial render time.

---

## PHASE 1: Robust Input System
**Objective:** Build a bulletproof data ingestion layer capable of handling messy real-world data (LAS files, Excel tables, WITSML streams).

*   **Objectives:**
    *   Implement robust LAS 2.0/3.0 parsing with error recovery.
    *   Auto-detect log mnemonics (e.g., alias `DT`, `DTCO`, `AC` to Sonic).
    *   Intelligent Unit Conversion engine.
*   **Key Features:**
    *   **Drag-and-Drop Data Loader:** Supports LAS, CSV, DLIS.
    *   **Data QC Dashboard:** Visual histogram checks, null value handling, outlier removal.
    *   **Curve Stitching:** Merge multiple runs (e.g., LWD + Wireline).
*   **UI/UX Enhancements:**
    *   Wizard-based import flow (`RobustInputWizard`).
    *   Traffic light system for data quality (Green=Good, Red=Critical Gaps).
*   **Data Flow:** User Upload -> Web Worker Parser -> QC & Normalization -> Redux/Context Store.
*   **Estimated Complexity:** Medium.
*   **Dependencies:** `src/utils/las-parser.js`.
*   **Success Metrics:** Successfully parse 95% of sample LAS files without user intervention.

---

## PHASE 2: Step-by-Step Analysis Workflow
**Objective:** Guide users through the logical geological workflow of pore pressure prediction to ensure geological consistency.

*   **Objectives:**
    *   Enforce order: Overburden -> NCT -> Pore Pressure -> Fracture Gradient.
    *   Prevent calculation of FG before PP is calibrated.
*   **Key Features:**
    *   **Overburden Integrator:** Variable water depth, air gap, density extrapolation (Amoco, Miller).
    *   **NCT Picker:** Interactive semi-log plot to pick Normal Compaction Trend lines in clean shale points.
    *   **Method Selector:** Choose between Eaton (Sonic/Res/Dx), Bowers (Velocity), Holbrook.
*   **UI/UX Enhancements:**
    *   "Next Step" guided navigation.
    *   Sidebar checklist showing completion status of each stage.
*   **Technical Implementation:**
    *   State machine for workflow stages.
    *   Intermediate result caching.
*   **Data Flow:** Inputs -> Step 1 Calc -> Step 1 Review -> Step 2 Input...
*   **Estimated Complexity:** High.
*   **Success Metrics:** User completion rate > 90% without "Help" clicks.

---

## PHASE 3: Interactive Parameter Tuning
**Objective:** Transform static charts into interactive canvases where engineers can "touch" the data to calibrate models.

*   **Objectives:**
    *   Allow visual dragging of NCT lines.
    *   Allow visual dragging of Eaton Exponent / Bowers Parameters to match calibration points (LOT/RFT).
*   **Key Features:**
    *   **Interactive Charts:** Drag markers to adjust `N` exponent dynamically.
    *   **Calibration Lock:** "Pin" model to specific RFT points.
    *   **Undo/Redo Stack:** Experiment safely with parameters.
*   **UI/UX Enhancements:**
    *   Instant visual feedback (charts update @ 60fps while dragging).
    *   Split-screen view: Parameter sliders vs. Result Log.
*   **Technical Implementation:**
    *   Heavy use of D3.js or optimized Recharts with custom cursor handling.
    *   Debounced calculation updates.
*   **Dependencies:** Phase 2 completion.
*   **Success Metrics:** Model calibration time reduced by 50% compared to manual input typing.

---

## PHASE 4: Advanced Probabilistic Engine
**Objective:** Move beyond deterministic "single line" prognosis to full Quantitative Risk Assessment (QRA) using Monte Carlo simulation.

*   **Objectives:**
    *   Quantify uncertainty in input logs, correlations, and parameters.
    *   Generate P10/P50/P90 profiles for PP and FG.
*   **Key Features:**
    *   **Uncertainty Definition:** Assign distributions (Normal, Triangular) to NCT slope, Eaton N, Matrix Density.
    *   **Monte Carlo Runner:** Client-side (Web Worker) or Server-side execution of 10,000+ realizations.
    *   **Kick/Loss Risk Maps:** Probability of kick vs. depth.
*   **UI/UX Enhancements:**
    *   "Fan Charts" or "Tornado Plots" for sensitivity analysis.
    *   Confidence interval shading on main log tracks.
*   **Data Flow:** Inputs + Distributions -> MC Engine -> Statistical Aggregator -> Visualization.
*   **Estimated Complexity:** Very High.
*   **Success Metrics:** Computation of 1,000 iterations in < 5 seconds.

---

## PHASE 5: Multi-Well Comparison & Dashboards
**Objective:** Leverage offset well data to improve prediction accuracy in new prospects.

*   **Objectives:**
    *   Overlay offset well pressures onto the current prognosis.
    *   Map regional pressure trends (centroid depths, overpressure tops).
*   **Key Features:**
    *   **Offset Well Selector:** Search database by radius/basin.
    *   **Correlation Panel:** Flatten on stratigraphic tops to compare pressure ramps.
    *   **Basin Master Chart:** Cross-plot Effective Stress vs. Velocity for regional trend establishment.
*   **UI/UX Enhancements:**
    *   Ghost curves for offset wells.
    *   Map view integration (`leaflet` or `maplibre`).
*   **Technical Implementation:**
    *   Spatial queries in Supabase (PostGIS).
    *   Multi-series charting performance optimization.
*   **Estimated Complexity:** High.
*   **Success Metrics:** Ability to load and display 5 offset wells simultaneously without lag.

---

## PHASE 6: Export & Integration
**Objective:** Seamlessly integrate results into the wider drilling workflow (Well Planning, Casing Design, Reporting).

*   **Objectives:**
    *   Generate "Drilling Engineer Ready" outputs.
    *   Direct feed into Casing Seat selection and Mud Weight Window modules.
*   **Key Features:**
    *   **Prognosis Pack Generator:** One-click PDF report with all standard charts and risk registers.
    *   **LAS Export:** Write calculated curves (PP, FG, OBG) to standard LAS files.
    *   **API Webhooks:** Push results to corporate data lakes.
*   **UI/UX Enhancements:**
    *   Report Preview Mode with customizable headers/logos.
    *   Export Format selector.
*   **Data Flow:** Final State -> Formatter -> File Generation (Client-side PDF/Blob).
*   **Estimated Complexity:** Medium.
*   **Success Metrics:** Generated reports accepted by Drilling Superintendents.

---

## PHASE 7: Field Deployment & Optimization
**Objective:** Enable Real-Time Operations (RTO) usage and mobile access for decision-making at the rig site.

*   **Objectives:**
    *   Connect to WITSML live streams for "While Drilling" updates.
    *   Optimize for low-bandwidth rig connections.
*   **Key Features:**
    *   **LWD Real-Time Update:** Auto-recalculate PP/FG as new LWD data arrives.
    *   **Mobile Companion App:** View current PP/FG window on tablet.
    *   **Alarm System:** Notifications when ESD (Equivalent Static Density) approaches FG limit.
*   **UI/UX Enhancements:**
    *   "Live Mode" dashboard toggle.
    *   Offline caching (PWA capabilities).
*   **Technical Implementation:**
    *   WebSocket connections for real-time data.
    *   Service Workers for offline capabilities.
*   **Estimated Complexity:** Very High.
*   **Success Metrics:** Latency < 2s from bit to screen.

---