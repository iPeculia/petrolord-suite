import React from 'react';
import { GeoJSON, FeatureGroup, Popup, Tooltip } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';

const MapFaultTracesLayer = ({ faults, style, visible, labelsVisible }) => {
    // STRICT Safety Checks
    if (!visible) return null;
    if (!faults || !Array.isArray(faults) || faults.length === 0) return null;

    // Helper to safely get style
    const getFaultStyle = () => ({
        color: style?.color || '#DC2626',
        weight: 3,
        opacity: style?.opacity || 1,
        dashArray: '8, 4',
        lineCap: 'round'
    });

    return (
        <FeatureGroup>
            {faults.map(f => {
                // Per-item safety check
                if (!f || !f.geojson) return null;
                
                // Ensure GeoJSON is valid object
                const geoData = typeof f.geojson === 'string' ? JSON.parse(f.geojson) : f.geojson;
                if (!geoData || !geoData.type) return null;

                return (
                    <GeoJSON 
                        key={`fault-${f.id}`} 
                        data={geoData} 
                        style={getFaultStyle}
                    >
                        <Popup className="text-slate-900 min-w-[200px]">
                            <div className="p-2 space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h4 className="font-bold text-sm">Fault Trace</h4>
                                    <Badge variant="outline" className="text-[10px] border-slate-400 text-slate-600">
                                        {f.kind || 'Fault'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                    <span className="text-slate-500 font-medium">Name:</span>
                                    <span className="font-mono">{f.name || 'Unnamed'}</span>
                                </div>
                            </div>
                        </Popup>
                        {labelsVisible && (
                            <Tooltip 
                                direction="center" 
                                opacity={0.8} 
                                permanent 
                                className="bg-transparent border-none shadow-none text-red-600 font-bold text-xs font-sans"
                            >
                                {f.name || 'Fault'}
                            </Tooltip>
                        )}
                    </GeoJSON>
                );
            })}
        </FeatureGroup>
    );
};

export default MapFaultTracesLayer;