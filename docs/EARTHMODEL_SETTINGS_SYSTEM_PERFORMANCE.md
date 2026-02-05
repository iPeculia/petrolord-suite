# Settings System Performance

*   **Boot Time**: Critical settings (Theme, Locale) are loaded from LocalStorage immediately to prevent layout shift (FOUC).
*   **Server Sync**: Settings sync occurs in background, non-blocking to UI.