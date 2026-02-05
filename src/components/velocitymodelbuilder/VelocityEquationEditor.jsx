import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FunctionSquare } from 'lucide-react';

const VelocityEquationEditor = () => {
  const [method, setMethod] = useState('wyllie');
  const [params, setParams] = useState({
    v_matrix: 5500,
    v_fluid: 1500,
    a: 0.31,
    b: 4.0,
    alpha: 1.0 // for Raymer-Hunt
  });

  const handleChange = (key, val) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-400">
          <FunctionSquare className="w-4 h-4" /> Rock Physics Equation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-slate-400">Transform Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="wyllie">Wyllie Time Average</SelectItem>
              <SelectItem value="gardner">Gardner (Density)</SelectItem>
              <SelectItem value="raymer">Raymer-Hunt-Gardner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {method === 'wyllie' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-slate-500">V_matrix (m/s)</Label>
              <Input type="number" value={params.v_matrix} onChange={e => handleChange('v_matrix', e.target.value)} className="h-7 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div>
              <Label className="text-[10px] text-slate-500">V_fluid (m/s)</Label>
              <Input type="number" value={params.v_fluid} onChange={e => handleChange('v_fluid', e.target.value)} className="h-7 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div className="col-span-2 text-[10px] text-slate-500 font-mono pt-1 bg-slate-950 p-1 rounded">
              1/V = (1-phi)/Vm + phi/Vf
            </div>
          </div>
        )}

        {method === 'gardner' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-slate-500">Coeff 'a'</Label>
              <Input type="number" value={params.a} onChange={e => handleChange('a', e.target.value)} className="h-7 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div>
              <Label className="text-[10px] text-slate-500">Exp 'b'</Label>
              <Input type="number" value={params.b} onChange={e => handleChange('b', e.target.value)} className="h-7 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div className="col-span-2 text-[10px] text-slate-500 font-mono pt-1 bg-slate-950 p-1 rounded">
              rho = a * V^b
            </div>
          </div>
        )}

        {method === 'raymer' && (
          <div className="grid grid-cols-2 gap-2">
             <div>
              <Label className="text-[10px] text-slate-500">V_matrix (m/s)</Label>
              <Input type="number" value={params.v_matrix} onChange={e => handleChange('v_matrix', e.target.value)} className="h-7 text-xs bg-slate-950 border-slate-700" />
            </div>
            <div className="col-span-2 text-[10px] text-slate-500 font-mono pt-1 bg-slate-950 p-1 rounded">
              V = (1-phi)^2 * Vm + phi*Vf
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VelocityEquationEditor;