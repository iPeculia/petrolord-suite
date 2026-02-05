import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, SlidersHorizontal } from 'lucide-react';

const InputField = ({ id, label, unit, value, onChange, type = "number", step = "any" }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-lime-300">{label} <span className="text-xs text-slate-400">({unit})</span></Label>
    <Input
      id={id}
      name={id}
      type={type}
      step={step}
      value={value}
      onChange={onChange}
      className="bg-white/5 border-white/20 text-white"
      required
    />
  </div>
);

const ZonalInputPanel = ({ inputs, handleInputChange, onCalculate, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-slate-800/50 backdrop-blur-lg border border-white/20 rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-white flex items-center">
        <SlidersHorizontal className="w-6 h-6 mr-3 text-lime-300" />
        Zonal Average Log Inputs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField id="gr-zone-input" label="Zone Gamma Ray" unit="API" value={inputs.gamma_ray_zone} onChange={handleInputChange} />
        <InputField id="gr-clean-input" label="Clean Sand GR" unit="API" value={inputs.gamma_ray_clean} onChange={handleInputChange} />
        <InputField id="gr-shale-input" label="Shale GR" unit="API" value={inputs.gamma_ray_shale} onChange={handleInputChange} />
        <InputField id="rt-zone-input" label="Zone Resistivity" unit="ohm.m" value={inputs.resistivity_zone} onChange={handleInputChange} />
        <InputField id="rw-input" label="Water Resistivity" unit="ohm.m" value={inputs.resistivity_water} onChange={handleInputChange} />
        <InputField id="porosity-input" label="Total Porosity" unit="%" value={inputs.porosity_percent} onChange={handleInputChange} />
      </div>

      <Button
        id="calculate-petro-button"
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Calculating...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Play className="w-5 h-5 mr-2" />
            Calculate
          </div>
        )}
      </Button>
    </motion.form>
  );
};

export default ZonalInputPanel;