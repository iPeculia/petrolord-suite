import React from 'react';
import StratigraphicColumn from './StratigraphicColumn';
import WellLogsPanel from './WellLogsPanel';
import PPPrognosisMainChart from './PPPrognosisMainChart';
import { AlertCircle } from 'lucide-react';

const PPPrognosisChart = ({ data, formations, casing, hardData }) => {
    // Calculate max depth from all available data sources to sync scales
    const maxDepth = React.useMemo(() => {
        const d1 = data && data.length > 0 ? Math.max(...data.map(d => d.depth)) : 0;
        const d2 = formations && formations.length > 0 ? Math.max(...formations.map(f => f.bottom)) : 0;
        return Math.max(d1, d2, 12000); // Minimum 12k ft scale if data is short
    }, [data, formations]);

    if (!data || data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                <div className="flex flex-col items-center text-slate-500">
                    <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                    <p>No Prognosis Data Available</p>
                    <p className="text-xs mt-1">Complete Phase 4 & 5 analysis to view chart.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            {/* Track 1: Stratigraphy (10% width) */}
            <div className="w-[10%] min-w-[80px] border-r border-slate-200 bg-slate-50 h-full">
                <StratigraphicColumn 
                    data={data} 
                    formations={formations} 
                    casing={casing} 
                    maxDepth={maxDepth} 
                />
            </div>

            {/* Track 2: Well Logs (25% width) */}
            <div className="w-[25%] min-w-[200px] border-r border-slate-200 bg-white h-full hidden md:block">
                <WellLogsPanel 
                    data={data} 
                    maxDepth={maxDepth} 
                />
            </div>

            {/* Track 3: PP-FG Main Chart (Remaining width) */}
            <div className="flex-1 min-w-[400px] bg-white relative h-full">
                {/* Add common depth axis labels on the left of this track if needed, 
                    but usually shared Y-axis is implied by alignment */}
                <PPPrognosisMainChart 
                    data={data} 
                    markers={hardData} 
                    casing={casing} 
                    maxDepth={maxDepth} 
                />
            </div>
        </div>
    );
};

export default PPPrognosisChart;