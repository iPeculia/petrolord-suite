# Help System Architecture

## Overview
The Help System is a microservice-backed module that serves static content (articles) and dynamic interactions (chat, search).

## Components
*   **Frontend**: React components (`HelpCenter.jsx`, `ContextualHelp.jsx`) using `HelpContext` for state.
*   **Content Store**: Help articles are stored in a structured JSON/Markdown format in the database (`help_articles` table) or a CMS.
*   **Search Engine**: Uses Supabase PostgreSQL Full Text Search (`tsvector`) or a dedicated search service (like Meilisearch/Elasticsearch) integrated via Edge Functions.
*   **Chatbot Service**: An Edge Function (`help-chatbot`) interfaces with an LLM provider (OpenAI), passing user queries + vector embeddings of documentation.

## Data Flow
1.  **Search**: User Input -> `useHelp` Hook -> `helpService` -> Supabase RPC (`search_help_articles`) -> DB -> Results.
2.  **Chat**: User Input -> Edge Function -> Vector DB (Context Retrieval) -> LLM -> Response.

## Schema
`help_articles`:
*   `id`: UUID
*   `title`: Text
*   `content`: Text/Markdown
*   `category`: Text
*   `tags`: Array[Text]
*   `embedding`: Vector (for semantic search)