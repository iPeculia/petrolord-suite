/**
 * Role-based access control for Material Balance Projects
 */

export const ROLES = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
  OWNER: 'owner'
};

export const PERMISSIONS = {
  VIEW: 'view',
  EDIT_DATA: 'edit_data',
  RUN_MODELS: 'run_models',
  DELETE: 'delete',
  EXPORT: 'export',
  SHARE: 'share'
};

const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [PERMISSIONS.VIEW, PERMISSIONS.EXPORT],
  [ROLES.EDITOR]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT_DATA, PERMISSIONS.RUN_MODELS, PERMISSIONS.EXPORT],
  [ROLES.ADMIN]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT_DATA, PERMISSIONS.RUN_MODELS, PERMISSIONS.EXPORT, PERMISSIONS.SHARE, PERMISSIONS.DELETE],
  [ROLES.OWNER]: Object.values(PERMISSIONS)
};

// Mock user permissions db
const mockUserDb = {}; 

export const checkPermission = (role, action) => {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(action);
};

export const getProjectPermissions = (projectId) => {
  // Stub: Return a default list for demo
  return [
    { userId: 'currentUser', role: ROLES.OWNER }
  ];
};