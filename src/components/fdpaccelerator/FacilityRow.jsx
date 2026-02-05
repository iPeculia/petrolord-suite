import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const FacilityRow = ({ item, updateFn, removeFn }) => (
  <div className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2 rounded-md">
      <div className="col-span-3"><Input placeholder="Name" value={item.name} onChange={(e) => updateFn(item.id, 'name', e.target.value)} className="bg-white/10 border-white/20"/></div>
      <div className="col-span-2"><Input type="number" placeholder="CAPEX (MM)" value={item.capex_mm_usd} onChange={(e) => updateFn(item.id, 'capex_mm_usd', parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/></div>
      <div className="col-span-2"><Input type="number" placeholder="OPEX (MM/yr)" value={item.opex_mm_usd_yr} onChange={(e) => updateFn(item.id, 'opex_mm_usd_yr', parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/></div>
      <div className="col-span-4"><Textarea placeholder="Description" value={item.description} onChange={(e) => updateFn(item.id, 'description', e.target.value)} className="bg-white/10 border-white/20 h-10"/></div>
      <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => removeFn(item.id)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button></div>
  </div>
);

export default FacilityRow;