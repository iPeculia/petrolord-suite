import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, BarChart2, Play, CheckCircle2 } from 'lucide-react';
import Plot from 'react-plotly.js';
import { runQCAnalysis } from '@/utils/petrophysicsQC';
import { useResizeDetector } from 'react-resize-detector';

const QCPanel = ({ petroState, onSaveReport }) => {
    const { activeWellId, wells } = petroState;
    const activeWell = wells.find(w => w.id === activeWellId);
    const [report, setReport] = useState(null);
    const { width, height, ref } = useResizeDetector();

    const handleRunQC = () => {
        if (!activeWell) return;
        const qcResult = runQCAnalysis(activeWell);
        setReport(qcResult);
        if (onSaveReport) {
            onSaveReport(qcResult);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const renderDistribution = (curve) => {
        if (!activeWell || !report || !report.stats[curve]) return null;
        const curveName = activeWell.curveMap[curve];
        const values = activeWell.data.map(d => d[curveName]).filter(v => v !== null && !isNaN(v));
        
        return (
            <div className="h-64 w-full border border-slate-800 rounded-lg p-2 bg-slate-900/50">
                <Plot
                    data={[{
                        x: values,
                        type: 'histogram',
                        marker: { color: '#6366f1' },
                        name: curve
                    }]}
                    layout={{
                        title: { text: `${curve} Distribution`, font: { color: '#e2e8f0', size: 12 } },
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        margin: { l: 40, r: 20, t: 30, b: 30 },
                        xaxis: { title: { text: activeWell.curves.find(c => c.mnemonic === curveName)?.unit || '', font: { color: '#94a3b8', size: 10 } }, tickfont: { color: '#94a3b8' } },
                        yaxis: { title: { text: 'Count', font: { color: '#94a3b8', size: 10 } }, tickfont: { color: '#94a3b8' } },
                        showlegend: false
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col gap-4 p-4">
            {/* Header Section */}
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Quality Control Dashboard</h2>
                        <p className="text-xs text-slate-400">Automated data validation and integrity checks</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    {report && (
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Quality Score</p>
                            <p className={`text-3xl font-bold ${getScoreColor(report.score)}`}>{report.score.toFixed(0)}<span className="text-sm text-slate-600">/100</span></p>
                        </div>
                    )}
                    <Button onClick={handleRunQC} disabled={!activeWell} className="bg-blue-600 hover:bg-blue-500">
                        <Play className="w-4 h-4 mr-2" /> Run QC Analysis
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex gap-4 min-h-0">
                {report ? (
                    <>
                        {/* Issues List */}
                        <Card className="w-1/3 bg-slate-950 border-slate-800 flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-300">Identified Issues</CardTitle>
                            </CardHeader>
                            <ScrollArea className="flex-1 p-4 pt-0">
                                <div className="space-y-3">
                                    {report.flags.length === 0 ? (
                                        <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                                            <CheckCircle2 className="w-12 h-12 mb-3 text-green-500/50" />
                                            <p>No issues detected!</p>
                                        </div>
                                    ) : (
                                        report.flags.map((flag, idx) => (
                                            <Alert key={idx} className={`border-l-4 ${flag.severity === 'Critical' ? 'border-l-red-500 bg-red-500/5 border-slate-800' : flag.severity === 'Warning' ? 'border-l-yellow-500 bg-yellow-500/5 border-slate-800' : 'border-l-blue-500 bg-blue-500/5 border-slate-800'}`}>
                                                <div className="flex items-start gap-3">
                                                    {flag.severity === 'Critical' && <AlertCircle className="w-4 h-4 text-red-500 mt-1" />}
                                                    {flag.severity === 'Warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1" />}
                                                    {flag.severity === 'Info' && <Info className="w-4 h-4 text-blue-500 mt-1" />}
                                                    <div>
                                                        <AlertTitle className={`text-xs font-bold ${flag.severity === 'Critical' ? 'text-red-400' : flag.severity === 'Warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                                            {flag.severity} • {flag.section}
                                                        </AlertTitle>
                                                        <AlertDescription className="text-xs text-slate-300 mt-1">
                                                            {flag.message}
                                                        </AlertDescription>
                                                    </div>
                                                </div>
                                            </Alert>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>

                        {/* Visualization & Stats */}
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-4 gap-4">
                                {Object.entries(report.stats).slice(0, 4).map(([key, stats]) => (
                                    <Card key={key} className="bg-slate-900 border-slate-800 p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-300">{key}</span>
                                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">{stats.count} pts</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-1 text-[10px] text-slate-400">
                                            <span>Min:</span> <span className="text-slate-200 text-right">{stats.min.toFixed(2)}</span>
                                            <span>Max:</span> <span className="text-slate-200 text-right">{stats.max.toFixed(2)}</span>
                                            <span>Mean:</span> <span className="text-slate-200 text-right">{stats.mean.toFixed(2)}</span>
                                            <span>Outliers:</span> <span className="text-slate-200 text-right text-red-400">{stats.outliers}</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Charts Tab */}
                            <Card className="flex-1 bg-slate-950 border-slate-800 flex flex-col min-h-0">
                                <Tabs defaultValue="histograms" className="flex-1 flex flex-col">
                                    <div className="px-4 pt-4">
                                        <TabsList className="bg-slate-900 border-slate-800">
                                            <TabsTrigger value="histograms">Distributions</TabsTrigger>
                                            <TabsTrigger value="gaps">Data Gaps</TabsTrigger>
                                        </TabsList>
                                    </div>
                                    <TabsContent value="histograms" className="flex-1 p-4 overflow-y-auto">
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.keys(report.stats).map(curve => renderDistribution(curve))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="gaps" className="flex-1 p-4">
                                        {report.gaps.length > 0 ? (
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-slate-400 uppercase bg-slate-900">
                                                    <tr>
                                                        <th className="px-4 py-3">Top Depth</th>
                                                        <th className="px-4 py-3">Base Depth</th>
                                                        <th className="px-4 py-3">Gap Size</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800">
                                                    {report.gaps.map((gap, i) => (
                                                        <tr key={i} className="hover:bg-slate-900/50">
                                                            <td className="px-4 py-3 font-mono text-slate-300">{gap.top.toFixed(2)}</td>
                                                            <td className="px-4 py-3 font-mono text-slate-300">{gap.base.toFixed(2)}</td>
                                                            <td className="px-4 py-3 font-bold text-red-400">{gap.size.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-500">
                                                No significant depth gaps detected.
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </Card>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/30">
                        <div className="text-center max-w-md">
                            <ShieldCheck className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-300">No Analysis Results</h3>
                            <p className="text-slate-500 mt-2 mb-6">Select a well and run the QC engine to analyze data integrity, identify outliers, and validate physics constraints.</p>
                            <Button onClick={handleRunQC} disabled={!activeWell} variant="outline" className="border-slate-700 text-slate-300">
                                Run Initial Analysis
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QCPanel;