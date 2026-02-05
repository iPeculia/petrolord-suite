# PP-FG Codebase Analysis & Architecture Report

## 1. Data Flow Architecture
**Current State:**
- **Phase 1 (Load Data):** Data is ingested and stored via `usePhase1State`, which persists to `localStorage` key `ppfg_phase1_state`.
- **Phase 2-5 (Analysis):** Each phase has its own isolated state hook (`usePhase2State`, etc.) managing its specific logic and persistence.
- **Prognosis Tab (Final View):** Currently disconnected. It receives props from the main `PorePressureFracGradient.jsx` page, which was generating *mock* data (`sampleCurves`) rather than reading the actual user-processed data from Phases 1-5.
- **Issue:** Users complete the workflow in tabs, but the Prognosis tab remains empty or shows default data because the parent container isn't aggregating the real-time results from the child phases.

**Recommendation:**
- The parent `PorePressureFracGradient.jsx` must act as the "Single Source of Truth" aggregator. It should instantiate the state hooks for all phases to read their current data and pass this aggregated "Real Data" down to the `PrognosisTab`.

## 2. State Management & Persistence
- **Approach:** The application uses a decentralized state management strategy where each phase manages its own persistence via `localStorage`.
- **Pros:** Modular, survives page reloads, reduces complexity in the main component.
- **Cons:** Makes cross-phase dependency (e.g., Prognosis needing Phase 4 results) harder if the parent doesn't explicitly coordinate it.
- **Fix:** We have updated the main page to read from these hooks and pass the data down.

## 3. Prognosis Empty State Logic
- **Current Logic:** Checks if `data` (derived from Phase 4/5 inputs) is null.
- **Button Issue:** The "Start with Load Well Data" button had no `onClick` event handler attached, rendering it non-functional.
- **Fix:**
  1.  Wired the `onClick` event to the main page's tab navigation function.
  2.  Added a check to ensure `phase1Data` is present before prompting for Phase 2, etc.

## 4. QC & Reports Visualization
- **Requirement:** Users need to see what they are exporting.
- **Implementation:** Added a `LogViewer` component inside the `Phase6ExportIntegration` tab (specifically within the Report Preview area) to visualize the final merged dataset (GR, RES, PP, FG) before export.

## 5. Navigation & Validation
- **Logic:** Tab navigation is manual. "Next Step" buttons simply advance the active tab index.
- **Validation:** Each phase hook contains `isComplete` or validation logic (e.g., `nctResult.valid`).
- **Improvement:** The "Next" button in the main layout is now conditionally disabled or shows a tooltip if the current phase's critical data is missing (e.g., attempting to go to Phase 3 without an NCT trend from Phase 2).

## 6. Workflow Completion Detection
- **Detection Method:** We track a `completedSteps` array in the main component.
- **Refinement:** A step should only be marked "complete" if its corresponding data exists in the state (e.g., Phase 2 is complete only if `nctParams` are present in `usePhase2State`).

---
*This report accompanies the code fixes applied to `PorePressureFracGradient.jsx`, `PrognosisTab.jsx`, and `Phase6ExportIntegration.jsx`.*