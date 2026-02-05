import React from 'react';

export const LithologyPatterns = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
            {/* Sandstone: Dots */}
            <pattern id="pattern-sand" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#000" fillOpacity="0.2" />
                <circle cx="7" cy="7" r="1" fill="#000" fillOpacity="0.2" />
            </pattern>

            {/* Shale: Dashes/Lines */}
            <pattern id="pattern-shale" x="0" y="0" width="10" height="4" patternUnits="userSpaceOnUse">
                <line x1="0" y1="2" x2="8" y2="2" stroke="#000" strokeOpacity="0.3" strokeWidth="1" />
            </pattern>

            {/* Limestone: Brick/Block pattern */}
            <pattern id="pattern-lime" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <path d="M0 10 L20 10 M10 0 L10 10" stroke="#000" strokeOpacity="0.2" strokeWidth="1" fill="none" />
            </pattern>
            
            {/* Dolomite: Diagonal Lines */}
            <pattern id="pattern-dolomite" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
            </pattern>

            {/* Salt: Crosshatch */}
            <pattern id="pattern-salt" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0 0 L10 10 M10 0 L0 10" stroke="#000" strokeOpacity="0.1" strokeWidth="1" />
            </pattern>
            
             {/* Coal: Solid black/dark fill is usually handled by color, but pattern adds texture */}
             <pattern id="pattern-coal" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="#000" fillOpacity="0.8" />
            </pattern>

            {/* Default/Generic */}
            <pattern id="pattern-generic" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fillOpacity="0" />
            </pattern>
        </defs>
    </svg>
);

export const getPatternId = (lithology) => {
    const l = lithology?.toLowerCase() || '';
    if (l.includes('sand')) return 'url(#pattern-sand)';
    if (l.includes('shale')) return 'url(#pattern-shale)';
    if (l.includes('lime')) return 'url(#pattern-lime)';
    if (l.includes('salt')) return 'url(#pattern-salt)';
    if (l.includes('dolomite')) return 'url(#pattern-dolomite)';
    if (l.includes('coal')) return 'url(#pattern-coal)';
    return null;
};