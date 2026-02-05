# Well Creation Guide

## Overview
Adding wells is a fundamental operation in EarthModel Pro. This guide outlines the process, security requirements, and troubleshooting steps.

## Step-by-Step Guide
1.  **Open Project:** Ensure you have an active project selected in EarthModel Pro.
2.  **Navigate to Wells:** Go to the "Data Management" or "Wells" section in the sidebar.
3.  **Click Add Well:** Select the "Add Well" button.
4.  **Fill Details:** Enter the Well Name (required) and coordinates (optional).
5.  **Save:** Click "Save".

## Security Requirements
-   **Authentication:** You must be logged in.
-   **Ownership:** The well will be assigned to you (`user_id`) and linked to the active project (`project_id`).
-   **RLS Policy:** You can only insert wells where `user_id` matches your account ID.

## Error Handling
If you encounter an error:
-   **"Violates row-level security policy":** This usually means the system failed to attach your User ID to the request. Refresh the page and try again. If the issue persists, contact support.
-   **"Project ID missing":** Ensure a project is active before adding a well.

## Best Practices
-   Use unique names for wells within a project.
-   Verify coordinate systems (CRS) before manual entry.
-   For bulk imports, use the CSV importer which handles batch RLS validation.