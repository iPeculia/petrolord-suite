import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import { MapPin, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FieldLocationMap = ({ location }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Basic Leaflet initialization (simulated since we can't guarantee external tile servers always work without API keys in some envs)
    // In a real scenario, this would initialize L.map
    useEffect(() => {
        if (!mapRef.current) return;
        
        // Mock map visual placeholder
        const ctx = mapRef.current.getContext('2d');
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, mapRef.current.width, mapRef.current.height);
        
        // Grid lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for(let i = 0; i < mapRef.current.width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, mapRef.current.height);
            ctx.stroke();
        }
        for(let i = 0; i < mapRef.current.height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(mapRef.current.width, i);
            ctx.stroke();
        }
        
        // Field Outline (Mock)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(mapRef.current.width/2, mapRef.current.height/2, 100, 60, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fill();
        
        // Wells (Mock)
        const wells = [
            {x: -20, y: -10}, {x: 30, y: 20}, {x: -40, y: 30}
        ];
        
        ctx.fillStyle = '#f59e0b';
        wells.forEach(w => {
            ctx.beginPath();
            ctx.arc(mapRef.current.width/2 + w.x, mapRef.current.height/2 + w.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

    }, []);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full min-h-[400px] relative overflow-hidden group">
             <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur p-2 rounded border border-slate-700">
                 <div className="text-xs text-slate-400 font-bold uppercase mb-1">Field Coordinates</div>
                 <div className="text-sm text-white font-mono">
                    LAT: {location.lat || '00°00\'00" N'}<br/>
                    LNG: {location.lng || '00°00\'00" E'}
                 </div>
             </div>
             
             <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                 <Button size="icon" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600">
                     <Maximize2 className="w-4 h-4" />
                 </Button>
                 <Button size="icon" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600">
                     <MapPin className="w-4 h-4" />
                 </Button>
             </div>

             <canvas 
                ref={mapRef} 
                width={800} 
                height={500} 
                className="w-full h-full object-cover"
             />
             
             <div className="absolute bottom-4 right-4 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-400 border border-slate-700">
                 Scale 1:50000
             </div>
        </Card>
    );
};

export default FieldLocationMap;