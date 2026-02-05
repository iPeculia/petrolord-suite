import React from 'react';
import { GeoJSON, FeatureGroup, Popup, Tooltip } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

const MapSeismicLinesLayer = ({ lines, style, visible, labelsVisible, onSelect }) => {
    if (!visible) return null;
    if (!lines || !Array.isArray(lines) || lines.length === 0) return null;

    return (
        <FeatureGroup>
            {lines.map(s => {
                if (!s || !s.meta?.geojson) return null;
                
                let geoData = s.meta.geojson;
                try {
                    if (typeof geoData === 'string') geoData = JSON.parse(geoData);
                } catch (e) { return null; }

                if(!geoData) return null;

                return (
                    <GeoJSON 
                        key={`seis-${s.id}`} 
                        data={geoData} 
                        style={{
                            color: style?.color || '#F59E0B',
                            weight: 4,
                            opacity: style?.opacity || 0.9,
                            lineCap: 'square'
                        }}
                        eventHandlers={{
                            click: (e) => {
                                // Don't stop propagation necessarily
                                if(onSelect) onSelect(s);
                            }
                        }}
                    >
                        <Popup className="text-slate-900">
                            <div className="p-2 min-w-[180px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-amber-600"/>
                                    <span className="font-bold text-sm">{s.name || 'Unnamed Line'}</span>
                                </div>
                                <div className="text-xs text-slate-500 mb-3">
                                    Type: {s.type === 'seis.line' ? '2D Line' : '3D Survey Boundary'}
                                </div>
                                <Button 
                                    size="sm" 
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white h-7 text-xs"
                                    onClick={() => onSelect && onSelect(s)}
                                >
                                    Open in Seismic Analyzer
                                </Button>
                            </div>
                        </Popup>
                        {labelsVisible && (
                            <Tooltip 
                                direction="top" 
                                offset={[0, -5]} 
                                opacity={0.9} 
                                className="font-bold text-xs bg-amber-50 text-amber-900 border-amber-200"
                            >
                                {s.name || 'Seismic Line'}
                            </Tooltip>
                        )}
                    </GeoJSON>
                );
            })}
        </FeatureGroup>
    );
};

export default MapSeismicLinesLayer;