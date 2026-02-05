import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const TVDMDToggle = () => {
    const [mode, setMode] = useState('MD');

    return (
        <div className="bg-slate-950 p-1 rounded-md border border-slate-800 inline-flex items-center gap-2">
            <Ruler className="w-4 h-4 text-slate-500 ml-2" />
            <ToggleGroup type="single" value={mode} onValueChange={(v) => v && setMode(v)}>
                <ToggleGroupItem value="MD" className="h-7 px-3 text-xs data-[state=on]:bg-slate-800">MD</ToggleGroupItem>
                <ToggleGroupItem value="TVD" className="h-7 px-3 text-xs data-[state=on]:bg-slate-800">TVD</ToggleGroupItem>
                <ToggleGroupItem value="TVDSS" className="h-7 px-3 text-xs data-[state=on]:bg-slate-800">TVDSS</ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default TVDMDToggle;