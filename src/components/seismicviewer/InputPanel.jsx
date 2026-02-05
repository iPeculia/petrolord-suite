import React, { useState } from 'react';
    import { useDropzone } from 'react-dropzone';
    import { Upload, Settings, Layers, Download, Save, X, Plus, Trash2 } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Slider } from '@/components/ui/slider';
    import { Switch } from '@/components/ui/switch';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
    import { Checkbox } from '@/components/ui/checkbox';

    const InputPanel = ({
      session,
      viewerParams,
      setViewerParams,
      pickSets,
      overlaySelected,
      setOverlaySelected,
      onFileUpload,
      onRender,
      onCreatePickSet,
      onDeletePickSet,
      onExportPicks,
      isLoading,
      isPicking,
      onSavePicks,
    }) => {
      const [newPickSetName, setNewPickSetName] = useState('');
      const [newPickSetKind, setNewPickSetKind] = useState('horizon');
      const [isModalOpen, setIsModalOpen] = useState(false);

      const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          onFileUpload(acceptedFiles[0]);
        }
      };

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/octet-stream': ['.sgy', '.segy'] },
        multiple: false,
      });

      const handleParamChange = (key, value) => {
        setViewerParams(prev => ({ ...prev, [key]: value }));
      };

      const handleIndexSliderChange = (value) => {
        handleParamChange('index', value[0]);
      };

      const handleOverlayChange = (setId) => {
        setOverlaySelected(prev =>
          prev.includes(setId) ? prev.filter(id => id !== setId) : [...prev, setId]
        );
      };

      const handleCreatePickSet = () => {
        if (newPickSetName) {
          onCreatePickSet(newPickSetName, newPickSetKind);
          setIsModalOpen(false);
          setNewPickSetName('');
        }
      };

      const getIndexRange = () => {
        if (!session) return { min: 0, max: 0 };
        if (viewerParams.sliceType === 'inline') return { min: session.il_range[0], max: session.il_range[1] };
        if (viewerParams.sliceType === 'crossline') return { min: session.xl_range[0], max: session.xl_range[1] };
        return { min: 0, max: 0 };
      };
      const indexRange = getIndexRange();

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Seismic Viewer</h2>
            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-amber-400 bg-amber-900/20' : 'border-gray-600 hover:border-amber-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">
                {isDragActive ? 'Drop the file here...' : 'Drag & drop a SEG-Y file, or click to select'}
              </p>
            </div>
          </div>

          {session && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center mb-3">
                  <Settings className="w-5 h-5 mr-2" />
                  Render Controls
                </h3>
                <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                  {session.kind === '3D' && (
                    <div>
                      <Label htmlFor="sliceType">Slice Type</Label>
                      <Select value={viewerParams.sliceType} onValueChange={(v) => handleParamChange('sliceType', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inline">Inline</SelectItem>
                          <SelectItem value="crossline">Crossline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {session.kind === '3D' && (
                    <div>
                      <Label htmlFor="index">Index ({indexRange.min} - {indexRange.max})</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="index"
                          min={indexRange.min}
                          max={indexRange.max}
                          step={1}
                          value={[viewerParams.index]}
                          onValueChange={handleIndexSliderChange}
                        />
                        <Input
                          type="number"
                          className="w-20"
                          value={viewerParams.index}
                          onChange={(e) => handleParamChange('index', parseInt(e.target.value))}
                          min={indexRange.min}
                          max={indexRange.max}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="pclip">Percentile Clip</Label>
                    <Slider id="pclip" min={50} max={99} step={1} value={[viewerParams.pclip]} onValueChange={(v) => handleParamChange('pclip', v[0])} />
                  </div>
                  <div>
                    <Label htmlFor="gain">Gain</Label>
                    <Slider id="gain" min={0.5} max={3} step={0.1} value={[viewerParams.gain]} onValueChange={(v) => handleParamChange('gain', v[0])} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="polarity">Reverse Polarity</Label>
                    <Switch
                      id="polarity"
                      checked={viewerParams.polarity === 'reverse'}
                      onCheckedChange={(c) => handleParamChange('polarity', c ? 'reverse' : 'normal')}
                    />
                  </div>
                  <Button onClick={onRender} disabled={isLoading} className="w-full bg-amber-600 hover:bg-amber-700">
                    {isLoading ? 'Rendering...' : 'Render Slice'}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white flex items-center mb-3">
                  <Layers className="w-5 h-5 mr-2" />
                  Interpretation
                </h3>
                <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                  {isPicking ? (
                    <Button onClick={onSavePicks} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Picks
                    </Button>
                  ) : (
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button disabled={isLoading} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          New Pick Set
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Pick Set</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input placeholder="Pick set name" value={newPickSetName} onChange={(e) => setNewPickSetName(e.target.value)} />
                          <Select value={newPickSetKind} onValueChange={setNewPickSetKind}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horizon">Horizon</SelectItem>
                              <SelectItem value="fault">Fault</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleCreatePickSet} className="w-full">Create</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <div className="space-y-2">
                    {pickSets.map(ps => (
                      <div key={ps.set_id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`overlay-${ps.set_id}`} checked={overlaySelected.includes(ps.set_id)} onCheckedChange={() => handleOverlayChange(ps.set_id)} />
                          <label htmlFor={`overlay-${ps.set_id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {ps.name}
                          </label>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onDeletePickSet(ps.set_id)} className="h-6 w-6">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button onClick={onExportPicks} disabled={isLoading || pickSets.length === 0} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Picks
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    };

    export default InputPanel;