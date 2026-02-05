import React from 'react';

/**
 * Generates SVG Pattern definitions for use in curve fills.
 * This component should be rendered inside an <svg><defs> block.
 */
export const FillPatternsDefs = () => (
  <defs>
    {/* Diagonal Lines */}
    <pattern id="pattern-diagonal" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="2" />
    </pattern>
    
    {/* Crosshatch */}
    <pattern id="pattern-crosshatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" />
    </pattern>

    {/* Dots */}
    <pattern id="pattern-dots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
    </pattern>

    {/* Vertical Lines */}
    <pattern id="pattern-vertical" width="6" height="6" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" />
    </pattern>

    {/* Horizontal Lines */}
    <pattern id="pattern-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="1" />
    </pattern>
  </defs>
);

/**
 * Helper to get the fill style object for a curve config
 */
export const getFillStyle = (fillSettings) => {
  const { color = '#000000', opacity = 0.2, pattern = 'solid' } = fillSettings;
  
  if (pattern === 'solid' || !pattern) {
    return {
      fill: color,
      fillOpacity: opacity
    };
  } else {
    // For patterns, we use the pattern URL but we need to apply color.
    // SVG patterns can inherit color if stroke="currentColor"
    // We wrap the path in a group or set color on path
    return {
      fill: `url(#pattern-${pattern})`,
      fillOpacity: opacity,
      color: color // This sets 'currentColor' for the pattern
    };
  }
};