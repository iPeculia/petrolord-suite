# Failed Tests Analysis

## Overview
*   **Total Failures**: 20
*   **Severity Distribution**:
    *   Critical: 0
    *   Major: 5
    *   Minor: 15

## Detailed Breakdown

1.  **Training Quiz Timer (Major)**
    *   *Reason*: Timer drift on background tab.
    *   *Status*: Fix Pending (Switching to Web Workers).

2.  **Grid Rendering (Major)**
    *   *Reason*: Timeout on grids > 10M cells in test env.
    *   *Status*: Fix Pending (Optimizing LOD logic for tests).

3.  **Theme Flicker (Minor)**
    *   *Reason*: FOUC on hard refresh.
    *   *Status*: Fixed in dev branch (Added blocking script in head).

4.  **Toast Overflow (Minor)**
    *   *Reason*: 5+ toasts obscure mobile nav.
    *   *Status*: Fixed (Limited stack to 3 on mobile).

5.  **Log Export Alignment (Minor)**
    *   *Reason*: CSV export header misalignment by 1 char.
    *   *Status*: Fixed.

## Resolution Plan
*   All minor UI issues are patched.
*   Major timing/performance issues are scheduled for Sprint 4.2 cleanup.