import React, { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const COMMON_CURVES = ['GR', 'GAMMA', 'RES', 'RT', 'NPHI', 'RHOB', 'DT', 'SONIC', 'CALI'];

const CurveSelector = ({ curves, selectedCurves, onSelectionChange }) => {
  const [filter, setFilter] = React.useState('');

  const filteredCurves = useMemo(() => {
    return curves.filter(c => 
      c.mnemonic.toLowerCase().includes(filter.toLowerCase()) ||
      c.description?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [curves, filter]);

  const toggleCurve = (mnemonic) => {
    const newSelection = selectedCurves.includes(mnemonic)
      ? selectedCurves.filter(c => c !== mnemonic)
      : [...selectedCurves, mnemonic];
    onSelectionChange(newSelection);
  };

  const selectAll = () => onSelectionChange(filteredCurves.map(c => c.mnemonic));
  const selectNone = () => onSelectionChange([]);
  const selectCommon = () => {
    const common = curves
      .filter(c => COMMON_CURVES.some(cc => c.mnemonic.toUpperCase().includes(cc)))
      .map(c => c.mnemonic);
    onSelectionChange(common);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-3 mb-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Filter curves..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="pl-8 bg-slate-950 border-slate-700 h-9 text-xs"
          />
        </div>
        <div className="flex gap-2 text-[10px]">
          <button onClick={selectAll} className="text-blue-400 hover:underline">All</button>
          <span className="text-slate-600">|</span>
          <button onClick={selectNone} className="text-blue-400 hover:underline">None</button>
          <span className="text-slate-600">|</span>
          <button onClick={selectCommon} className="text-blue-400 hover:underline">Common</button>
        </div>
      </div>

      <ScrollArea className="flex-1 border rounded-md border-slate-800 bg-slate-900/50 p-2">
        <div className="space-y-1">
          {filteredCurves.map(curve => (
            <div 
              key={curve.mnemonic} 
              className="flex items-center space-x-3 p-2 hover:bg-slate-800 rounded group"
            >
              <Checkbox 
                id={`curve-${curve.mnemonic}`} 
                checked={selectedCurves.includes(curve.mnemonic)}
                onCheckedChange={() => toggleCurve(curve.mnemonic)}
                className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <div className="flex-1 grid gap-0.5">
                <label 
                  htmlFor={`curve-${curve.mnemonic}`}
                  className="text-xs font-medium text-slate-200 cursor-pointer flex items-center justify-between"
                >
                  <span>{curve.mnemonic}</span>
                  {curve.unit && <Badge variant="outline" className="text-[9px] h-4 px-1 border-slate-700 text-slate-400">{curve.unit}</Badge>}
                </label>
                <p className="text-[10px] text-slate-500 truncate" title={curve.description}>
                  {curve.description || 'No description'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CurveSelector;