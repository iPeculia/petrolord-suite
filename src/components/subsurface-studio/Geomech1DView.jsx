import React, { useState, useEffect, useMemo } from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HardHat, Play, Loader2 } from 'lucide-react';

const Geomech1DView = () => {
    const { selectedWell, allAssets } = useStudio();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [curves, setCurves] = useState([]);
    const [params, setParams] = useState({
        vp: '', vs: '', rho: '',
        obgMethod: 'integration',
        ppMethod: 'eaton',
        eatonExponent: 3.0,
        nctV0: 1600,
        nctK: 0.6,
        fgMethod: 'tectonic',
        poissonRatio: 0.25,
    });

    useEffect(() => {
        if (selectedWell) {
            const logAssets = allAssets.filter(a => a.parent_id === selectedWell.id && a.type === 'log.curve_set');
            const allCurves = [...new Set(logAssets.flatMap(l => l.meta?.curves || []))];
            setCurves(allCurves);
            
            // Auto-map curves
            setParams(p => ({
                ...p,
                vp: allCurves.find(c => c.toUpperCase().includes('VP')) || '',
                vs: allCurves.find(c => c.toUpperCase().includes('VS')) || '',
                rho: allCurves.find(c => c.toUpperCase().includes('RHO') || c.toUpperCase().includes('DENS')) || '',
            }));
            setResults(null);
        } else {
            setCurves([]);
            setResults(null);
        }
    }, [selectedWell, allAssets]);

    const handleRun = async () => {
        if (!selectedWell || !params.vp || !params.rho) {
            toast({ variant: 'destructive', title: 'Missing Inputs', description: 'Please select a well and map Vp and Density curves.' });
            return;
        }
        setLoading(true);
        setResults(null);

        try {
            // In a real scenario, this would be an edge function call.
            // For now, we simulate the calculation on the client.
            const logAssets = allAssets.filter(a => a.parent_id === selectedWell.id && a.type === 'log.curve_set');
            if (logAssets.length === 0) throw new Error("No log data found for this well.");

            // A simplified approach: fetch the first log asset. A real app would merge logs.
            const logAsset = logAssets[0];
            const { data: fileData, error: downloadError } = await supabase.storage.from('ss-assets').download(logAsset.uri);
            if (downloadError) throw downloadError;
            
            const textData = await fileData.text();
            const lines = textData.split('\n');
            let curveNames = [];
            let dataStartIndex = -1;
            lines.forEach((line, i) => {
                if (line.trim().toUpperCase().startsWith('~C')) {
                    const curveSectionLines = [];
                    for (let j = i + 1; j < lines.length; j++) {
                        if (lines[j].trim().startsWith('~')) break;
                        if (lines[j].trim() && !lines[j].trim().startsWith('#')) curveSectionLines.push(lines[j]);
                    }
                    curveNames = curveSectionLines.map(l => l.split('.')[0].trim().split(/\s+/)[0]);
                }
                if (line.trim().toUpperCase().startsWith('~A')) dataStartIndex = i + 1;
            });

            if (dataStartIndex === -1 || curveNames.length === 0) throw new Error("Invalid LAS file format.");

            const depthCurve = curveNames[0];
            const logData = lines.slice(dataStartIndex)
                .map(line => line.trim().split(/\s+/).map(Number))
                .filter(values => values.length === curveNames.length)
                .map(values => {
                    const row = {};
                    curveNames.forEach((name, i) => { row[name] = values[i]; });
                    return row;
                });

            // Perform geomechanical calculations
            const calculatedData = logData.map((row, i, arr) => {
                const depth = row[depthCurve];
                const rho = row[params.rho]; // g/cc
                const vp = row[params.vp]; // m/s
                
                if (depth == null || rho == null || vp == null) return { ...row, obg: null, pp: null, fg: null };

                // OBG (sg)
                let obg = 1.0; // Start with water density
                if (i > 0) {
                    const prevRow = arr[i-1];
                    const prevDepth = prevRow[depthCurve];
                    const prevObgStress = (results?.data[i-1]?.obg || 1.0) * 9.81 * prevDepth;
                    const deltaStress = (rho + (prevRow[params.rho] || rho)) / 2 * 9.81 * (depth - prevDepth);
                    obg = (prevObgStress + deltaStress) / (9.81 * depth);
                }
                
                // PP (sg)
                const vp_nct = params.nctV0 + params.nctK * depth;
                const pp = obg - (obg - 1.0) * Math.pow(vp / vp_nct, params.eatonExponent);

                // FG (sg)
                const fg = (params.poissonRatio / (1 - params.poissonRatio)) * (obg - pp) + pp;

                return { depth, obg, pp, fg };
            }).filter(r => r.depth != null);

            setResults({ data: calculatedData });
            toast({ title: 'Calculation Complete', description: '1D Geomechanical model generated.' });

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Calculation Failed', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!selectedWell) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
                <HardHat className="w-16 h-16 mb-4 text-slate-500" />
                <h2 className="text-2xl font-bold text-slate-300">1D Geomechanical Model</h2>
                <p>Select a well with Vp, Vs, and Density logs to begin.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-slate-950 text-white">
            <div className="w-full md:w-1/3 p-4 sm:p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto space-y-6">
                <h3 className="text-xl font-bold text-cyan-300">Well: {selectedWell.name}</h3>
                
                <div>
                    <h4 className="font-semibold mb-2">Input Curves</h4>
                    <div className="space-y-2">
                        <Label>Vp (P-wave velocity)</Label>
                        <Select value={params.vp} onValueChange={v => setParams(p => ({...p, vp: v}))}><SelectTrigger><SelectValue placeholder="Select Vp..."/></SelectTrigger><SelectContent>{curves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                        <Label>Vs (S-wave velocity)</Label>
                        <Select value={params.vs} onValueChange={v => setParams(p => ({...p, vs: v}))}><SelectTrigger><SelectValue placeholder="Select Vs..."/></SelectTrigger><SelectContent>{curves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                        <Label>RHO (Bulk Density)</Label>
                        <Select value={params.rho} onValueChange={v => setParams(p => ({...p, rho: v}))}><SelectTrigger><SelectValue placeholder="Select Density..."/></SelectTrigger><SelectContent>{curves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Model Parameters</h4>
                    <div className="space-y-2">
                        <Label>Pore Pressure Method</Label>
                        <Select value={params.ppMethod} onValueChange={v => setParams(p => ({...p, ppMethod: v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="eaton">Eaton</SelectItem></SelectContent></Select>
                        <Label>Eaton Exponent</Label>
                        <Input type="number" value={params.eatonExponent} onChange={e => setParams(p => ({...p, eatonExponent: parseFloat(e.target.value)}))} />
                    </div>
                </div>

                <Button onClick={handleRun} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg">
                    {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                    Run Calculation
                </Button>
            </div>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                {results ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="obg" type="number" domain={['dataMin', 'dataMax']} label={{ value: 'Gradient (sg)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} stroke="#9ca3af" />
                            <YAxis dataKey="depth" reversed={true} domain={['dataMin', 'dataMax']} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} labelStyle={{ color: '#e5e7eb' }} />
                            <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                            <Line type="monotone" dataKey="obg" name="Overburden" stroke="#f59e0b" dot={false} />
                            <Line type="monotone" dataKey="pp" name="Pore Pressure" stroke="#3b82f6" dot={false} />
                            <Line type="monotone" dataKey="fg" name="Frac Gradient" stroke="#ef4444" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
                        <HardHat className="w-16 h-16 mb-4 text-slate-500" />
                        <h2 className="text-xl font-bold text-slate-300">Ready to Calculate</h2>
                        <p>Configure inputs and run the calculation to see the 1D geomechanical model.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Geomech1DView;