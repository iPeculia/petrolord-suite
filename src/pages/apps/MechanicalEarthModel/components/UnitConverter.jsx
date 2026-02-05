import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UNIT_SYSTEMS } from '../constants';

const UnitConverter = ({ onUnitChange, currentSystem }) => {
    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="text-base text-white">Unit System</CardTitle>
                <CardDescription className="text-sm text-slate-400">Select the primary unit system for inputs and calculations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ToggleGroup 
                    type="single" 
                    value={currentSystem} 
                    onValueChange={(value) => {
                        if (value) onUnitChange(value);
                    }}
                    className="grid grid-cols-2"
                >
                    <ToggleGroupItem value="metric" aria-label="Metric" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">
                        Metric ({UNIT_SYSTEMS.METRIC.depth}, {UNIT_SYSTEMS.METRIC.pressure})
                    </ToggleGroupItem>
                    <ToggleGroupItem value="imperial" aria-label="Imperial" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white">
                        Imperial ({UNIT_SYSTEMS.IMPERIAL.depth}, {UNIT_SYSTEMS.IMPERIAL.pressure})
                    </ToggleGroupItem>
                </ToggleGroup>
            </CardContent>
        </Card>
    );
};

export default UnitConverter;