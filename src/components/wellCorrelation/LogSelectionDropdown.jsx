import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, Activity } from 'lucide-react';
import { getLogColor } from '@/utils/wellCorrelation/colorPalettes';

const COMMON_LOGS = [
  { mnemonic: 'GR', name: 'Gamma Ray', unit: 'gAPI' },
  { mnemonic: 'RES', name: 'Resistivity', unit: 'ohm.m' },
  { mnemonic: 'RHOB', name: 'Bulk Density', unit: 'g/cc' },
  { mnemonic: 'NPHI', name: 'Neutron Porosity', unit: 'v/v' },
  { mnemonic: 'DT', name: 'Sonic', unit: 'us/ft' },
  { mnemonic: 'CALI', name: 'Caliper', unit: 'in' },
  { mnemonic: 'SP', name: 'Spontaneous Potential', unit: 'mV' }
];

const LogSelectionDropdown = ({ onSelect }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 hover:bg-slate-800 hover:text-white shadow-sm w-full justify-between">
          <span className="flex items-center"><Plus className="w-3 h-3 mr-1.5 text-blue-400" /> Add Log</span>
          <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200 min-w-[200px]" align="end">
        <DropdownMenuLabel className="text-xs text-slate-500">Common Logs</DropdownMenuLabel>
        {COMMON_LOGS.map(log => (
          <DropdownMenuItem 
            key={log.mnemonic} 
            onClick={() => onSelect(log.mnemonic)}
            className="cursor-pointer focus:bg-slate-800 flex items-center justify-between group"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getLogColor(log.mnemonic) }} />
              <span className="font-medium text-xs">{log.mnemonic}</span>
              <span className="text-[10px] text-slate-500 ml-2">({log.name})</span>
            </div>
            <Plus className="w-3 h-3 text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100" />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem className="text-xs text-blue-400 focus:text-blue-300 focus:bg-slate-800 cursor-pointer">
          <Activity className="w-3 h-3 mr-2" /> Custom / Calculated...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LogSelectionDropdown;