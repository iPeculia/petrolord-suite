import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useDropzone } from 'react-dropzone';
import { Upload, Save, RotateCcw, Download, Trash2, ChevronDown, ChevronUp, Wand2, MousePointerClick } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ControlPanel = ({
  fileName,
  onFileDrop,
  simplifyEpsilon,
  setSimplifyEpsilon,
  currentTrack,
  setCurrentTrack,
  onSave,
  onClear,
  curves,
  onDeleteCurve,
  onExport,
  isProcessing,
  calibration,
  onAutoDigitize,
  manualMode,
  setManualMode
}) => {
  const [showCurves, setShowCurves] = useState(true);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onFileDrop, accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }, multiple: false });

  const isCalibrated = Object.values(calibration).every(v => v !== '' && v !== null) && calibration.img_width > 0;
  const canSave = isCalibrated;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg space-y-4">
      <div {...getRootProps()} className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-lime-400 bg-lime-900/50' : 'border-gray-600 hover:border-gray-500'}`}>
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-center text-sm text-gray-400">{isDragActive ? 'Drop the image here...' : 'Drag & drop an image, or click to select'}</p>
        {fileName && <p className="text-xs text-lime-300 mt-2 truncate max-w-full">{fileName}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-teal-300">Digitizing Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Curve Name</Label><Input value={currentTrack.name} onChange={e => setCurrentTrack({...currentTrack, name: e.target.value})} className="bg-gray-700 border-gray-600" /></div>
          <div><Label>Unit</Label><Input value={currentTrack.unit} onChange={e => setCurrentTrack({...currentTrack, unit: e.target.value})} className="bg-gray-700 border-gray-600" /></div>
        </div>

        <div className="flex items-center justify-between space-x-2 pt-2">
          <Label htmlFor="manual-mode" className="flex items-center gap-2 text-white">
            <MousePointerClick className="w-4 h-4" />
            Manual Mode
          </Label>
          <Switch
            id="manual-mode"
            checked={manualMode}
            onCheckedChange={setManualMode}
            disabled={isProcessing || !fileName}
          />
        </div>

        <div>
          <Label>Simplify ({simplifyEpsilon.toFixed(1)} px)</Label>
          <Slider value={[simplifyEpsilon]} onValueChange={([v]) => setSimplifyEpsilon(v)} min={0} max={5} step={0.1} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onSave} disabled={isProcessing || !canSave} className="bg-teal-600 hover:bg-teal-700"><Save className="w-4 h-4 mr-2" />Save Curve</Button>
          <Button onClick={onClear} variant="secondary" disabled={isProcessing}><RotateCcw className="w-4 h-4 mr-2" />Clear Points</Button>
        </div>
        <Button onClick={onAutoDigitize} disabled={isProcessing || !fileName || !isCalibrated} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Wand2 className="w-4 h-4 mr-2" />Auto-Digitize ROI
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowCurves(!showCurves)}>
          <h3 className="text-lg font-semibold text-teal-300">Saved Curves ({curves.length})</h3>
          {showCurves ? <ChevronUp /> : <ChevronDown />}
        </div>
        {showCurves && (
          <div className="space-y-2 bg-gray-900/50 p-2 rounded-md max-h-40 overflow-y-auto">
            {curves.length > 0 ? curves.map(curve => (
              <div key={curve.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span className="text-sm">{curve.name} ({curve.unit}) - {curve.point_count} pts</span>
                <Button variant="ghost" size="icon" onClick={() => onDeleteCurve(curve.id)} disabled={isProcessing} className="text-red-400 hover:text-red-200 h-8 w-8">
                  <Trash2 size={16} />
                </Button>
              </div>
            )) : <p className="text-sm text-gray-500 text-center p-2">No curves saved yet.</p>}
          </div>
        )}
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full" disabled={isProcessing || curves.length === 0}><Download className="w-4 h-4 mr-2" />Export Data</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 text-white border-gray-700">
            <DropdownMenuItem onSelect={() => onExport('csv')}>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport('las')}>Export as LAS</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ControlPanel;