import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Button } from '@/components/ui/button';
import { Smartphone, Settings, BarChart2, UploadCloud } from 'lucide-react';
import MobileAppOverview from './mobile/MobileAppOverview';
import MobileAppConfiguration from './mobile/MobileAppConfiguration';
import MobileAppDeployment from './mobile/MobileAppDeployment';
import MobileAppAnalytics from './mobile/MobileAppAnalytics';

const MobileAppModule = () => {
    const { state } = useFDP();
    const [activeTool, setActiveTool] = useState('overview');

    const renderTool = () => {
        switch(activeTool) {
            case 'config': return <MobileAppConfiguration />;
            case 'deployment': return <MobileAppDeployment />;
            case 'analytics': return <MobileAppAnalytics />;
            default: return <MobileAppOverview onNavigate={setActiveTool} />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Mobile Companion App</h2>
                    <p className="text-slate-400">Configure, deploy, and monitor your project's mobile interface.</p>
                </div>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <Button 
                        variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('overview')}
                        className="text-xs"
                    >
                        <Smartphone className="w-4 h-4 mr-2" /> Overview
                    </Button>
                    <Button 
                        variant={activeTool === 'config' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('config')}
                        className="text-xs"
                    >
                        <Settings className="w-4 h-4 mr-2" /> Configure
                    </Button>
                    <Button 
                        variant={activeTool === 'deployment' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('deployment')}
                        className="text-xs"
                    >
                        <UploadCloud className="w-4 h-4 mr-2" /> Deploy
                    </Button>
                    <Button 
                        variant={activeTool === 'analytics' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('analytics')}
                        className="text-xs"
                    >
                        <BarChart2 className="w-4 h-4 mr-2" /> Analytics
                    </Button>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default MobileAppModule;