# Build Troubleshooting Guide

## Common Errors

### 1. Missing Import or Module not found
**Error:** `[vite] Internal server error: Failed to resolve import "@/.../..."`
**Cause:** The file referenced in the import path does not exist or the path casing is incorrect.
**Solution:**
- Verify the file exists in the `src` directory.
- Check case sensitivity (Linux/Mac filesystems are case-sensitive).
- Run `npm run verify` to scan for broken imports.

### 2. Circular Dependency
**Error:** `ReferenceError: Cannot access 'X' before initialization`
**Cause:** Two files import each other, causing a cycle that prevents proper initialization.
**Solution:**
- Move shared logic to a utility file.
- Use `useEffect` or function declarations to delay execution.

### 3. Syntax Error in JSX
**Error:** `Expected corresponding JSX closing tag for <...>`
**Cause:** Unclosed HTML/React tags.
**Solution:**
- Check your component render method.
- Ensure all tags are closed.
- Ensure `return` statements wrap multi-line JSX in `()`.

## Support
For further assistance, contact the devops team.