# Administrator Guide

## 1. System Administration
*   **Feature Flags**: Enable/Disable the Chatbot or Live Chat globally via the `system_config` table.
*   **Maintenance Mode**: Broadcast a system-wide "Maintenance" notification to all active sessions via the Admin Console.

## 2. User Management
*   **Roles**: Assign "Support Agent" or "Trainer" roles to specific users to grant them edit access to Help and Training content.
*   **Permissions**: Configure which user groups can access advanced Settings (e.g., API Keys).

## 3. Content Management
*   **Help Articles**: Use the internal CMS (`/admin/help`) to write, edit, and publish documentation.
*   **Training Courses**: Upload video assets and define quiz questions in the Training Manager (`/admin/training`).

## 4. Monitoring
*   **Notification Volume**: Monitor the `notifications` table for spikes in error alerts, indicating system issues.
*   **Search Analytics**: Review `help_search_logs` to see what terms users are searching for but not finding (content gaps).

## 5. Backup & Recovery
*   **User Settings**: Daily snapshots of the `user_settings` table are recommended.
*   **Training Progress**: Critical user data; ensure point-in-time recovery is enabled for `user_training_progress`.