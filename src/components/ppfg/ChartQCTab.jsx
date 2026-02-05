import React, { useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ZoomIn, Activity, AlertTriangle, CheckCircle2, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';
import html2canvas from 'html2canvas';
import { useToast } from '@/components/ui/use-toast';

const ChartQCTab = ({ data }) => {
    const { toast } = useToast();
    const chartRef = useRef(null);

    // Process Data for Chart
    const processedData = useMemo(() => {
        if (!data || !data.depths) return [];
        
        return data.depths.map((d, i) => ({
            depth: d,
            gr: data.GR ? data.GR[i] : null,
            dt: data.dt ? data.dt[i] : null,
        })).filter((p, i) => i % 10 === 0); // Downsample for performance if needed
    }, [data]);

    // Calculate Statistics
    const stats = useMemo(() => {
        if (!data || !data.depths) return null;
        
        const totalPoints = data.depths.length;
        const grValid = data.GR ? data.GR.filter(v => v !== null && v !== -999.25).length : 0;
        const dtValid = data.dt ? data.dt.filter(v => v !== null && v !== -999.25).length : 0;
        
        const grCompleteness = (grValid / totalPoints) * 100;
        const dtCompleteness = (dtValid / totalPoints) * 100;

        const minDepth = Math.min(...data.depths);
        const maxDepth = Math.max(...data.depths);

        let status = 'Good';
        if (grCompleteness < 80 || dtCompleteness < 80) status = 'Fair';
        if (grCompleteness < 50 || dtCompleteness < 50) status = 'Poor';

        return {
            totalPoints,
            depthRange: `${Math.round(minDepth)} - ${Math.round(maxDepth)} ft`,
            grCompleteness: Math.round(grCompleteness),
            dtCompleteness: Math.round(dtCompleteness),
            status
        };
    }, [data]);

    const handleDownload = async () => {
        if (chartRef.current) {
            try {
                const canvas = await html2canvas(chartRef.current);
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'well-logs-qc.png';
                link.href = url;
                link.click();
                toast({ title: "Download Started", description: "Chart saved as PNG image." });
            } catch (err) {
                console.error(err);
                toast({ title: "Download Failed", description: "Could not generate image.", variant: "destructive" });
            }
        }
    };

    if (!data || !data.depths) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-slate-500 gap-4 p-8">
                <Activity className="w-16 h-16 text-slate-700" />
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-300">No Well Logs Available</h3>
                    <p className="text-sm">Load well data in Step 1 to view logs here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4 p-4 bg-slate-950" ref={chartRef}>
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <BarChart2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Well Log Quality Control</h3>
                        <p className="text-xs text-slate-400">Review Gamma Ray and Sonic curves</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {stats && (
                        <>
                            <div className="flex flex-col items-end px-3 border-r border-slate-800">
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Quality Status</span>
                                <Badge variant="outline" className={`${stats.status === 'Good' ? 'text-emerald-400 border-emerald-800 bg-emerald-950' : 'text-yellow-400 border-yellow-800 bg-yellow-950'}`}>
                                    {stats.status}
                                </Badge>
                            </div>
                            <div className="flex flex-col items-end px-3 border-r border-slate-800 hidden md:flex">
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Depth Range</span>
                                <span className="text-sm font-mono text-slate-200">{stats.depthRange}</span>
                            </div>
                        </>
                    )}
                    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 border-slate-700 text-slate-300 hover:text-white">
                        <Download className="w-4 h-4" /> Export Chart
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
                
                {/* Left Stats Panel */}
                <Card className="col-span-1 bg-slate-900 border-slate-800 overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-200">Data Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Points</span>
                                <span className="text-slate-200 font-mono">{stats?.totalPoints.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">Curve Completeness</h4>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-blue-400 font-medium">Gamma Ray (GR)</span>
                                    <span className="text-slate-300">{stats?.grCompleteness}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${stats?.grCompleteness}%` }} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-red-400 font-medium">Sonic (DT)</span>
                                    <span className="text-slate-300">{stats?.dtCompleteness}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${stats?.dtCompleteness}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded bg-slate-950 border border-slate-800">
                             <div className="flex items-start gap-2">
                                 <Activity className="w-4 h-4 text-slate-500 mt-0.5" />
                                 <p className="text-xs text-slate-400 leading-relaxed">
                                     Use the chart tools to zoom into specific intervals. Check for washouts or cycle skipping in DT curve.
                                 </p>
                             </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Chart Panel */}
                <Card className="col-span-3 bg-slate-900 border-slate-800 flex flex-col overflow-hidden">
                    <CardContent className="flex-1 p-2 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={processedData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                                <CartesianGrid {...getGridConfig()} />
                                
                                {/* Y Axis - Depth */}
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} />

                                {/* X Axis 1 - Gamma Ray */}
                                <XAxis 
                                    xAxisId="gr"
                                    type="number" 
                                    dataKey="gr" 
                                    domain={[0, 150]} 
                                    orientation="bottom"
                                    stroke="#3b82f6"
                                    label={{ value: 'Gamma Ray (API)', position: 'bottom', fill: '#3b82f6', fontSize: 12 }}
                                    tick={{ fontSize: 10, fill: '#3b82f6' }}
                                />

                                {/* X Axis 2 - Sonic */}
                                <XAxis 
                                    xAxisId="dt"
                                    type="number" 
                                    dataKey="dt" 
                                    domain={[40, 240]} 
                                    orientation="top"
                                    stroke="#ef4444"
                                    label={{ value: 'Sonic (us/ft)', position: 'top', fill: '#ef4444', fontSize: 12 }}
                                    tick={{ fontSize: 10, fill: '#ef4444' }}
                                />

                                <Tooltip contentStyle={getTooltipStyle()} />
                                <Legend verticalAlign="top" height={36}/>

                                <Line 
                                    xAxisId="gr"
                                    type="monotone" 
                                    dataKey="gr" 
                                    stroke="#3b82f6" 
                                    strokeWidth={1} 
                                    dot={false} 
                                    name="Gamma Ray"
                                />
                                
                                <Line 
                                    xAxisId="dt"
                                    type="monotone" 
                                    dataKey="dt" 
                                    stroke="#ef4444" 
                                    strokeWidth={1} 
                                    dot={false} 
                                    name="Sonic (DT)"
                                />

                                <Brush 
                                    dataKey="depth" 
                                    height={30} 
                                    stroke="#64748b"
                                    fill="#1e293b"
                                    tickFormatter={(val) => Math.round(val)}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ChartQCTab;