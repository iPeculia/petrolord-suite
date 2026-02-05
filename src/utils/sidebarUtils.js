import { applicationRoutes } from '@/config/applicationRoutes';

export const checkSidebarVisibility = (currentPath) => {
  const app = applicationRoutes.find(app => currentPath.startsWith(app.path));
  if (app && app.hideSidebar) {
    return false; // Sidebar should be hidden
  }
  return true; // Sidebar should be visible
};

export const getSidebarState = (isInApplication) => {
  return {
    isVisible: !isInApplication,
    mode: isInApplication ? 'application' : 'dashboard'
  };
};