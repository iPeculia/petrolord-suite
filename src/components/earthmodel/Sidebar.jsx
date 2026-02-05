import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { phase3Modules } from '@/config/earthmodel-phase3-config';
import { phase4Modules } from '@/config/earthmodel-phase4-config';
import { ChevronRight, Database, Link, Activity, BrainCircuit } from 'lucide-react';

const Sidebar = ({ activeModule, setActiveModule, projectStatus = "Draft" }) => {
  const allModules = [...phase3Modules, ...phase4Modules];
  const categories = ['Core', 'Structural', 'Property', 'Analysis', 'Visualization', 'Integrations', 'Machine Learning'];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
      {/* Project Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-100 truncate">Project Alpha</h2>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
            {projectStatus}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-slate-500">
          <Database className="w-3 h-3 mr-1" />
          <span>1.6 GB • Last saved 30s ago</span>
        </div>
      </div>

      {/* Navigation Modules */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryModules = allModules.filter(m => m.category === category);
            if (categoryModules.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between group cursor-pointer hover:text-slate-300 transition-colors">
                  {category}
                  {category === 'Integrations' && <Activity className="w-3 h-3 text-blue-500 animate-pulse" />}
                  {category === 'Machine Learning' && <BrainCircuit className="w-3 h-3 text-purple-500" />}
                </h3>
                <div className="space-y-1">
                  {categoryModules.map((module) => (
                    <Button
                      key={module.id}
                      variant={activeModule === module.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-9 px-2",
                        activeModule === module.id 
                          ? "bg-blue-600 text-white hover:bg-blue-500" 
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                      )}
                      onClick={() => setActiveModule(module.id)}
                    >
                      <module.icon className={cn("w-4 h-4 mr-3", activeModule === module.id ? "text-white" : "text-slate-500")} />
                      <span className="flex-1 text-left truncate">{module.name}</span>
                      {module.phase === 3 && activeModule !== module.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-2" />
                      )}
                      {module.phase === 4 && activeModule !== module.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-2" />
                      )}
                      {activeModule === module.id && <ChevronRight className="w-3 h-3 opacity-50 ml-auto" />}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <div className="text-[10px] text-slate-600 text-center">
          EarthModel Pro v4.0.0
          <br />
          Powered by PetroLord
        </div>
      </div>
    </div>
  );
};

export default Sidebar;