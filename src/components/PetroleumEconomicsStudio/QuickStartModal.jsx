import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Activity, Layers, Plus, Flame, Droplet } from 'lucide-react';

const QuickStartModal = ({ isOpen, onClose, onLoadTemplate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Get Started with Economics Studio</DialogTitle>
          <DialogDescription className="text-slate-400">
            Your model is currently empty. Choose a template to load sample data or start from scratch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {/* Template 1: Simple Well */}
          <Card 
            className="bg-slate-950 border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all group relative overflow-hidden flex flex-col"
            onClick={() => onLoadTemplate('well')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
              <div className="p-3 bg-blue-900/20 rounded-full border border-blue-900/50">
                <Droplet className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-200">Simple Well</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Single oil well, 10-year decline, basic royalty/tax. Good for quick screening.
                </p>
              </div>
              <Button size="sm" variant="outline" className="w-full border-blue-900/50 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300">
                Load Well
              </Button>
            </CardContent>
          </Card>

          {/* Template 2: Gas Field */}
          <Card 
            className="bg-slate-950 border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group relative overflow-hidden flex flex-col"
            onClick={() => onLoadTemplate('gas')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
              <div className="p-3 bg-amber-900/20 rounded-full border border-amber-900/50">
                <Flame className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-200">Gas Field</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  15-year gas development, plateau profile, condensate yield, phased CAPEX.
                </p>
              </div>
              <Button size="sm" variant="outline" className="w-full border-amber-900/50 text-amber-400 hover:bg-amber-900/20 hover:text-amber-300">
                Load Gas
              </Button>
            </CardContent>
          </Card>

          {/* Template 3: Full FDP */}
          <Card 
            className="bg-slate-950 border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group relative overflow-hidden flex flex-col"
            onClick={() => onLoadTemplate('fdp')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
              <div className="p-3 bg-emerald-900/20 rounded-full border border-emerald-900/50">
                <Layers className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-200">Full FDP (PSC)</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Complex 20-year multi-phase project, Oil & Gas, Production Sharing Contract.
                </p>
              </div>
              <Button size="sm" variant="outline" className="w-full border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/20 hover:text-emerald-300">
                Load FDP
              </Button>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-500 order-2 sm:order-1">Templates auto-calculate on load.</p>
          <Button variant="ghost" onClick={onClose} className="order-1 sm:order-2 text-slate-400 hover:text-white">
            <Plus className="w-4 h-4 mr-2" /> Start Blank Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickStartModal;