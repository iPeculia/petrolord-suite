import React, { useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { identifyCurveType } from '@/utils/dataValidation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const REQUIRED_CURVES = ['DEPTH', 'GR', 'RES', 'DT', 'DEN'];

const CurveMapperWizard = ({ curves, mapping, setMapping, onConfirm }) => {

  // Auto-detect on load
  useEffect(() => {
    const newMapping = { ...mapping };
    curves.forEach(curve => {
       const { type, confidence } = identifyCurveType(curve);
       if (type !== 'UNKNOWN' && !newMapping[type]) {
           newMapping[type] = curve;
       }
    });
    setMapping(newMapping);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curves]);

  const handleMapChange = (type, curve) => {
      setMapping(prev => ({ ...prev, [type]: curve }));
  };

  const getCompletionStatus = () => {
      const mappedCount = REQUIRED_CURVES.filter(c => mapping[c]).length;
      return Math.round((mappedCount / REQUIRED_CURVES.length) * 100);
  };

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-100">Curve Mapping</h3>
                <p className="text-sm text-slate-400">Map your input channels to standard petrophysical types.</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-300">Completion: {getCompletionStatus()}%</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${getCompletionStatus()}%` }} />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto">
            {REQUIRED_CURVES.map(type => {
                const assigned = mapping[type];
                return (
                    <Card key={type} className={`p-4 bg-slate-900 border-slate-800 ${assigned ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-yellow-500'}`}>
                        <div className="flex justify-between mb-3">
                            <Badge variant="outline" className="font-bold">{type}</Badge>
                            {assigned ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
                        </div>
                        
                        <Select value={assigned || ''} onValueChange={(val) => handleMapChange(type, val)}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue placeholder="Select Curve..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {curves.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {assigned && (
                            <div className="mt-3 text-xs text-slate-500 bg-slate-950 p-2 rounded">
                                <div className="flex justify-between"><span>Values:</span> <span>1500</span></div>
                                <div className="flex justify-between"><span>Unit:</span> <span>Auto</span></div>
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Confirm Mappings
            </Button>
        </div>
    </div>
  );
};

export default CurveMapperWizard;