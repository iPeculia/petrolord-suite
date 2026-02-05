import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateZonalStats } from '@/utils/petrophysicsCalculations';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ZoneStatsDashboard = ({ wells, markers }) => {
    // Group zones by name across all wells
    const zonalData = useMemo(() => {
        const rows = [];
        const uniqueZoneNames = [...new Set(markers.map(m => m.name))];
        
        // Standard Cutoffs for general stats (can be customizable later)
        const defaultCutoffs = { vshMax: 0.5, phiMin: 0.05, swMax: 1.0 }; 

        uniqueZoneNames.forEach(zoneName => {
            wells.forEach(well => {
                // Find top marker for this zone
                const topM = markers.find(m => m.well_id === well.id && m.name === zoneName);
                if (!topM) return;

                // Find base (next marker depth or end of well)
                // This is simplistic; ideally we pair Top X with Base X markers.
                // For now, we'll assume a fixed interval or look for next marker in depth order.
                const wellMarkers = markers.filter(m => m.well_id === well.id).sort((a,b) => a.depth - b.depth);
                const topIdx = wellMarkers.findIndex(m => m.id === topM.id);
                
                let baseDepth = well.depthRange.max;
                if (topIdx !== -1 && topIdx < wellMarkers.length - 1) {
                    baseDepth = wellMarkers[topIdx+1].depth;
                } else {
                    // If last marker, maybe just take 50ft or till TD
                    baseDepth = Math.min(topM.depth + 100, well.depthRange.max);
                }

                const stats = calculateZonalStats(
                    well.data, well.curveMap, topM.depth, baseDepth, defaultCutoffs, well.statistics.step
                );

                if (stats) {
                    rows.push({
                        well: well.name,
                        zone: zoneName,
                        interval: `${topM.depth.toFixed(0)} - ${baseDepth.toFixed(0)}`,
                        gross: stats.grossThickness,
                        net: stats.netThickness,
                        pay: stats.payThickness,
                        avgPhi: stats.avgPhi,
                        avgSw: stats.avgSw,
                        avgVsh: stats.avgVsh
                    });
                }
            });
        });
        return rows;
    }, [wells, markers]);

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Well,Zone,Interval,Gross,Net,Pay,AvgPhi,AvgSw,AvgVsh\n"
            + zonalData.map(r => `${r.well},${r.zone},${r.interval},${r.gross},${r.net},${r.pay},${r.avgPhi},${r.avgSw},${r.avgVsh}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "zonal_stats.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="h-full flex flex-col bg-slate-950 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium text-white">Zonal Statistics</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport} disabled={zonalData.length === 0}>
                    <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="p-0">
                    <table className="w-full text-xs text-left">
                        <thead className="text-slate-400 uppercase bg-slate-900 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Well</th>
                                <th className="px-4 py-3">Zone</th>
                                <th className="px-4 py-3">Interval (ft)</th>
                                <th className="px-4 py-3 text-right">Gross</th>
                                <th className="px-4 py-3 text-right">Net</th>
                                <th className="px-4 py-3 text-right">Pay</th>
                                <th className="px-4 py-3 text-right">Avg Phi</th>
                                <th className="px-4 py-3 text-right">Avg Sw</th>
                                <th className="px-4 py-3 text-right">Avg Vsh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {zonalData.length > 0 ? (
                                zonalData.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-900/50">
                                        <td className="px-4 py-2 font-medium text-slate-200">{row.well}</td>
                                        <td className="px-4 py-2 text-slate-300">{row.zone}</td>
                                        <td className="px-4 py-2 text-slate-400">{row.interval}</td>
                                        <td className="px-4 py-2 text-right text-slate-400">{row.gross.toFixed(1)}</td>
                                        <td className="px-4 py-2 text-right text-slate-400">{row.net.toFixed(1)}</td>
                                        <td className="px-4 py-2 text-right text-green-400 font-semibold">{row.pay.toFixed(1)}</td>
                                        <td className="px-4 py-2 text-right text-blue-400">{(row.avgPhi * 100).toFixed(1)}%</td>
                                        <td className="px-4 py-2 text-right text-cyan-400">{(row.avgSw * 100).toFixed(1)}%</td>
                                        <td className="px-4 py-2 text-right text-yellow-600">{(row.avgVsh * 100).toFixed(1)}%</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="9" className="p-8 text-center text-slate-500">No zones found. Add markers to wells to generate statistics.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ScrollArea>
        </Card>
    );
};

export default ZoneStatsDashboard;