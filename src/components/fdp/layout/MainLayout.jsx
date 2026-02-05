import React from 'react';
import { useFDP } from '@/contexts/FDPContext';
import SidebarNavigation from '../navigation/SidebarNavigation';
import TopNavigation from '../navigation/TopNavigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntegrationService } from '@/services/fdp/IntegrationService';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';

const RightPanel = () => {
    const { state } = useFDP();
    const registry = IntegrationService.getRegistry();

    return (
        <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 w-80">
            <div className="p-4 border-b border-slate-800 font-semibold text-white flex items-center justify-between">
                <span>Properties & Integrations</span>
                <Activity className="w-4 h-4 text-slate-500" />
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Project Stats</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-800 p-2 rounded border border-slate-700">
                                <div className="text-xs text-slate-400">NPV (MM$)</div>
                                <div className="text-lg font-bold text-green-400">${state.economics.npv}</div>
                            </div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700">
                                <div className="text-xs text-slate-400">Reserves</div>
                                <div className="text-lg font-bold text-blue-400">{state.subsurface.reserves.p50}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Integrations</h3>
                        <div className="space-y-2">
                            {registry.map(app => (
                                <div key={app.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3 ${app.status === 'connected' || app.status === 'active' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                        <span className="text-sm text-slate-200">{app.name}</span>
                                    </div>
                                    {app.status === 'connected' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                    {app.status === 'disconnected' && <AlertCircle className="w-3 h-3 text-slate-500" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Validation</h3>
                        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3">
                            <div className="flex items-start">
                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 mr-2" />
                                <div>
                                    <div className="text-sm text-yellow-200 font-medium">Missing Data</div>
                                    <p className="text-xs text-yellow-200/70 mt-1">Facilities cost estimates are pending validation from the engineering team.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

const MainLayout = ({ children }) => {
    const { state } = useFDP();
    const { sidebarCollapsed, rightPanelOpen } = state.navigation;

    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden text-slate-200 font-sans">
            <TopNavigation />
            
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <aside 
                    className={cn(
                        "bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex-shrink-0 z-20",
                        sidebarCollapsed ? "w-16" : "w-64"
                    )}
                >
                    <SidebarNavigation />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
                    <ScrollArea className="flex-1">
                        <div className="p-6 min-h-full">
                            {children}
                        </div>
                    </ScrollArea>
                </main>

                {/* Right Panel */}
                <aside 
                    className={cn(
                        "border-l border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out flex-shrink-0 z-10",
                        rightPanelOpen ? "w-80" : "w-0 border-l-0 overflow-hidden"
                    )}
                >
                    <RightPanel />
                </aside>
            </div>
            
            {/* Status Bar */}
            <div className="h-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 select-none">
                <div className="flex items-center space-x-4">
                    <span>Ready</span>
                    <span>v1.0.0</span>
                    <span>Region: Global</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span>Last Saved: {new Date().toLocaleTimeString()}</span>
                    <span>{state.meta.mode.toUpperCase()} MODE</span>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;