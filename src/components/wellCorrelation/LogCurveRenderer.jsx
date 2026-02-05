import React, { useMemo } from 'react';
import { calculateFillPath } from '@/utils/curveFillCalculator';
import { getFillStyle, FillPatternsDefs } from '@/utils/fillPatternRenderer';

const LogCurveRenderer = ({ 
  trackWidth, 
  trackHeight, 
  logs, 
  depthRange, 
  scaleType = 'linear',
  trackMin = 0,
  trackMax = 100
}) => {
  // Filter logs to only those with data visible
  // Assuming log object has structure: { id, mnemonic, color, data: [{depth, value}, ...], visible, fill: {} }
  // Note: Data structure might vary based on implementation. Assuming normalized 'data' array.
  
  const visibleLogs = useMemo(() => {
    return logs.filter(l => l.visible !== false);
  }, [logs]);

  // Generate Paths for Lines
  const curvePaths = useMemo(() => {
    return visibleLogs.map(log => {
        if (!log.data) return null;
        
        // Use the calculateFillPath utility for the line itself (using "none" fill type logic essentially, or simplified)
        // Actually, calculateFillPath returns a closed shape. We just need a line.
        // Let's quickly generate line D here to keep it simple and performant
        
        const points = log.data.filter(p => p.depth >= depthRange.min && p.depth <= depthRange.max);
        if (points.length < 2) return null;

        const totalDepth = depthRange.max - depthRange.min;
        let d = '';
        
        points.forEach((p, i) => {
            // Scale X
            let x;
            if (scaleType === 'log') {
                let val = p.value <= 0 ? 0.001 : p.value;
                const minL = Math.log10(Math.max(trackMin, 0.001));
                const maxL = Math.log10(Math.max(trackMax, 0.001));
                const valL = Math.log10(val);
                x = ((valL - minL) / (maxL - minL)) * trackWidth;
            } else {
                x = ((p.value - trackMin) / (trackMax - trackMin)) * trackWidth;
            }
            
            // Scale Y
            const y = ((p.depth - depthRange.min) / totalDepth) * trackHeight;
            
            if (i === 0) d += `M ${x} ${y}`;
            else d += ` L ${x} ${y}`;
        });

        return { id: log.id, d, color: log.color, width: log.lineWidth || 1, style: log.lineStyle };
    }).filter(Boolean);
  }, [visibleLogs, depthRange, trackHeight, trackWidth, trackMin, trackMax, scaleType]);

  // Generate Paths for Fills
  const fillPaths = useMemo(() => {
    return visibleLogs.map(log => {
        if (!log.fill || log.fill.type === 'none') return null;
        
        const pathD = calculateFillPath(
            log.data,
            log.fill.type,
            log.fill,
            trackWidth,
            trackHeight,
            depthRange.min,
            depthRange.max,
            scaleType,
            trackMin,
            trackMax,
            logs // Pass all logs for cross-referencing
        );

        if (!pathD) return null;

        return {
            id: `fill-${log.id}`,
            d: pathD,
            style: getFillStyle(log.fill)
        };
    }).filter(Boolean);
  }, [visibleLogs, depthRange, trackHeight, trackWidth, trackMin, trackMax, scaleType, logs]);

  return (
    <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
      <FillPatternsDefs />
      
      {/* Render Fills First (Behind lines) */}
      {fillPaths.map(fill => (
        <path 
            key={fill.id}
            d={fill.d}
            {...fill.style}
            stroke="none"
        />
      ))}

      {/* Render Curve Lines */}
      {curvePaths.map(curve => (
        <path 
            key={curve.id}
            d={curve.d}
            stroke={curve.color}
            strokeWidth={curve.width}
            strokeDasharray={curve.style === 'dashed' ? '4 2' : curve.style === 'dotted' ? '1 2' : 'none'}
            fill="none"
        />
      ))}
    </svg>
  );
};

export default LogCurveRenderer;