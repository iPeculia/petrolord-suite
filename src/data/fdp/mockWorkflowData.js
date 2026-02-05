export const mockTasks = [
    { id: 't1', title: 'Review Seismic Interpretation', status: 'Done', priority: 'High', assigneeName: 'Mike Geologist', dueDate: '2024-10-15' },
    { id: 't2', title: 'Finalize Production Profiles', status: 'In Progress', priority: 'Critical', assigneeName: 'Sarah Engineer', dueDate: '2024-10-20' },
    { id: 't3', title: 'Approve CAPEX Budget', status: 'To Do', priority: 'High', assigneeName: 'David Manager', dueDate: '2024-10-25' },
    { id: 't4', title: 'Update HSE Risk Register', status: 'To Do', priority: 'Medium', assigneeName: 'Sarah Engineer', dueDate: '2024-10-28' }
];

export const mockApprovals = [
    { id: 'ap1', title: 'Concept Select Gate Review', requestor: 'Sarah Engineer', status: 'Pending', approvers: ['David Manager', 'VP Operations'], submittedAt: '2024-10-14' },
    { id: 'ap2', title: 'Rig Contract Award', requestor: 'Procurement', status: 'Approved', approvers: ['David Manager'], submittedAt: '2024-09-30' }
];

export const mockAuditLog = [
    { id: 'al1', action: 'Modified Production Schedule', actor: 'Sarah Engineer', time: 'Today, 10:42 AM', module: 'Schedule' },
    { id: 'al2', action: 'Uploaded Well Logs (W-01, W-02)', actor: 'Mike Geologist', time: 'Yesterday, 4:15 PM', module: 'Wells' },
    { id: 'al3', action: 'Changed Concept Selection to FPSO', actor: 'Sarah Engineer', time: 'Oct 10, 2024', module: 'Concepts' }
];