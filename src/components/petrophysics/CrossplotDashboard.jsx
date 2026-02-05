import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScatterChart, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { calculateLinearRegression, calculatePowerLawRegression, calculateExponentialRegression } from '@/utils/petrophysicsCalculations';
import { useResizeDetector } from 'react-resize-detector';

const CrossplotDashboard = ({ data, curveMap, markers }) => {
    const { width, height, ref } = useResizeDetector();
    const [xAxis, setXAxis] = useState('NPHI');
    const [yAxis, setYAxis] = useState('RHOB');
    const [colorAxis, setColorAxis] = useState('GR');
    const [showTrend, setShowTrend] = useState(false);
    const [trendType, setTrendType] = useState('linear');
    const [selectedPoints, setSelectedPoints] = useState(null);

    // Presets
    const applyPreset = (preset) => {
        if (preset === 'den-neu') {
            setXAxis('NPHI'); setYAxis('RHOB'); setColorAxis('GR');
        } else if (preset === 'pickett') {
            setXAxis('PHIE'); setYAxis('RES_DEEP'); setColorAxis('VSH'); setTrendType('power');
        } else if (preset === 'buckles') {
            setXAxis('PHIE'); setYAxis('SW'); setColorAxis('VSH'); setTrendType('power');
        } else if (preset === 'phi-k') {
            setXAxis('PHIE'); setYAxis('PERM'); setColorAxis('VSH'); setTrendType('exponential');
        }
    };

    const availableCurves = useMemo(() => {
        return Object.keys(curveMap).filter(k => curveMap[k]);
    }, [curveMap]);

    const plotData = useMemo(() => {
        if (!data || !curveMap[xAxis] || !curveMap[yAxis]) return null;
        
        const xKey = curveMap[xAxis];
        const yKey = curveMap[yAxis];
        const cKey = curveMap[colorAxis];
        const depthKey = curveMap['DEPTH'];

        const xData = [];
        const yData = [];
        const cData = [];
        const textData = [];

        data.forEach(row => {
            if (row[xKey] !== null && row[yKey] !== null) {
                xData.push(row[xKey]);
                yData.push(row[yKey]);
                cData.push(cKey ? row[cKey] : 0);
                textData.push(`MD: ${row[depthKey]?.toFixed(1)}`);
            }
        });

        return { x: xData, y: yData, c: cData, text: textData };
    }, [data, curveMap, xAxis, yAxis, colorAxis]);

    const regression = useMemo(() => {
        if (!showTrend || !plotData || plotData.x.length < 2) return null;
        
        let res;
        if (trendType === 'linear') res = calculateLinearRegression(plotData.x, plotData.y);
        else if (trendType === 'power') res = calculatePowerLawRegression(plotData.x, plotData.y);
        else if (trendType === 'exponential') res = calculateExponentialRegression(plotData.x, plotData.y);

        if (!res) return null;

        // Generate line points
        const xMin = Math.min(...plotData.x);
        const xMax = Math.max(...plotData.x);
        const lineX = [];
        const lineY = [];
        const steps = 50;
        const stepSize = (xMax - xMin) / steps;

        for(let i=0; i<=steps; i++) {
            const x = xMin + i * stepSize;
            let y;
            if (trendType === 'linear') y = res.slope * x + res.intercept;
            else if (trendType === 'power') y = res.a * Math.pow(x, res.b);
            else if (trendType === 'exponential') y = res.a * Math.exp(res.b * x);
            
            lineX.push(x);
            lineY.push(y);
        }

        return { lineX, lineY, stats: res };
    }, [plotData, showTrend, trendType]);

    const traces = useMemo(() => {
        if (!plotData) return [];

        const scatter = {
            x: plotData.x,
            y: plotData.y,
            mode: 'markers',
            type: 'scatter',
            text: plotData.text,
            marker: {
                color: plotData.c,
                colorscale: 'Viridis',
                showscale: true,
                colorbar: { title: colorAxis, thickness: 10 },
                size: 6,
                opacity: 0.7
            },
            name: 'Data Points'
        };

        const t = [scatter];

        if (regression) {
            t.push({
                x: regression.lineX,
                y: regression.lineY,
                mode: 'lines',
                type: 'scatter',
                line: { color: 'red', width: 3, dash: 'dash' },
                name: `Trend (R²=${regression.stats.rSquared?.toFixed(3)})`
            });
        }

        return t;
    }, [plotData, regression, colorAxis]);

    const layout = useMemo(() => {
        const isLogX = xAxis === 'RES_DEEP' || xAxis === 'PERM' || xAxis === 'RT';
        const isLogY = yAxis === 'RES_DEEP' || yAxis === 'PERM' || yAxis === 'RT';
        const isReversedY = yAxis === 'RHOB' || yAxis === 'NPHI' || yAxis === 'DT'; // Conventionally RHOB plots reversed in Density-Neutron? No, usually Density on Y (2.0-3.0 reversed?) Standard Den-Neu: NPHI X (0.45 to -0.15), RHOB Y (1.95 to 2.95).
        // Actually standard triple combo: NPHI/RHOB on same track.
        // Crossplot: X=NPHI (linear), Y=RHOB (linear, typically reversed to match depth density logic? No, standard crossplot is cartesian). 
        // Let's stick to standard autoscaling unless specific preset.
        
        let xRange = null;
        let yRange = null;

        if (xAxis === 'NPHI' && yAxis === 'RHOB') {
            xRange = [-0.05, 0.45]; // Standard Sandstone-Limestone-Dolomite range
            yRange = [3.0, 1.9]; // Reversed Density for standard chart
        }

        return {
            grid: { rows: 1, columns: 1 },
            margin: { l: 50, r: 20, t: 30, b: 40 },
            plot_bgcolor: '#1e293b',
            paper_bgcolor: 'transparent',
            height: height || 600,
            width: width, // responsive
            xaxis: { 
                title: { text: xAxis, font: { color: '#e2e8f0' } }, 
                type: isLogX ? 'log' : 'linear',
                gridcolor: '#334155',
                zerolinecolor: '#475569',
                tickfont: { color: '#94a3b8' },
                range: xRange
            },
            yaxis: { 
                title: { text: yAxis, font: { color: '#e2e8f0' } }, 
                type: isLogY ? 'log' : 'linear',
                gridcolor: '#334155',
                zerolinecolor: '#475569',
                tickfont: { color: '#94a3b8' },
                range: yRange
            },
            showlegend: true,
            legend: { x: 0, y: 1, bgcolor: 'rgba(0,0,0,0.5)' },
            hovermode: 'closest',
            dragmode: 'select' // Enable selection
        };
    }, [xAxis, yAxis, height, width]);

    return (
        <div className="h-full flex gap-4">
            {/* Controls */}
            <Card className="w-64 bg-slate-950 border-slate-800 flex flex-col shrink-0">
                <CardHeader className="pb-3 border-b border-slate-800">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                        <ScatterChart className="w-4 h-4 text-blue-400" /> Crossplot
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400 uppercase">Presets</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => applyPreset('den-neu')}>Den-Neu</Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => applyPreset('pickett')}>Pickett</Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => applyPreset('buckles')}>Buckles</Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => applyPreset('phi-k')}>Phi-K</Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs text-slate-400 uppercase">Axes</Label>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500">X Axis</Label>
                            <Select value={xAxis} onValueChange={setXAxis}>
                                <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500">Y Axis</Label>
                            <Select value={yAxis} onValueChange={setYAxis}>
                                <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500">Color (Z)</Label>
                            <Select value={colorAxis} onValueChange={setColorAxis}>
                                <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-trend" checked={showTrend} onCheckedChange={setShowTrend} />
                            <Label htmlFor="show-trend" className="text-xs text-slate-300">Show Trend Line</Label>
                        </div>
                        {showTrend && (
                            <Select value={trendType} onValueChange={setTrendType}>
                                <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="linear">Linear (y=mx+c)</SelectItem>
                                    <SelectItem value="power">Power (Archie)</SelectItem>
                                    <SelectItem value="exponential">Exponential (Phi-K)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                        {regression && (
                            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] font-mono text-green-400">
                                R² = {regression.stats.rSquared?.toFixed(4)}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Plot Area */}
            <div ref={ref} className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative">
                {plotData && width && height ? (
                    <Plot
                        data={traces}
                        layout={layout}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                        config={{ displayModeBar: true, responsive: true }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        Select curves to generate crossplot
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrossplotDashboard;