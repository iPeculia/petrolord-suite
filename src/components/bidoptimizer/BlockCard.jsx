import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, DollarSign, Package } from 'lucide-react';

const BlockCard = ({ block, onChange, onRemove }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleNestedChange = (field, value) => {
    onChange(block.id, field, value);
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-white/5">
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex-grow flex items-center space-x-2 text-left">
          <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
            <ChevronDown className="w-5 h-5 text-lime-300" />
          </motion.div>
          <Input value={block.name} onChange={(e) => handleNestedChange('name', e.target.value)} className="bg-transparent border-none h-auto p-0 text-white font-semibold focus-visible:ring-0" />
        </button>
        <Button variant="ghost" size="icon" onClick={() => onRemove(block.id)} className="text-red-400 hover:bg-red-500/20 hover:text-red-300">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
                <div>
                    <Label className="text-lime-300 text-xs">Geological Chance of Success (POSg %)</Label>
                    <Input type="number" value={block.posg} onChange={(e) => handleNestedChange('posg', Number(e.target.value))} className="bg-white/5 border-white/20" />
                </div>
                <div>
                    <Label className="text-lime-300 text-xs flex items-center"><Package className="w-3 h-3 mr-1"/> Unrisked Oil (MMBbl)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        <Input placeholder="P10" type="number" value={block.oil_p10} onChange={(e) => handleNestedChange('oil_p10', Number(e.target.value))} className="bg-white/5 border-white/20" />
                        <Input placeholder="P50" type="number" value={block.oil_p50} onChange={(e) => handleNestedChange('oil_p50', Number(e.target.value))} className="bg-white/5 border-white/20" />
                        <Input placeholder="P90" type="number" value={block.oil_p90} onChange={(e) => handleNestedChange('oil_p90', Number(e.target.value))} className="bg-white/5 border-white/20" />
                    </div>
                </div>
                <div>
                    <Label className="text-lime-300 text-xs flex items-center"><DollarSign className="w-3 h-3 mr-1"/> Development CAPEX ($MM)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        <Input placeholder="P10" type="number" value={block.capex_p10} onChange={(e) => handleNestedChange('capex_p10', Number(e.target.value))} className="bg-white/5 border-white/20" />
                        <Input placeholder="P50" type="number" value={block.capex_p50} onChange={(e) => handleNestedChange('capex_p50', Number(e.target.value))} className="bg-white/5 border-white/20" />
                        <Input placeholder="P90" type="number" value={block.capex_p90} onChange={(e) => handleNestedChange('capex_p90', Number(e.target.value))} className="bg-white/5 border-white/20" />
                    </div>
                </div>
                 <div>
                    <Label className="text-lime-300 text-xs">Proposed Bid Amount ($MM)</Label>
                    <Input type="number" value={block.bidAmount} onChange={(e) => handleNestedChange('bidAmount', Number(e.target.value))} className="bg-white/5 border-white/20" />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlockCard;