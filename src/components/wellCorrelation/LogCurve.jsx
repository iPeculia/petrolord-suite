import React from 'react';

const LogCurve = ({ curve, depth, width, min, max, color, fill, height }) => {
  if (!curve || !depth || curve.length === 0) return null;

  const points = [];
  const range = max - min;
  
  // Simple downsampling for display could be added here for performance
  // But assuming reasonably sized logs for now.
  
  for (let i = 0; i < curve.length; i++) {
    // Map value to x (0 to width)
    let x = ((curve[i] - min) / range) * width;
    
    // Clamp for display
    x = Math.max(0, Math.min(width, x));
    
    // Map depth to y (relative to container/window logic handled by parent usually, 
    // but here we assume depth array corresponds to pixel/unit mapping passed in or direct plotting)
    // NOTE: In this simple viewer, we assume 1 unit depth = 1 pixel or similar scale factor.
    // Better approach: Use normalized coordinates or explicit pixel mapping
    
    // Simplification: We assume parent passes normalized data or handled scaling
    // For SVG paths, we need pixel coords.
    
    // Let's assume depth[i] is already mapped to Y pixels by parent or we map it here
    // We'll rely on index-based plotting for uniform sampling or mapped depth
    
    const y = i; // Simple index-based for uniform sampling demo
    
    if (!isNaN(x) && curve[i] !== null) {
      points.push(`${x},${y}`);
    }
  }

  const polyline = points.join(' ');

  return (
    <g>
      {fill && (
        <polygon 
          points={`0,0 ${polyline} 0,${points.length} 0,0`} 
          fill={fill} 
          fillOpacity={0.2} 
        />
      )}
      <polyline 
        points={polyline} 
        fill="none" 
        stroke={color} 
        strokeWidth="1" 
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};

export default LogCurve;