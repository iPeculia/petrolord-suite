import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Calculator, ArrowRight } from 'lucide-react';

const RunEconomicsModal = ({ isOpen, onClose, onRun }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600/20 rounded-full border border-blue-500/30">
                <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <DialogTitle className="text-xl">Run Economic Model?</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-base">
            This will calculate all economic indicators for the active scenario, including:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-300">Net Present Value (NPV) & IRR</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-300">Full Cashflow Waterfall</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-950 rounded border border-slate-800">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-300">Payback, DPI & Unit Costs</span>
            </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
          <Button onClick={onRun} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px] shadow-lg shadow-blue-900/20">
            <Play className="w-4 h-4 mr-2 fill-current" />
            Run Calculation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunEconomicsModal;