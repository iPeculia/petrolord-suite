import React from 'react';
import { motion } from 'framer-motion';
import { 
  GitMerge, Clock, Users, Shield, CheckCircle2, 
  Zap, AlertTriangle, Rocket, BarChart, Server 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

const phases = [
  {
    id: 1,
    title: "Core Velocity Foundation",
    status: "done",
    progress: 100,
    timeline: "Q1 2024",
    description: "Establishing the fundamental velocity modeling capabilities including interval velocity, average velocity, and basic time-depth conversion.",
    features: ["Layered Velocity Model", "Checkshot Integration", "Basic Time-Depth Curve Generation", "Single Well Analysis"],
    resources: ["2 Geoscientists", "1 Backend Dev"],
    gate: "Successful match of checkshot data within 5ms tolerance."
  },
  {
    id: 2,
    title: "Multi-Well & Field Modeling",
    status: "in-progress",
    progress: 65,
    timeline: "Q2 2024",
    description: "Expanding to field-wide models with multiple wells, interpolation of velocity grids, and spatial consistency checks.",
    features: ["Multi-Well Project Management", "Velocity Grid Interpolation", "Well-to-Well Correlation", "Field-wide Trend Analysis"],
    resources: ["3 Geoscientists", "2 Full Stack Devs"],
    gate: "Cross-validation of blind wells yields <2% depth error."
  },
  {
    id: 3,
    title: "Advanced Velocity Functions",
    status: "in-progress",
    progress: 40,
    timeline: "Q3 2024",
    description: "Implementing complex velocity functions like V0+kZ (linear gradient), compaction trends, and lithology-dependent velocity models.",
    features: ["Linear Gradient (V0+kZ)", "Exponential Compaction Curves", "Lithology-Based Velocity", "Anisotropy Basics (VTI)"],
    resources: ["2 Geophysicists", "1 Math/Algo Specialist"],
    gate: "User acceptance of gradient editing tools."
  },
  {
    id: 4,
    title: "Seismic Integration & Stacking Velocities",
    status: "planned",
    progress: 0,
    timeline: "Q4 2024",
    description: "Direct ingestion of seismic stacking velocities (Vnmo) and conversion to interval velocities (Dix) for background models.",
    features: ["SEG-Y Velocity Volume Import", "Dix Conversion Engine", "Smoothed Background Models", "Seismic-Well Tie Calibration"],
    resources: ["2 Seismic Processors", "2 Backend Devs"],
    gate: "Seamless import of 5GB+ velocity volumes."
  },
  {
    id: 5,
    title: "Horizon Conversion & Mapping",
    status: "planned",
    progress: 0,
    timeline: "Q1 2025",
    description: "Workflows to convert time interpretation maps to depth structure maps using the built velocity model.",
    features: ["Batch Horizon Conversion", "Time-to-Depth Gridding", "Residual Correction Maps", "Depth Map QC Tools"],
    resources: ["2 Geologists", "1 UI/UX Designer"],
    gate: "Generation of depth maps for 10+ horizons in under 1 minute."
  },
  {
    id: 6,
    title: "Anisotropy & Complex Media",
    status: "future",
    progress: 0,
    timeline: "Q2 2025",
    description: "Full support for TTI anisotropy, shale compaction corrections, and overpressure velocity reversals.",
    features: ["TTI/VTI Parameters Editor", "Overpressure Detection", "Shale Trend Analysis", "Complex Salt Modeling"],
    resources: ["Advanced Research Team"],
    gate: "Validation against pre-stack depth migration results."
  },
  {
    id: 7,
    title: "Uncertainty & Scenarios",
    status: "future",
    progress: 0,
    timeline: "Q3 2025",
    description: "Probabilistic velocity modeling, Monte Carlo simulation of depth uncertainty, and gross rock volume (GRV) range estimation.",
    features: ["P10/P50/P90 Velocity Models", "Depth Uncertainty Maps", "Stochastic Simulation", "Volume Impact Analysis"],
    resources: ["Risk Analysis Specialist", "2 Data Scientists"],
    gate: "Generation of valid P10/P90 realizations."
  },
  {
    id: 8,
    title: "Real-Time Drilling Integration",
    status: "future",
    progress: 0,
    timeline: "Q4 2025",
    description: "Updating velocity models in real-time using LWD sonic and checkshots to predict formation tops ahead of the bit.",
    features: ["LWD Data Stream", "Real-Time Model Update", "Look-Ahead Depth Prediction", "Drilling Hazard Alerts"],
    resources: ["Operations Geologist", "Real-Time Systems Engineer"],
    gate: "Live update latency < 30 seconds."
  },
  {
    id: 9,
    title: "Machine Learning Velocity Prediction",
    status: "future",
    progress: 0,
    timeline: "2026+",
    description: "AI-driven prediction of velocity trends in undrilled areas based on regional geology and seismic attributes.",
    features: ["ML Velocity Prediction", "Regional Trend Learning", "Seismic Attribute Correlation", "Automated outlier detection"],
    resources: ["AI/ML Team"],
    gate: "Model generalization to new fields."
  },
  {
    id: 10,
    title: "Enterprise Cloud Scale",
    status: "future",
    progress: 0,
    timeline: "2026+",
    description: "Global deployment, basin-scale models, and collaborative multi-user model building in the cloud.",
    features: ["Basin-Scale Grids", "Multi-User Collaboration", "Versioning & Audit Trails", "Cloud HPC Offloading"],
    resources: ["Cloud Architects", "DevOps Team"],
    gate: "Support for 100+ concurrent users on a shared model."
  }
];

const VelocityModelBuilderRoadmap = () => {
  return (
    <div className="h-full flex flex-col bg-slate-950 p-6 text-white overflow-hidden">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <GitMerge className="w-8 h-8 text-emerald-500" />
            Velocity Model Builder Roadmap
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Strategic 10-phase plan for developing an enterprise-grade velocity modeling solution, moving from core 1D analysis to advanced 3D anisotropic field models.
          </p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="border-emerald-500 text-emerald-400">Enterprise Edition</Badge>
            <Badge variant="secondary">v2.0 Planned</Badge>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-slate-900 w-fit border border-slate-800 mb-4">
          <TabsTrigger value="timeline"><Clock className="w-4 h-4 mr-2"/>Timeline View</TabsTrigger>
          <TabsTrigger value="resources"><Users className="w-4 h-4 mr-2"/>Resource Allocation</TabsTrigger>
          <TabsTrigger value="gates"><Shield className="w-4 h-4 mr-2"/>Phase Gates</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-10">
              {phases.map((phase, index) => (
                <motion.div 
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-slate-900 border-slate-800 ${phase.status === 'in-progress' ? 'border-l-4 border-l-emerald-500' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-emerald-500 mb-1 uppercase tracking-wider">Phase {phase.id} • {phase.timeline}</div>
                          <CardTitle className="text-lg text-white">{phase.title}</CardTitle>
                        </div>
                        <Badge className={`${
                          phase.status === 'done' ? 'bg-emerald-900 text-emerald-300' :
                          phase.status === 'in-progress' ? 'bg-blue-900 text-blue-300' : 
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {phase.status === 'in-progress' ? 'Active' : phase.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">{phase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Completion</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-1.5 bg-slate-800" indicatorClassName={phase.status === 'in-progress' ? 'bg-emerald-500' : 'bg-emerald-600'} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center"><Zap className="w-3 h-3 mr-1"/> Key Features</h4>
                          <ul className="space-y-1">
                            {phase.features.map((feature, i) => (
                              <li key={i} className="text-xs text-slate-400 flex items-start">
                                <span className="mr-2 text-slate-600">•</span>{feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                           <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Success Criteria</h4>
                           <p className="text-xs text-slate-400 italic bg-slate-950/50 p-2 rounded border border-slate-800">
                             "{phase.gate}"
                           </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="resources" className="h-full overflow-hidden">
             <Card className="bg-slate-900 border-slate-800 h-full">
                <CardHeader><CardTitle>Resource Allocation Matrix</CardTitle></CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phases.map(phase => (
                            <div key={phase.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <h3 className="text-sm font-bold text-white mb-2">Phase {phase.id}: {phase.title}</h3>
                                <div className="space-y-2">
                                    {phase.resources.map((res, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                            <Users className="w-3 h-3 text-emerald-500" />
                                            {res}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    </ScrollArea>
                </CardContent>
             </Card>
        </TabsContent>

        <TabsContent value="gates" className="h-full">
            <Card className="bg-slate-900 border-slate-800 h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500"/> Quality Gates & Risk Mitigation</CardTitle>
                    <CardDescription>Strict criteria required to proceed to the next development phase.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <div className="space-y-4">
                            {phases.map(phase => (
                                <div key={phase.id} className="flex gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800 items-start">
                                    <div className="bg-slate-900 p-2 rounded-full border border-slate-700">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Gate {phase.id}: {phase.title}</h4>
                                        <p className="text-sm text-slate-400 mt-1">{phase.gate}</p>
                                        <div className="mt-2 flex gap-2">
                                            <Badge variant="outline" className="text-xs">Technical Review</Badge>
                                            <Badge variant="outline" className="text-xs">User Acceptance</Badge>
                                            <Badge variant="outline" className="text-xs">Performance Benchmarking</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VelocityModelBuilderRoadmap;