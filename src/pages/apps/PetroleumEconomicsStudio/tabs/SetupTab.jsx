import React, { useState } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Wand2, Info } from 'lucide-react';
import RunEconomicsModal from '@/components/PetroleumEconomicsStudio/RunEconomicsModal';
import InputChecklist from '@/components/PetroleumEconomicsStudio/InputChecklist';
import InputWizard from '@/components/PetroleumEconomicsStudio/InputWizard';
import ContextTooltip from '@/components/PetroleumEconomicsStudio/ContextTooltip';

const SetupTab = () => {
  const { modelSettings, setModelSettings, streams, setStreams, runEconomics, calculating, priceAssumptions, setPriceAssumptions } = usePetroleumEconomics();
  const [showRunModal, setShowRunModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const handleSettingChange = (key, value) => {
    setModelSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleStreamToggle = (streamId) => {
    setStreams(prev => prev.map(s => s.id === streamId ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 space-y-6 pb-8 overflow-y-auto pr-2">
          
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-md">
              <div>
                  <h2 className="text-xl font-bold text-white">Model Configuration</h2>
                  <p className="text-sm text-slate-400">Configure global settings and run calculation.</p>
              </div>
              <div className="flex gap-3">
                  <Button onClick={() => setShowWizard(true)} variant="outline" className="border-slate-700 hover:bg-slate-800">
                      <Wand2 className="w-4 h-4 mr-2" /> Wizard
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 px-6" onClick={() => setShowRunModal(true)} disabled={calculating}>
                      {calculating ? <span className="flex items-center">Running...</span> : <span className="flex items-center"><Play className="w-4 h-4 mr-2 fill-current" /> RUN ECONOMICS</span>}
                  </Button>
              </div>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-lg text-white">Model Parameters</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Start Year *</Label>
                <ContextTooltip content="The first year of the economic analysis. Usually the year of First Oil or FID."><Input type="number" value={modelSettings.startYear} onChange={(e) => handleSettingChange('startYear', parseInt(e.target.value))} className="bg-slate-800 border-slate-700" /></ContextTooltip>
              </div>
              <div className="space-y-2">
                <Label>End Year</Label>
                <ContextTooltip content="The final year of the cashflow projection. Ensure this covers the full field life."><Input type="number" value={modelSettings.endYear} onChange={(e) => handleSettingChange('endYear', parseInt(e.target.value))} className="bg-slate-800 border-slate-700" /></ContextTooltip>
              </div>
              <div className="space-y-2">
                <Label>Discount Rate (%)</Label>
                <ContextTooltip content="The rate used to discount future cash flows to present value. Typical corporate hurdle rates are 10-15%."><Input type="number" step="0.1" value={modelSettings.discountRate * 100} onChange={(e) => handleSettingChange('discountRate', parseFloat(e.target.value) / 100)} className="bg-slate-800 border-slate-700" /></ContextTooltip>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-lg text-white">Active Streams</CardTitle></CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {streams.map(stream => (
                        <div key={stream.id} className="flex items-center space-x-3 p-3 rounded-md bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors">
                            <Checkbox id={`stream-${stream.id}`} checked={stream.active} onCheckedChange={() => handleStreamToggle(stream.id)} />
                            <Label htmlFor={`stream-${stream.id}`} className="font-medium cursor-pointer text-base flex-1">{stream.name}</Label>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

          <RunEconomicsModal isOpen={showRunModal} onClose={() => setShowRunModal(false)} onRun={() => { setShowRunModal(false); runEconomics(true); }} />
          <InputWizard isOpen={showWizard} onClose={() => setShowWizard(false)} />
      </div>
      <div className="w-72 shrink-0 hidden md:block">
          <InputChecklist onLaunchWizard={() => setShowWizard(true)} />
      </div>
    </div>
  );
};

export default SetupTab;