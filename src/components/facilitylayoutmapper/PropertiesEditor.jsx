import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PropertiesEditor = ({ selectedLayer, onUpdateLayer }) => {
  const [tag, setTag] = useState('');
  const [lineSize, setLineSize] = useState('');

  useEffect(() => {
    if (selectedLayer) {
      setTag(selectedLayer.tag || '');
      if (selectedLayer.type === 'pipeline') {
        setLineSize(selectedLayer.lineSize || '');
      }
    } else {
      setTag('');
      setLineSize('');
    }
  }, [selectedLayer]);

  const handleUpdate = () => {
    if (!selectedLayer) return;

    const updatedLayer = { ...selectedLayer, tag };
    if (selectedLayer.type === 'pipeline') {
      updatedLayer.lineSize = lineSize;
    }
    onUpdateLayer(updatedLayer);
  };

  if (!selectedLayer) {
    return (
      <div className="text-sm text-slate-400 p-4 text-center bg-slate-800/50 rounded-lg">
        Select an item on the map to edit its properties.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <div>
        <Label htmlFor="tag-input" className="text-slate-300">Tag / Name</Label>
        <Input
          id="tag-input"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      {selectedLayer.type === 'pipeline' && (
        <div>
          <Label htmlFor="linesize-input" className="text-slate-300">Line Size</Label>
          <Input
            id="linesize-input"
            value={lineSize}
            onChange={(e) => setLineSize(e.target.value)}
            placeholder='e.g., 6" or 150mm'
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      )}
      <Button onClick={handleUpdate} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
        Update Properties
      </Button>
    </div>
  );
};

export default PropertiesEditor;