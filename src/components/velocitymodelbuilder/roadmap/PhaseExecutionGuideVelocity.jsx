import React from 'react';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Users, AlertTriangle } from 'lucide-react';

const PhaseExecutionGuideVelocity = () => {
  const executionSteps = [
    {
      id: "phase-1",
      title: "Phase 1: Inputs & Workflows",
      status: "Complete",
      steps: [
        "Implement LAS parsing for Checkshots/VSP/Sonic.",
        "Develop smart curve detection logic (DT, RHOB, TZ).",
        "Create unit conversion utilities (ft/m, us/ft -> m/s).",
        "Build Multi-Well project structure in Supabase."
      ]
    },
    {
      id: "phase-2",
      title: "Phase 2: Physics Engine",
      status: "Complete",
      steps: [
        "Implement Layer model classes (Constant, Linear, Compaction).",
        "Add Water Layer support with fixed Vw.",
        "Integrate Anisotropy (VTI/TTI) parameter inputs.",
        "Link Pressure/Temperature gradients to velocity bounds."
      ]
    },
    {
      id: "phase-3",
      title: "Phase 3: Time-Depth Conversion",
      status: "Complete",
      steps: [
        "Develop grid math for Horizon Time -> Depth.",
        "Implement forward modeling for Well Tops.",
        "Create Scenario Manager (Base, Low, High cases).",
        "Optimize conversion engine for 100k+ point grids."
      ]
    },
    {
      id: "phase-4",
      title: "Phase 4: QC & Visualization",
      status: "Complete",
      steps: [
        "Build interactive Plotly TD Curve viewer.",
        "Create Velocity vs Depth panel.",
        "Implement Map View Comparison component.",
        "Add real-time sensitivity sliders."
      ]
    },
    {
      id: "phase-5",
      title: "Phase 5: Guided Mode",
      status: "Complete",
      steps: [
        "Design Wizard UI for common tasks.",
        "Implement 'Convert Horizon' workflow.",
        "Implement 'Build TD Curve' workflow.",
        "Add tooltips and help guides."
      ]
    },
    {
      id: "phase-6",
      title: "Phase 6: Expert Mode",
      status: "In Progress",
      steps: [
        "Build detailed layer table editor.",
        "Add Misfit Analysis dashboard.",
        "Implement advanced rock physics templates.",
        "Enable manual editing of velocity functions."
      ]
    },
    {
      id: "phase-7",
      title: "Phase 7: Petrolord Integration",
      status: "Pending",
      steps: [
        "Link to Log Facies Analysis results.",
        "Sync velocity models to EarthModel Studio.",
        "Export depth maps to Volumetrics calculator.",
        "Auto-create tasks in Project Management Pro."
      ]
    },
    {
      id: "phase-8",
      title: "Phase 8: External Tools",
      status: "Pending",
      steps: [
        "Create Petrel ASCII export format.",
        "Create Kingdom T-D chart export.",
        "Build Simulation Grid (Eclipse/CMG) exporter.",
        "Support SEG-Y velocity volume export."
      ]
    },
    {
      id: "phase-9",
      title: "Phase 9: Collaboration",
      status: "In Progress",
      steps: [
        "Implement model versioning system.",
        "Add annotation and commenting system.",
        "Create reproducible run logs.",
        "Build comprehensive audit trail."
      ]
    },
    {
      id: "phase-10",
      title: "Phase 10: Performance",
      status: "Planned",
      steps: [
        "Implement background job queue for large grids.",
        "Create REST API endpoints.",
        "Optimize caching strategy.",
        "Enable GPU acceleration for grid ops."
      ]
    }
  ];

  return (
    <div className="p-4 h-full overflow-y-auto bg-slate-950">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-400" />
        Execution Guide & Timeline
      </h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {executionSteps.map((phase) => (
          <AccordionItem key={phase.id} value={phase.id} className="border border-slate-800 rounded-lg bg-slate-900 px-2">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="text-sm font-medium text-slate-200">{phase.title}</span>
                <Badge variant="outline" className={`
                  ${phase.status === 'Complete' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/10' : 
                    phase.status === 'In Progress' ? 'text-blue-400 border-blue-900 bg-blue-900/10' : 
                    'text-slate-500 border-slate-700'}
                `}>
                  {phase.status}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3 pl-4 border-l-2 border-slate-800 ml-2">
                {phase.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${phase.status === 'Complete' ? 'text-emerald-500' : 'text-slate-600'}`} />
                    <span>{step}</span>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center"><Users className="w-3 h-3 mr-1"/> Resources</h4>
                        <p className="text-xs text-slate-300">2 Full Stack Devs, 1 Geophysicist</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Risks</h4>
                        <p className="text-xs text-slate-300">Data quality, Calc performance</p>
                    </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PhaseExecutionGuideVelocity;