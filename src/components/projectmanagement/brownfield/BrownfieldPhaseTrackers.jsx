import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Layout, TrendingUp, BarChart2 } from 'lucide-react';

const TrackerCard = ({ title, icon: Icon, progress, status, details, color }) => (
    <Card className="bg-slate-900 border-slate-800 h-full">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${color}-400`} />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-white">{progress}%</div>
                <Badge variant="outline" className={`text-${color}-400 border-${color}-500/30 bg-${color}-500/10`}>{status}</Badge>
            </div>
            <Progress value={progress} className={`h-2 bg-slate-800`} indicatorClassName={`bg-${color}-500`} />
            <div className="space-y-2">
                {details.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-400">
                        <span>{item.label}</span>
                        <span className="text-slate-200">{item.value}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export const OpportunityIdentification = () => (
    <TrackerCard 
        title="Opportunity Assessment" 
        icon={Lightbulb} 
        progress={100} 
        status="Complete"
        color="yellow"
        details={[
            { label: 'Screening', value: 'Done' },
            { label: 'Business Case', value: 'Approved' },
            { label: 'ROI Estimate', value: '25%' }
        ]}
    />
);

export const InfrastructureAssessment = () => (
    <TrackerCard 
        title="Existing Infrastructure" 
        icon={Layout} 
        progress={80} 
        status="Audited"
        color="slate"
        details={[
            { label: 'Piping Integrity', value: 'Acceptable' },
            { label: 'Structural Capacity', value: '90% Utilized' },
            { label: 'Control System', value: 'Obsolete' }
        ]}
    />
);

export const BrownfieldOptimization = () => (
    <TrackerCard 
        title="Optimization Tracking" 
        icon={TrendingUp} 
        progress={40} 
        status="Implementing"
        color="blue"
        details={[
            { label: 'Debottlenecking', value: 'Study Phase' },
            { label: 'Energy Efficiency', value: 'Implemented' },
            { label: 'Cost Savings', value: '$2M/yr' }
        ]}
    />
);

export const ProductionIncreaseTracking = () => (
    <TrackerCard 
        title="Production Uplift" 
        icon={BarChart2} 
        progress={10} 
        status="Forecast"
        color="green"
        details={[
            { label: 'Target Increase', value: '+5,000 bopd' },
            { label: 'Actual Increase', value: '0 bopd' },
            { label: 'Cost per Barrel', value: '$8.50' }
        ]}
    />
);