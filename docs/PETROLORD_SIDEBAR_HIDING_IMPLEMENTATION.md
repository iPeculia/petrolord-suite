# Sidebar Hiding Implementation Guide

## Overview
This document outlines the new Sidebar Hiding System implemented for the Petrolord platform. This system allows specific applications (like EarthModel Pro, Mechanical Earth Model) to utilize the full screen real estate by automatically hiding the main dashboard sidebar when active.

## Architecture
The system is built on a Context-Provider pattern:

1.  **ApplicationContext**: Stores the global state of whether the user is currently "in an application".
2.  **SidebarVisibilityController**: A headless component that monitors route changes. It checks the current path against a registry of known application routes. If a match is found, it automatically triggers "Application Mode".
3.  **DashboardLayout**: Consumes the context. If "Application Mode" is active, it conditionally stops rendering the Sidebar component and expands the main content area to full width.
4.  **Hooks**: `useApplicationMode` allows components to manually enter/exit this mode if needed.

## Configuration
To register a new application for sidebar hiding, add it to `src/config/applicationRoutes.js`: