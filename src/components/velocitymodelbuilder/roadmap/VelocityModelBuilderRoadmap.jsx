import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, Database, Activity, Wand2, Settings, 
  Share2, Globe, Users, Zap, Server, CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const phases = [
  {
    id: 1,
    title: "Inputs & Workflows",
    icon: Database,
    status: "complete",
    progress: 100,
    timeline: "Q1 2024",
    description: "Foundation for data ingestion including Checkshots, VSP, Sonic Logs, and smart curve detection with unit conversion.",
    deliverables: ["LAS/CSV Import", "Smart Curve Detection", "Unit Converter", "Multi-Well Manager"]
  },
  {
    id: 2,
    title: "Physics Engine",
    icon: Activity,
    status: "complete",
    progress: 100,
    timeline: "Q2 2024",
    description: "Core velocity algorithms: V0+kZ gradients, compaction trends, water layers, anisotropy (VTI/TTI), and P/T linking.",
    deliverables: ["Layer Type Builder", "Anisotropy Editor", "P/T Linker", "Rock Physics Templates"]
  },
  {
    id: 3,
    title: "Time-Depth Conversion",
    icon: Layers,
    status: "active",
    progress: 80,
    timeline: "Q3 2024",
    description: "Horizon grid conversion, well top conversion, forward/inverse modeling engines, and scenario set management.",
    deliverables: ["T-D Engine", "Forward Modeling", "Scenario Manager", "Grid Operations"]
  },
  {
    id: 4,
    title: "QC & Visualization",
    icon: Activity,
    status: "active",
    progress: 60,
    timeline: "Q4 2024",
    description: "Interactive TD curves, interval velocity panels, map views, and real-time sensitivity sliders.",
    deliverables: ["Interactive TD Viewer", "Velocity Panel Viz", "Map Comparison", "Residual Analysis"]
  },
  {
    id: 5,
    title: "Guided Mode",
    icon: Wand2,
    status: "planned",
    progress: 0,
    timeline: "Q1 2025",
    description: "Task-based wizards with plain language prompts and default templates for common geological settings.",
    deliverables: ["Horizon Conversion Wizard", "Well Tie Wizard", "Smart Defaults"]
  },
  {
    id: 6,
    title: "Expert Mode",
    icon: Settings,
    status: "planned",
    progress: 0,
    timeline: "Q2 2025",
    description: "Advanced layer grouping, manual parameter editing, misfit analysis, and rock physics constraints.",
    deliverables: ["Manual Parameter Editor", "Misfit Matrix", "Advanced Constraints"]
  },
  {
    id: 7,
    title: "Petrolord Integration",
    icon: Share2,
    status: "planned",
    progress: 0,
    timeline: "Q3 2025",
    description: "Deep linking with Log Facies, EarthModel Studio, Volumetrics, and Project Management Pro.",
    deliverables: ["Cross-App Sync", "Shared Project Data"]
  },
  {
    id: 8,
    title: "External Tools",
    icon: Globe,
    status: "planned",
    progress: 0,
    timeline: "Q4 2025",
    description: "Export connectors for Petrel/Kingdom and simulation grid builders (Eclipse/CMG).",
    deliverables: ["Petrel Export", "Kingdom Export", "Rescue/ZMap Support"]
  },
  {
    id: 9,
    title: "Collaboration",
    icon: Users,
    status: "planned",
    progress: 0,
    timeline: "Q1 2026",
    description: "Model versioning, team comments, reproducible runs, and comprehensive audit trails.",
    deliverables: ["Model Versioning", "Team Comments", "Audit Trail"]
  },
  {
    id: 10,
    title: "Performance",
    icon: Zap,
    status: "future",
    progress: 0,
    timeline: "Q2 2026",
    description: "Cloud job queuing, API endpoints, GPU acceleration, and large dataset optimization.",
    deliverables: ["Cloud Jobs", "Public API", "GPU Acceleration"]
  }
];

const VelocityModelBuilderRoadmap = () => {
  return (
    <div className="h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Velocity Model Builder Roadmap</h1>
        <p className="text-slate-400 max-w-3xl">
          Strategic 10-phase development plan for delivering a world-class Enterprise Velocity Modeling solution.
          Currently executing Phase 3 & 4.
        </p>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="timeline">Strategic Timeline</TabsTrigger>
            <TabsTrigger value="matrix">Resource Matrix</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phases.map((phase, index) => (
                <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Card className={`h-full bg-slate-900 border-slate-800 flex flex-col ${phase.status === 'active' ? 'border-l-4 border-l-blue-500' : ''}`}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <phase.icon className={`w-6 h-6 ${
                            phase.status === 'complete' ? 'text-emerald-400' : 
                            phase.status === 'active' ? 'text-blue-400' : 'text-slate-500'
                            }`} />
                        </div>
                        <Badge variant="secondary" className={`text-xs ${
                            phase.status === 'complete' ? 'bg-emerald-900/20 text-emerald-400' : 
                            phase.status === 'active' ? 'bg-blue-900/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                            {phase.status.toUpperCase()}
                        </Badge>
                        </div>
                        <CardTitle className="mt-4 text-lg text-white">Phase {phase.id}: {phase.title}</CardTitle>
                        <CardDescription className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {phase.timeline}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-slate-400 mb-4 flex-1">{phase.description}</p>
                        
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-500 mb-2 block">Key Deliverables:</span>
                            <div className="flex flex-wrap gap-1">
                                {phase.deliverables.map(d => (
                                    <Badge key={d} variant="outline" className="text-[10px] border-slate-700 text-slate-400">{d}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1 mt-auto pt-4 border-t border-slate-800">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span>{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-1.5 bg-slate-800" 
                            indicatorClassName={
                            phase.status === 'complete' ? 'bg-emerald-500' : 
                            phase.status === 'active' ? 'bg-blue-500' : 'bg-slate-600'
                            } 
                        />
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="matrix">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Resource Allocation</CardTitle>
                    <CardDescription>Team composition required per phase</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="grid grid-cols-12 gap-4 items-center p-3 bg-slate-950/50 rounded border border-slate-800">
                                <div className="col-span-2 font-bold text-slate-300">Phase {i}</div>
                                <div className="col-span-10 grid grid-cols-4 gap-2">
                                    <div className="flex flex-col items-center p-2 bg-blue-900/10 rounded">
                                        <span className="text-xs text-blue-400">Frontend</span>
                                        <span className="font-bold text-white">2 FTE</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-emerald-900/10 rounded">
                                        <span className="text-xs text-emerald-400">Backend</span>
                                        <span className="font-bold text-white">1.5 FTE</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-purple-900/10 rounded">
                                        <span className="text-xs text-purple-400">Geoscience</span>
                                        <span className="font-bold text-white">1 FTE</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-orange-900/10 rounded">
                                        <span className="text-xs text-orange-400">QA/QC</span>
                                        <span className="font-bold text-white">0.5 FTE</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="dependencies">
             <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 flex items-center justify-center min-h-[400px] text-slate-500">
                    Dependency Graph Visualization Placeholder
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VelocityModelBuilderRoadmap;