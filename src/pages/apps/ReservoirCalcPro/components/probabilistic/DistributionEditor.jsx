import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DistributionManager } from '../../services/DistributionManager';
import Plot from 'react-plotly.js';

const DistributionEditor = ({ label, parameterKey, distribution, onChange, unit }) => {
    const [previewData, setPreviewData] = useState([]);

    useEffect(() => {
        if (distribution) {
            setPreviewData(DistributionManager.getPreviewData(distribution));
        }
    }, [distribution]);

    const handleTypeChange = (type) => {
        const newDist = DistributionManager.createDistribution(type);
        // Preserve constant value if switching to/from constant
        if (type === 'constant' && distribution.mean) newDist.value = distribution.mean;
        if (distribution.type === 'constant' && type !== 'constant') {
            newDist.mean = distribution.value;
            newDist.mode = distribution.value;
            newDist.min = distribution.value * 0.9;
            newDist.max = distribution.value * 1.1;
        }
        onChange(parameterKey, newDist);
    };

    const handleParamChange = (key, val) => {
        onChange(parameterKey, { ...distribution, [key]: parseFloat(val) });
    };

    return (
        <Card className="p-3 bg-slate-900 border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-200">{label} <span className="text-slate-500 font-normal">({unit})</span></Label>
                <Select value={distribution.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="h-6 w-[100px] text-[10px] bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="triangular">Triangular</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="lognormal">Lognormal</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                        <SelectItem value="constant">Constant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {/* Dynamic Inputs based on Type */}
                {distribution.type === 'triangular' && (
                    <>
                        <div className="space-y-1"><Label className="text-[10px] text-slate-400">Min</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.min} onChange={e=>handleParamChange('min', e.target.value)}/></div>
                        <div className="space-y-1"><Label className="text-[10px] text-slate-400">Mode</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.mode} onChange={e=>handleParamChange('mode', e.target.value)}/></div>
                        <div className="space-y-1"><Label className="text-[10px] text-slate-400">Max</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.max} onChange={e=>handleParamChange('max', e.target.value)}/></div>
                    </>
                )}
                {(distribution.type === 'normal' || distribution.type === 'lognormal') && (
                    <>
                        <div className="col-span-1 space-y-1"><Label className="text-[10px] text-slate-400">Mean</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.mean} onChange={e=>handleParamChange('mean', e.target.value)}/></div>
                        <div className="col-span-1 space-y-1"><Label className="text-[10px] text-slate-400">StdDev</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.stdDev} onChange={e=>handleParamChange('stdDev', e.target.value)}/></div>
                    </>
                )}
                {distribution.type === 'uniform' && (
                    <>
                        <div className="col-span-1.5 space-y-1"><Label className="text-[10px] text-slate-400">Min</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.min} onChange={e=>handleParamChange('min', e.target.value)}/></div>
                        <div className="col-span-1.5 space-y-1"><Label className="text-[10px] text-slate-400">Max</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.max} onChange={e=>handleParamChange('max', e.target.value)}/></div>
                    </>
                )}
                {distribution.type === 'constant' && (
                    <div className="col-span-3 space-y-1"><Label className="text-[10px] text-slate-400">Value</Label><Input type="number" className="h-6 text-xs bg-slate-950" value={distribution.value} onChange={e=>handleParamChange('value', e.target.value)}/></div>
                )}
            </div>

            {/* Mini Preview Chart */}
            <div className="h-16 w-full bg-slate-950/50 rounded overflow-hidden relative">
                {distribution.type !== 'constant' && (
                    <Plot
                        data={[{
                            x: previewData.map(d => d.x),
                            y: previewData.map(d => d.y),
                            type: 'scatter',
                            mode: 'lines',
                            fill: 'tozeroy',
                            line: { color: '#3b82f6', width: 1 },
                            fillcolor: 'rgba(59, 130, 246, 0.2)'
                        }]}
                        layout={{
                            margin: { t: 0, r: 0, b: 0, l: 0 },
                            xaxis: { showgrid: false, zeroline: false, showticklabels: false },
                            yaxis: { showgrid: false, zeroline: false, showticklabels: false },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            height: 64
                        }}
                        config={{ displayModeBar: false }}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </div>
        </Card>
    );
};

export default DistributionEditor;