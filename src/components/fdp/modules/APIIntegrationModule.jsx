import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Button } from '@/components/ui/button';
import { Server, Terminal, FileText, Activity } from 'lucide-react';
import APIOverview from './api/APIOverview';
import APITesting from './api/APITesting';
import APIDocumentationViewer from './api/APIDocumentationViewer';

const APIIntegrationModule = () => {
    const { state } = useFDP();
    const [activeTool, setActiveTool] = useState('overview');

    const renderTool = () => {
        switch(activeTool) {
            case 'testing': return <APITesting />;
            case 'docs': return <APIDocumentationViewer />;
            default: return <APIOverview onNavigate={setActiveTool} />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">API Integration Hub</h2>
                    <p className="text-slate-400">Manage REST & GraphQL endpoints for external system connectivity.</p>
                </div>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <Button 
                        variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('overview')}
                        className="text-xs"
                    >
                        <Activity className="w-4 h-4 mr-2" /> Overview
                    </Button>
                    <Button 
                        variant={activeTool === 'testing' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('testing')}
                        className="text-xs"
                    >
                        <Terminal className="w-4 h-4 mr-2" /> Testing Tool
                    </Button>
                    <Button 
                        variant={activeTool === 'docs' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('docs')}
                        className="text-xs"
                    >
                        <FileText className="w-4 h-4 mr-2" /> Documentation
                    </Button>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default APIIntegrationModule;