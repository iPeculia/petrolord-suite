# API Documentation

## Overview
The API primarily uses **Supabase PostgREST** for CRUD operations and **Edge Functions** for business logic.

## Authentication
All requests must include the `apikey` and `Authorization: Bearer <token>` headers.

## Core Endpoints (Supabase Client)

### Projects
*   `GET /rest/v1/ss_projects`: List projects.
*   `POST /rest/v1/ss_projects`: Create project.

### Wells
*   `GET /rest/v1/wells?project_id=eq.{id}`: Get wells for a project.
*   `POST /rest/v1/wells`: Upload well header.

### Assets (Files)
*   `POST /storage/v1/object/ss-assets/{path}`: Upload file.
*   `GET /storage/v1/object/public/ss-assets/{path}`: Get public URL.

## Edge Functions
Invoke via `supabase.functions.invoke('function-name')`.

| Function | Purpose | Payload |
| :--- | :--- | :--- |
| `well-log-parser` | Parse LAS files to JSON | `{ file_url: string }` |
| `seis-tile-job` | Generate ZXY tiles from SEG-Y | `{ volume_id: uuid }` |
| `anti-collision-guardian` | Calculate wellbore separation | `{ plan_id: uuid }` |
| `job-step` | Execute generic async task | `{ job_type: string, params: object }` |

## Error Handling
*   **400 Bad Request**: Invalid input parameters.
*   **401 Unauthorized**: Missing or invalid token.
*   **403 Forbidden**: RLS policy violation.
*   **500 Server Error**: Internal processing failure (check Edge Function logs).