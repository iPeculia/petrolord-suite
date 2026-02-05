import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const PriceDeckRow = ({ item, updateFn, removeFn }) => (
  <div className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2 rounded-md">
      <div className="col-span-4"><Input type="number" placeholder="Year" value={item.year} onChange={(e) => updateFn(item.id, 'year', parseInt(e.target.value, 10) || 0)} className="bg-white/10 border-white/20"/></div>
      <div className="col-span-3"><Input type="number" placeholder="Oil Price ($)" value={item.oil_price_usd} onChange={(e) => updateFn(item.id, 'oil_price_usd', parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/></div>
      <div className="col-span-4"><Input type="number" placeholder="Gas Price ($)" value={item.gas_price_usd} onChange={(e) => updateFn(item.id, 'gas_price_usd', parseFloat(e.target.value) || 0)} className="bg-white/10 border-white/20"/></div>
      <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => removeFn(item.id)} className="text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button></div>
  </div>
);

export default PriceDeckRow;