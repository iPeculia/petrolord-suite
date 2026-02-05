import { applicationRoutes } from '@/config/applicationRoutes';

export const isAppRoute = (pathname) => {
  return applicationRoutes.some(app => pathname.startsWith(app.path));
};

export const getAppMetadata = (pathname) => {
  return applicationRoutes.find(app => pathname.startsWith(app.path));
};

export const validateAppRoute = (pathname) => {
  const app = getAppMetadata(pathname);
  if (!app) return { isValid: false, error: 'Unknown application' };
  return { isValid: true, app };
};