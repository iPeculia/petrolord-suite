/**
 * Workflow Service
 * Manages tasks, approvals, and audit logs.
 */

export class WorkflowService {
    static async getTasks(projectId) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            { id: 't1', title: 'Review Seismic Interpretation', status: 'Done', priority: 'High', assigneeId: 'u2', dueDate: '2024-10-15' },
            { id: 't2', title: 'Finalize Production Profiles', status: 'In Progress', priority: 'Critical', assigneeId: 'u1', dueDate: '2024-10-20' },
            { id: 't3', title: 'Approve CAPEX Budget', status: 'To Do', priority: 'High', assigneeId: 'u3', dueDate: '2024-10-25' }
        ];
    }

    static async getAuditLog(projectId) {
        return [
            { id: 'a1', action: 'Project Created', actorName: 'Sarah Engineer', timestamp: '2024-10-01T09:00:00Z', module: 'General' },
            { id: 'a2', action: 'Updated Reserves P50', actorName: 'Mike Geologist', timestamp: '2024-10-05T14:30:00Z', module: 'Subsurface' },
            { id: 'a3', action: 'Added Well W-04', actorName: 'Sarah Engineer', timestamp: '2024-10-06T10:15:00Z', module: 'Wells' }
        ];
    }

    static async createTask(projectId, task) {
        console.log("Creating task", task);
        return { ...task, id: `task-${Date.now()}` };
    }

    static async updateTaskStatus(taskId, status) {
        console.log(`Updating task ${taskId} to ${status}`);
        return true;
    }
}