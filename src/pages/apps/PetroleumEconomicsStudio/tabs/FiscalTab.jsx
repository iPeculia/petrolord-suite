import React, { useState, useEffect } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Save, FileText, Briefcase, HeartHandshake as Handshake } from 'lucide-react';

const FiscalTab = () => {
  const { fiscalTerms, saveFiscalTerms, saving } = usePetroleumEconomics();
  const [localConfig, setLocalConfig] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (fiscalTerms) {
        setLocalConfig({ ...fiscalTerms });
    }
  }, [fiscalTerms]);

  const handleChange = (field, value) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!localConfig) return;
    const success = await saveFiscalTerms(localConfig);
    if (success) setIsDirty(false);
  };

  if (!localConfig) {
      return (
          <div className="flex h-64 items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading Fiscal Terms...
          </div>
      );
  }

  const templates = [
      { id: 'royalty_tax', name: 'Royalty / Tax', icon: <FileText className="w-5 h-5 text-blue-400" />, desc: 'Standard concessionary system with royalty and corporate tax.' },
      { id: 'psc', name: 'Prod. Sharing Contract', icon: <Handshake className="w-5 h-5 text-emerald-400" />, desc: 'Contractor recovers costs and shares profit oil with government.' },
      { id: 'jv', name: 'Joint Venture', icon: <Briefcase className="w-5 h-5 text-amber-400" />, desc: 'Simple equity split between partners with standard taxation.' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      {/* Left Sidebar: Template Selector */}
      <Card className="w-full md:w-1/3 bg-slate-900 border-slate-800 flex flex-col shrink-0">
        <CardHeader>
            <CardTitle className="text-lg">Regime Type</CardTitle>
            <CardDescription>Select the fiscal model template.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
            <RadioGroup 
                value={localConfig.template_type} 
                onValueChange={(val) => handleChange('template_type', val)}
                className="grid gap-3"
            >
                {templates.map(template => (
                    <div key={template.id}>
                        <RadioGroupItem value={template.id} id={template.id} className="peer sr-only" />
                        <Label 
                            htmlFor={template.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                localConfig.template_type === template.id 
                                ? 'bg-slate-800 border-blue-500 ring-1 ring-blue-500/20' 
                                : 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                            }`}
                        >
                            <div className="mt-0.5 p-2 bg-slate-950 rounded-md border border-slate-800">
                                {template.icon}
                            </div>
                            <div className="space-y-1">
                                <div className="font-semibold text-slate-200">{template.name}</div>
                                <p className="text-xs text-slate-400 font-normal leading-snug">
                                    {template.desc}
                                </p>
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </CardContent>
      </Card>

      {/* Right Sidebar: Configuration Form */}
      <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col min-h-0">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div>
                <CardTitle className="text-lg">Fiscal Rules</CardTitle>
                <CardDescription>Configure rates and limits for {templates.find(t => t.id === localConfig.template_type)?.name}.</CardDescription>
            </div>
            <Button 
                onClick={handleSave} 
                disabled={!isDirty || saving}
                className={`${isDirty ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 text-slate-400'}`}
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
            </Button>
        </CardHeader>
        
        <ScrollArea className="flex-1">
            <CardContent className="p-6 space-y-8">
                {/* Common Settings */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">General Taxation</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Corporate Tax Rate (%)</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    value={localConfig.tax_rate} 
                                    onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value))}
                                    className="bg-slate-800 border-slate-700 pr-8" 
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-slate-500">%</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Depreciation Method</Label>
                            <Select 
                                value={localConfig.depreciation_method} 
                                onValueChange={(val) => handleChange('depreciation_method', val)}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="straight_line">Straight Line (5 Years)</SelectItem>
                                    <SelectItem value="declining_balance">Declining Balance</SelectItem>
                                    <SelectItem value="unit_of_production">Unit of Production</SelectItem>
                                    <SelectItem value="immediate">Immediate Expensing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="space-y-0.5">
                            <Label className="text-base">Ring Fencing</Label>
                            <p className="text-xs text-slate-400">Restrict deduction of costs to this specific project/field.</p>
                        </div>
                        <Switch 
                            checked={localConfig.ring_fence} 
                            onCheckedChange={(val) => handleChange('ring_fence', val)} 
                        />
                    </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Conditional Settings based on Template */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                        {localConfig.template_type === 'psc' ? 'Production Sharing Terms' : 'Concessionary Terms'}
                    </h3>

                    {localConfig.template_type === 'royalty_tax' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Royalty Rate (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        value={localConfig.royalty_rate} 
                                        onChange={(e) => handleChange('royalty_rate', parseFloat(e.target.value))}
                                        className="bg-slate-800 border-slate-700 pr-8" 
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-slate-500">%</span>
                                </div>
                                <p className="text-xs text-slate-500">Gross revenue share taken by government before costs.</p>
                            </div>
                        </div>
                    )}

                    {localConfig.template_type === 'psc' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Cost Oil Limit (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        value={localConfig.cost_oil_limit} 
                                        onChange={(e) => handleChange('cost_oil_limit', parseFloat(e.target.value))}
                                        className="bg-slate-800 border-slate-700 pr-8" 
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-slate-500">%</span>
                                </div>
                                <p className="text-xs text-slate-500">Maximum revenue allowed for cost recovery.</p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Profit Oil Split - Contractor (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number" 
                                        value={localConfig.profit_split} 
                                        onChange={(e) => handleChange('profit_split', parseFloat(e.target.value))}
                                        className="bg-slate-800 border-slate-700 pr-8" 
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-slate-500">%</span>
                                </div>
                                <p className="text-xs text-slate-500">Contractor&apos;s share of remaining profit oil.</p>
                            </div>
                        </div>
                    )}

                    {localConfig.template_type === 'jv' && (
                        <div className="p-4 bg-amber-900/10 border border-amber-900/30 rounded-lg text-amber-200 text-sm">
                            <p>Joint Venture terms typically rely on standard tax + equity split.</p>
                            <p className="mt-2 text-xs opacity-70">Working Interest defined in Assumptions tab will determine partner share.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default FiscalTab;