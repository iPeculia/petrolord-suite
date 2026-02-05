import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WellMapVisualization = ({ wells, selectedIds, onToggle }) => {
  // Calculate center of wells to position map automatically
  const validWells = wells.filter(w => w.location && w.location.lat && w.location.lon);
  const latSum = validWells.reduce((acc, w) => acc + w.location.lat, 0);
  const lonSum = validWells.reduce((acc, w) => acc + w.location.lon, 0);
  const center = validWells.length > 0 ? [latSum / validWells.length, lonSum / validWells.length] : [28.5, -90.5];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-slate-800 relative z-0">
         <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%', background: '#0f172a' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {validWells.map(well => (
                <CircleMarker 
                    key={well.id}
                    center={[well.location.lat, well.location.lon]}
                    radius={8}
                    pathOptions={{ 
                        color: selectedIds.includes(well.id) ? '#10b981' : '#64748b', 
                        fillColor: well.status === 'warning' ? '#eab308' : (selectedIds.includes(well.id) ? '#10b981' : '#475569'),
                        fillOpacity: 0.8,
                        weight: 2
                    }}
                    eventHandlers={{
                        click: () => onToggle(well.id)
                    }}
                >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} className="bg-slate-900 text-white border-slate-700 text-xs">
                        <div className="font-bold">{well.name}</div>
                        <div className="text-[10px] font-normal">Operator: {well.operator}</div>
                    </Tooltip>
                </CircleMarker>
            ))}
         </MapContainer>
         
         {/* Legend Overlay */}
         <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur p-2 rounded border border-slate-700 z-[1000] text-[10px] text-slate-300">
             <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-400"></div> Selected
             </div>
             <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-slate-600 border border-slate-500"></div> Unselected
             </div>
             <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-yellow-500 border border-yellow-400"></div> Warning
             </div>
         </div>
    </div>
  );
};

export default WellMapVisualization;