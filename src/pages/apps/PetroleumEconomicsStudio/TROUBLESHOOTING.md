# Troubleshooting Guide

## Common Issues

### 1. Model is not calculating
- **Symptom**: KPIs show "NaN" or "-".
- **Cause**: Missing inputs (e.g., Oil Price is 0) or invalid dates (End Year < Start Year).
- **Fix**: Check the "Data QC" banner at the top of the workspace for critical errors.

### 2. Cannot save scenario
- **Symptom**: Save button is disabled.
- **Cause**: Scenario might be locked (Approved status) or you have lost internet connection.
- **Fix**: Check your network. If scenario is approved, unlock it in the **Governance** tab.

### 3. Charts are empty
- **Symptom**: Dashboard shows "No Data".
- **Cause**: No production or cost data entered for the active scenario.
- **Fix**: Go to **Production** tab and enter values, or load a Template via **Setup > Load Template**.

### 4. Excel Export fails
- **Symptom**: Clicking download does nothing.
- **Cause**: Browser pop-up blocker or script error.
- **Fix**: Check browser console (F12) for errors. Ensure `xlsx` dependency is loaded.

## Support
For further assistance, contact the Petrolord IT Support team at support@petrolord.com.