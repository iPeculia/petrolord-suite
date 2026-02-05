# EarthModel Pro Well Security Fix

## Problem Description
Users were encountering a "new row violates row-level security policy for table 'em_wells'" error when attempting to add new wells in EarthModel Pro. This prevented authenticated users from creating new well records in their projects.

## Root Cause Analysis
The `em_wells` table had strict Row-Level Security (RLS) policies that checked for project ownership via a join on `em_projects`. When inserting a new row, the policy `WITH CHECK` expression was failing, likely because the `project_id` check was too complex for an insert operation or the user ownership wasn't being correctly validated during the transaction. Additionally, the table lacked a direct `user_id` column, relying solely on `project_id` for ownership resolution, which complicates RLS for inserts.

## Solution Overview
1.  **Database Schema Update:** Added a `user_id` column to `em_wells` to establish direct record ownership.
2.  **RLS Policy Simplification:** Replaced complex join-based policies with direct ownership checks (`auth.uid() = user_id`). This significantly improves performance and reliability for inserts.
3.  **Frontend Logic Update:** Updated the well creation logic to automatically inject the current user's ID into the insert payload.
4.  **UI Guard:** Added a `WellSecurityGuard` component to proactively check for RLS issues and inform the user.

## Changes Implemented

### Database
-   Added `user_id` column to `em_wells`.
-   Updated RLS policies for INSERT, SELECT, UPDATE, DELETE to use `auth.uid() = user_id`.
-   Backfilled `user_id` for existing records based on project ownership.

### Frontend
-   Created `useWells` hook with enhanced error handling and user ID injection.
-   Added `WellSecurityGuard` to `EarthModelPro` layout.
-   Added `BackToGeoscienceDashboard` for improved navigation.

## Verification
To verify the fix:
1.  Log in as a standard user.
2.  Navigate to EarthModel Pro.
3.  Attempt to add a new well.
4.  The operation should succeed without RLS errors.
5.  Verify the new row in Supabase has the correct `user_id`.