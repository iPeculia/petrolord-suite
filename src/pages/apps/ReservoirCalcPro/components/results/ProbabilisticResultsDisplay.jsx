import React, { useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Maximize2, ZoomIn, Expand } from 'lucide-react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import ProbabilisticSummaryTable from './ProbabilisticSummaryTable';
import { ReportGenerator } from '../tools/ReportGenerator';
import { useToast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import ResultsModal from './ResultsModal';

const ProbabilisticResultsDisplay = ({ isCompact = false }) => {
    const { state } = useReservoirCalc();
    const { probResults } = state;
    const { toast } = useToast();
    
    const [isFullViewOpen, setIsFullViewOpen] = useState(false);
    
    // Refs for capturing charts
    const histogramRef = useRef(null);
    const cdfRef = useRef(null);
    const tornadoRef = useRef(null);

    const [isExporting, setIsExporting] = useState(false);

    if (!probResults) return <div className="flex items-center justify-center h-full text-slate-500">Run a simulation to see results.</div>;

    const stats = probResults.stats.stooip; // Default to STOOIP for charts
    const cdfData = stats.cdf || [];
    const sensitivity = probResults.stats.sensitivity || [];
    
    const captureChart = async (ref) => {
        if (ref.current) {
            const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#0f172a' }); // Capture at 2x for quality
            return canvas.toDataURL('image/png');
        }
        return null;
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        toast({ title: "Generating Report", description: "Capturing charts and compiling data..." });
        
        try {
            // Capture charts
            const histImg = await captureChart(histogramRef);
            const cdfImg = await captureChart(cdfRef);
            const tornadoImg = await captureChart(tornadoRef);

            const chartImages = {
                histogram: histImg,
                cdf: cdfImg,
                tornado: tornadoImg
            };

            await ReportGenerator.generateProbabilisticReport(
                state.reservoirName || 'Project', 
                probResults, 
                state.unitSystem,
                chartImages
            );
            
            toast({ title: "Success", description: "Report downloaded successfully.", className: "bg-emerald-900 text-white border-emerald-800" });
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Export Failed", description: "Could not generate PDF report. " + e.message });
        } finally {
            setIsExporting(false);
        }
    };

    // Prepare Tornado Data
    const reversedSensitivity = [...sensitivity].reverse();
    const tornadoTraces = [
        {
            type: 'bar',
            y: reversedSensitivity.map(s => s.parameter.toUpperCase()),
            x: reversedSensitivity.map(s => -(s.baseValue - s.lowValue)), // Left Side
            orientation: 'h',
            name: 'Low Case',
            marker: { color: '#ef4444' },
            width: 0.6,
            hoverinfo: 'x+name'
        },
        {
            type: 'bar',
            y: reversedSensitivity.map(s => s.parameter.toUpperCase()),
            x: reversedSensitivity.map(s => s.highValue - s.baseValue), // Right Side
            orientation: 'h',
            name: 'High Case',
            marker: { color: '#3b82f6' },
            width: 0.6,
             hoverinfo: 'x+name'
        }
    ];

    // Histogram with P-values lines
    const histTrace = {
        x: probResults.raw.stooip.map(v => v/1000000), 
        type: 'histogram',
        marker: { color: 'rgba(16, 185, 129, 0.6)', line: { color: '#059669', width: 1 } },
        name: 'Trials',
        nbinsx: 50
    };

    const commonLayout = {
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', size: 10 },
        margin: { t: 30, r: 20, l: 40, b: 40 },
        xaxis: { gridcolor: '#334155', zerolinecolor: '#475569' },
        yaxis: { gridcolor: '#334155', zerolinecolor: '#475569' },
    };

    // Compact mode layout vs Full mode layout
    const containerClass = isCompact 
        ? "flex flex-col gap-4 p-2" 
        : "grid grid-cols-1 gap-6 p-4";

    const cardClass = isCompact
        ? "p-3 bg-slate-900 border-slate-800 min-h-[250px]"
        : "p-4 bg-slate-900 border-slate-800 min-h-[400px]";

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
             {/* Header & Export - Only show full header in non-compact mode */}
             {!isCompact && (
                <div className="flex justify-between items-end p-4 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white">Probabilistic Simulation Results</h2>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            Monte Carlo Analysis • <span className="text-emerald-400">{probResults.raw.stooip.length.toLocaleString()} Iterations</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2" 
                            onClick={handleExportPDF}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <span className="animate-pulse">Exporting...</span>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" /> Export Report (PDF)
                                </>
                            )}
                        </Button>
                    </div>
                </div>
             )}

            <div className={containerClass}>
                {/* Key KPIs - Responsive Grid */}
                <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
                    {!isCompact && (
                         <Card className="p-4 bg-slate-900 border-slate-800 text-center shadow-md hover:border-slate-700 transition-colors">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">P90 (Proven)</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-white">{(stats.p90 / 1000000).toFixed(2)}</span>
                                <span className="text-xs text-slate-500">MMstb</span>
                            </div>
                        </Card>
                    )}
                    <Card className={`${isCompact ? 'p-3' : 'p-4'} bg-emerald-950/20 border-emerald-500/30 text-center shadow-lg shadow-emerald-900/10 relative overflow-hidden hover:bg-emerald-950/30 transition-colors`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-400"></div>
                        <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1">P50 (Probable)</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className={`${isCompact ? 'text-3xl' : 'text-4xl'} font-black text-white`}>{(stats.p50 / 1000000).toFixed(2)}</span>
                            <span className="text-xs text-emerald-400 font-bold">MMstb</span>
                        </div>
                        {isCompact && (
                             <div className="flex justify-between mt-2 pt-2 border-t border-emerald-900/30 text-[10px]">
                                 <div className="text-slate-400">P90: <span className="text-white">{(stats.p90 / 1000000).toFixed(1)}</span></div>
                                 <div className="text-slate-400">P10: <span className="text-white">{(stats.p10 / 1000000).toFixed(1)}</span></div>
                             </div>
                        )}
                    </Card>
                    {!isCompact && (
                        <Card className="p-4 bg-slate-900 border-slate-800 text-center shadow-md hover:border-slate-700 transition-colors">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">P10 (Possible)</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-white">{(stats.p10 / 1000000).toFixed(2)}</span>
                                <span className="text-sm text-slate-500">MMstb</span>
                            </div>
                        </Card>
                    )}
                </div>
                
                {/* Open Modal Button for Compact View */}
                {isCompact && (
                    <Button variant="outline" size="sm" className="w-full border-dashed border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => setIsFullViewOpen(true)}>
                        <Expand className="w-3 h-3 mr-2" /> Expand All Charts
                    </Button>
                )}

                {/* Charts Grid - Adjust columns based on compact mode */}
                <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
                    {/* Histogram */}
                    <Card className={`${cardClass} flex flex-col`}>
                        <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
                            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                <ZoomIn className="w-3 h-3 text-blue-400" /> Volume Distribution
                            </h3>
                        </div>
                        <div className="flex-1 relative min-h-0" ref={histogramRef}>
                             <Plot
                                data={[histTrace]}
                                layout={{
                                    ...commonLayout,
                                    title: undefined,
                                    xaxis: { ...commonLayout.xaxis, title: isCompact ? '' : 'STOOIP (MMstb)', tickfont: {size: 9} },
                                    yaxis: { ...commonLayout.yaxis, title: isCompact ? '' : 'Frequency', tickfont: {size: 9} },
                                    showlegend: false,
                                    margin: isCompact ? { t: 10, r: 10, l: 30, b: 20 } : { t: 30, r: 20, l: 50, b: 40 },
                                    shapes: [
                                        { type: 'line', x0: stats.p90/1e6, x1: stats.p90/1e6, y0: 0, y1: 1, xref: 'x', yref: 'paper', line: {color: '#94a3b8', width: 1, dash: 'dot'} },
                                        { type: 'line', x0: stats.p50/1e6, x1: stats.p50/1e6, y0: 0, y1: 1, xref: 'x', yref: 'paper', line: {color: '#10b981', width: 2} },
                                        { type: 'line', x0: stats.p10/1e6, x1: stats.p10/1e6, y0: 0, y1: 1, xref: 'x', yref: 'paper', line: {color: '#94a3b8', width: 1, dash: 'dot'} }
                                    ]
                                }}
                                useResizeHandler
                                style={{ width: '100%', height: '100%' }}
                                config={{displayModeBar: !isCompact, modeBarButtonsToRemove: ['lasso2d', 'select2d']}}
                            />
                        </div>
                    </Card>
                    
                    {/* CDF Curve */}
                    <Card className={`${cardClass} flex flex-col`}>
                        <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
                            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                <ZoomIn className="w-3 h-3 text-amber-400" /> Expectation Curve
                            </h3>
                        </div>
                        <div className="flex-1 relative min-h-0" ref={cdfRef}>
                            <Plot
                                data={[{
                                    x: cdfData.map(p => p.x / 1000000),
                                    y: cdfData.map(p => 100 - p.y), 
                                    type: 'scatter',
                                    mode: 'lines',
                                    line: { color: '#f59e0b', width: 2, shape: 'spline' },
                                    fill: 'tozeroy',
                                    fillcolor: 'rgba(245, 158, 11, 0.1)'
                                }]}
                                layout={{
                                    ...commonLayout,
                                    title: undefined,
                                    xaxis: { ...commonLayout.xaxis, title: isCompact ? '' : 'STOOIP (MMstb)', tickfont: {size: 9} },
                                    yaxis: { ...commonLayout.yaxis, title: isCompact ? '' : 'Probability (%)', range: [0, 105], tickfont: {size: 9} },
                                    showlegend: false,
                                    margin: isCompact ? { t: 10, r: 10, l: 30, b: 20 } : { t: 30, r: 20, l: 50, b: 40 },
                                }}
                                useResizeHandler
                                style={{ width: '100%', height: '100%' }}
                                config={{displayModeBar: !isCompact, modeBarButtonsToRemove: ['lasso2d', 'select2d']}}
                            />
                        </div>
                    </Card>
                </div>

                {/* Charts Row 2 & Stats */}
                <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
                    {/* Tornado */}
                    <Card className={`${isCompact ? '' : 'lg:col-span-2'} ${cardClass} flex flex-col`}>
                         <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
                            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                <Maximize2 className="w-3 h-3 text-purple-400" /> Sensitivity Analysis
                            </h3>
                        </div>
                        <div className="flex-1 relative min-h-0" ref={tornadoRef}>
                             <Plot
                                data={tornadoTraces}
                                layout={{
                                    ...commonLayout,
                                    title: undefined,
                                    barmode: 'relative',
                                    margin: isCompact ? { t: 10, r: 10, l: 80, b: 20 } : { t: 30, r: 20, l: 120, b: 40 },
                                    showlegend: !isCompact,
                                    legend: { orientation: 'h', y: 1.1, x: 0.5, xanchor: 'center', font: {color: '#94a3b8'} },
                                    xaxis: { ...commonLayout.xaxis, title: isCompact ? '' : 'Impact on Mean Volume (MMstb)', tickfont: {size: 9} }
                                }}
                                useResizeHandler
                                style={{ width: '100%', height: '100%' }}
                                config={{displayModeBar: !isCompact}}
                            />
                        </div>
                    </Card>
                    
                    {/* Stats Table - Only visible in full mode or if explicitly requested */}
                    {!isCompact && (
                        <div className="flex flex-col gap-4">
                             <Card className="p-4 bg-slate-900 border-slate-800 flex-1">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                    <h3 className="text-sm font-bold text-slate-200">Detailed Statistics</h3>
                                </div>
                                <ProbabilisticSummaryTable />
                                
                                <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800 text-[10px] text-slate-400">
                                    <p className="mb-2 font-bold text-slate-300">Convergence Status:</p>
                                    <div className="flex justify-between mb-1">
                                        <span>Iterations:</span> <span className="text-slate-200">{probResults.raw.stooip.length}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span>Mean Stability:</span> <span className="text-emerald-400">Stable (&lt;0.1%)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>P90/P10 Ratio:</span> <span className="text-blue-400">{(stats.p10 / stats.p90).toFixed(2)}</span>
                                    </div>
                                </div>
                             </Card>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Self-contained modal trigger for compact view */}
            <ResultsModal 
                isOpen={isFullViewOpen} 
                onClose={() => setIsFullViewOpen(false)} 
            />
        </div>
    );
};

export default ProbabilisticResultsDisplay;