# Petroleum Economics Studio

## Overview
The Petroleum Economics Studio is a comprehensive economic evaluation tool for upstream oil and gas projects. It provides a robust environment for modeling cashflows, analyzing fiscal regimes, running sensitivities, and generating investment-grade reports.

## Key Features
-   **Economic Modeling**: Deterministic cashflow generation based on production profiles, costs, and price decks.
-   **Scenario Management**: Create, clone, compare, and lock scenarios (Base, High, Low, etc.).
-   **Fiscal Regime Designer**: Support for Concessionary (Royalty/Tax) and Production Sharing Contracts (PSC).
-   **Sensitivity Analysis**: Automated Tornado charts for Price, CAPEX, OPEX, and Production sensitivities.
-   **Reconciliation**: Compare internal models against external CSV/Excel datasets.
-   **Integrations**: Direct snapshots to FDP Accelerator and AFE/Cost Control modules.
-   **Governance**: Full audit trail of changes and approval workflows.

## User Guide

### 1. Getting Started
-   **Create Project**: Start by creating a project container in the "Projects" view.
-   **Load Template**: Use the "Quick Start" templates (Simple Well or Full FDP) to populate initial data.

### 2. Workflow
1.  **Setup**: Define start year, currency, and discount rate.
2.  **Production**: Input or import yearly production rates for Oil, Gas, and Condensate.
3.  **Costs**: Enter CAPEX and OPEX profiles.
4.  **Fiscal**: Configure the tax regime (Royalties, Tax Rate, Cost Recovery limits).
5.  **Calculate**: The model auto-calculates NPV, IRR, and Payback on every change.
6.  **Analyze**: Use the Dashboard for KPI viz and Cashflow tab for detailed tables.

### 3. Comparison & Sensitivity
-   Go to the **Scenarios** tab to compare multiple cases side-by-side.
-   Use **Sensitivity** tab to run One-Factor-At-A-Time (OFAT) analysis.

### 4. Reporting
-   **Reporting Tab**: Add narrative notes to key sections.
-   **Export Tab**: Generate PDF reports or Excel dumps of the full model.

## Troubleshooting

### Calculation Issues
-   **Negative NPV?** Check if CAPEX is too high relative to Production/Price.
-   **IRR fails?** Ensure there is at least one positive cashflow year.

### Data Saving
-   The app saves automatically 1 second after the last edit.
-   Look for the "Saved" indicator in the top right.

### Export Failures
-   Ensure you have an active scenario loaded.
-   Pop-up blockers may prevent file downloads.

## Tech Stack
-   **Frontend**: React, TailwindCSS, Recharts, Framer Motion
-   **Backend**: Supabase (PostgreSQL + RLS)
-   **Calculations**: Client-side JavaScript engine (src/utils/petroleumEconomicsEngine.js)