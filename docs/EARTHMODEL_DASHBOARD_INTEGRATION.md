# EarthModel Pro - Dashboard Integration Guide

## Overview
This document details the integration of **EarthModel Pro** into the main application dashboard and navigation system.

## Integration Points

### 1. Geoscience Analytics Hub
- **File**: `src/pages/dashboard/GeoscienceAnalytics.jsx`
- **Category**: Structural
- **Status**: Active
- **Action**: Added to `apps` array with `Cuboid` icon and navigation path `/dashboard/apps/geoscience/earth-model-pro`.

### 2. Global App Registry
- **File**: `src/data/applications.js`
- **Module**: Geoscience & Analytics
- **Action**: Added entry to `apps` array under `geoscience` category. This ensures the app appears in global search and app listings. The `route` property is explicitly set to `/dashboard/apps/geoscience/earth-model-pro`.

### 3. Geoscience Hub Landing Page
- **File**: `src/pages/apps/GeoscienceHub.jsx`
- **Action**: Added a dedicated `AppCard` for quick access from the hub landing page using correct routing.

### 4. Configuration & Metadata
- **File**: `src/config/apps/earthmodel-pro-metadata.js`
- **Description**: Centralized metadata file containing app details, features, and version info.
- **Key Property**: `route` is set to `/dashboard/apps/geoscience/earth-model-pro`.

### 5. Components
- **File**: `src/components/dashboard/apps/EarthModelProCard.jsx`
- **Description**: A reusable React component for displaying the EarthModel Pro card in various dashboard contexts. It uses `useNavigate` to perform client-side navigation without full page reloads.

## Verification Checklist

- [x] **Dashboard Visibility**: Navigate to `/dashboard/geoscience`. Select "Structural" filter. "EarthModel Pro" card should be visible.
- [x] **Navigation**: Clicking the "Open" or "Launch" button on the card should navigate to `/dashboard/apps/geoscience/earth-model-pro`.
- [x] **Metadata**: Hovering or viewing details should show correct description and feature list.
- [x] **Global Registry**: App should be discoverable via the global app mechanism.
- [x] **Responsive Design**: Card should display correctly on mobile and desktop.

## Troubleshooting

**Issue**: App not appearing in dashboard?
- **Fix**: Ensure `GeoscienceAnalytics.jsx` was updated with the new object in the `apps` array. Clear browser cache if necessary.

**Issue**: Navigation 404?
- **Fix**: Verify `src/App.jsx` has the correct route definition: `<Route path="apps/geoscience/earth-model-pro" ... />` nested under `/dashboard`.

**Issue**: Redirects to Homepage?
- **Fix**: Ensure the path matches exactly `/dashboard/apps/geoscience/earth-model-pro`. A missing `/dashboard` prefix usually triggers the auth guard or 404 redirect logic.