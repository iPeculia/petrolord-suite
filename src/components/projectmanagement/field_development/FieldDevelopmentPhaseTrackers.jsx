import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { DraftingCompass, ShoppingCart, HardHat, Wrench, Factory, TrendingUp } from 'lucide-react';

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

export const FEEDManagement = () => (
    <TrackerCard 
        title="FEED Management" 
        icon={DraftingCompass} 
        progress={100} 
        status="Complete"
        color="green"
        details={[
            { label: 'BOD Approved', value: 'Yes' },
            { label: 'Cost Estimate', value: 'Class 3' },
            { label: 'Hazop', value: 'Done' }
        ]}
    />
);

export const FacilitiesManagement = () => (
    <TrackerCard 
        title="Facilities Engineering" 
        icon={Factory} 
        progress={45} 
        status="In Progress"
        color="blue"
        details={[
            { label: '3D Model', value: '60% Review' },
            { label: 'P&IDs', value: 'IFC' },
            { label: 'Weight Control', value: 'On Target' }
        ]}
    />
);

export const ProcurementManagement = () => (
    <TrackerCard 
        title="Procurement" 
        icon={ShoppingCart} 
        progress={30} 
        status="Active"
        color="purple"
        details={[
            { label: 'Long Lead Items', value: 'Ordered' },
            { label: 'Bulk Materials', value: 'Tendering' },
            { label: 'Expediting', value: 'On Schedule' }
        ]}
    />
);

export const ConstructionManagement = () => (
    <TrackerCard 
        title="Construction" 
        icon={HardHat} 
        progress={10} 
        status="Mobilizing"
        color="orange"
        details={[
            { label: 'Site Works', value: 'Started' },
            { label: 'Fabrication', value: 'Cutting Steel' },
            { label: 'Safety Incidents', value: '0' }
        ]}
    />
);

export const CommissioningManagement = () => (
    <TrackerCard 
        title="Commissioning" 
        icon={Wrench} 
        progress={0} 
        status="Planned"
        color="slate"
        details={[
            { label: 'Systemization', value: 'Draft' },
            { label: 'Checksheets', value: 'Pending' },
            { label: 'Walkdowns', value: 'Not Started' }
        ]}
    />
);

export const ProductionRampUpTracking = () => (
    <TrackerCard 
        title="Production Ramp-Up" 
        icon={TrendingUp} 
        progress={0} 
        status="Future"
        color="slate"
        details={[
            { label: 'Target Rate', value: '25k bopd' },
            { label: 'First Oil Date', value: 'Q4 2026' },
            { label: 'Uptime Target', value: '95%' }
        ]}
    />
);