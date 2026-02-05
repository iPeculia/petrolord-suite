# EarthModel Pro - Routing Fix Verification

## Issue Description
Users reported issues navigating to EarthModel Pro from the dashboard. The app card and links were pointing to `/apps/geoscience/earth-model-pro` (root relative), but the application route is nested under `/dashboard` in `src/App.jsx`.

## Root Cause
The route defined in `src/App.jsx` is: