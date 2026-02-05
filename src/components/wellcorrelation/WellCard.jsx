import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Save, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const WellCard = ({ well, isSelected, onSelect, onUpdate, onFileUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localWell, setLocalWell] = useState(well);

  const handleMetaChange = (key, value) => {
    setLocalWell(prev => ({ ...prev, [key]: value }));
  };

  const handleCurveMapChange = (key, value) => {
    setLocalWell(prev => ({ ...prev, curve_map: { ...prev.curve_map, [key]: value } }));
  };

  const handleTopChange = (index, key, value) => {
    const newTops = [...(localWell.tops || [])];
    newTops[index] = { ...newTops[index], [key]: value };
    setLocalWell(prev => ({ ...prev, tops: newTops }));
  };

  const addTop = () => {
    const newTops = [...(localWell.tops || []), { name: '', md: '' }];
    setLocalWell(prev => ({ ...prev, tops: newTops }));
  };

  const removeTop = (index) => {
    const newTops = (localWell.tops || []).filter((_, i) => i !== index);
    setLocalWell(prev => ({ ...prev, tops: newTops }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onFileUpload(files, well.well_id),
    accept: { 'text/csv': ['.csv'], 'application/octet-stream': ['.las'] },
    multiple: false
  });

  return (
    <div className="bg-slate-800/70 rounded-lg border border-slate-700">
      <div className="flex items-center p-2 space-x-2">
        <Checkbox id={`select-well-${well.well_id}`} checked={isSelected} onCheckedChange={onSelect} className="border-slate-500" />
        <label htmlFor={`select-well-${well.well_id}`} className="flex-grow text-left font-semibold text-white cursor-pointer">{well.name}</label>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-7 w-7">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      {isOpen && (
        <div className="p-3 border-t border-slate-700 space-y-4">
          <div {...getRootProps()} className="p-2 border-dashed border-2 border-slate-600 rounded text-center cursor-pointer hover:border-lime-400 hover:bg-slate-800 transition-colors">
            <input {...getInputProps()} />
            <div className="flex items-center justify-center text-slate-400">
              <Upload className="w-4 h-4 mr-2"/>
              <p className="text-xs">Re-upload LAS/CSV</p>
            </div>
          </div>

          <div>
            <Label>Well Name</Label>
            <div className="flex gap-2 mt-1">
              <Input value={localWell.name} onChange={e => handleMetaChange('name', e.target.value)} className="bg-slate-900 border-slate-600" />
              <Button size="icon" onClick={() => onUpdate('set-well-meta', { well_id: well.well_id, name: localWell.name })} className="bg-slate-700 hover:bg-slate-600"><Save className="w-4 h-4" /></Button>
            </div>
          </div>

          <div>
            <Label>Curve Mapping</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.keys(well.curve_map).map(key => (
                <div key={key}>
                  <Label className="text-xs text-slate-400 uppercase">{key}</Label>
                  <Select value={localWell.curve_map[key] || ''} onValueChange={v => handleCurveMapChange(key, v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 w-full"><SelectValue placeholder="-" /></SelectTrigger>
                    <SelectContent>
                      {well.curves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-2 bg-slate-700 hover:bg-slate-600" onClick={() => onUpdate('set-curve-map', { well_id: well.well_id, curve_map: localWell.curve_map })}>
              <Save className="w-3 h-3 mr-1" /> Save Map
            </Button>
          </div>

          <div>
            <Label>Tops</Label>
            <div className="space-y-2 mt-1 max-h-40 overflow-y-auto pr-1">
              {(localWell.tops || []).map((top, i) => (
                <div key={i} className="flex gap-1">
                  <Input placeholder="Top Name" value={top.name} onChange={e => handleTopChange(i, 'name', e.target.value)} className="bg-slate-900 border-slate-600" />
                  <Input type="number" placeholder="MD" value={top.md} onChange={e => handleTopChange(i, 'md', e.target.value)} className="bg-slate-900 border-slate-600" />
                  <Button variant="destructive" size="icon" onClick={() => removeTop(i)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={addTop} className="border-slate-600"><Plus className="w-3 h-3 mr-1" /> Add Top</Button>
              <Button size="sm" className="bg-slate-700 hover:bg-slate-600" onClick={() => onUpdate('set-tops', { well_id: well.well_id, tops: localWell.tops })}>
                <Save className="w-3 h-3 mr-1" /> Save Tops
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellCard;