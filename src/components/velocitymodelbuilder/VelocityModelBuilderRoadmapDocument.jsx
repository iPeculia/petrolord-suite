import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Circle, Clock, ArrowRight, 
  Shield, Zap, Users, Layers, Code, Globe, 
  Database, Cpu, Lock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const phases = [
  { id: 1, title: "Foundation & QC", desc: "Core velocity structure, well data loading, checkshot integration, and basic quality control.", status: "complete", icon: Layers },
  { id: 2, title: "Multi-Well Logic", desc: "Field-wide consistency, cross-well correlation, and spatial interpolation of velocity trends.", status: "complete", icon: Globe },
  { id: 3, title: "Advanced Functions", desc: "Gradient velocities (V0+kZ), compaction trends, and lithology-dependent models.", status: "complete", icon: Code },
  { id: 4, title: "Seismic Integration", desc: "Direct ingestion of stacking velocities, Dix conversion, and background model building.", status: "complete", icon: Database },
  { id: 5, title: "Horizon Mapping", desc: "Batch conversion of time grids to depth, residual correction maps, and structural consistency.", status: "complete", icon: Layers },
  { id: 6, title: "Anisotropy & Physics", desc: "VTI/TTI parameters, pore pressure prediction linking, and rock physics constraints.", status: "complete", icon: Zap },
  { id: 7, title: "Uncertainty", desc: "Monte Carlo simulation, P10/P50/P90 scenarios, and gross rock volume range estimation.", status: "complete", icon: Shield },
  { id: 8, title: "Real-Time Ops", desc: "LWD integration, look-ahead prediction while drilling, and dynamic model updating.", status: "complete", icon: Clock },
  { id: 9, title: "Collaboration & Audit", desc: "Versioning, team comments, reproducible runs, and comprehensive audit trails.", status: "active", icon: Users },
  { id: 10, title: "Enterprise Scale", desc: "Cloud job offloading, API endpoints, massive dataset handling, and advanced export.", status: "active", icon: Cpu },
];

const VelocityModelBuilderRoadmapDocument = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Enterprise Development Roadmap</h1>
        <p className="text-slate-400 max-w-3xl">
          Strategic 10-phase plan for the Velocity Model Builder, evolving from a single-well tool to a field-wide enterprise solution.
          Currently executing Phase 9 & 10: Collaboration and Enterprise Scale.
        </p>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-8 pb-12 relative">
          {/* Vertical Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-800 z-0"></div>

          {phases.map((phase, idx) => (
            <motion.div 
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative z-10 pl-20 group"
            >
              {/* Status Icon */}
              <div className={`absolute left-0 top-0 w-14 h-14 rounded-full border-4 flex items-center justify-center bg-slate-900 transition-colors ${
                phase.status === 'complete' ? 'border-emerald-500 text-emerald-500' :
                phase.status === 'active' ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                'border-slate-700 text-slate-600'
              }`}>
                <phase.icon className="w-6 h-6" />
              </div>

              <Card className={`bg-slate-900 border-slate-800 transition-all ${phase.status === 'active' ? 'border-blue-500/50 bg-blue-900/5' : 'hover:border-slate-700'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span className={phase.status === 'active' ? 'text-blue-400' : 'text-slate-500'}>Phase {phase.id}</span>
                        {phase.status === 'active' && <Badge className="bg-blue-600 text-[10px]">In Progress</Badge>}
                        {phase.status === 'complete' && <Badge variant="outline" className="text-emerald-500 border-emerald-900 bg-emerald-900/10 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1"/> Complete</Badge>}
                      </div>
                      <CardTitle className="text-lg text-slate-200">{phase.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">{phase.desc}</p>
                  
                  {/* Phase Details Expansion (simplified for view) */}
                  {phase.status === 'active' && (
                    <div className="mt-4 p-3 bg-slate-950/50 rounded border border-slate-800/50 text-xs text-slate-400 grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-300">Key Deliverables</span>
                            <ul className="list-disc list-inside space-y-0.5">
                                <li>Feature Implementation</li>
                                <li>User Acceptance Testing</li>
                                <li>Documentation</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-300">Resources</span>
                            <div className="flex items-center gap-2"><Users className="w-3 h-3"/> 2 Developers</div>
                            <div className="flex items-center gap-2"><Lock className="w-3 h-3"/> Security Review</div>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VelocityModelBuilderRoadmapDocument;