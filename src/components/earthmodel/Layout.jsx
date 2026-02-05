import React from 'react';
import Sidebar from './Sidebar';
import { useToast } from '@/components/ui/use-toast';

const EarthModelLayout = ({ children, activeModule, onChangeModule, activeProject }) => {
  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      <Sidebar 
        activeModule={activeModule} 
        onChangeModule={onChangeModule}
        activeProject={activeProject}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar could go here */}
        <header className="h-12 border-b border-slate-800 bg-slate-900 flex items-center px-4 justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-semibold text-slate-100">
              {activeProject ? activeProject.name : 'Select a Project'}
            </h1>
            {activeProject && <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">{activeProject.crs}</span>}
          </div>
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EarthModelLayout;