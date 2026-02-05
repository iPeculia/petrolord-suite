# Training System Architecture

## Overview
Manages course content delivery, user progress tracking, and certification logic.

## Components
*   **LMS Engine**: Frontend logic in `TrainingService.js` handling course navigation.
*   **Progress Tracker**: React Context (`TrainingContext`) syncing with `user_training_progress` table.
*   **Assessment Engine**: Grading logic for quizzes, running either client-side (for instant feedback) or server-side (for certification exams).

## Database Schema
*   `training_courses`: Metadata, syllabus structure.
*   `training_modules`: Individual content units (video URL, text body).
*   `user_training_progress`: Links `user_id` to `module_id` with `status` (started, completed) and `score`.
*   `certificates`: Records issued credentials with unique validation IDs.

## Performance
*   **Caching**: Course content is heavily cached using React Query or similar to prevent re-fetching on navigation.
*   **Video**: Hosted on streaming-optimized storage (e.g., Cloudflare Stream or S3/CloudFront).