/**
 * Simple Role Based Access Control (RBAC) System
 */
export const PERMISSIONS = {
    VIEW_PROJECT: 'view_project',
    EDIT_PROPERTIES: 'edit_properties',
    RUN_SIMULATION: 'run_simulation',
    MANAGE_TEAM: 'manage_team',
    DELETE_PROJECT: 'delete_project',
    EXPORT_DATA: 'export_data',
    VIEW_AUDIT_LOGS: 'view_audit_logs',
    MANAGE_BACKUPS: 'manage_backups'
};

export const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer'
};

const ROLE_PERMISSIONS = {
    [ROLES.OWNER]: [
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.EDIT_PROPERTIES,
        PERMISSIONS.RUN_SIMULATION,
        PERMISSIONS.MANAGE_TEAM,
        PERMISSIONS.DELETE_PROJECT,
        PERMISSIONS.EXPORT_DATA,
        PERMISSIONS.VIEW_AUDIT_LOGS,
        PERMISSIONS.MANAGE_BACKUPS
    ],
    [ROLES.ADMIN]: [
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.EDIT_PROPERTIES,
        PERMISSIONS.RUN_SIMULATION,
        PERMISSIONS.MANAGE_TEAM,
        PERMISSIONS.EXPORT_DATA,
        PERMISSIONS.VIEW_AUDIT_LOGS
    ],
    [ROLES.EDITOR]: [
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.EDIT_PROPERTIES,
        PERMISSIONS.RUN_SIMULATION,
        PERMISSIONS.EXPORT_DATA
    ],
    [ROLES.VIEWER]: [
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.EXPORT_DATA
    ]
};

export class RBAC {
    static hasPermission(role, permission) {
        if (!role) return false;
        const perms = ROLE_PERMISSIONS[role] || [];
        return perms.includes(permission);
    }

    static getRolePermissions(role) {
        return ROLE_PERMISSIONS[role] || [];
    }
}