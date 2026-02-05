import React from 'react';

const CrossSectionLegend = ({ layers }) => {
    return (
        <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-lg min-w-[150px]">
            <h4 className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-700 pb-1">Legend</h4>
            <div className="space-y-1.5">
                {layers.wells.visible && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <div className="w-3 h-3 border border-white bg-transparent"></div>
                        <span>Well Bore</span>
                    </div>
                )}
                {layers.horizons.visible && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <div className="w-3 h-0.5 bg-green-400"></div>
                        <span>Horizon A</span>
                    </div>
                )}
                {layers.faults.visible && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <div className="w-3 h-0.5 bg-red-500"></div>
                        <span>Faults</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrossSectionLegend;