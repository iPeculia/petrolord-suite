import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Share2, Bell } from 'lucide-react';
import CollaborationOverview from './collaboration/CollaborationOverview';
import TeamManagement from './collaboration/TeamManagement';
import CommentAndAnnotation from './collaboration/CommentAndAnnotation';

const CollaborationModule = () => {
    const { state } = useFDP();
    const [activeTool, setActiveTool] = useState('overview');

    const renderTool = () => {
        switch(activeTool) {
            case 'team': return <TeamManagement />;
            case 'comments': return <CommentAndAnnotation />;
            default: return <CollaborationOverview onNavigate={setActiveTool} />;
        }
    };

    return (
        <div className="space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Collaboration Hub</h2>
                    <p className="text-slate-400">Manage your team, communications, and shared resources.</p>
                </div>
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <Button 
                        variant={activeTool === 'overview' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('overview')}
                        className="text-xs"
                    >
                        <Users className="w-4 h-4 mr-2" /> Overview
                    </Button>
                    <Button 
                        variant={activeTool === 'team' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('team')}
                        className="text-xs"
                    >
                        <Users className="w-4 h-4 mr-2" /> Team
                    </Button>
                    <Button 
                        variant={activeTool === 'comments' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTool('comments')}
                        className="text-xs"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" /> Comments
                    </Button>
                </div>
            </div>

            {renderTool()}
        </div>
    );
};

export default CollaborationModule;