import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CollapsibleSection from './CollapsibleSection';
import { Settings, Droplets, TestTube, Play, FolderKanban, Waves, Atom } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InputPanel = ({ onCalculate, onRunSample, loading, hasResults, initialInputs }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    setup: { pmin_psi: 100, pmax_psi: 5000, npoints: 20 },
    oil: {
      api: 35,
      gas_sg: 0.75,
      temp_F: 200,
      rsb_scf_stb: 800,
      pb_psia: null,
      co_above_pb_per_psi: 1.5e-5,
      corr_pb: "STANDING",
    },
    gas: { gas_sg: null, temp_F: null, corr_z: "PAPAY" },
    water: { salinity_ppm: 30000, cw_per_psi: 3e-6, muw_cP_approx: 0.8 },
  });

  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
    }
  }, [initialInputs]);

  const handleInputChange = (block, field, value) => {
    setInputs(prev => ({
      ...prev,
      [block]: { ...prev[block], [field]: value === '' ? null : Number(value) }
    }));
  };

  const handleSelectChange = (block, field, value) => {
    setInputs(prev => ({ ...prev, [block]: { ...prev[block], [field]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">PVT Setup</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/my-pvt-projects')}>
            <FolderKanban className="w-4 h-4 mr-2" />
            My Projects
          </Button>
        </div>

        <CollapsibleSection title="Setup" icon={<Settings />} defaultOpen>
          <div className="grid grid-cols-3 gap-2">
            <div><Label>Min P (psi)</Label><Input type="number" value={inputs.setup.pmin_psi || ''} onChange={(e) => handleInputChange('setup', 'pmin_psi', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            <div><Label>Max P (psi)</Label><Input type="number" value={inputs.setup.pmax_psi || ''} onChange={(e) => handleInputChange('setup', 'pmax_psi', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            <div><Label>N Points</Label><Input type="number" value={inputs.setup.npoints || ''} onChange={(e) => handleInputChange('setup', 'npoints', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Oil Properties" icon={<Droplets />} defaultOpen>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div><Label>API</Label><Input type="number" value={inputs.oil.api || ''} onChange={(e) => handleInputChange('oil', 'api', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
              <div><Label>Gas SG</Label><Input type="number" value={inputs.oil.gas_sg || ''} onChange={(e) => handleInputChange('oil', 'gas_sg', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
              <div><Label>Temp °F</Label><Input type="number" value={inputs.oil.temp_F || ''} onChange={(e) => handleInputChange('oil', 'temp_F', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Rsb (scf/stb)</Label><Input type="number" value={inputs.oil.rsb_scf_stb || ''} onChange={(e) => handleInputChange('oil', 'rsb_scf_stb', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
              <div><Label>Pb (psia)</Label><Input type="number" placeholder="Auto" value={inputs.oil.pb_psia || ''} onChange={(e) => handleInputChange('oil', 'pb_psia', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            </div>
            <div><Label>Co above Pb</Label><Input type="number" value={inputs.oil.co_above_pb_per_psi || ''} onChange={(e) => handleInputChange('oil', 'co_above_pb_per_psi', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            <div className="grid grid-cols-1 gap-2">
              <div><Label>Pb/Rs Corr.</Label><Select value={inputs.oil.corr_pb} onValueChange={(v) => handleSelectChange('oil', 'corr_pb', v)}><SelectTrigger className="bg-slate-800 border-slate-600"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="STANDING">Standing</SelectItem><SelectItem value="GLASO">Glaso</SelectItem><SelectItem value="VASQUEZ_BEGGS">Vazquez & Beggs</SelectItem></SelectContent></Select></div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Gas Properties (Optional)" icon={<Atom />}>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Gas SG</Label><Input type="number" placeholder="From oil" value={inputs.gas.gas_sg || ''} onChange={(e) => handleInputChange('gas', 'gas_sg', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            <div><Label>Temp °F</Label><Input type="number" placeholder="From oil" value={inputs.gas.temp_F || ''} onChange={(e) => handleInputChange('gas', 'temp_F', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Water Properties (Optional)" icon={<Waves />}>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Salinity (ppm)</Label><Input type="number" value={inputs.water.salinity_ppm || ''} onChange={(e) => handleInputChange('water', 'salinity_ppm', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
            <div><Label>Cw (1/psi)</Label><Input type="number" value={inputs.water.cw_per_psi || ''} onChange={(e) => handleInputChange('water', 'cw_per_psi', e.target.value)} className="bg-slate-800 border-slate-600" /></div>
          </div>
        </CollapsibleSection>
      </div>

      <div className="pt-4 space-y-3">
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg">
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <Play className="w-5 h-5 mr-2" />}
          {hasResults ? 'Re-Calculate' : 'Calculate PVT'}
        </Button>
        <div className="flex gap-2">
          <Button type="button" onClick={onRunSample} variant="outline" className="w-full"><TestTube className="w-4 h-4 mr-2"/>Sample</Button>
        </div>
      </div>
    </form>
  );
};

export default InputPanel;