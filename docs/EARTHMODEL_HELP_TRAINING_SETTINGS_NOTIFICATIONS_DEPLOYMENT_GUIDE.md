# Deployment Guide: Help, Training, Settings, & Notifications

## 1. Deployment Prerequisites
Before deploying the User Support Suite, ensure the following environment is prepared:
*   **Runtime**: Node.js v20+ and npm v9+.
*   **Frontend**: React 18.2.0+ build environment (Vite).
*   **Backend**: Supabase project with active Database and Edge Functions.
*   **Migrations**: All SQL migrations from `supabase/migrations/` applied.
*   **Secrets**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SERVICE_ROLE_KEY` configured.

## 2. Step-by-Step Deployment

### Step 1: Install Dependencies
Ensure all package dependencies for the new UI components are installed.