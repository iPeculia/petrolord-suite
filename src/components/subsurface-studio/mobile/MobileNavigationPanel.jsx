import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, Map, Layers, Activity, BrainCircuit, Menu } from 'lucide-react';

const MobileNavigationPanel = ({ activeTab, onTabChange, onMenuClick }) => {
    const navItems = [
        { id: '3d', label: '3D', icon: Box },
        { id: 'map', label: 'Map', icon: Map },
        { id: 'section', label: 'Sect', icon: Layers },
        { id: 'seismic', label: 'Seis', icon: Activity },
        { id: 'ai', label: 'AI', icon: BrainCircuit },
    ];

    return (
        <div className="h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 shrink-0 z-50 pb-safe">
            <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1 h-auto py-1 text-slate-400" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
                <span className="text-[10px]">Menu</span>
            </Button>
            
            <div className="h-8 w-[1px] bg-slate-800 mx-1" />

            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <Button
                        key={item.id}
                        variant="ghost"
                        size="icon"
                        onClick={() => onTabChange(item.id)}
                        className={`flex flex-col items-center gap-1 h-auto py-1 transition-colors ${isActive ? 'text-cyan-400 bg-cyan-950/30' : 'text-slate-400'}`}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px]">{item.label}</span>
                    </Button>
                );
            })}
        </div>
    );
};

export default MobileNavigationPanel;