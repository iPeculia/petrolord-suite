import React from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Switch } from "@/components/ui/switch";
    import { Slider } from "@/components/ui/slider";
    import { MinusCircle, PlusCircle, Route, Atom, Thermometer } from 'lucide-react';

    const InputField = ({ label, id, value, onChange, unit, type = "number", step = "any" }) => (
      <div>
        <Label htmlFor={id} className="text-sm font-medium text-slate-300">{label}</Label>
        <div className="flex items-center mt-1">
          <Input id={id} type={type} value={value || ''} onChange={onChange} step={step} className="bg-slate-800 border-slate-600 text-white" />
          {unit && <span className="ml-2 text-sm text-slate-400">{unit}</span>}
        </div>
      </div>
    );

    const FluidStreamInputs = ({ stream, onStreamChange, streamLabel }) => (
        <div className="space-y-4 p-1">
            <h3 className="text-lg font-semibold text-lime-300">{streamLabel}</h3>
            <InputField label="API Gravity" id={`api-${streamLabel}`} value={stream.api} onChange={e => onStreamChange('api', e.target.value)} />
            <InputField label="Gas-Oil Ratio" id={`gor-${streamLabel}`} value={stream.gor} onChange={e => onStreamChange('gor', e.target.value)} unit="scf/stb" />
            <InputField label="Gas Specific Gravity" id={`gasSg-${streamLabel}`} value={stream.gasSg} onChange={e => onStreamChange('gasSg', e.target.value)} />
            <InputField label="Reservoir Temperature" id={`temp-${streamLabel}`} value={stream.temp} onChange={e => onStreamChange('temp', e.target.value)} unit="°F" />
            <InputField label="Bubble Point Pressure" id={`pb-${streamLabel}`} value={stream.pb} onChange={e => onStreamChange('pb', e.target.value)} unit="psia" />
            <InputField label="Water Salinity" id={`salinity-${streamLabel}`} value={stream.salinity} onChange={e => onStreamChange('salinity', e.target.value)} unit="ppm" />
        </div>
    );

    const FluidStudioInput = ({ inputs, setInputs }) => {
      const handleStreamChange = (streamKey, field, value) => {
        setInputs(prev => ({ ...prev, [streamKey]: { ...prev[streamKey], blackOil: { ...prev[streamKey].blackOil, [field]: value === '' ? null : Number(value) } } }));
      };

      const handleSeparatorChange = (index, field, value) => {
        const newStages = [...inputs.separatorTrain.stages];
        newStages[index][field] = value === '' ? null : Number(value);
        setInputs(prev => ({ ...prev, separatorTrain: { ...prev.separatorTrain, stages: newStages } }));
      };

      const toggleSeparatorStage = (index) => {
        const newStages = [...inputs.separatorTrain.stages];
        newStages[index].enabled = !newStages[index].enabled;
        setInputs(prev => ({ ...prev, separatorTrain: { ...prev.separatorTrain, stages: newStages } }));
      };

      const handleFlowAssuranceChange = (field, value) => {
        setInputs(prev => ({ ...prev, flowAssurance: { ...prev.flowAssurance, flowline: { ...prev.flowAssurance.flowline, [field]: value === '' ? null : Number(value) } } }));
      };
      
      const handlePtProfileChange = (value) => {
        setInputs(prev => ({ ...prev, ptProfile: { ...prev.ptProfile, raw: value } }));
      };

      const handleCompositionChange = (field, value) => {
        setInputs(prev => ({ ...prev, streamA: { ...prev.streamA, composition: { ...prev.streamA.composition, [field]: value } } }));
      };

      const handleBlendingChange = (field, value) => {
        setInputs(prev => ({ ...prev, blending: { ...prev.blending, [field]: value } }));
      };

      const handleBatchRunChange = (field, value) => {
        setInputs(prev => ({ ...prev, batchRun: { ...prev.batchRun, [field]: value } }));
      };

      return (
        <div className="space-y-4 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-4">Analysis Setup</h2>
          <Tabs defaultValue="stream-a" className="flex-grow flex flex-col">
            <TabsList className="flex flex-wrap h-auto justify-start bg-slate-800">
              <TabsTrigger value="stream-a">Stream A</TabsTrigger>
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="blending">Blending</TabsTrigger>
              <TabsTrigger value="batch-run">Batch Run</TabsTrigger>
              <TabsTrigger value="separators">Separators</TabsTrigger>
              <TabsTrigger value="flow-assurance">Flow Assurance</TabsTrigger>
            </TabsList>
            <div className="flex-grow mt-4 overflow-y-auto">
              <TabsContent value="stream-a">
                  <FluidStreamInputs stream={inputs.streamA.blackOil} onStreamChange={(field, value) => handleStreamChange('streamA', field, value)} streamLabel="Stream A Properties" />
              </TabsContent>
              <TabsContent value="composition">
                  <div className="space-y-4 p-1">
                      <h3 className="text-lg font-semibold text-lime-300 flex items-center"><Atom className="w-5 h-5 mr-2" />Equation of State (Stream A)</h3>
                      <div>
                          <Label htmlFor="eos-model">EOS Model</Label>
                          <Select value={inputs.streamA.composition.model} onValueChange={value => handleCompositionChange('model', value)}>
                              <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                                  <SelectValue placeholder="Select EOS model" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="pr">Peng-Robinson</SelectItem>
                                  <SelectItem value="srk">Soave-Redlich-Kwong</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div>
                          <Label htmlFor="composition-raw">Fluid Composition (mol %)</Label>
                          <Textarea
                              id="composition-raw"
                              value={inputs.streamA.composition.raw || ''}
                              onChange={e => handleCompositionChange('raw', e.target.value)}
                              placeholder="e.g.&#10;C1, 80.5&#10;C2, 10.2&#10;...&#10;Overrides Black Oil inputs for Stream A."
                              className="bg-slate-800 border-slate-600 text-white h-48 mt-1"
                          />
                      </div>
                  </div>
              </TabsContent>
              <TabsContent value="blending">
                  <div className="space-y-6 p-1">
                      <div className="flex items-center space-x-2">
                          <Switch id="blending-enabled" checked={inputs.blending.enabled} onCheckedChange={checked => handleBlendingChange('enabled', checked)} />
                          <Label htmlFor="blending-enabled" className="text-lg font-semibold text-lime-300">Enable Stream Blending</Label>
                      </div>
                      {inputs.blending.enabled && (
                          <>
                              <div>
                                  <Label>Blend Ratio: {100 - inputs.blending.streamB_fraction}% A / {inputs.blending.streamB_fraction}% B</Label>
                                  <Slider
                                      value={[inputs.blending.streamB_fraction]}
                                      onValueChange={([value]) => handleBlendingChange('streamB_fraction', value)}
                                      max={100}
                                      step={1}
                                      className="mt-2"
                                  />
                              </div>
                              <FluidStreamInputs stream={inputs.streamB.blackOil} onStreamChange={(field, value) => handleStreamChange('streamB', field, value)} streamLabel="Stream B Properties" />
                          </>
                      )}
                  </div>
              </TabsContent>
              <TabsContent value="batch-run">
                  <div className="space-y-6 p-1">
                      <div className="flex items-center space-x-2">
                          <Switch id="batch-run-enabled" checked={inputs.batchRun.enabled} onCheckedChange={checked => handleBatchRunChange('enabled', checked)} />
                          <Label htmlFor="batch-run-enabled" className="text-lg font-semibold text-lime-300">Enable Batch Run</Label>
                      </div>
                      {inputs.batchRun.enabled && (
                          <div className="space-y-4">
                              <div>
                                  <Label htmlFor="batch-variable">Sensitivity Variable</Label>
                                  <Select value={inputs.batchRun.variable} onValueChange={value => handleBatchRunChange('variable', value)}>
                                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                                          <SelectValue placeholder="Select variable" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="api">API Gravity</SelectItem>
                                          <SelectItem value="gor">Gas-Oil Ratio</SelectItem>
                                          <SelectItem value="gasSg">Gas Specific Gravity</SelectItem>
                                          <SelectItem value="temp">Reservoir Temperature</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                              <InputField label="Min Value" id="batch-min" value={inputs.batchRun.min} onChange={e => handleBatchRunChange('min', e.target.value)} />
                              <InputField label="Max Value" id="batch-max" value={inputs.batchRun.max} onChange={e => handleBatchRunChange('max', e.target.value)} />
                              <InputField label="Number of Steps" id="batch-steps" value={inputs.batchRun.steps} onChange={e => handleBatchRunChange('steps', e.target.value)} type="number" step="1" />
                          </div>
                      )}
                  </div>
              </TabsContent>
              <TabsContent value="separators">
                <div className="space-y-4 p-1">
                  <h3 className="text-lg font-semibold text-lime-300">Separator Train</h3>
                  {inputs.separatorTrain.stages.map((stage, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${stage.enabled ? 'border-slate-600 bg-slate-800/50' : 'border-slate-700 bg-slate-800/20'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-white">Stage {index + 1}</h4>
                        <Button size="sm" variant="ghost" onClick={() => toggleSeparatorStage(index)} className="text-slate-400 hover:text-white">
                          {stage.enabled ? <MinusCircle className="w-4 h-4 text-red-500" /> : <PlusCircle className="w-4 h-4 text-green-500" />}
                        </Button>
                      </div>
                      {stage.enabled && (
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="Pressure" id={`sep-p-${index}`} value={stage.pressure} onChange={e => handleSeparatorChange(index, 'pressure', e.target.value)} unit="psia" />
                          <InputField label="Temperature" id={`sep-t-${index}`} value={stage.temperature} onChange={e => handleSeparatorChange(index, 'temperature', e.target.value)} unit="°F" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="flow-assurance">
                <div className="space-y-4 p-1">
                  <h3 className="text-lg font-semibold text-lime-300 flex items-center"><Route className="w-5 h-5 mr-2" />Flowline Properties</h3>
                  <InputField label="Length" id="length" value={inputs.flowAssurance.flowline.length} onChange={e => handleFlowAssuranceChange('length', e.target.value)} unit="ft" />
                  <InputField label="Diameter" id="diameter" value={inputs.flowAssurance.flowline.diameter} onChange={e => handleFlowAssuranceChange('diameter', e.target.value)} unit="in" />
                  <InputField label="Outlet Pressure" id="outletPressure" value={inputs.flowAssurance.flowline.outletPressure} onChange={e => handleFlowAssuranceChange('outletPressure', e.target.value)} unit="psia" />
                  <InputField label="Ambient Temperature" id="ambientTemp" value={inputs.flowAssurance.flowline.ambientTemp} onChange={e => handleFlowAssuranceChange('ambientTemp', e.target.value)} unit="°F" />
                  
                  <div className="pt-4">
                      <h3 className="text-lg font-semibold text-lime-300 flex items-center"><Thermometer className="w-5 h-5 mr-2" />P-T Profile (Optional)</h3>
                      <Label htmlFor="pt-profile" className="text-sm font-medium text-slate-400">Paste Pressure (psi), Temp (°F) data</Label>
                      <Textarea
                          id="pt-profile"
                          value={inputs.ptProfile.raw || ''}
                          onChange={e => handlePtProfileChange(e.target.value)}
                          placeholder="e.g.&#10;3000, 180&#10;2500, 165&#10;2000, 140"
                          className="bg-slate-800 border-slate-600 text-white h-24 mt-1"
                      />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      );
    };

    export default FluidStudioInput;