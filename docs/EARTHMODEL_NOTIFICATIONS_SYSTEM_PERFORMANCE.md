# Notifications System Performance

*   **Throughput**: System designed to handle 10,000 events/second via partitioning and queuing.
*   **Real-time**: WebSocket latency < 100ms globally.
*   **Retention**: Historical notifications older than 90 days are moved to cold storage to keep active table queries fast.