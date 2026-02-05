import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Download, Star, Activity, Settings, UploadCloud } from 'lucide-react';

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

const MobileAppOverview = ({ onNavigate }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard 
                    title="Active Users" 
                    value="128" 
                    subtitle="+12% this week" 
                    icon={Smartphone} 
                    color="blue" 
                />
                <StatCard 
                    title="Downloads" 
                    value="450" 
                    subtitle="Total installs" 
                    icon={Download} 
                    color="green" 
                />
                <StatCard 
                    title="App Rating" 
                    value="4.8" 
                    subtitle="Average (52 reviews)" 
                    icon={Star} 
                    color="yellow" 
                />
                <StatCard 
                    title="Crash Free" 
                    value="99.9%" 
                    subtitle="Last 30 days" 
                    icon={Activity} 
                    color="purple" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Builds</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                <div>
                                    <div className="text-sm font-bold text-white">v2.1.0 (Production)</div>
                                    <div className="text-xs text-slate-400">Released 2 days ago</div>
                                </div>
                                <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">Live</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                <div>
                                    <div className="text-sm font-bold text-white">v2.2.0-beta (TestFlight)</div>
                                    <div className="text-xs text-slate-400">Uploaded 4 hours ago</div>
                                </div>
                                <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded">Testing</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => onNavigate('config')} className="p-4 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-left">
                                <Settings className="w-5 h-5 text-blue-400 mb-2" />
                                <div className="text-sm font-bold text-white">Update Config</div>
                                <div className="text-xs text-slate-400">Edit features & permissions</div>
                            </button>
                            <button onClick={() => onNavigate('deployment')} className="p-4 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-left">
                                <UploadCloud className="w-5 h-5 text-green-400 mb-2" />
                                <div className="text-sm font-bold text-white">New Deployment</div>
                                <div className="text-xs text-slate-400">Push update to stores</div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MobileAppOverview;