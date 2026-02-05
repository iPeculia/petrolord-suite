import React from 'react';
import { 
    CheckCircle2, Database, Brain, Layout, 
    FileSearch, ShieldCheck, Users, Network, Server 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const phases = [
    {
        id: 1,
        title: "Foundation & QC",
        icon: Database,
        status: "completed",
        features: ["LAS Quality Checker", "Smart Curve Mapping", "Data Lineage Tracker", "Unit Standardization"]
    },
    {
        id: 2,
        title: "ML & Modeling",
        icon: Brain,
        status: "in-progress",
        features: ["Probabilistic Predictions", "Sequence-Aware Models", "Custom Facies Schemes", "In-App Training"]
    },
    {
        id: 3,
        title: "Visualization & UX",
        icon: Layout,
        status: "in-progress",
        features: ["Advanced Well Log Viewer", "Multi-Well Correlation", "Interactive Crossplots", "Depth Histograms"]
    },
    {
        id: 4,
        title: "Interpretation Workflows",
        icon: FileSearch,
        status: "planned",
        features: ["Rock Typing Engine", "Pay Flag Cutoffs", "Scenario Analysis", "Automated Reporting"]
    },
    {
        id: 5,
        title: "Validation & Explainability",
        icon: ShieldCheck,
        status: "planned",
        features: ["Confusion Matrix", "Feature Importance (SHAP)", "Tricky Interval Detection", "Manual Editing"]
    },
    {
        id: 6,
        title: "Collaboration & Enterprise",
        icon: Users,
        status: "planned",
        features: ["Project Workspaces", "Version Control", "Audit Trails", "Team Annotations"]
    },
    {
        id: 7,
        title: "Integration & APIs",
        icon: Network,
        status: "planned",
        features: ["Petrel/Techlog Export", "Internal Suite Connectors", "Public REST API", "Webhooks"]
    },
    {
        id: 8,
        title: "Performance & Scale",
        icon: Server,
        status: "planned",
        features: ["Cloud Job Engine", "GPU Acceleration", "Result Caching", "Multi-Tenant Scaling"]
    }
];

const EnterpriseRoadmapPlan = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-y-auto p-1">
            {phases.map((phase) => {
                const Icon = phase.icon;
                return (
                    <Card key={phase.id} className={`flex flex-col ${phase.status === 'completed' ? 'border-green-500/50 bg-green-950/10' : phase.status === 'in-progress' ? 'border-blue-500/50 bg-blue-950/10' : 'border-slate-800 bg-slate-900'}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${phase.status === 'completed' ? 'bg-green-500/20 text-green-400' : phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <Badge variant="outline" className="uppercase text-[10px]">Phase {phase.id}</Badge>
                            </div>
                            <CardTitle className="text-lg">{phase.title}</CardTitle>
                            <CardDescription className="capitalize text-xs font-semibold text-slate-500">{phase.status.replace('-', ' ')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {phase.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${phase.status === 'completed' ? 'text-green-500' : 'text-slate-600'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default EnterpriseRoadmapPlan;