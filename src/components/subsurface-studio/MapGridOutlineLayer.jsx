import React from 'react';
import { GeoJSON, FeatureGroup, Popup } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';

const MapGridOutlineLayer = ({ grids, style, visible }) => {
    if (!visible) return null;
    if (!grids || !Array.isArray(grids) || grids.length === 0) return null;

    return (
        <FeatureGroup>
            {grids.map(g => {
                if (!g || !g.meta?.geojson) return null;
                
                let geoData = g.meta.geojson;
                try {
                    if (typeof geoData === 'string') geoData = JSON.parse(geoData);
                } catch (e) { return null; }

                if (!geoData) return null;

                return (
                    <GeoJSON 
                        key={`grid-${g.id}`} 
                        data={geoData} 
                        style={{ 
                            color: style?.color || '#6366F1', 
                            weight: 2, 
                            opacity: style?.opacity || 0.5, 
                            dashArray: '4, 4', 
                            fill: true,
                            fillColor: style?.color || '#6366F1',
                            fillOpacity: 0.1
                        }}
                    >
                        <Popup className="text-slate-900 min-w-[200px]">
                            <div className="p-2 space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h4 className="font-bold text-sm">Reservoir Grid</h4>
                                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-0">3D Grid</Badge>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="grid grid-cols-2 gap-1">
                                        <span className="text-slate-500">Name:</span>
                                        <span className="font-medium">{g.name || 'Unnamed Grid'}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </GeoJSON>
                );
            })}
        </FeatureGroup>
    );
};

export default MapGridOutlineLayer;