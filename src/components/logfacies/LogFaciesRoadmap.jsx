import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ArrowRight, Map, Milestone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const phases = [
  { 
    id: 1, 
    title: "Phase 1: Foundation & Data Ingestion", 
    status: "completed", 
    timeline: "Q1 2024",
    items: ["LAS 2.0 Parsing Engine", "Basic Curve Visualization", "Simple Cutoff Classification", "CSV/LAS Export"] 
  },
  { 
    id: 2, 
    title: "Phase 2: Intelligent QC & Preprocessing", 
    status: "in-progress", 
    timeline: "Q2 2024",
    items: ["Automated LAS Quality Checker", "Smart Curve Mapping (Alias Library)", "Null/Spike Detection Algorithms", "Unit Normalization & Standardization"] 
  },
  { 
    id: 3, 
    title: "Phase 3: Advanced ML Engine", 
    status: "planned", 
    timeline: "Q3 2024",
    items: ["Probabilistic Predictions (Bayesian)", "Sequence Models (1D CNN/LSTM)", "Confidence Scoring System", "In-App Model Training Studio"] 
  },
  { 
    id: 4, 
    title: "Phase 4: Facies Management System", 
    status: "planned", 
    timeline: "Q4 2024",
    items: ["Custom Facies Scheme Builder", "Global & Asset Templates", "Color/Pattern Customization", "Rock Type Definitions"] 
  },
  { 
    id: 5, 
    title: "Phase 5: Multi-Well Workflow", 
    status: "planned", 
    timeline: "Q1 2025",
    items: ["Batch Processing Engine", "Multi-Well Correlation Panel", "Field-Wide Statistics", "Job Queue Management"] 
  },
  { 
    id: 6, 
    title: "Phase 6: Depth & Lineage Control", 
    status: "planned", 
    timeline: "Q2 2025",
    items: ["Interactive Depth Shifting", "Stretch & Squeeze Tools", "Data Lineage Tracking", "Full Undo/Redo History"] 
  },
  { 
    id: 7, 
    title: "Phase 7: Enhanced Visualization", 
    status: "planned", 
    timeline: "Q3 2025",
    items: ["High-Performance Log Viewer (Canvas)", "Interactive Tops Picking", "Integrated Cross-plots", "Core Image Overlay"] 
  },
  { 
    id: 8, 
    title: "Phase 8: Enterprise Integration", 
    status: "planned", 
    timeline: "Q4 2025",
    items: ["Cloud Model Registry", "API Access Control", "Team Collaboration Features", "Automated PDF Reporting"] 
  },
];

const LogFaciesRoadmap = () => {
  return (
    <div className="space-y-6 p-4 h-full overflow-y-auto bg-slate-950">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Map className="w-8 h-8 text-lime-400" /> 
                    Product Roadmap
                </h2>
                <p className="text-slate-400 mt-1">Strategic development plan for the Log Facies Analysis Suite.</p>
            </div>
            <Badge variant="outline" className="text-lg py-1 px-3 border-lime-500 text-lime-400">
                Current: Phase 2
            </Badge>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full flex flex-col border-t-4 ${phase.status === 'completed' ? 'border-t-lime-500' : phase.status === 'in-progress' ? 'border-t-blue-500' : 'border-t-slate-700'} bg-slate-900 border-x-slate-800 border-b-slate-800 shadow-lg`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {phase.timeline}
                  </div>
                  {phase.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-lime-500" /> : 
                   phase.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-500 animate-pulse" /> : 
                   <Milestone className="w-5 h-5 text-slate-700" />}
                </div>
                <CardTitle className="text-lg text-slate-100 leading-tight">{phase.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                      <ArrowRight className={`w-3 h-3 mt-1 ${phase.status === 'completed' ? 'text-lime-600' : 'text-slate-600'}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LogFaciesRoadmap;