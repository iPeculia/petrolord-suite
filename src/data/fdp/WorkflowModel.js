/**
 * Workflow and Task Data Models
 */

export const TaskStatus = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'In Review',
    DONE: 'Done',
    BLOCKED: 'Blocked'
};

export const TaskPriority = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical'
};

export const createTask = (title, assigneeId = null, dueDate = null) => ({
    id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    description: '',
    assigneeId,
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate,
    createdAt: new Date().toISOString(),
    dependencies: [],
    attachments: []
});

export const createApprovalRequest = (title, requestorId) => ({
    id: `apr-${Date.now()}`,
    title,
    requestorId,
    status: 'Pending', // Pending, Approved, Rejected
    approvers: [], // List of user IDs required to approve
    decisions: [], // { approverId, decision, comment, date }
    createdAt: new Date().toISOString(),
    deadline: null
});

export const createAuditEvent = (action, actor, details) => ({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action, // e.g., "Updated Field Reserves"
    actorId: actor.id,
    actorName: actor.name,
    details, // JSON object with diff or specific info
    module: 'General'
});