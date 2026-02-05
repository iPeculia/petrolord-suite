/**
 * Utility functions for annotations
 */
import { v4 as uuidv4 } from 'uuid';

export const createAnnotation = (type, position, content = '', style = {}) => {
  return {
    id: uuidv4(),
    type, // 'text', 'arrow', 'rect', 'circle'
    position, // { x, y } or { startX, startY, endX, endY }
    content,
    style: {
      color: style.color || '#ef4444',
      fontSize: style.fontSize || 12,
      strokeWidth: style.strokeWidth || 2,
      fill: style.fill || 'transparent',
      ...style
    },
    createdAt: Date.now(),
  };
};

export const ANNOTATION_TYPES = {
  TEXT: 'text',
  ARROW: 'arrow',
  RECT: 'rect',
  CIRCLE: 'circle'
};

export const DEFAULT_STYLES = {
  text: { color: '#f8fafc', fontSize: 12 },
  shape: { color: '#ef4444', strokeWidth: 2, fill: 'rgba(239, 68, 68, 0.1)' }
};