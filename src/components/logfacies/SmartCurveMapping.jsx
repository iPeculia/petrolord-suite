import React from 'react';
import { ArrowRightLeft, Search, Link2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const mappings = [
    { standard: 'Gamma Ray (GR)', detected: 'GR_FINAL', confidence: 'High', curves: ['GR_FINAL', 'CGR', 'SGR'] },
    { standard: 'Density (RHOB)', detected: 'DEN', confidence: 'Medium', curves: ['DEN', 'ZDEN', 'RHOB'] },
    { standard: 'Neutron (NPHI)', detected: 'NPHI_LS', confidence: 'High', curves: ['NPHI_LS', 'TNPH'] },
    { standard: 'Resistivity (RT)', detected: 'RDEEP', confidence: 'High', curves: ['RDEEP', 'ILD', 'LLD'] },
    { standard: 'Sonic (DT)', detected: 'DTCO', confidence: 'High', curves: ['DTCO', 'DT', 'AC'] },
];

const SmartCurveMapping = () => {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 bg-blue-950/20 border border-blue-900 rounded-lg">
                <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-blue-400" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-200">Auto-Mapping Complete</h4>
                        <p className="text-xs text-blue-400">Identified 5 standard curves from 12 input channels.</p>
                    </div>
                </div>
                <Button size="sm" variant="outline" className="border-blue-800 text-blue-300 hover:bg-blue-900/50">
                    <RefreshCw className="w-3 h-3 mr-2" /> Re-Scan
                </Button>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
                {mappings.map((map, i) => (
                    <Card key={i} className="bg-slate-900 border-slate-800 shadow-none hover:border-slate-700 transition-colors">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-48 font-medium text-slate-200 flex items-center gap-2">
                                    <Link2 className="w-4 h-4 text-slate-500" />
                                    {map.standard}
                                </div>
                                <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                                <Select defaultValue={map.detected}>
                                    <SelectTrigger className="w-56 bg-slate-950 border-slate-700 h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        <SelectItem value={map.detected} className="font-medium text-lime-400">{map.detected} (Detected)</SelectItem>
                                        {map.curves.filter(c => c !== map.detected).map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                        <SelectItem value="ignore" className="text-slate-500 font-style-italic">-- Ignore --</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Badge variant="outline" className={
                                map.confidence === 'High' ? 'text-green-400 border-green-900 bg-green-900/10' : 
                                'text-amber-400 border-amber-900 bg-amber-900/10'
                            }>
                                {map.confidence} Match
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SmartCurveMapping;