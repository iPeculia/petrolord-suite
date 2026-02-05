# Notifications API Reference

### `GET /api/v1/notifications`
Get list of notifications.
*   **Params**: `page`, `limit`, `unreadOnly`

### `PATCH /api/v1/notifications/{id}/read`
Mark as read.

### `POST /api/v1/notifications/test`
Trigger a test notification (Dev only).