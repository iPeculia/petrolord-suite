# EarthModel Pro: Troubleshooting Quick Reference

## Well Creation Issues

### Error: "New row violates row-level security policy"
*   **Meaning:** The database rejected the data because it didn't see you as the owner.
*   **Solution:**
    1.  Refresh the page.
    2.  Log out and log back in.
    3.  Ensure you are not using a guest/anonymous account for write operations.

### Error: "Invalid coordinates"
*   **Meaning:** Non-numeric characters were entered in X/Y fields.
*   **Solution:** Ensure only numbers and decimal points are used.

### Form Button is Disabled
*   **Cause:** Required fields (Name) are missing.
*   **Solution:** Enter a Well Name.

## Navigation Issues

### Back Button Not Working
*   **Solution:** Use the keyboard shortcut `Alt + B` or use the browser's back button.

### Unsaved Changes Dialog Stuck
*   **Solution:** Click "Discard" to force navigation if saving is failing.

## General Performance
*   **Sluggish 3D View:** Reduce the number of visible wells or grid resolution in Settings.
*   **Data Not Loading:** Check your internet connection. The "Cloud" icon in the header will show red if disconnected.

## Support
If issues persist, please contact the internal support desk with the **Error Code** displayed in the red alert box.