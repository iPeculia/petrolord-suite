# Phase 5 Detailed Implementation Plan

## Phase 5A: Core Functionality Completion

### Task 1: Right Sidebar - Track Config
-   **File**: `src/components/wellCorrelation/RightSidebar.jsx`
-   **Action**: Replace "Tracks" placeholder with a list of active tracks.
-   **Logic**: Allow changing curve color, line width, and scale (Log/Linear) via Context dispatch.

### Task 2: Right Sidebar - Layer Config
-   **File**: `src/components/wellCorrelation/RightSidebar.jsx`
-   **Action**: Replace "Layers" placeholder.
-   **Logic**: Toggle visibility of Markers, Horizons, and Ghost Curves.

### Task 3: PDF Report Generation
-   **File**: `src/services/wellCorrelation/reportGenerator.js`
-   **Action**: Implement `generatePDFReport`.
-   **Logic**: Use `html2canvas` on the `CorrelationPanel` or draw directly with `jspdf` to create a printable cross-section.

## Phase 5B: State Management & Persistence

### Task 1: Database Schema
-   **Action**: Create SQL migration for:
    -   `projects` (id, name, description, owner_id)
    -   `project_wells` (project_id, well_data_json)
    -   `markers` (project_id, well_id, depth, name)

### Task 2: Context Integration
-   **File**: `src/contexts/WellCorrelationContext.jsx`
-   **Action**: Replace `localStorage` calls with `supabase.from('...').select/insert`.
-   **Logic**: Add `fetchProjects`, `saveProject` async thunks.

## Phase 5C: Error Handling & Validation

### Task 1: Global Error Boundary
-   **File**: `src/components/wellCorrelation/WellCorrelationTool.jsx`
-   **Action**: Wrap internal components in a specific Error Boundary that allows resetting the tool state without reloading the page.

### Task 2: LAS Parser Worker
-   **File**: `src/workers/lasParser.worker.js` (New)
-   **Action**: Move parsing logic to a web worker to keep UI responsive during large file uploads.

## Phase 5D: Performance Optimization

### Task 1: Memoization
-   **Files**: `LogTrack.jsx`, `CorrelationWellTrack.jsx`
-   **Action**: Wrap exports in `React.memo`. Ensure props (arrays) are stable.

### Task 2: Canvas Rendering (Optional)
-   **File**: `LogTrack.jsx`
-   **Action**: If performance is poor with SVG/Recharts, implement a Canvas-based renderer for the log curves using the `HTML5 Canvas API`.