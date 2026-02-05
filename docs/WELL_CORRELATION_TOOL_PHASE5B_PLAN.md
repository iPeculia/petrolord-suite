# Phase 5B: State Management & Persistence - DETAILED PLAN

## Phase 5B: State Management & Persistence

### Objectives
*   Implement robust state management capable of handling large datasets.
*   Implement reliable localStorage persistence for session recovery.
*   Implement comprehensive data validation during state transitions.
*   Implement error recovery mechanisms for corrupted state.
*   Ensure data consistency across application components.
*   Ensure referential integrity between Wells, Markers, and Horizons.

### Scope
*   Update `WellCorrelationContext` to handle edge cases and large arrays.
*   Implement a persistence layer abstraction.
*   Add data validation utilities for state hydration.
*   Implement a recovery strategy for failed loads.
*   Add mechanisms for state synchronization.
*   Add periodic data consistency checks.

### Deliverables
*   ✅ Complete `WellCorrelationContext` with optimized reducers.
*   ✅ `localStorage` persistence layer.
*   ✅ Data validation schemas (Zod or custom).
*   ✅ Error recovery UI/UX.
*   ✅ State synchronization logic.
*   ✅ Data consistency check utilities.
*   ✅ Tests for state management logic.
*   ✅ Documentation for state architecture.

### Tasks

#### Task 5B.1: Complete WellCorrelationContext
*   **Subtasks**:
    -   Refine reducer actions for atomic updates.
    -   Implement `dispatch` middleware for logging and side effects.
    -   Optimize state structure for shallow comparison.
    -   Implement derived state selectors (using `useMemo`).
    -   Add performance logging for state updates.

#### Task 5B.2: Implement localStorage Persistence
*   **Subtasks**:
    -   Create `PersistenceService` to handle serialization/deserialization.
    -   Implement debounced saving to `localStorage` to prevent blocking.
    -   Implement load strategy with version checking.
    -   Handle `localStorage` quota exceeded errors.
    -   Implement data migration strategy for schema changes.

#### Task 5B.3: Implement Data Validation
*   **Subtasks**:
    -   Create validation functions for Well objects.
    -   Create validation for Marker and Horizon relationships.
    -   Create validation for Project metadata.
    -   Validate Correlation Panel configurations.
    -   Integrate validation into the hydration process.

#### Task 5B.4: Implement Error Recovery
*   **Subtasks**:
    -   Detect corrupted state during load.
    -   Implement "Safe Mode" load (loading only verified data).
    -   Provide UI options to reset state or attempt repair.
    -   Log corruption events for diagnosis.

#### Task 5B.5: Add State Synchronization
*   **Subtasks**:
    -   Ensure all views (Map, Correlation, List) reflect state changes instantly.
    -   Handle potential race conditions in async operations (e.g., parsing).
    -   (Optional) BroadcastChannel for multi-tab sync (if required).

#### Task 5B.6: Add Data Consistency Checks
*   **Subtasks**:
    -   Verify all Markers belong to existing Wells.
    -   Verify all Markers reference existing Horizons.
    -   Check for orphan data entries.
    -   Provide a consistency report utility.

#### Task 5B.7: Create Tests
*   **Subtasks**:
    -   Unit tests for reducers and actions.
    -   Integration tests for persistence save/load cycles.
    -   Test validation logic against invalid payloads.
    -   Test error recovery flows.

#### Task 5B.8: Create Documentation
*   **Subtasks**:
    -   Document the State Schema.
    -   Document Action Types and payloads.
    -   Document Persistence strategy and limitations.
    -   Document recovery procedures for users.

### Timeline
*   **Duration**: 2-3 weeks
*   **Priority**: High
*   **Dependencies**: Phase 5A (completed)