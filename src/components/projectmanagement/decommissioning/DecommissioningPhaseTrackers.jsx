import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Trash, Anchor, Sprout, Scale, CheckSquare, Recycle } from 'lucide-react';

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

export const WellAbandonmentManagement = () => (
    <TrackerCard 
        title="Well Abandonment" 
        icon={Trash} 
        progress={60} 
        status="In Progress"
        color="red"
        details={[
            { label: 'Wells Plugged', value: '6/10' },
            { label: 'Rig Utilization', value: '95%' },
            { label: 'Cost per Well', value: '$2.5M' }
        ]}
    />
);

export const FacilityRemovalManagement = () => (
    <TrackerCard 
        title="Facility Removal" 
        icon={Anchor} 
        progress={20} 
        status="Planning"
        color="orange"
        details={[
            { label: 'HLV Contracted', value: 'Yes' },
            { label: 'Topsides Weight', value: '15,000t' },
            { label: 'Lifting Plan', value: 'Approved' }
        ]}
    />
);

export const SiteRemediationManagement = () => (
    <TrackerCard 
        title="Site Remediation" 
        icon={Sprout} 
        progress={0} 
        status="Pending"
        color="green"
        details={[
            { label: 'Debris Survey', value: 'Scheduled' },
            { label: 'Seabed Clearance', value: '0%' },
            { label: 'Sampling Plan', value: 'Draft' }
        ]}
    />
);

export const EnvironmentalMonitoring = () => (
    <TrackerCard 
        title="Environmental Monitoring" 
        icon={Scale} 
        progress={40} 
        status="Active"
        color="blue"
        details={[
            { label: 'Baseline Survey', value: 'Complete' },
            { label: 'Monitoring Events', value: 'Ongoing' },
            { label: 'Compliance', value: '100%' }
        ]}
    />
);

export const RegulatoryComplianceTracking = () => (
    <TrackerCard 
        title="Regulatory Compliance" 
        icon={CheckSquare} 
        progress={80} 
        status="Compliant"
        color="purple"
        details={[
            { label: 'Decom Plan', value: 'Approved' },
            { label: 'Permits Active', value: '12' },
            { label: 'Inspections', value: 'Passed' }
        ]}
    />
);

export const WasteManagementTracking = () => (
    <TrackerCard 
        title="Waste Management" 
        icon={Recycle} 
        progress={35} 
        status="Active"
        color="yellow"
        details={[
            { label: 'Total Waste', value: '5000t' },
            { label: 'Recycling Rate', value: '98%' },
            { label: 'HazMat Disposal', value: 'Safe' }
        ]}
    />
);