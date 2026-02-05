import React from 'react';

const StatBox = ({ label, value, subtext, color = "text-white" }) => (
    <div className="flex flex-col justify-center px-4 py-2 bg-slate-900 border border-slate-800 rounded h-full">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{label}</div>
        <div className={`text-xl font-mono font-bold ${color} mt-1`}>{value}</div>
        {subtext && <div className="text-[10px] text-slate-600 mt-0.5">{subtext}</div>}
    </div>
);

const FieldStatisticsSummary = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    // Compute overall field stats from the depth-indexed stats
    const maxPP = Math.max(...stats.map(s => s.pp.max));
    const avgPP = stats.reduce((a,b) => a + b.pp.mean, 0) / stats.length;
    
    // Safe check for depths
    const minDepth = stats[0]?.depth || 0;
    const maxDepth = stats[stats.length-1]?.depth || 0;
    const depthRange = `${minDepth} - ${maxDepth} ft`;

    return (
        <div className="grid grid-cols-4 gap-4 h-full">
             <StatBox label="Field Depth Range" value={depthRange} color="text-slate-200" />
             <StatBox label="Max Field Pressure" value={`${maxPP.toFixed(0)} psi`} color="text-red-400" subtext="Highest detected PP" />
             <StatBox label="Avg Field Pressure" value={`${avgPP.toFixed(0)} psi`} color="text-emerald-400" subtext="Mean across all wells" />
             <StatBox label="Data Coverage" value={stats.length} subtext="Depth slices analyzed" color="text-blue-400" />
        </div>
    );
};

export default FieldStatisticsSummary;