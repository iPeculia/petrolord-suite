import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowRight, 
  Zap, 
  Layers, 
  BarChart3, 
  Globe, 
  FileUp, 
  Radio,
  ChevronRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const phases = [
  {
    id: 0,
    title: "Foundation",
    subtitle: "Audit & Stability",
    icon: <Layers className="w-5 h-5" />,
    status: "completed",
    progress: 100,
    timeline: "Week 1",
    features: [
      "Calculation Engine Audit",
      "Unit Test Framework",
      "Dark Theme Standardization",
      "Performance Profiling"
    ],
    desc: "Establishing a stable, verified core for all future calculations."
  },
  {
    id: 1,
    title: "Robust Inputs",
    subtitle: "Data Ingestion",
    icon: <FileUp className="w-5 h-5" />,
    status: "in-progress",
    progress: 65,
    timeline: "Week 2-3",
    features: [
      "Advanced LAS Parsing",
      "Automated Unit Conversion",
      "Data Quality (QC) Dashboard",
      "Curve Stitching & Merging"
    ],
    desc: "Ensuring garbage-in does not lead to garbage-out with smart loaders."
  },
  {
    id: 2,
    title: "Analysis Workflow",
    subtitle: "Step-by-Step Guide",
    icon: <ArrowRight className="w-5 h-5" />,
    status: "pending",
    progress: 0,
    timeline: "Week 4-5",
    features: [
      "Overburden Integrator",
      "NCT Picker Interface",
      "Method Selection Wizard",
      "Constraint Enforcement"
    ],
    desc: "Guiding the user through a logical geological process."
  },
  {
    id: 3,
    title: "Interactive Tuning",
    subtitle: "Dynamic Calibration",
    icon: <Zap className="w-5 h-5" />,
    status: "pending",
    progress: 0,
    timeline: "Week 6-7",
    features: [
      "Drag-and-Drop Charting",
      "Real-time Parameter Sliders",
      "Undo/Redo History",
      "Visual Calibration Locking"
    ],
    desc: "Making the static charts alive and responsive to engineering intuition."
  },
  {
    id: 4,
    title: "Probabilistic Engine",
    subtitle: "QRA & Uncertainty",
    icon: <BarChart3 className="w-5 h-5" />,
    status: "pending",
    progress: 0,
    timeline: "Week 8-9",
    features: [
      "Monte Carlo Simulation",
      "P10/P50/P90 Generation",
      "Sensitivity Tornado Plots",
      "Risk Register Integration"
    ],
    desc: "Moving from single-line prognosis to full risk quantification."
  },
  {
    id: 5,
    title: "Multi-Well",
    subtitle: "Regional Context",
    icon: <Globe className="w-5 h-5" />,
    status: "pending",
    progress: 0,
    timeline: "Week 10-11",
    features: [
      "Offset Well Comparison",
      "Basin Trend Mapping",
      "Stratigraphic Correlation",
      "Geospatial Search"
    ],
    desc: "Leveraging historical data to inform new well planning."
  },
  {
    id: 6,
    title: "Export & Integration",
    subtitle: "Reporting Suite",
    icon: <FileUp className="w-5 h-5" />,
    status: "pending",
    progress: 0,
    timeline: "Week 12",
    features: [
      "Prognosis Pack PDF",
      "LAS Export",
      "Casing Design Handover",
      "Corporate Data Lake Sync"
    ],
    desc: "Seamlessly connecting results to the wider drilling workflow."
  },
  {
    id: 7,
    title: "Field Deployment",
    subtitle: "Real-Time Ops",
    icon: <Radio className="w-5 h-5" />,
    status: "locked",
    progress: 0,
    timeline: "Q2 2026",
    features: [
      "WITSML Live Stream",
      "Mobile PWA Access",
      "Real-time Alarming",
      "Low-Bandwidth Mode"
    ],
    desc: "Bringing the power of the analyzer to the rig floor."
  }
];

const PhaseRoadmap = () => {
  const [selectedPhase, setSelectedPhase] = useState(phases[1]); // Default to current active phase

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 overflow-hidden rounded-lg border border-slate-800">
      {/* Sidebar List */}
      <div className="w-1/3 min-w-[250px] border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold text-lg text-emerald-400">Development Roadmap</h3>
          <p className="text-xs text-slate-500">PP-FG Analyzer Evolution Plan</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {phases.map((phase) => (
              <div 
                key={phase.id}
                onClick={() => setSelectedPhase(phase)}
                className={`p-3 rounded-lg cursor-pointer transition-all border flex items-center gap-3
                  ${selectedPhase.id === phase.id 
                    ? 'bg-slate-800 border-emerald-500/50 shadow-md' 
                    : 'bg-slate-900/30 border-transparent hover:bg-slate-800/50'
                  }
                  ${phase.status === 'locked' ? 'opacity-50' : 'opacity-100'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold
                  ${phase.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
                    phase.status === 'in-progress' ? 'bg-blue-500/20 border-blue-500 text-blue-400' :
                    phase.status === 'locked' ? 'bg-slate-800 border-slate-600 text-slate-600' :
                    'bg-slate-800 border-slate-600 text-slate-400'}
                `}>
                  {phase.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                   phase.status === 'locked' ? <Lock className="w-4 h-4" /> :
                   phase.id}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-semibold text-sm truncate ${selectedPhase.id === phase.id ? 'text-white' : 'text-slate-300'}`}>
                      PHASE {phase.id}
                    </h4>
                    {phase.status === 'in-progress' && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{phase.subtitle}</p>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedPhase.id === phase.id ? 'text-emerald-500' : 'text-slate-700'}`} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Detail View */}
      <div className="flex-1 flex flex-col bg-slate-950 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full flex flex-col max-w-4xl mx-auto w-full"
          >
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className={`
                    ${selectedPhase.status === 'completed' ? 'border-emerald-500 text-emerald-400' : 
                      selectedPhase.status === 'in-progress' ? 'border-blue-500 text-blue-400' : 
                      'border-slate-600 text-slate-500'}
                  `}>
                    {selectedPhase.status.toUpperCase()}
                  </Badge>
                  <span className="text-slate-500 text-sm font-mono">{selectedPhase.timeline}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  {selectedPhase.icon}
                  Phase {selectedPhase.id}: {selectedPhase.title}
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">{selectedPhase.desc}</p>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm text-slate-500 mb-1">Completion</div>
                <div className="text-2xl font-mono font-bold text-white">{selectedPhase.progress}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={selectedPhase.progress} className="h-2 bg-slate-800" indicatorClassName={
                selectedPhase.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'
              } />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {selectedPhase.features.map((feature, idx) => (
                <Card key={idx} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="p-4 flex items-center gap-3">
                    {selectedPhase.progress === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                    <span className={`font-medium ${selectedPhase.progress === 100 ? 'text-slate-300' : 'text-slate-400'}`}>
                      {feature}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA / Dependencies */}
            <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center">
              <div className="text-sm text-slate-500">
                Dependency: <span className="text-slate-300">{selectedPhase.id > 0 ? `Phase ${selectedPhase.id - 1}` : 'None'}</span>
              </div>
              
              <div className="flex gap-3">
                 <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    View Documentation
                 </Button>
                 {selectedPhase.status === 'in-progress' && (
                   <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                      Contribute Code
                   </Button>
                 )}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhaseRoadmap;