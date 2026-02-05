import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { decimalToDMS, dmsToDecimal, validateCoordinate } from '@/utils/coordinateUtils';

const CoordinateInput = ({ label, value, onChange, isLatitude = true }) => {
  const [mode, setMode] = useState('dd');
  const [inputValue, setInputValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (mode === 'dd') {
      setInputValue(value || '');
    } else {
      setInputValue(decimalToDMS(value, isLatitude) || '');
    }
  }, [value, mode, isLatitude]);

  const handleModeToggle = () => {
    setMode(prev => prev === 'dd' ? 'dms' : 'dd');
  };

  const handleChange = (e) => {
    const currentVal = e.target.value;
    setInputValue(currentVal);
    
    let decimalValue;
    if (mode === 'dms') {
      decimalValue = dmsToDecimal(currentVal);
    } else {
      decimalValue = currentVal;
    }

    const valid = validateCoordinate(decimalValue, isLatitude);
    setIsValid(valid);

    if (valid || decimalValue === '') {
      onChange(parseFloat(decimalValue) || '');
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={`bg-white/10 border-white/20 ${!isValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          placeholder={mode === 'dd' ? (isLatitude ? 'e.g., 5.7873' : 'e.g., 4.6435') : (isLatitude ? "e.g., 5°47'14.37\"N" : "e.g., 4°38'36.95\"E")}
        />
        <Button variant="ghost" size="icon" type="button" onClick={handleModeToggle} className="h-9 w-9 text-lime-300 hover:bg-lime-500/10 hover:text-lime-200">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      {!isValid && <p className="text-xs text-red-400">Invalid coordinate value.</p>}
    </div>
  );
};

export default CoordinateInput;