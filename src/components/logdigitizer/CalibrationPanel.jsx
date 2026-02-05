import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

const CalibrationPanel = ({ calibration, setCalibration, disabled, pickingFor, onPick }) => {
  const handleCalChange = (e) => {
    const { name, value } = e.target;
    setCalibration({ ...calibration, [name]: value === '' ? '' : Number(value) });
  };

  const handleRadioChange = (name, value) => {
    setCalibration({ ...calibration, [name]: value });
  };

  const handleSwitchChange = (name, checked) => {
    setCalibration({ ...calibration, [name]: checked ? 'log10' : 'linear' });
  };
  
  const CalibrationInput = ({ name, label, type, ...props }) => (
    <div className="flex items-center space-x-2">
      <div className="flex-grow">
        <Label>{label}</Label>
        <Input 
          name={name}
          value={calibration[name]} 
          onChange={handleCalChange} 
          type={type} 
          className={cn("bg-gray-700 border-gray-600", pickingFor === name && "ring-2 ring-lime-400")}
          {...props}
        />
      </div>
      {type === 'pixel' && (
        <Button 
          variant="outline" 
          size="icon" 
          className="mt-6"
          onClick={() => onPick(name)}
          aria-label={`Pick ${label}`}
        >
          <Crosshair className={cn("h-4 w-4", pickingFor === name ? "text-lime-400" : "text-gray-400")} />
        </Button>
      )}
    </div>
  );

  return (
    <div className={`bg-gray-800/50 p-4 rounded-lg shadow-lg space-y-4 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-semibold text-teal-300">Calibration</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <CalibrationInput name="depth_top_pixel" label="Depth Top (px)" type="pixel" />
        <CalibrationInput name="depth_top_value" label="Depth Top Value" type="value" />
        <CalibrationInput name="depth_bottom_pixel" label="Depth Bottom (px)" type="pixel" />
        <CalibrationInput name="depth_bottom_value" label="Depth Bottom Value" type="value" />
        <div className="col-span-2">
          <Label>Depth Unit</Label>
          <RadioGroup value={calibration.depth_unit} onValueChange={(v) => handleRadioChange('depth_unit', v)} className="flex gap-4 mt-1">
            <div className="flex items-center space-x-2"><RadioGroupItem value="ft" id="ft" /><Label htmlFor="ft">ft</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="m" id="m" /><Label htmlFor="m">m</Label></div>
          </RadioGroup>
        </div>
        <div className="col-span-2 border-t border-gray-700 pt-3"></div>
        <CalibrationInput name="x_left_pixel" label="Curve Left (px)" type="pixel" />
        <CalibrationInput name="x_min" label="Curve Left Value" type="value" />
        <CalibrationInput name="x_right_pixel" label="Curve Right (px)" type="pixel" />
        <CalibrationInput name="x_max" label="Curve Right Value" type="value" />
        <div className="col-span-2 flex items-center gap-2">
          <Label>Logarithmic Scale</Label>
          <Switch checked={calibration.x_scale === 'log10'} onCheckedChange={(c) => handleSwitchChange('x_scale', c)} />
        </div>
      </div>
    </div>
  );
};

export default CalibrationPanel;