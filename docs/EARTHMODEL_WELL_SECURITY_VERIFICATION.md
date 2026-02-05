# Well Security Verification

## 1. RLS Policy Verification
- [x] **INSERT Policy:** Uses `WITH CHECK (auth.uid() = user_id)`. This prevents users from creating wells assigned to others or project IDs they don't own (indirectly via app logic).
- [x] **SELECT Policy:** Uses `USING (auth.uid() = user_id)`. Users can only see their own data.
- [x] **Column Existence:** `user_id` column confirmed on `em_wells` table.

## 2. Frontend Validation
- [x] **User Injection:** `useWells` hook automatically injects `auth.uid()` from the auth context into the insert payload.
- [x] **Input Validation:** `validateWellData` ensures required fields are present and types are correct before network request.

## 3. Error Handling
- [x] **User Feedback:** Specific toast messages for RLS violations (translated to "Permission Denied") vs generic network errors.
- [x] **Retry Mechanism:** Users can retry failed operations directly from the UI.

## 4. Navigation Safety
- [x] **Unsaved Changes:** Navigation attempts check for dirty state (simulated) and prompt user confirmation.
- [x] **Shortcuts:** Alt+B shortcut implemented and verified.

## 5. Verification Steps (Manual)
1.  Log in as User A.
2.  Open EarthModel Pro.
3.  Click "Add Well".
4.  Enter Name "Well-Test-Sec".
5.  Click Create. 
    *   **Expected:** Success toast.
6.  (Advanced) Attempt to insert a well with a different `user_id` via console/network tampering.
    *   **Expected:** 403 Forbidden / RLS Error (handled gracefully by UI).