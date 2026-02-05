# Quick Fix: Well Security Policy Error

## The Problem
Users encountered a red error toast stating **"new row violates row-level security policy for table 'em_wells'"** when attempting to add a new well. This was caused by the application attempting to insert a record without explicitly assigning ownership to the current user.

## The Solution
We have deployed a patch that:
1.  **Auto-Assigns Ownership:** The application now automatically attaches your unique User ID to any well you create.
2.  **Updates Permissions:** The database rules have been streamlined to explicitly allow you to create data that belongs to you.
3.  **Adds Navigation:** A new "Back to Dashboard" button has been added for easier navigation.

## How to Use
No action is required from users. The fix is automatic.
1.  Click the **"Add Well"** button as usual.
2.  Fill in the well details.
3.  Click **"Create Well"**.
4.  The well will be created successfully.

## Keyboard Shortcuts
*   **Alt + B:** Go back to Geoscience Dashboard
*   **F1:** Open Help Center for more details

## Troubleshooting
If you still see the error:
1.  Refresh your browser to ensure you have the latest code.
2.  Log out and log back in to refresh your authentication token.
3.  If the issue persists, contact support.