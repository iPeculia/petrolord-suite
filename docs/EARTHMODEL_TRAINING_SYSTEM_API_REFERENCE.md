# Training API Reference

### `GET /api/v1/training/courses`
List available courses.

### `POST /api/v1/training/enroll/{courseId}`
Enroll current user.

### `PUT /api/v1/training/progress`
Update module status.
*   **Body**: `{ moduleId: uuid, status: 'completed', progress: 100 }`

### `GET /api/v1/training/certificates/{id}`
Validate a certificate ID.