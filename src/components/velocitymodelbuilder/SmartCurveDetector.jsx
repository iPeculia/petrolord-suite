import React, { useState, useEffect } from 'react';
import { Wand2, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const KNOWN_Types = {
    'DT': { units: ['us/ft', 'us/m'], alias: ['DT', 'DTC', 'AC', 'DTCO'] },
    'DEPTH': { units: ['m', 'ft'], alias: ['DEPTH', 'DEPT', 'MD', 'TVD'] },
    'TIME': { units: ['ms', 's'], alias: ['TWT', 'TIME', 'T'] },
    'VELOCITY': { units: ['m/s', 'ft/s'], alias: ['VEL', 'VINT', 'VAVG', 'VRMS'] }
};

const SmartCurveDetector = ({ columns = [], onMappingConfirmed }) => {
    const [mapping, setMapping] = useState({});

    useEffect(() => {
        const newMapping = {};
        columns.forEach(col => {
            const upperCol = col.toUpperCase();
            let foundType = null;
            
            Object.entries(KNOWN_Types).forEach(([type, config]) => {
                if (config.alias.some(a => upperCol.includes(a))) {
                    foundType = type;
                }
            });

            if (foundType) {
                newMapping[col] = { type: foundType, unit: KNOWN_Types[foundType].units[0] }; // Default to first unit
            } else {
                newMapping[col] = { type: 'UNKNOWN', unit: '' };
            }
        });
        setMapping(newMapping);
    }, [columns]);

    const updateMapping = (col, key, value) => {
        setMapping(prev => ({
            ...prev,
            [col]: { ...prev[col], [key]: value }
        }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-400"/> Smart Curve Detector
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {Object.entries(mapping).map(([col, config]) => (
                    <div key={col} className="flex items-center gap-2 text-sm">
                        <div className="w-1/3 font-mono text-slate-300 truncate" title={col}>{col}</div>
                        <div className="w-1/3">
                            <Select value={config.type} onValueChange={(v) => updateMapping(col, 'type', v)}>
                                <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800">
                                    {Object.keys(KNOWN_Types).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-1/3">
                             {config.type !== 'UNKNOWN' && (
                                <Select value={config.unit} onValueChange={(v) => updateMapping(col, 'unit', v)}>
                                    <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800">
                                        {KNOWN_Types[config.type].units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                             )}
                        </div>
                    </div>
                ))}
                
                <div className="pt-2 flex justify-between items-center">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3"/> verify units before import
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-500" onClick={() => onMappingConfirmed && onMappingConfirmed(mapping)}>
                        Confirm Mapping
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SmartCurveDetector;