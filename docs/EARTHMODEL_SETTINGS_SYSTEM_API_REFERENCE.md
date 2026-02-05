# Settings API Reference

### `GET /api/v1/settings`
Get all user settings.

### `PATCH /api/v1/settings`
Update settings.
*   **Body**: `{ "theme.mode": "dark", "units": "metric" }`

### `POST /api/v1/settings/api-keys`
Create new PAT.