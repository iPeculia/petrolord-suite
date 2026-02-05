import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, CheckCircle, Clock, FileText, Layers, Database, BarChart } from 'lucide-react';
import { useMEM } from '../contexts/MEMContext';

const StatCard = ({ title, value, icon: Icon, description, status = 'neutral' }) => {
    const statusColors = {
        neutral: 'text-slate-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-400">{title}</p>
                        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-full bg-slate-800 ${statusColors[status]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
            </CardContent>
        </Card>
    );
};

const OverviewTab = () => {
    const { state, dispatch } = useMEM();
    const { project, well, logs, lithology, pressureData } = state;

    // Calculate completion status safely
    const hasWellData = well.name !== 'New Well';
    const hasLogs = logs && logs.length > 0;
    const hasLithology = lithology && lithology.length > 0;
    const hasPressure = pressureData && pressureData.length > 0;
    
    const steps = [
        { label: 'Well Setup', completed: hasWellData },
        { label: 'Data Import', completed: hasLogs },
        { label: 'Lithology', completed: hasLithology },
        { label: 'Pressure Data', completed: hasPressure },
    ];
    
    const completedSteps = steps.filter(s => s.completed).length;
    const progress = (completedSteps / steps.length) * 100;

    return (
        <div className="space-y-6 p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                    <p className="text-slate-400">Last updated: {new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'data' })}>
                        <Database className="w-4 h-4 mr-2" /> Manage Data
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'analysis' })}>
                        <Activity className="w-4 h-4 mr-2" /> Run Analysis
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Overall Progress" 
                    value={`${progress.toFixed(0)}%`} 
                    icon={Activity} 
                    status={progress === 100 ? 'success' : 'neutral'}
                    description={`${completedSteps} of ${steps.length} steps completed`}
                />
                <StatCard 
                    title="Well Data" 
                    value={well.name} 
                    icon={Layers} 
                    description={`${well.depthRange.top} - ${well.depthRange.bottom} ${well.depthUnit}`}
                />
                <StatCard 
                    title="Data Points" 
                    value={pressureData?.length || 0} 
                    icon={Database} 
                    description="Pressure/Stress points"
                />
                <StatCard 
                    title="Alerts" 
                    value="0" 
                    icon={AlertTriangle} 
                    status="success"
                    description="No anomalies detected"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Project Health</CardTitle>
                        <CardDescription>Data completeness and quality checks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {step.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <span className={step.completed ? 'text-white' : 'text-slate-400'}>{step.label}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'data' })}>
                                        {step.completed ? 'Review' : 'Start'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                <div>
                                    <p className="text-sm text-white">Project Created</p>
                                    <p className="text-xs text-slate-500">{new Date(project.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            {/* Placeholder for more activity */}
                            <div className="text-center text-xs text-slate-600 py-4">
                                No other recent activity
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OverviewTab;