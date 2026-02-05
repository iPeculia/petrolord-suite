# Notifications System Architecture

## Overview
A real-time event distribution system handling internal and external alerts.

## Components
*   **Event Bus**: A backend trigger system (Supabase Database Webhooks/Triggers) monitoring tables for specific changes.
*   **Realtime Service**: Supabase Realtime (WebSockets) pushing payloads to connected clients.
*   **Delivery Worker**: Edge Function (`notification-delivery`) processing rules and dispatching emails (Resend/SendGrid) or SMS (Twilio).

## Data Flow
1.  **Trigger**: High Pressure detected in `rto_data` table.
2.  **Detection**: DB Trigger fires -> Inserts row into `notifications` table.
3.  **Push**: Supabase Realtime broadcasts INSERT event to subscribed clients (Frontend).
4.  **Toast**: React `NotificationProvider` receives event -> Renders Toast.
5.  **External**: Background worker sees high priority -> Checks user preferences -> Sends SMS.

## Scalability
*   Notifications table is partitioned by time (e.g., monthly) to maintain query speed.
*   Old notifications are archived/deleted after retention period.