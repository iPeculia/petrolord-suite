# Well Security Best Practices

## Overview
This document outlines the security standards applied to the Well Management module in EarthModel Pro.

## Row-Level Security (RLS)
*   **Principle of Least Privilege:** Database policies are restrictive by default.
*   **Direct Ownership:** We favor `auth.uid() = user_id` checks over complex joins for performance and reliability during `INSERT` operations.
*   **Project Context:** While `user_id` is the primary security key, `project_id` is used for logical grouping.

## Client-Side Security
*   **No Trust:** The client assumes the network is hostile. All critical validation happens on the database edge.
*   **Graceful Degradation:** If security tokens expire or permissions change, the UI degrades gracefully to a read-only or error state without crashing.
*   **Audit Logging:** Security-relevant events (creation attempts, permission failures) are logged to the console in dev and can be piped to an observability service in prod.

## Developer Guidelines
1.  **Always** use the `useWells` hook for well operations; do not call Supabase directly from UI components.
2.  **Never** expose raw error messages from the DB directly to the user; use `getWellErrorMessage` to sanitize them.
3.  **Validate** inputs early to save network round-trips.