import { applicationRoutes } from './applicationRoutes';

/**
 * Registry of all registered applications in the Petrolord Platform.
 * Used for generating menus, checking permissions, and routing.
 */
export const applicationRegistry = {
  getAll: () => applicationRoutes,
  getById: (id) => applicationRoutes.find(app => app.id === id),
  getByPath: (path) => applicationRoutes.find(app => path.startsWith(app.path)),
  isEnabled: (id) => true // Placeholder for feature flag logic
};

export default applicationRegistry;