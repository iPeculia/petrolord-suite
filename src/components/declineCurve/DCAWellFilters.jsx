import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

const DCAWellFilters = () => {
  // Mock filters for UI demonstration - can be wired to context later
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <Filter size={14} />
        <span className="text-xs font-medium uppercase tracking-wider">Filters</span>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Reservoir</Label>
        <Select defaultValue="all">
          <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
            <SelectValue placeholder="All Reservoirs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reservoirs</SelectItem>
            <SelectItem value="res1">Eagle Ford</SelectItem>
            <SelectItem value="res2">Permian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Lift Type</Label>
        <Select defaultValue="all">
          <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="esp">ESP</SelectItem>
            <SelectItem value="gaslift">Gas Lift</SelectItem>
            <SelectItem value="rodpump">Rod Pump</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Status</Label>
        <Select defaultValue="active">
          <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="shut_in">Shut-In</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DCAWellFilters;