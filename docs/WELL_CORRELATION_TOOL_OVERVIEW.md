# Well Correlation Tool - Project Overview

## Introduction
The **Well Correlation Tool** is a specialized application within the Geoscience Analytics Hub designed to facilitate the stratigraphic and structural correlation of well logs. It allows geoscientists to visualize multiple well logs side-by-side, pick horizons/markers, and interpret geological connectivity.

## Key Objectives
1.  **Visualization**: High-performance rendering of well logs (Gamma Ray, Resistivity, etc.) in vertical tracks.
2.  **Correlation**: Interactive tools to draw correlation lines (horizons) between wells.
3.  **Data Integration**: Seamless import of LAS files and export of correlation data.
4.  **Usability**: A modern, responsive interface comparable to desktop industry software.

## Architecture
- **Frontend**: React 18 with Vite.
- **State Management**: React Context + Hooks.
- **UI Library**: shadcn/ui + TailwindCSS.
- **Visualization**: HTML5 Canvas / SVG (Planned for Phase 2).

## Core Modules
1.  **Project Manager**: Handles meta-data, autosave, and file I/O.
2.  **Well Data Handler**: Parses and normalizes well log data (depth matching, unit conversion).
3.  **Correlation Engine**: Manages the geometric relationships between wells and horizons.
4.  **Layout Engine**: Controls the visual arrangement of tracks and panels.

## User Flow
1.  User enters via **Geoscience Analytics Hub**.
2.  User creates a **New Project** or opens an existing one.
3.  User adds **Wells** to the project from the database.
4.  User configures **Tracks** (which logs to show, scales, colors).
5.  User picks **Tops/Markers** on the canvas.
6.  User exports the results (PDF, CSV).