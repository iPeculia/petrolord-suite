import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Play, Loader2 } from 'lucide-react';

    const InputField = ({ label, id, value, onChange, unit, type = "number", step = "any" }) => (
      <div>
        <Label htmlFor={id} className="text-sm font-medium text-slate-300">{label}</Label>
        <div className="flex items-center mt-1">
          <Input id={id} type={type} value={value} onChange={onChange} step={step} className="bg-slate-800 border-slate-600 text-white" />
          {unit && <span className="ml-2 text-sm text-slate-400">{unit}</span>}
        </div>
      </div>
    );

    const InputPanel = ({ onAnalyze, loading, initialInputs }) => {
      const [inputs, setInputs] = useState({
        projectName: "New Pipeline Project",
        fluid: "oil",
        flow_rate: 20000,
        oil_gravity: 35,
        gas_gravity: 0.7,
        gor: 800,
        water_cut: 10,
        inlet_pressure: 1500,
        outlet_pressure: 200,
        inlet_temperature: 150,
        ambient_temperature: 40,
        length: 10,
        roughness: 0.0006,
        elevation_profile: "0,0\n5,100\n10,-50",
        diameters: "6,8,10,12",
        wall_thickness: 0.5,
        material_smys: 60000,
        design_factor: 0.72,
        corrosion_allowance: 0.125,
        pigging_frequency: 30,
        arrival_temperature_req: 100,
        insulation_k: 0.1,
        insulation_thickness: 1,
      });

      useEffect(() => {
        if (initialInputs) {
          setInputs(prev => ({ ...prev, ...initialInputs }));
        }
      }, [initialInputs]);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setInputs(prev => ({ ...prev, [id]: value }));
      };

      const handleSelectChange = (id, value) => {
        setInputs(prev => ({ ...prev, [id]: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onAnalyze(inputs);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Project Name" id="projectName" value={inputs.projectName} onChange={handleChange} type="text" />
          
          <Tabs defaultValue="fluid" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fluid">Fluid</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>
            <TabsContent value="fluid" className="mt-4 space-y-4">
              <Select onValueChange={(value) => handleSelectChange('fluid', value)} value={inputs.fluid}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white"><SelectValue placeholder="Select fluid type" /></SelectTrigger>
                <SelectContent><SelectItem value="oil">Oil</SelectItem><SelectItem value="gas">Gas</SelectItem></SelectContent>
              </Select>
              <InputField label="Flow Rate" id="flow_rate" value={inputs.flow_rate} onChange={handleChange} unit={inputs.fluid === 'oil' ? "bbl/d" : "MMscf/d"} />
              {inputs.fluid === 'oil' && (
                <>
                  <InputField label="Oil API Gravity" id="oil_gravity" value={inputs.oil_gravity} onChange={handleChange} />
                  <InputField label="Gas Specific Gravity" id="gas_gravity" value={inputs.gas_gravity} onChange={handleChange} />
                  <InputField label="Gas-Oil Ratio" id="gor" value={inputs.gor} onChange={handleChange} unit="scf/stb" />
                  <InputField label="Water Cut" id="water_cut" value={inputs.water_cut} onChange={handleChange} unit="%" />
                </>
              )}
              {inputs.fluid === 'gas' && (
                <InputField label="Gas Specific Gravity" id="gas_gravity" value={inputs.gas_gravity} onChange={handleChange} />
              )}
            </TabsContent>
            <TabsContent value="pipeline" className="mt-4 space-y-4">
              <InputField label="Length" id="length" value={inputs.length} onChange={handleChange} unit="miles" />
              <InputField label="Candidate Diameters (comma-sep)" id="diameters" value={inputs.diameters} onChange={handleChange} unit="in" type="text" />
              <InputField label="Pipe Roughness" id="roughness" value={inputs.roughness} onChange={handleChange} unit="in" />
              <div>
                <Label htmlFor="elevation_profile">Elevation Profile (Distance, Elevation)</Label>
                <Textarea id="elevation_profile" value={inputs.elevation_profile} onChange={handleChange} className="bg-slate-800 border-slate-600 text-white" placeholder="e.g.&#10;0,0&#10;5,100&#10;10,-50" />
              </div>
            </TabsContent>
            <TabsContent value="operations" className="mt-4 space-y-4">
              <InputField label="Inlet Pressure" id="inlet_pressure" value={inputs.inlet_pressure} onChange={handleChange} unit="psig" />
              <InputField label="Outlet Pressure" id="outlet_pressure" value={inputs.outlet_pressure} onChange={handleChange} unit="psig" />
              <InputField label="Inlet Temperature" id="inlet_temperature" value={inputs.inlet_temperature} onChange={handleChange} unit="°F" />
              <InputField label="Ambient Temperature" id="ambient_temperature" value={inputs.ambient_temperature} onChange={handleChange} unit="°F" />
              <InputField label="Required Arrival Temp" id="arrival_temperature_req" value={inputs.arrival_temperature_req} onChange={handleChange} unit="°F" />
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 text-lg">
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
            Analyze Pipeline
          </Button>
        </form>
      );
    };

    export default InputPanel;