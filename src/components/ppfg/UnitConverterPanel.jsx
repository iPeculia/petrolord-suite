import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

const UNIT_OPTIONS = {
    DEPTH: ['ft', 'm'],
    GR: ['API'],
    RES: ['ohm.m', 'ohm.ft'],
    DEN: ['g/cc', 'kg/m3', 'ppg'],
    DT: ['us/ft', 'us/m'],
    // ... others
};

const UnitConverterPanel = ({ mapping, units, setUnits, onConvert }) => {
  
  const handleUnitChange = (curve, unit) => {
      setUnits(prev => ({ ...prev, [curve]: unit }));
  };

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-100">Unit Standardization</h3>
            <p className="text-sm text-slate-400">Ensure all curves are converted to field standard units.</p>
       </div>

       <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex-1">
           <Table>
               <TableHeader>
                   <TableRow className="border-slate-800 hover:bg-slate-900">
                       <TableHead className="text-slate-400">Parameter</TableHead>
                       <TableHead className="text-slate-400">Mapped Curve</TableHead>
                       <TableHead className="text-slate-400">Current Unit</TableHead>
                       <TableHead className="text-slate-400">Target Unit</TableHead>
                       <TableHead className="text-right text-slate-400">Action</TableHead>
                   </TableRow>
               </TableHeader>
               <TableBody>
                   {Object.entries(mapping).map(([type, curveName]) => {
                       if (!curveName) return null;
                       const options = UNIT_OPTIONS[type] || ['Standard'];
                       return (
                           <TableRow key={type} className="border-slate-800 hover:bg-slate-800/50">
                               <TableCell className="font-bold text-slate-200">{type}</TableCell>
                               <TableCell className="font-mono text-xs text-emerald-400">{curveName}</TableCell>
                               <TableCell>
                                   <Select value={units[curveName] || options[0]} onValueChange={(val) => handleUnitChange(curveName, val)}>
                                        <SelectTrigger className="h-8 w-32 bg-slate-950 border-slate-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            {options.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                        </SelectContent>
                                   </Select>
                               </TableCell>
                               <TableCell className="text-slate-500 text-xs">
                                   {/* Ideally target units are fixed by the system standards */}
                                   {options[0]}
                               </TableCell>
                               <TableCell className="text-right">
                                   {units[curveName] !== options[0] && (
                                       <span className="text-yellow-500 text-xs flex items-center justify-end gap-1">
                                           <ArrowRightLeft className="w-3 h-3" /> Convert
                                       </span>
                                   )}
                               </TableCell>
                           </TableRow>
                       );
                   })}
               </TableBody>
           </Table>
       </div>

       <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <Button onClick={onConvert} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                Apply Conversions
            </Button>
       </div>
    </div>
  );
};

export default UnitConverterPanel;