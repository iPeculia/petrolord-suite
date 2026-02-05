/**
 * Audit Trail System for Material Balance Pro
 */

export const logChange = (projectId, user, action, details) => {
  const entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    user: user || 'Unknown User',
    action,
    details
  };
  // In a real app, this would push to a backend log immediately
  return entry;
};

export const formatAuditHistory = (auditTrail) => {
  if (!auditTrail) return [];
  return auditTrail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};