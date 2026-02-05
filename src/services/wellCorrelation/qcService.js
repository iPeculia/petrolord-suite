/**
 * QC Service
 * Handles Quality Control flags and comments for markers and logs.
 */

export const setQCFlag = (targetId, targetType, status, user = 'Current User') => {
  // targetType: 'marker' | 'horizon' | 'curve'
  console.log(`Setting QC for ${targetType} ${targetId} to ${status} by ${user}`);
  
  return {
    id: `${targetId}-qc-${Date.now()}`,
    targetId,
    targetType,
    qcStatus: status, // 'Good', 'Fair', 'Poor', 'Unchecked'
    qcBy: user,
    qcDate: new Date().toISOString()
  };
};

export const getQCStatus = (targetId, qcHistory = []) => {
  // Find latest QC entry for this target
  const history = qcHistory.filter(q => q.targetId === targetId).sort((a, b) => new Date(b.qcDate) - new Date(a.qcDate));
  return history.length > 0 ? history[0] : { qcStatus: 'Unchecked' };
};

export const addComment = (targetId, text, user = 'Current User') => {
  if (!text || !text.trim()) return null;
  
  return {
    id: `cmt-${Date.now()}`,
    targetId,
    text,
    author: user,
    date: new Date().toISOString()
  };
};

export const deleteComment = (commentId, comments = []) => {
  return comments.filter(c => c.id !== commentId);
};

export const getComments = (targetId, comments = []) => {
  return comments.filter(c => c.targetId === targetId).sort((a, b) => new Date(b.date) - new Date(a.date));
};