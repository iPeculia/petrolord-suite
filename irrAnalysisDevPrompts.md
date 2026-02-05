# IRR Analysis Application Development Guide

This document outlines the comprehensive development plan for the Internal Rate of Return (IRR) Analysis application within the Petrolord ecosystem. It is divided into 8 distinct phases to ensure a structured, iterative development process.

---

## Phase 1: Database Schema & Data Models

**Objective:** Establish the foundational data structures required to store project details, temporal cashflow data, financial parameters, and analysis results.

**Technical Requirements:**
- Define TypeScript/JSDoc interfaces for all core entities.
- Create Supabase SQL migration for new tables (e.g., `irr_projects`, `irr_cashflows`, `irr_scenarios`).
- Establish relationships between Projects, Scenarios, and Results.

**Data Structures (JSON Example):**

*Project & Financial Model:*