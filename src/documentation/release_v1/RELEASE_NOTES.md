# Release Notes - v1.0.0

**Release Date:** 2025-11-28

## 🚀 Launch
We are proud to announce the General Availability (GA) of EarthModel Studio v1.0. This release marks the completion of our foundational roadmap.

## ✨ Key Features
*   **Full Subsurface Suite**: 3D, Map, and Section views are fully operational.
*   **AI Integrations**: Machine Learning Studio is now available for all Enterprise users.
*   **Mobile Support**: The application is fully responsive and PWA-capable.
*   **Collaboration**: Real-time cursors and chat enable synchronous team workflows.

## 🛠️ Improvements
*   **Performance**: Well log rendering engine rewritten for 10x speedup on large datasets.
*   **UI/UX**: Unified design system based on Tailwind/Shadcn for consistent experience.
*   **Security**: Enhanced RLS policies and audit logging implementation.

## 🐛 Bug Fixes
*   Fixed Z-fighting issues in 3D transparency rendering.
*   Resolved race conditions in WebSocket reconnection logic.
*   Corrected projection errors in Map View export.

## ⚠️ Known Issues
*   Very large seismic volumes (>5GB) may experience latency during initial tile generation.
*   Safari on iOS has limited WebGL memory, potentially affecting complex 3D scenes.