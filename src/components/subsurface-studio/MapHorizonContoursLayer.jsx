import React, { useMemo } from 'react';
import { GeoJSON, FeatureGroup, Popup, Tooltip } from 'react-leaflet';

const MapHorizonContoursLayer = ({ horizons, style, visible, labelsVisible }) => {
    if (!visible) return null;
    if (!horizons || !Array.isArray(horizons) || horizons.length === 0) return null;

    // Simple static style if dynamic not needed, robust against missing props
    const getStyle = () => ({
        color: style?.color || '#10B981',
        weight: 1.5,
        opacity: style?.opacity || 0.8,
        lineJoin: 'round'
    });

    return (
        <FeatureGroup>
            {horizons.map(h => {
                if (!h || !h.geojson) return null;
                
                // Robust GeoJSON parsing
                let geoData = h.geojson;
                try {
                    if (typeof h.geojson === 'string') geoData = JSON.parse(h.geojson);
                } catch (e) { return null; }

                if (!geoData) return null;

                return (
                    <GeoJSON 
                        key={`horizon-${h.id}`} 
                        data={geoData} 
                        style={getStyle}
                    >
                        <Popup className="text-slate-900">
                            <div className="p-2">
                                <strong className="block text-sm border-b border-slate-200 pb-1 mb-2">{h.name || 'Unnamed Horizon'}</strong>
                                <span className="text-xs text-slate-500">Horizon Contour</span>
                            </div>
                        </Popup>
                        {labelsVisible && (
                            <Tooltip direction="center" opacity={0.7} className="text-[10px] font-mono text-slate-700 bg-white/80 border-0 shadow-sm">
                                {h.name || 'Horizon'}
                            </Tooltip>
                        )}
                    </GeoJSON>
                );
            })}
        </FeatureGroup>
    );
};

export default MapHorizonContoursLayer;