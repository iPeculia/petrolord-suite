# Artificial Lift Design Application Development Guide

This document outlines the comprehensive development plan for the Artificial Lift Design application within the Petrolord ecosystem. It is divided into 8 distinct phases to ensure a structured, iterative development process.

---

## Phase 1: Database Schema & Data Models

**Objective:** Establish the foundational data structures required to store well configurations, reservoir properties, equipment catalogs, and lift design parameters.

**Technical Requirements:**
- Define TypeScript/JSDoc interfaces for all core entities.
- Create Supabase SQL migration for new tables (e.g., `ald_projects`, `ald_wells`, `ald_designs`, `ald_equipment_catalog`).
- Establish relationships between Projects, Wells, and specific Lift Designs (ESP, Gas Lift, Rod Pump).

**Data Structures (JSON Example):**

*Well & Reservoir Model:*