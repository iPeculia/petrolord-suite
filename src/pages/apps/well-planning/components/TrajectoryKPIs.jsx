import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, ArrowDownToLine, MoveHorizontal, AlertTriangle, Layers } from 'lucide-react';

const KPIItem = ({ label, value, unit, icon: Icon, color = "text-slate-400", warning = false }) => (
    <div className={`flex flex-col p-3 rounded-lg border ${warning ? 'bg-red-900/10 border-red-900/30' : 'bg-slate-800 border-slate-700'}`}>
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
            {Icon && <Icon className={`w-3 h-3 ${warning ? 'text-red-400' : color}`} />}
        </div>
        <div className="flex items-baseline">
            <span className={`text-lg font-mono font-bold ${warning ? 'text-red-400' : 'text-slate-200'}`}>
                {value}
            </span>
            {unit && <span className="ml-1 text-[10px] text-slate-500">{unit}</span>}
        </div>
    </div>
);

const TrajectoryKPIs = ({ summary, qc, depthUnit = 'ft' }) => {
    if (!summary) return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-800/50 rounded-lg animate-pulse" />)}
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPIItem 
                label="Total MD" 
                value={summary.totalMD.toFixed(0)} 
                unit={depthUnit} 
                icon={Layers} 
                color="text-blue-400"
            />
            <KPIItem 
                label="Total TVD" 
                value={summary.totalTVD.toFixed(0)} 
                unit={depthUnit} 
                icon={ArrowDownToLine} 
                color="text-emerald-400"
            />
            <KPIItem 
                label="Displacement" 
                value={summary.horizontalDisplacement.toFixed(0)} 
                unit={depthUnit} 
                icon={MoveHorizontal} 
                color="text-orange-400"
            />
            <KPIItem 
                label="Max Inc" 
                value={summary.maxInclination.toFixed(1)} 
                unit="°" 
                icon={Activity} 
                color="text-purple-400"
            />
            <KPIItem 
                label="Max DLS" 
                value={summary.maxDLS.toFixed(2)} 
                unit={`/ ${depthUnit === 'ft' ? '100ft' : '30m'}`}
                icon={AlertTriangle} 
                color="text-yellow-400"
                warning={qc && !qc.guards?.lengthSanity?.pass} // Example warning logic
            />
            <KPIItem 
                label="Bottom Hole" 
                value={`${summary.wellheadLat.toFixed(4)}, ${summary.wellheadLon.toFixed(4)}`} 
                unit=""
                icon={Activity} 
                color="text-slate-400"
            />
        </div>
    );
};

export default TrajectoryKPIs;