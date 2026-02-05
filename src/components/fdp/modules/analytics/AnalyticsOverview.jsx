import React from 'react';
import { Database, BrainCircuit, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-400 uppercase">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-500/10`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
        </CardContent>
    </Card>
);

const AnalyticsOverview = ({ onNavigate }) => {
    // Mock data for scatter plot
    const data = Array.from({ length: 20 }, () => ({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        z: Math.floor(Math.random() * 500)
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Data Readiness" 
                    value="85%" 
                    subtitle="Quality check passed" 
                    icon={Database} 
                    color="blue" 
                />
                <StatCard 
                    title="Models Trained" 
                    value="4" 
                    subtitle="Last: Production Forecast" 
                    icon={BrainCircuit} 
                    color="purple" 
                />
                <StatCard 
                    title="Anomalies" 
                    value="12" 
                    subtitle="Detected in Well Data" 
                    icon={AlertCircle} 
                    color="yellow" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Cross-Correlation Discovery</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis type="number" dataKey="x" name="Porosity" unit="%" stroke="#94a3b8" />
                                    <YAxis type="number" dataKey="y" name="Permeability" unit="mD" stroke="#94a3b8" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                    <Scatter name="Wells" data={data} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-white">Cost Driver Identified</span>
                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">High Confidence</span>
                                </div>
                                <p className="text-sm text-slate-400">Drilling days strongly correlated with formation pressure in Sector 4.</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-white">Production Optimization</span>
                                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">Medium Confidence</span>
                                </div>
                                <p className="text-sm text-slate-400">Gas injection rate of 50 MMscfd maximizes recovery in Reservoir B.</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-white">Data Gap</span>
                                    <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded">Critical</span>
                                </div>
                                <p className="text-sm text-slate-400">Missing viscosity data for Well P-03 affects flow assurance model accuracy.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsOverview;