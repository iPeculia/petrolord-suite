export const mockTeam = [
    { id: 'u1', name: 'Sarah Engineer', role: 'Owner', email: 'sarah@example.com', status: 'active', lastActive: 'Now', avatar: null },
    { id: 'u2', name: 'Mike Geologist', role: 'Editor', email: 'mike@example.com', status: 'idle', lastActive: '10m ago', avatar: null },
    { id: 'u3', name: 'David Manager', role: 'Reviewer', email: 'david@example.com', status: 'offline', lastActive: '1d ago', avatar: null },
    { id: 'u4', name: 'Elena Reservoir', role: 'Editor', email: 'elena@example.com', status: 'active', lastActive: '2m ago', avatar: null }
];

export const mockComments = [
    { id: 'c1', text: 'Should we reconsider the plateau duration based on the new permeability data?', authorName: 'Mike Geologist', createdAt: '2024-10-12T10:30:00Z', resolved: false },
    { id: 'c2', text: 'Agreed. I will run a new sensitivity case.', authorName: 'Sarah Engineer', createdAt: '2024-10-12T11:15:00Z', resolved: false }
];

export const mockNotifications = [
    { id: 'n1', message: 'Mike Geologist assigned you a task: Review Well Tops', type: 'info', read: false, time: '2h ago' },
    { id: 'n2', message: 'CAPEX Budget approved by David Manager', type: 'success', read: true, time: '1d ago' }
];