
const LOG_PREFIX = '[WellManager]';
const isDev = import.meta.env.DEV;

export const wellLogger = {
  info: (message, data) => {
    if (isDev) {
      console.log(`${LOG_PREFIX} ℹ️ ${message}`, data || '');
    }
  },
  
  warn: (message, data) => {
    console.warn(`${LOG_PREFIX} ⚠️ ${message}`, data || '');
  },

  error: (message, error) => {
    console.error(`${LOG_PREFIX} ❌ ${message}`, error || '');
  },

  logSecurityEvent: (action, status, details) => {
    console.log(`${LOG_PREFIX} 🔒 Security Event: ${action} - ${status}`, details);
  },

  logPerformance: (operation, durationMs) => {
    if (isDev) {
      console.log(`${LOG_PREFIX} ⏱️ ${operation} took ${durationMs}ms`);
    }
  }
};
