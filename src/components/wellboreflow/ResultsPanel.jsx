import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CollapsibleSection from '@/components/flowassurance/CollapsibleSection';
import { BarChart, Clock, Droplets, GitMerge, Layers, Maximize, Play, Thermometer, Waves, Save, Download, FileText } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { exportWellboreFlowCSV, exportWellboreFlowPDF } from '@/utils/wellboreFlowExport';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-red-500/50 rounded-md shadow-lg text-white">
                <p className="label text-red-300">{`Depth: ${label.toFixed(0)} ft`}</p>
                {payload.map(p => (
                     <p key={p.name} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(1)} ${p.unit}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const ResultsPanel = ({ results, inputs }) => {
    const { kpis, timeSeriesProfiles, slugReport, solidsReport } = results;
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(timeSeriesProfiles[0]);
    const { toast } = useToast();

    useEffect(() => {
        setCurrentProfile(timeSeriesProfiles[currentTime]);
    }, [currentTime, timeSeriesProfiles]);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prevTime => {
                    const nextTime = prevTime + 1;
                    if (nextTime >= timeSeriesProfiles.length) {
                        setIsPlaying(false);
                        return prevTime;
                    }
                    return nextTime;
                });
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeSeriesProfiles.length]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleSave = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save.' });
            return;
        }

        const projectData = {
            user_id: user.id,
            project_name: inputs.projectName,
            inputs_data: inputs,
            results_data: results,
            updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase.from('wellbore_flow_projects').upsert(projectData, { onConflict: 'user_id, project_name' });

        if (error) {
            toast({ variant: 'destructive', title: 'Save Error', description: error.message });
        } else {
            toast({ title: 'Project Saved & Updated', description: `Results for "${inputs.projectName}" have been saved.` });
        }
    };

    const kpiCards = [
        { label: "Max Slug Volume", value: slugReport.maxSlugVolume, unit: "bbl", icon: Waves },
        { label: "Liquid Holdup @ WH", value: currentProfile.wellhead.holdup.toFixed(2), unit: "", icon: Droplets },
        { label: "Wellhead Temperature", value: currentProfile.wellhead.temperature.toFixed(1), unit: "°F", icon: Thermometer },
        { label: "Sand Deposition Risk", value: solidsReport.maxDepositionRate > 0 ? "High" : "Low", icon: Layers },
    ];

    return (
        <div className="space-y-6 text-white">
            <CollapsibleSection title="Transient Simulation KPIs" icon={<BarChart />} defaultOpen>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                    {kpiCards.map(kpi => (
                        <div key={kpi.label} className="bg-white/5 p-4 rounded-lg">
                            <div className="flex items-center space-x-2"><kpi.icon className="w-5 h-5 text-red-400" /><span className="text-sm text-slate-300">{kpi.label}</span></div>
                            <p className="text-2xl font-bold mt-1">{kpi.value} <span className="text-base font-normal text-slate-400">{kpi.unit}</span></p>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Animated Wellbore Profiles" icon={<Clock />} defaultOpen>
                <div className="bg-white/5 p-4 rounded-lg">
                     <div className="flex items-center gap-4 mb-4">
                        <Button onClick={togglePlay} size="sm"><Play className="w-4 h-4 mr-2" />{isPlaying ? 'Pause' : 'Play'}</Button>
                        <span className="font-mono text-lime-300">Time: {currentProfile.time.toFixed(1)} min</span>
                        <Slider
                            value={[currentTime]}
                            onValueChange={(value) => setCurrentTime(value[0])}
                            max={timeSeriesProfiles.length - 1}
                            step={1}
                            className="flex-grow"
                        />
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={currentProfile.profile} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="depth" unit=" ft" stroke="#a3e635" reversed={true} domain={['dataMax', 0]} label={{ value: 'Depth (ft)', position: 'insideBottom', offset: -5, fill: '#a3e635' }}/>
                            <YAxis yAxisId="left" stroke="#38bdf8" label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#38bdf8' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#facc15" label={{ value: 'Temperature (°F)', angle: 90, position: 'insideRight', fill: '#facc15' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="pressure" name="Pressure" stroke="#38bdf8" dot={false} unit=" psia"/>
                            <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperature" stroke="#facc15" dot={false} unit=" °F" />
                            <Line yAxisId="right" type="monotone" dataKey="holdup" name="Liquid Holdup" stroke="#fb923c" dot={false} unit="" display="none" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CollapsibleSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CollapsibleSection title="Slug Analysis Report" icon={<Waves />}>
                    <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span>Slug Flow Regime:</span><span className="font-bold">{slugReport.flowRegime}</span></div>
                        <div className="flex justify-between"><span>Avg. Slug Frequency:</span><span className="font-bold">{slugReport.avgFrequency.toFixed(2)} /min</span></div>
                        <div className="flex justify-between"><span>Max Slug Volume:</span><span className="font-bold">{slugReport.maxSlugVolume.toFixed(1)} bbl</span></div>
                         <div className="flex justify-between"><span>Max Slug Velocity:</span><span className="font-bold">{slugReport.maxSlugVelocity.toFixed(1)} ft/s</span></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Solids Transport Report" icon={<Layers />}>
                    <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between"><span>Sand Settling Velocity:</span><span className="font-bold">{solidsReport.settlingVelocity.toFixed(2)} ft/s</span></div>
                        <div className="flex justify-between"><span>Max Deposition Rate:</span><span className="font-bold">{solidsReport.maxDepositionRate.toFixed(2)} lb/hr</span></div>
                        <div className="flex justify-between"><span>Deposition Location (MD):</span><span className="font-bold">{solidsReport.maxDepositionDepth} ft</span></div>
                        <div className="flex justify-between"><span>Erosion Risk:</span><span className="font-bold text-orange-400">{solidsReport.erosionRisk}</span></div>
                    </div>
                </CollapsibleSection>
            </div>
             <CollapsibleSection title="Save & Export Results" icon={<Download />}>
                <div className="bg-slate-800/50 p-6 rounded-lg flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Save Progress & Download Analysis</h3>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Save Results</Button>
                        <Button onClick={() => exportWellboreFlowCSV(results, inputs)}><Download className="w-4 h-4 mr-2"/>Export CSV</Button>
                        <Button onClick={() => exportWellboreFlowPDF(results, inputs)}><FileText className="w-4 h-4 mr-2"/>Export PDF</Button>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
};

export default ResultsPanel;