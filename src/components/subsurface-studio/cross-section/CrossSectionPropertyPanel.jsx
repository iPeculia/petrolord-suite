import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PropertyRow = ({ label, value, unit }) => (
    <div className="flex justify-between items-center py-1 border-b border-slate-800 last:border-0">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono text-slate-200">
            {value} {unit && <span className="text-slate-500 ml-1">{unit}</span>}
        </span>
    </div>
);

const CrossSectionPropertyPanel = ({ selection }) => {
    if (!selection) {
        return (
            <div className="p-4 text-center text-slate-500 text-sm italic">
                Select an object on the section to view properties.
            </div>
        );
    }

    const renderContent = () => {
        switch (selection.type) {
            case 'well':
                return (
                    <>
                        <div className="mb-4">
                            <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 mb-2">Well</Badge>
                            <h3 className="text-lg font-bold text-white">{selection.data.name}</h3>
                        </div>
                        <div className="space-y-1">
                            <PropertyRow label="Type" value={selection.data.meta?.well_type || 'Unknown'} />
                            <PropertyRow label="Total Depth" value={selection.data.meta?.md_max || 'N/A'} unit="m" />
                            <PropertyRow label="KB Elev" value={selection.data.meta?.kb || 0} unit="m" />
                            <PropertyRow label="Projected Dist" value={selection.projection?.distance?.toFixed(1)} unit="m" />
                            <PropertyRow label="Offset" value={selection.projection?.offset?.toFixed(1)} unit="m" />
                        </div>
                    </>
                );
            case 'formation':
            case 'horizon':
                return (
                    <>
                        <div className="mb-4">
                            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 mb-2">Horizon</Badge>
                            <h3 className="text-lg font-bold text-white">{selection.data.name}</h3>
                        </div>
                        <div className="space-y-1">
                            <PropertyRow label="Depth (TVD)" value={selection.depth?.toFixed(1)} unit="m" />
                            <PropertyRow label="Dip Angle" value={selection.dip?.toFixed(1)} unit="deg" />
                            <PropertyRow label="Source" value={selection.data.source || 'Manual'} />
                        </div>
                    </>
                );
            case 'fault':
                return (
                    <>
                        <div className="mb-4">
                            <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30 mb-2">Fault</Badge>
                            <h3 className="text-lg font-bold text-white">{selection.data.name}</h3>
                        </div>
                        <div className="space-y-1">
                            <PropertyRow label="Throw" value={selection.throw?.toFixed(1) || 'Unknown'} unit="m" />
                            <PropertyRow label="Dip" value={selection.dip?.toFixed(1)} unit="deg" />
                        </div>
                    </>
                );
            default:
                return <div className="text-slate-400">Unknown selection type</div>;
        }
    };

    return (
        <div className="space-y-4">
            {renderContent()}
        </div>
    );
};

export default CrossSectionPropertyPanel;