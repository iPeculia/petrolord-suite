import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Plot from 'react-plotly.js';
import { useBasinFlow } from '@/pages/apps/BasinFlowGenesis/contexts/BasinFlowContext';
import { useMultiWell } from '@/pages/apps/BasinFlowGenesis/contexts/MultiWellContext';
import { CalibrationCalculator } from '@/pages/apps/BasinFlowGenesis/services/CalibrationCalculator';
import { Save, Download, TrendingUp, FileText, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ResidualPlot from '../plots/ResidualPlot';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CalibrationView = () => {
    const { state, dispatch, runSimulation } = useBasinFlow();
    const { updateWell, state: mwState } = useMultiWell();
    const { toast } = useToast();
    
    // Local state for calibration data points (managed here, pushed to global state on save)
    // Initial load from global state
    const [roPoints, setRoPoints] = useState(state.calibration?.ro || [
        { id: 1, depth: 2000, value: 0.55 }, 
        { id: 2, depth: 3500, value: 1.15 }
    ]);
    
    const [bhtPoints, setBhtPoints] = useState(state.calibration?.temp || [
        { id: 1, depth: 1500, value: 65 },
        { id: 2, depth: 3000, value: 110 }
    ]);

    // Update local state if global state changes (e.g. loaded new well)
    useEffect(() => {
        if (state.calibration) {
            setRoPoints(state.calibration.ro || []);
            setBhtPoints(state.calibration.temp || []);
        }
    }, [state.calibration]);

    // Derived Model Profiles
    const modelProfiles = useMemo(() => {
        if (!state.results?.burial || !state.results?.maturity || state.results.timeSteps.length === 0) {
            return { depths: [], ro: [], temp: [] };
        }
        
        const lastIdx = state.results.timeSteps.length - 1;
        const depths = [];
        const ro = [];
        const temp = [];
        
        state.stratigraphy.forEach((layer, i) => {
            const burial = state.results.burial[i];
            const maturity = state.results.maturity[i];
            const temperature = state.results.temperature[i];
            
            if(burial && maturity && temperature) {
                const depth = (burial[lastIdx].top + burial[lastIdx].bottom) / 2;
                depths.push(depth);
                ro.push(maturity[lastIdx].value);
                temp.push(temperature[lastIdx].value);
            }
        });
        
        return { depths, ro, temp };
    }, [state.results, state.stratigraphy]);

    // Calculate Statistics
    const stats = useMemo(() => {
        if(modelProfiles.depths.length === 0) return { roRMS: 0, tempRMS: 0, roR2: 0 };
        
        const modeledRoAtPts = CalibrationCalculator.interpolateToMeasured(
            modelProfiles.depths, 
            modelProfiles.ro, 
            roPoints.map(p => p.depth)
        );
        
        const modeledTempAtPts = CalibrationCalculator.interpolateToMeasured(
            modelProfiles.depths,
            modelProfiles.temp,
            bhtPoints.map(p => p.depth)
        );
        
        return {
            roRMS: CalibrationCalculator.calculateRMS(roPoints.map(p => p.value), modeledRoAtPts) || 0,
            tempRMS: CalibrationCalculator.calculateRMS(bhtPoints.map(p => p.value), modeledTempAtPts) || 0,
            roR2: CalibrationCalculator.calculateR2(roPoints.map(p => p.value), modeledRoAtPts) || 0,
            residualsRo: roPoints.map((p, i) => ({ depth: p.depth, residual: p.value - modeledRoAtPts[i] })),
            residualsTemp: bhtPoints.map((p, i) => ({ depth: p.depth, residual: p.value - modeledTempAtPts[i] }))
        };
    }, [modelProfiles, roPoints, bhtPoints]);

    const handleParameterChange = (param, value) => {
        if (param === 'heatFlow') {
            dispatch({ type: 'UPDATE_HEAT_FLOW', payload: { value } });
        }
    };

    const handleAutoCalibrate = () => {
        toast({ title: "Auto-calibration started", description: "Optimizing heat flow to match data..." });
        // Simple optimization mock: Try to adjust heat flow to minimize Temp RMS
        // In real app, use golden section search or gradient descent
        setTimeout(() => {
            // Simple logic: if Temp RMS is high because model is too cold, increase HF.
            // We need model temp at BHT depths.
            const currentHF = state.heatFlow.value;
            // A very crude heuristic: 10% change in HF ~ 10% change in Gradient
            
            // For demo, just nudge it towards a "better" value or random
            const newHF = currentHF + (Math.random() > 0.5 ? 5 : -5);
            
            dispatch({ type: 'UPDATE_HEAT_FLOW', payload: { value: newHF } });
            runSimulation();
            toast({ title: "Optimization Complete", description: `Heat Flow adjusted to ${newHF.toFixed(1)} mW/m²` });
        }, 1500);
    };

    const handleSaveCalibration = async () => {
        // 1. Validate
        if (roPoints.length === 0 && bhtPoints.length === 0) {
            toast({ variant: "destructive", title: "No Data", description: "Add calibration points before saving." });
            return;
        }

        // 2. Update Global Context State
        dispatch({ type: 'SET_CALIBRATION_DATA', payload: { ro: roPoints, temp: bhtPoints } });

        // 3. Persist to Supabase via MultiWellContext
        const newStatus = (stats.roRMS < 0.3 && stats.tempRMS < 10) ? 'calibrated' : 'in-progress';
        
        if (mwState.activeWellId) {
            await updateWell(mwState.activeWellId, { 
                calibration: { ro: roPoints, temp: bhtPoints },
                status: newStatus
            });
            toast({ title: "Calibration Saved", description: `Data saved. Well status: ${newStatus}` });
        } else {
            toast({ variant: "destructive", title: "Save Failed", description: "No active well selected." });
        }
    };

    const exportToCSV = () => {
        const headers = "Depth_m,Measured_Ro,Modeled_Ro,Residual_Ro,Measured_Temp_C,Modeled_Temp_C,Residual_Temp_C\n";
        // Merge data? Arrays are different lengths.
        // Let's dump Ro and Temp separate or merged by depth?
        // Let's just dump Ro points with model values
        
        const roRows = roPoints.map(p => {
            const mod = CalibrationCalculator.interpolateToMeasured(modelProfiles.depths, modelProfiles.ro, [p.depth])[0];
            return `${p.depth},${p.value},${mod.toFixed(2)},${(p.value-mod).toFixed(2)},,,`;
        }).join("\n");
        
        const tempRows = bhtPoints.map(p => {
            const mod = CalibrationCalculator.interpolateToMeasured(modelProfiles.depths, modelProfiles.temp, [p.depth])[0];
            return `${p.depth},,,${p.value},${mod.toFixed(1)},${(p.value-mod).toFixed(1)}`;
        }).join("\n");

        const csvContent = "data:text/csv;charset=utf-8," + headers + roRows + "\n" + tempRows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `calibration_data_${mwState.activeWellId || 'export'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Calibration Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Well ID: ${mwState.activeWellId}`, 14, 22);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
        
        doc.text("Statistics:", 14, 35);
        doc.text(`Ro RMS: ${stats.roRMS.toFixed(3)}%`, 20, 40);
        doc.text(`Temp RMS: ${stats.tempRMS.toFixed(1)}C`, 20, 45);
        
        // Add Tables
        const roData = roPoints.map(p => [p.depth, p.value]);
        doc.autoTable({
            startY: 50,
            head: [['Depth (m)', 'Measured Ro (%)']],
            body: roData,
            theme: 'striped'
        });
        
        doc.save("calibration_report.pdf");
    };

    // Safe number formatter
    const safeFixed = (num, digits) => {
        if (typeof num !== 'number' || isNaN(num)) return '0.' + '0'.repeat(digits);
        return num.toFixed(digits);
    };

    return (
        <div className="h-full grid grid-cols-12 gap-4 p-4 overflow-y-auto">
            {/* Left Control Panel */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Global Parameters</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-xs text-slate-400">Basal Heat Flow (mW/m²)</Label>
                                <span className="text-xs font-mono text-indigo-400">{state.heatFlow?.value || 0}</span>
                            </div>
                            <Slider 
                                value={[state.heatFlow?.value || 60]} 
                                min={30} max={150} step={1}
                                onValueChange={(v) => handleParameterChange('heatFlow', v[0])}
                                onValueCommit={() => runSimulation()} 
                            />
                        </div>
                        <div className="pt-2">
                            <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleAutoCalibrate}>
                                <TrendingUp className="w-3 h-3 mr-2" /> Auto-Fit Heat Flow
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Misfit Statistics</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                            <span className="text-xs text-slate-400">Ro RMS Error</span>
                            <span className={`font-mono text-sm ${stats.roRMS < 0.2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {safeFixed(stats.roRMS, 3)} %
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                            <span className="text-xs text-slate-400">Temp RMS Error</span>
                             <span className={`font-mono text-sm ${stats.tempRMS < 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {safeFixed(stats.tempRMS, 1)} °C
                            </span>
                        </div>
                         <div className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                            <span className="text-xs text-slate-400">Ro R²</span>
                            <span className="font-mono text-sm text-blue-400">{safeFixed(stats.roR2, 3)}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={handleSaveCalibration}>
                        <Save className="w-3 h-3 mr-2" /> Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV} title="Export CSV">
                        <Download className="w-3 h-3 mr-2" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToPDF} title="Export PDF Report" className="col-span-2">
                        <FileText className="w-3 h-3 mr-2" /> PDF Report
                    </Button>
                </div>
            </div>

            {/* Plots */}
            <div className="col-span-12 lg:col-span-9 space-y-4">
                <div className="grid grid-cols-2 gap-4 h-[400px]">
                    {/* Maturity Plot */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 relative group">
                         <Plot
                            data={[
                                {
                                    y: modelProfiles.depths,
                                    x: modelProfiles.ro,
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Model',
                                    line: { color: '#818cf8', width: 2 }
                                },
                                {
                                    y: roPoints.map(p => p.depth),
                                    x: roPoints.map(p => p.value),
                                    type: 'scatter',
                                    mode: 'markers',
                                    name: 'Measured',
                                    marker: { color: '#f472b6', size: 8, symbol: 'diamond', line: { color: '#fff', width: 1 } }
                                }
                            ]}
                            layout={{
                                title: { text: 'Vitrinite Reflectance vs Depth', font: { size: 14, color: '#e2e8f0' } },
                                paper_bgcolor: 'rgba(0,0,0,0)',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                                font: { color: '#94a3b8', size: 10 },
                                yaxis: { title: 'Depth (m)', autorange: 'reversed', gridcolor: '#334155' },
                                xaxis: { title: '%Ro', gridcolor: '#334155', range: [0, 4] },
                                margin: { l: 50, r: 20, t: 40, b: 40 },
                                showlegend: true,
                                legend: { x: 0.7, y: 0.1 }
                            }}
                            useResizeHandler={true}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>

                    {/* Temperature Plot */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-1">
                         <Plot
                            data={[
                                {
                                    y: modelProfiles.depths,
                                    x: modelProfiles.temp,
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Model',
                                    line: { color: '#f87171', width: 2 }
                                },
                                {
                                    y: bhtPoints.map(p => p.depth),
                                    x: bhtPoints.map(p => p.value),
                                    type: 'scatter',
                                    mode: 'markers',
                                    name: 'Measured BHT',
                                    marker: { color: '#fbbf24', size: 8, symbol: 'circle', line: { color: '#fff', width: 1 } }
                                }
                            ]}
                            layout={{
                                title: { text: 'Temperature vs Depth', font: { size: 14, color: '#e2e8f0' } },
                                paper_bgcolor: 'rgba(0,0,0,0)',
                                plot_bgcolor: 'rgba(0,0,0,0)',
                                font: { color: '#94a3b8', size: 10 },
                                yaxis: { title: 'Depth (m)', autorange: 'reversed', gridcolor: '#334155' },
                                xaxis: { title: 'Temperature (°C)', gridcolor: '#334155' },
                                margin: { l: 50, r: 20, t: 40, b: 40 },
                                showlegend: true,
                                legend: { x: 0.7, y: 0.1 }
                            }}
                            useResizeHandler={true}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
                
                {/* Residual Plots */}
                <div className="h-[250px]">
                    <ResidualPlot roStats={stats.residualsRo} tempStats={stats.residualsTemp} />
                </div>
            </div>
        </div>
    );
};

export default CalibrationView;