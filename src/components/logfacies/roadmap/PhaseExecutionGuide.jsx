import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const guides = [
    {
        id: "p1",
        phase: "Phase 1: Foundation & QC",
        timeline: "Weeks 1-4",
        resources: "1 Frontend Dev, 1 Petrophysicist",
        steps: [
            "Implement robust LAS 2.0 parser with error handling.",
            "Develop 'Smart Mapping' logic to alias curve mnemonics (e.g. GR_FINAL -> GR).",
            "Create 'LAS Quality Checker' to visualize nulls, gaps, and spikes.",
            "Set up 'Data Lineage' to track raw vs. normalized curves."
        ],
        success: "Users can upload dirty LAS files and get a clean, normalized dataset ready for ML."
    },
    {
        id: "p2",
        phase: "Phase 2: ML & Modeling",
        timeline: "Weeks 5-10",
        resources: "1 ML Engineer, 1 Frontend Dev",
        steps: [
            "Integrate XGBoost/RandomForest via WebAssembly or Edge Function.",
            "Implement 'In-App Training' UI for users to tag intervals.",
            "Add 'Probabilistic Output' (P10/P50/P90) for facies confidence.",
            "Build 'Batch Processing' queue for multi-well jobs."
        ],
        success: "Model achieves >85% accuracy on blind test wells; training workflow is intuitive."
    },
    {
        id: "p3",
        phase: "Phase 3: Visualization & UX",
        timeline: "Weeks 11-14",
        resources: "1 Frontend Dev (D3/Canvas specialist)",
        steps: [
            "Upgrade log viewer to use Canvas/WebGL for performance with 10k+ points.",
            "Build 'Multi-Well Correlation' panel with stratigraphic flattening.",
            "Create interactive Crossplots (NPHI-RHOB, etc.) with lasso selection.",
            "Implement 'Theme Toggle' for dark/light/print modes."
        ],
        success: "Visualizations remain 60fps during zoom/pan; print layouts look professional."
    },
    {
        id: "p4",
        phase: "Phase 4: Interpretation Workflows",
        timeline: "Weeks 15-18",
        resources: "1 Petrophysicist, 1 Fullstack Dev",
        steps: [
            "Develop 'Rock Typing Engine' linking facies to Phi/K/Sw.",
            "Create 'Pay Flag Engine' with cutoffs (Vsh, Phi, Sw).",
            "Implement 'Scenario Runner' to compare different model parameters.",
            "Build 'Report Generator' for PDF/PPTX summaries."
        ],
        success: "End-to-end workflow from log upload to Net Pay summary report is seamless."
    },
    {
        id: "p5",
        phase: "Phase 5: Validation & Explainability",
        timeline: "Weeks 19-22",
        resources: "1 ML Engineer, 1 Frontend Dev",
        steps: [
            "Add 'Confusion Matrix' and per-class accuracy metrics.",
            "Implement 'Feature Importance' (SHAP values) visualization.",
            "Create 'Tricky Interval Detector' for thin beds/washouts.",
            "Build 'Manual Editing' layer for expert overrides."
        ],
        success: "Users trust the \"black box\" because they can see why it made decisions and override them."
    },
    {
        id: "p6",
        phase: "Phase 6: Collaboration & Enterprise",
        timeline: "Weeks 23-26",
        resources: "1 Backend Dev, 1 Frontend Dev",
        steps: [
            "Implement 'Project Workspaces' with role-based access (RBAC).",
            "Add 'Version Control' for project states (v1, v2, etc.).",
            "Create 'Audit Logs' for all data modifications.",
            "Enable 'Team Comments' pinned to specific depths."
        ],
        success: "Multiple users can work on the same project safely with full history tracking."
    },
    {
        id: "p7",
        phase: "Phase 7: Integration & APIs",
        timeline: "Weeks 27-30",
        resources: "1 Backend Dev, 1 Integration Specialist",
        steps: [
            "Build connectors for Petrel/Techlog (LAS/DLIS export).",
            "Develop Public REST API for headless classification.",
            "Integrate with Petrolord Suite (EarthModel, Reservoir Balance).",
            "Add Webhooks for job completion notifications."
        ],
        success: "System acts as a connected node in the client's larger subsurface ecosystem."
    },
    {
        id: "p8",
        phase: "Phase 8: Performance & Scale",
        timeline: "Weeks 31-34",
        resources: "1 DevOps, 1 Backend Dev",
        steps: [
            "Migrate heavy ML jobs to GPU-accelerated cloud clusters.",
            "Implement aggressive caching for visualization data.",
            "Optimize database queries for multi-tenant scale.",
            "Set up auto-scaling infrastructure."
        ],
        success: "System handles 100+ concurrent users and 1GB+ file uploads without degradation."
    }
];

const PhaseExecutionGuide = () => {
    return (
        <ScrollArea className="h-full p-4">
            <Accordion type="single" collapsible className="space-y-4">
                {guides.map((guide) => (
                    <AccordionItem key={guide.id} value={guide.id} className="border border-slate-800 rounded-lg bg-slate-900 px-4">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex flex-col items-start text-left">
                                <h3 className="text-lg font-semibold text-white">{guide.phase}</h3>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">{guide.timeline}</Badge>
                                    <span className="text-xs text-slate-400">{guide.resources}</span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Execution Steps</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                                        {guide.steps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-emerald-900/20 border border-emerald-900/50 p-3 rounded">
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Success Criteria</h4>
                                    <p className="text-sm text-emerald-100">{guide.success}</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </ScrollArea>
    );
};

export default PhaseExecutionGuide;