# Database Schema

## Key Tables

### `ss_projects`
The root entity for data organization.
*   `id` (uuid, PK)
*   `name` (text)
*   `created_by` (uuid, FK -> auth.users)
*   `crs_epsg` (int): Spatial reference system code.

### `wells`
Physical wellbore headers.
*   `id` (uuid, PK)
*   `project_id` (uuid, FK)
*   `name` (text)
*   `surface_x`, `surface_y` (numeric): Coordinates.

### `ss_assets`
Generic asset registry for files and metadata.
*   `id` (uuid, PK)
*   `type` (text): 'las', 'segy', 'horizon', etc.
*   `uri` (text): Storage path.
*   `meta` (jsonb): Flexible metadata (curve names, headers).

### `ss_interpretations`
User-generated data.
*   `id` (uuid, PK)
*   `kind` (text): 'horizon', 'fault', 'pick'.
*   `data` (jsonb): Geometry points or values.
*   `locked_by` (uuid): For concurrency control.

### `audit_logs`
Security and compliance tracking.
*   `actor_id` (uuid): Who performed the action.
*   `action` (text): What happened.
*   `details` (jsonb): Context/diff.

## Security Policies (RLS)
*   **Projects**: Users can only see projects they created or are members of.
*   **Audit Logs**: Only Super Admins can read. Insert is open to system roles.
*   **Public Data**: Some reference tables (`tubular_grades`) are public read.