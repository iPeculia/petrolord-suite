import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const WellRow = ({ item, updateFn, removeFn }) => (
  <div className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2 rounded-md">
    <div className="col-span-3"><Input placeholder="Name" value={item.name} onChange={(e) => updateFn(item.id, 'name', e.target.value)} className="bg-white/10 border-white/20"/></div>
    <div className="col-span-2">
        <select value={item.type} onChange={(e) => updateFn(item.id, 'type', e.target.value)} className="w-full bg-white border border-slate-300 rounded-md p-2 text-black h-10">
            <option value="producer">Producer</option><option value="injector">Injector</option><option value="observation">Observation</option>
        </select>
    </div>
    <div className="col-span-1"><Input type="number" placeholder="Count" value={item.count} onChange={(e) => updateFn(item.id, 'count', parseInt(e.target.value, 10) || 0)} className="bg-white/10 border-white/20"/></div>
    <div className="col-span-2"><Input type="number" placeholder="Drilling Cost (MM)" value={item.drilling_cost_mm_usd} onChange={(e) => updateFn(item.id, 'drilling_cost_mm_usd', parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/></div>
    <div className="col-span-3"><Input type="number" placeholder="Completion Cost (MM)" value={item.completion_cost_mm_usd} onChange={(e) => updateFn(item.id, 'completion_cost_mm_usd', parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/></div>
    <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => removeFn(item.id)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button></div>
  </div>
);

export default WellRow;