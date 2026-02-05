import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Maximize2, PenTool, MousePointer2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

const FaciesCrossplots = ({ data, faciesColors, onSelection }) => {
    const [xCurve, setXCurve] = useState('NPHI');
    const [yCurve, setYCurve] = useState('RHOB');
    const [colorBy, setColorBy] = useState('Facies');
    const [selectionMode, setSelectionMode] = useState('zoom'); // 'zoom' | 'lasso' | 'select'

    const plotData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const groups = {};
        data.forEach((point, index) => {
            const facies = point[colorBy] || 'Unknown';
            if (!groups[facies]) groups[facies] = { x: [], y: [], indices: [] };
            // Check if curves exist
            if (point[xCurve] !== undefined && point[yCurve] !== undefined) {
                groups[facies].x.push(point[xCurve]);
                groups[facies].y.push(point[yCurve]);
                groups[facies].indices.push(index);
            }
        });

        return Object.keys(groups).map(facies => ({
            x: groups[facies].x,
            y: groups[facies].y,
            mode: 'markers',
            type: 'scattergl',
            name: facies,
            marker: { 
                color: faciesColors[facies] || '#888',
                size: 6,
                opacity: 0.7,
                line: { width: 0.5, color: '#fff' }
            },
            customdata: groups[facies].indices // Store original indices
        }));
    }, [data, xCurve, yCurve, colorBy, faciesColors]);

    const layout = {
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'rgba(255,255,255,0.02)',
        font: { color: '#94a3b8' },
        xaxis: { 
            title: xCurve, 
            gridcolor: '#334155',
            zerolinecolor: '#334155'
        },
        yaxis: { 
            title: yCurve, 
            gridcolor: '#334155', 
            zerolinecolor: '#334155',
            autorange: yCurve === 'RHOB' ? 'reversed' : true 
        },
        legend: { orientation: 'h', y: 1.1, bgcolor: 'transparent' },
        margin: { l: 50, r: 20, t: 20, b: 50 },
        dragmode: selectionMode,
        hovermode: 'closest'
    };

    const handleSelected = (event) => {
        if (!event || !event.points) return;
        // Extract original indices from customdata
        const selectedIndices = event.points.map(p => p.customdata);
        if (onSelection) onSelection(selectedIndices);
    };

    return (
        <Card className="h-full bg-slate-900 border-slate-800 flex flex-col shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    Interactive Crossplot
                </CardTitle>
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-1 bg-slate-950 rounded-md p-1 border border-slate-800">
                        <Toggle 
                            pressed={selectionMode === 'zoom'} 
                            onPressedChange={() => setSelectionMode('zoom')}
                            size="sm"
                            className="h-7 w-7 data-[state=on]:bg-slate-800"
                        >
                            <MousePointer2 className="w-4 h-4" />
                        </Toggle>
                        <Toggle 
                            pressed={selectionMode === 'lasso'} 
                            onPressedChange={() => setSelectionMode('lasso')}
                            size="sm"
                            className="h-7 w-7 data-[state=on]:bg-slate-800"
                        >
                            <PenTool className="w-4 h-4" />
                        </Toggle>
                    </div>
                    
                    <Select value={xCurve} onValueChange={setXCurve}>
                        <SelectTrigger className="h-8 w-24 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                            <SelectItem value="NPHI">NPHI</SelectItem>
                            <SelectItem value="GR">GR</SelectItem>
                            <SelectItem value="DT">DT</SelectItem>
                            <SelectItem value="RT">RT</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-slate-500 text-xs">vs</span>
                    <Select value={yCurve} onValueChange={setYCurve}>
                        <SelectTrigger className="h-8 w-24 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                            <SelectItem value="RHOB">RHOB</SelectItem>
                            <SelectItem value="NPHI">NPHI</SelectItem>
                            <SelectItem value="GR">GR</SelectItem>
                            <SelectItem value="DT">DT</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white"><Maximize2 className="w-4 h-4" /></Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] p-2 relative">
                <Plot
                    data={plotData}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ 
                        displayModeBar: false, // Use custom toolbar
                        scrollZoom: true 
                    }}
                    onSelected={handleSelected}
                />
            </CardContent>
        </Card>
    );
};

export default FaciesCrossplots;