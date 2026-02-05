import { applicationRoutes } from '@/config/applicationRoutes';

/**
 * Utility to detect if the current layout should be in "Application Mode"
 * (Sidebar hidden, Fullscreen)
 */

export const isApplicationRoute = (pathname) => {
  if (!pathname) return false;
  return applicationRoutes.some(app => pathname.startsWith(app.path));
};

export const getApplicationMetadata = (pathname) => {
  if (!pathname) return null;
  return applicationRoutes.find(app => pathname.startsWith(app.path)) || null;
};

export const shouldHideSidebar = (pathname) => {
  const app = getApplicationMetadata(pathname);
  return app ? app.hideSidebar : false;
};

export const detectLayoutConfig = (pathname) => {
  const app = getApplicationMetadata(pathname);
  if (app) {
    return {
      isApplication: true,
      hideSidebar: app.hideSidebar,
      fullscreen: app.fullscreen,
      appName: app.name,
      appId: app.id
    };
  }
  return {
    isApplication: false,
    hideSidebar: false,
    fullscreen: false,
    appName: null,
    appId: null
  };
};