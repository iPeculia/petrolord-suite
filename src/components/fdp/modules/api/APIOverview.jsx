import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server, Globe, ShieldCheck, Zap } from 'lucide-react';

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

const APIOverview = ({ onNavigate }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Requests" 
                    value="1.2M" 
                    subtitle="Last 30 days" 
                    icon={Server} 
                    color="blue" 
                />
                <StatCard 
                    title="Uptime" 
                    value="99.99%" 
                    subtitle="API Gateway" 
                    icon={Globe} 
                    color="green" 
                />
                <StatCard 
                    title="Avg Latency" 
                    value="45ms" 
                    subtitle="P95 Response Time" 
                    icon={Zap} 
                    color="yellow" 
                />
                <StatCard 
                    title="Security" 
                    value="Secure" 
                    subtitle="0 Threats Detected" 
                    icon={ShieldCheck} 
                    color="purple" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Endpoint Health</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-slate-300">REST API (/v1)</span>
                                </div>
                                <span className="text-xs text-green-400">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-slate-300">GraphQL Gateway</span>
                                </div>
                                <span className="text-xs text-green-400">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span className="text-sm text-slate-300">Webhooks Service</span>
                                </div>
                                <span className="text-xs text-yellow-400">Degraded Performance</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Consumers</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-2">
                                <span>Mobile App (iOS)</span>
                                <span className="font-mono">450k req</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-2">
                                <span>PowerBI Connector</span>
                                <span className="font-mono">320k req</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-2">
                                <span>Partner Portal</span>
                                <span className="font-mono">180k req</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default APIOverview;