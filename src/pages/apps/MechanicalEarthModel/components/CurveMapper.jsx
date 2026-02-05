import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CURVE_MNEMONICS } from '../constants';
import { ScrollArea } from '@/components/ui/scroll-area';

const CurveMapper = ({ logs, onMapChange, initialMap = {} }) => {
    const { curves: availableCurves = [], stats = {} } = logs || {};
    const [curveMap, setCurveMap] = useState(initialMap);

    useEffect(() => {
        setCurveMap(initialMap);
    }, [initialMap]);
    
    const handleMappingChange = (standardMnemonic, selectedCurve) => {
        const newMap = { ...curveMap, [standardMnemonic]: selectedCurve };
        setCurveMap(newMap);
        onMapChange(newMap);
    };

    const getCurveStats = (curveName) => {
        if (!stats || !stats[curveName]) return 'No stats available';
        const { min, max, mean } = stats[curveName];
        return `Min: ${min?.toFixed(2)}, Max: ${max?.toFixed(2)}, Mean: ${mean?.toFixed(2)}`;
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle className="text-base text-white">Manual Curve Mapping</CardTitle>
                <CardDescription className="text-sm text-slate-400">
                    Match standard MEM curves to curves found in your LAS file.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {CURVE_MNEMONICS.ALL_FOR_MAPPING.map(stdCurve => (
                            <div key={stdCurve.mnemonic} className="grid grid-cols-2 items-center gap-4">
                                <Label htmlFor={`select-${stdCurve.mnemonic}`} className="text-slate-300">
                                    {stdCurve.name} <span className="text-slate-500">({stdCurve.mnemonic})</span>
                                    {CURVE_MNEMONICS.REQUIRED.includes(stdCurve.mnemonic) && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                <div>
                                     <Select
                                        value={curveMap[stdCurve.mnemonic] || ''}
                                        onValueChange={(value) => handleMappingChange(stdCurve.mnemonic, value === 'null' ? null : value)}
                                    >
                                        <SelectTrigger id={`select-${stdCurve.mnemonic}`} className="bg-slate-900 border-slate-700">
                                            <SelectValue placeholder="Select curve..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 text-white border-slate-700">
                                            <SelectItem value="null" className="text-slate-400">None</SelectItem>
                                            {availableCurves.map(curve => (
                                                <SelectItem key={curve} value={curve}>{curve}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {curveMap[stdCurve.mnemonic] && (
                                        <p className="text-xs text-slate-500 mt-1">{getCurveStats(curveMap[stdCurve.mnemonic])}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default CurveMapper;