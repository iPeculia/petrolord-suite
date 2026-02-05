# Incomplete Features List

## Core Logic & Services

### Feature: PDF Report Generation
*   **File**: `src/services/wellCorrelation/reportGenerator.js`
*   **Status**: 10% (Stubbed)
*   **Missing**: Implementation of `jspdf` or `pdf-lib` to render cross-sections and tables to PDF.
*   **Priority**: High

### Feature: Dynamic Time Warping (DTW)
*   **File**: `src/services/wellCorrelation/correlationAssistant.js`
*   **Status**: 0% (Not started)
*   **Missing**: DTW algorithm for non-linear depth alignment matching.
*   **Priority**: Medium

### Feature: Advanced Integration
*   **File**: `src/services/wellCorrelation/integrationService.js`
*   **Status**: 20% (Mocked)
*   **Missing**: Actual API calls or Window messaging to `EarthModel Pro` and `Velocity Model Builder`.
*   **Priority**: Medium

## User Interface

### Feature: Track Configuration
*   **File**: `src/components/wellCorrelation/RightSidebar.jsx`
*   **Status**: 10% (Placeholder)
*   **Missing**: UI to reorder tracks, change individual curve colors/scales, and toggle fill patterns.
*   **Priority**: High

### Feature: Layer Management
*   **File**: `src/components/wellCorrelation/RightSidebar.jsx`
*   **Status**: 10% (Placeholder)
*   **Missing**: UI to manage ghost curves, flattened horizons, and other overlays.
*   **Priority**: Medium

### Feature: Marker Editor (Dedicated)
*   **File**: `N/A` (Missing Component)
*   **Status**: 0%
*   **Missing**: A dedicated modal or panel for bulk editing markers (renaming, changing colors globally). Currently handled partially via `QCPanel`.
*   **Priority**: Low

## Data & Persistence

### Feature: Project Persistence
*   **File**: `src/contexts/WellCorrelationContext.jsx`
*   **Status**: 30% (Local Storage only)
*   **Missing**: Integration with Supabase `projects`, `wells`, `curves` tables.
*   **Priority**: **Critical**

### Feature: Well Metadata Editing
*   **File**: `src/hooks/useWellCorrelation.js`
*   **Status**: 0%
*   **Missing**: Ability to edit well headers (KB, Location, Name) after import.
*   **Priority**: Medium