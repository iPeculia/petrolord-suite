/**
 * Collaboration Service
 * Simulates backend interaction for team management and real-time features.
 */

export class CollaborationService {
    static async getTeamMembers(projectId) {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock data if empty
        return [
            { id: 'u1', name: 'Sarah Engineer', role: 'Owner', email: 'sarah@example.com', status: 'active', lastActive: 'Now' },
            { id: 'u2', name: 'Mike Geologist', role: 'Editor', email: 'mike@example.com', status: 'active', lastActive: '5m ago' },
            { id: 'u3', name: 'David Manager', role: 'Reviewer', email: 'david@example.com', status: 'offline', lastActive: '2d ago' }
        ];
    }

    static async addComment(projectId, comment) {
        console.log(`Adding comment to project ${projectId}:`, comment);
        return { ...comment, id: `cmt-${Date.now()}`, createdAt: new Date().toISOString() };
    }

    static async inviteMember(projectId, email, role) {
        console.log(`Inviting ${email} as ${role} to project ${projectId}`);
        return {
            id: `u-${Date.now()}`,
            name: email.split('@')[0],
            email,
            role,
            status: 'pending',
            lastActive: null
        };
    }
    
    static async updatePermissions(projectId, userId, newRole) {
        console.log(`Updating user ${userId} to ${newRole}`);
        return true;
    }
}