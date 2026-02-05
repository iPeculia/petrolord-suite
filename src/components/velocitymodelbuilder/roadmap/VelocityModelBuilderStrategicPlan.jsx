import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, Database, Activity, Wand2, Settings, 
  Share2, Globe, Users, Zap, Server 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const phases = [
  {
    id: 1,
    title: "Inputs & Workflows",
    icon: Database,
    status: "complete",
    progress: 100,
    timeline: "Q1 2024",
    description: "Foundation for data ingestion including Checkshots, VSP, Sonic Logs, and smart curve detection with unit conversion."
  },
  {
    id: 2,
    title: "Physics Engine",
    icon: Activity,
    status: "complete",
    progress: 100,
    timeline: "Q2 2024",
    description: "Core velocity algorithms: V0+kZ gradients, compaction trends, water layers, anisotropy (VTI/TTI), and P/T linking."
  },
  {
    id: 3,
    title: "Time-Depth Conversion",
    icon: Layers,
    status: "complete",
    progress: 100,
    timeline: "Q3 2024",
    description: "Horizon grid conversion, well top conversion, forward/inverse modeling engines, and scenario set management."
  },
  {
    id: 4,
    title: "QC & Visualization",
    icon: Activity,
    status: "complete",
    progress: 100,
    timeline: "Q4 2024",
    description: "Interactive TD curves, interval velocity panels, map views, and real-time sensitivity sliders."
  },
  {
    id: 5,
    title: "Guided Mode",
    icon: Wand2,
    status: "complete",
    progress: 100,
    timeline: "Q1 2025",
    description: "Task-based wizards with plain language prompts and default templates for common geological settings."
  },
  {
    id: 6,
    title: "Expert Mode",
    icon: Settings,
    status: "active",
    progress: 60,
    timeline: "Q2 2025",
    description: "Advanced layer grouping, manual parameter editing, misfit analysis, and rock physics constraints."
  },
  {
    id: 7,
    title: "Petrolord Integration",
    icon: Share2,
    status: "planned",
    progress: 20,
    timeline: "Q3 2025",
    description: "Deep linking with Log Facies, EarthModel Studio, Volumetrics, and Project Management Pro."
  },
  {
    id: 8,
    title: "External Tools",
    icon: Globe,
    status: "planned",
    progress: 0,
    timeline: "Q4 2025",
    description: "Export connectors for Petrel/Kingdom and simulation grid builders (Eclipse/CMG)."
  },
  {
    id: 9,
    title: "Collaboration",
    icon: Users,
    status: "active",
    progress: 40,
    timeline: "Q1 2026",
    description: "Model versioning, team comments, reproducible runs, and comprehensive audit trails."
  },
  {
    id: 10,
    title: "Performance",
    icon: Zap,
    status: "future",
    progress: 0,
    timeline: "Q2 2026",
    description: "Cloud job queuing, API endpoints, GPU acceleration, and large dataset optimization."
  }
];

const VelocityModelBuilderStrategicPlan = () => {
  return (
    <div className="space-y-6 p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Strategic 10-Phase Plan</h2>
          <p className="text-slate-400">Enterprise roadmap for Velocity Model Builder evolution.</p>
        </div>
        <div className="flex gap-2">
            <Badge className="bg-emerald-600">On Track</Badge>
            <Badge variant="outline" className="text-slate-400">Updated: Nov 2025</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`h-full bg-slate-900 border-slate-800 ${phase.status === 'active' ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <phase.icon className={`w-6 h-6 ${
                      phase.status === 'complete' ? 'text-emerald-400' : 
                      phase.status === 'active' ? 'text-blue-400' : 'text-slate-500'
                    }`} />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300">
                    Phase {phase.id}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg text-white">{phase.title}</CardTitle>
                <CardDescription className="text-xs text-slate-500">{phase.timeline}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-4 h-16">{phase.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Completion</span>
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
    </div>
  );
};

export default VelocityModelBuilderStrategicPlan;