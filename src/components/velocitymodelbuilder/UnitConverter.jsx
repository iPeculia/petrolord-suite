import React, { useState } from 'react';
import { ArrowRightLeft, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [type, setType] = useState('length');
  const [fromUnit, setFromUnit] = useState('ft');
  const [toUnit, setToUnit] = useState('m');
  const [result, setResult] = useState('');

  const convert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    let res = 0;
    if (type === 'length') {
        if (fromUnit === 'ft' && toUnit === 'm') res = val * 0.3048;
        else if (fromUnit === 'm' && toUnit === 'ft') res = val / 0.3048;
        else res = val;
    } else if (type === 'velocity') {
        if (fromUnit === 'ft/s' && toUnit === 'm/s') res = val * 0.3048;
        else if (fromUnit === 'm/s' && toUnit === 'ft/s') res = val / 0.3048;
        else res = val;
    } else if (type === 'slowness') {
        // us/ft <-> us/m
        if (fromUnit === 'us/ft' && toUnit === 'us/m') res = val / 0.3048;
        else if (fromUnit === 'us/m' && toUnit === 'us/ft') res = val * 0.3048;
        else res = val;
    }
    
    setResult(res.toFixed(4));
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2 border-b border-slate-800">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400"/> Unit Converter
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="length">Length (Depth)</SelectItem>
                    <SelectItem value="velocity">Velocity</SelectItem>
                    <SelectItem value="slowness">Slowness (DT)</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
                <Input 
                    type="number" 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    className="h-8 text-xs bg-slate-950 border-slate-700"
                    placeholder="Value"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700 w-24"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                        {type === 'length' && <><SelectItem value="ft">ft</SelectItem><SelectItem value="m">m</SelectItem></>}
                        {type === 'velocity' && <><SelectItem value="ft/s">ft/s</SelectItem><SelectItem value="m/s">m/s</SelectItem></>}
                        {type === 'slowness' && <><SelectItem value="us/ft">us/ft</SelectItem><SelectItem value="us/m">us/m</SelectItem></>}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-center">
                <Button size="sm" variant="ghost" onClick={convert}><ArrowRightLeft className="w-4 h-4 text-slate-500" /></Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="h-8 flex-1 bg-slate-800 rounded border border-slate-700 flex items-center px-3 text-xs text-emerald-400 font-mono">
                    {result || '---'}
                </div>
                <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700 w-24"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                        {type === 'length' && <><SelectItem value="ft">ft</SelectItem><SelectItem value="m">m</SelectItem></>}
                        {type === 'velocity' && <><SelectItem value="ft/s">ft/s</SelectItem><SelectItem value="m/s">m/s</SelectItem></>}
                        {type === 'slowness' && <><SelectItem value="us/ft">us/ft</SelectItem><SelectItem value="us/m">us/m</SelectItem></>}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
    </Card>
  );
};

export default UnitConverter;