# Settings System Architecture

## Overview
Handles persistence of user preferences and system configurations across sessions and devices.

## Components
*   **Settings Provider**: `SettingsContext.jsx` initializes state from LocalStorage (for anonymous/guest) or Supabase (for auth users).
*   **Sync Service**: Background process ensuring local changes push to `user_settings` table.
*   **Config Manager**: Handles hierarchical settings (System Default -> Organization -> Project -> User).

## Data Flow
1.  **Load**: App Init -> Auth Check -> Fetch `user_settings` -> Merge with Defaults -> Hydrate Context.
2.  **Update**: User Change -> Optimistic UI Update -> Debounced API Call -> DB Update.

## Security
*   Sensitive settings (API Keys) are stored encrypted (`pgsodium` or similar) or in a separate secure Vault table (`vault.secrets`), never in plain text `user_settings`.