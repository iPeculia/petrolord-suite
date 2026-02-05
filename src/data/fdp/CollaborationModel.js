/**
 * Collaboration Data Model
 * Structures for team, comments, and shared resources.
 */

export const UserRole = {
    OWNER: 'Owner',
    EDITOR: 'Editor',
    REVIEWER: 'Reviewer',
    VIEWER: 'Viewer'
};

export const CommentType = {
    GENERAL: 'General',
    SECTION: 'Section',
    FIELD: 'Field',
    TASK: 'Task'
};

export const createTeamMember = (user, role = UserRole.VIEWER) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: role,
    lastActive: new Date().toISOString(),
    avatar: user.avatar || null,
    status: 'active'
});

export const createComment = (text, author, target = {}) => ({
    id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text,
    authorId: author.id,
    authorName: author.name,
    createdAt: new Date().toISOString(),
    targetType: target.type || CommentType.GENERAL, // e.g., 'section', 'field'
    targetId: target.id || null,
    resolved: false,
    replies: []
});

export const createNotification = (type, message, link = null) => ({
    id: `notif-${Date.now()}`,
    type, // 'info', 'warning', 'success', 'error'
    message,
    link,
    read: false,
    createdAt: new Date().toISOString()
});