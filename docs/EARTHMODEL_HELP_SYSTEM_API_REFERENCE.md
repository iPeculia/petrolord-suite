# Help System API Reference

## Endpoints

### `GET /api/v1/help/search`
Search documentation.
*   **Params**: `q` (query string), `category` (optional)
*   **Response**: JSON array of article objects with relevance score.

### `GET /api/v1/help/articles/{id}`
Retrieve full article content.

### `POST /api/v1/help/feedback`
Submit rating.
*   **Body**: `{ articleId: uuid, helpful: boolean, comment: string }`

### `POST /api/v1/help/chat`
Send message to AI bot.
*   **Body**: `{ message: string, context: object }`
*   **Response**: `{ reply: string, sources: array }`