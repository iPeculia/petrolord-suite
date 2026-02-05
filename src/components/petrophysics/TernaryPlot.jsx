import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const TernaryPlot = ({ data, curveMap }) => {
    const { width, height, ref } = useResizeDetector();
    const [aAxis, setAAxis] = useState('NPHI'); // Top
    const [bAxis, setBAxis] = useState('RHOB'); // Left
    const [cAxis, setCAxis] = useState('GR');   // Right

    const availableCurves = useMemo(() => {
        return Object.keys(curveMap).filter(k => curveMap[k]);
    }, [curveMap]);

    const plotData = useMemo(() => {
        if (!data || !curveMap[aAxis] || !curveMap[bAxis] || !curveMap[cAxis]) return [];

        const aKey = curveMap[aAxis];
        const bKey = curveMap[bAxis];
        const cKey = curveMap[cAxis];

        const aArr = [];
        const bArr = [];
        const cArr = [];
        const textArr = [];

        data.forEach(row => {
            const a = row[aKey];
            const b = row[bKey];
            const c = row[cKey];
            
            if (a != null && b != null && c != null) {
                // Normalize for display if needed, but Plotly ternary does relative scaling.
                // Usually inputs are 0-1 or 0-100.
                // If mixing units (g/cc vs v/v vs API), shape will be skewed. 
                // For visualization, raw values are usually okay as Plotly scales axes independently or user interprets relative position.
                // But standard ternary expects sum=constant. Plotly's scatterternary sums to 'sum' attr (default 1 or 100).
                // It automatically normalizes: a_plot = a / (a+b+c).
                aArr.push(a);
                bArr.push(b);
                cArr.push(c);
                textArr.push(`MD: ${row[curveMap['DEPTH']]?.toFixed(1)}`);
            }
        });

        return [{
            type: 'scatterternary',
            mode: 'markers',
            a: aArr,
            b: bArr,
            c: cArr,
            text: textArr,
            marker: {
                color: '#f59e0b',
                size: 5,
                line: { width: 1 }
            },
            name: 'Data'
        }];
    }, [data, curveMap, aAxis, bAxis, cAxis]);

    const layout = useMemo(() => ({
        ternary: {
            sum: 1, // Not enforcing sum, let Plotly normalize relative ratios
            aaxis: { title: aAxis, color: '#06b6d4' },
            baxis: { title: bAxis, color: '#8b5cf6' },
            caxis: { title: cAxis, color: '#22c55e' },
            bgcolor: '#1e293b'
        },
        paper_bgcolor: 'transparent',
        margin: { l: 50, r: 50, t: 50, b: 50 },
        height: height || 500,
        showlegend: false
    }), [aAxis, bAxis, cAxis, height]);

    return (
        <div className="h-full flex gap-4">
            <Card className="w-48 bg-slate-950 border-slate-800 p-4 shrink-0 space-y-4">
                <h3 className="text-sm font-bold text-white">Ternary Axes</h3>
                <div className="space-y-1">
                    <Label className="text-[10px] text-cyan-400">Top (A)</Label>
                    <Select value={aAxis} onValueChange={setAAxis}>
                        <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] text-purple-400">Left (B)</Label>
                    <Select value={bAxis} onValueChange={setBAxis}>
                        <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] text-green-400">Right (C)</Label>
                    <Select value={cAxis} onValueChange={setCAxis}>
                        <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-[10px] text-slate-500 pt-4">
                    Use for lithology (e.g. Qtz, Cal, Dol) or component analysis.
                </p>
            </Card>

            <div ref={ref} className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                {width && height ? (
                    <Plot
                        data={plotData}
                        layout={layout}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                        config={{ displayModeBar: true, responsive: true }}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default TernaryPlot;