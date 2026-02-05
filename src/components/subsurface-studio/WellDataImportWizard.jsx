import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { UploadCloud, FileText, Loader2, List, Check, Milestone } from 'lucide-react';
import { parseLAS } from '@/utils/las-parser.js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const FileUploader = ({ onFileUpload, fileType, description }) => {
  const [fileName, setFileName] = useState('');
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) { setFileName(file.name); onFileUpload(file, file.name); }
  }, [onFileUpload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 hover:border-cyan-500 bg-slate-800'}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloud className="w-12 h-12 text-slate-500 mb-4" />
        <p className="font-semibold text-white">Drag & drop a {fileType} file here, or click to select</p>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
        {fileName && <p className="mt-4 text-sm text-green-400 flex items-center"><FileText className="w-4 h-4 mr-2" />{fileName}</p>}
      </div>
    </div>
  );
};

const LasCurveSelector = ({ curves, selectedCurves, onSelectionChange, onSelectAll }) => {
  const isAll = curves.length > 0 && selectedCurves.length === curves.length;
  return (
    <div className="mt-4 p-4 bg-slate-800 rounded-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
        <h3 className="text-md font-semibold flex items-center"><List className="w-5 h-5 mr-2 text-cyan-400" /> Select Logs to Expose</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="select-all-curves" checked={isAll} onCheckedChange={onSelectAll} />
          <Label htmlFor="select-all-curves">Select All</Label>
        </div>
      </div>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {curves.map((c) => (
            <div key={c.mnemonic} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-700">
              <Checkbox
                id={`curve-${c.mnemonic}`}
                checked={selectedCurves.includes(c.mnemonic)}
                onCheckedChange={(checked) => onSelectionChange(c.mnemonic, checked)}
              />
              <Label htmlFor={`curve-${c.mnemonic}`} className="flex-grow cursor-pointer">
                {c.mnemonic} <span className="text-slate-400 text-xs">({c.unit})</span>
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-xs text-slate-400 mt-2">We’ll store the LAS once (as a logset) and create lightweight child “log” items that point to it.</p>
    </div>
  );
};

// canonical aliases
const ALIAS = [
  { std: 'DEPTH', rx: /^(md|dept|depth|measured[_ ]?depth|de?p?t)$/i },
  { std: 'GR',    rx: /^(gr(_[a-z]+)?|gamma[_ ]?ray|gamma)$/i },
  { std: 'RHOB',  rx: /^(rhob|dens|rhoz|density)$/i },
  { std: 'NPHI',  rx: /^(nphi|neut|neutron(_porosity)?|phin)$/i },
  { std: 'DT',    rx: /^(dt|dtc|sonic|slowness)$/i },
  { std: 'RT',    rx: /^(rt|rdeep|rll?d|res(d|istivity)(_deep)?|ild|resd(_[a-z]+)?)$/i },
  { std: 'CALI',  rx: /^(cali(_[a-z]+)?|caliper)$/i },
  { std: 'TEMP',  rx: /^(temp|ftemp)$/i },
  { std: 'PRESS', rx: /^(press|fpres?s)$/i },
  { std: 'PHI',   rx: /^(phi|phie|por|porosity)$/i },
];
const normalizeName = (name) => {
  for (const a of ALIAS) if (a.rx.test(name)) return a.std;
  return String(name).toUpperCase();
};

const WellDataImportWizard = ({ open, onOpenChange, projectId, parentWell, onImportComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('logs');
  const [fileObject, setFileObject] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lasData, setLasData] = useState(null);
  const [selectedCurves, setSelectedCurves] = useState([]);

  const handleFileUpload = async (file, name) => {
    setFileObject(file);
    setFileName(name);
    if (activeTab === 'logs' && name.toLowerCase().endsWith('.las')) {
      setIsLoading(true);
      try {
        const content = await file.text();
        const parsed = parseLAS(content); // expects { curves:[{mnemonic,unit,...}, ...], data:[[...],...]}
        // normalize aliases now so the rest of the app is clean
        const normalizedCurves = parsed.curves.map((c, i) => ({
          ...c,
          index: i,
          alias: normalizeName(c.mnemonic),
        }));
        setLasData({ ...parsed, curves: normalizedCurves });
        const preselect = normalizedCurves.slice(1).map(c => c.mnemonic);
        setSelectedCurves(preselect);
      } catch (e) {
        toast({ variant: 'destructive', title: 'Failed to parse LAS file', description: e.message });
        setLasData(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLasData(null);
      setSelectedCurves([]);
    }
  };

  const resetState = () => {
    setFileObject(null);
    setFileName('');
    setIsLoading(false);
    setLasData(null);
    setSelectedCurves([]);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) resetState();
    onOpenChange(isOpen);
  };

  const handleTabChange = (tab) => { setActiveTab(tab); resetState(); };

  const handleCurveSelectionChange = (mnemonic, checked) => {
    setSelectedCurves(prev => checked ? [...prev, mnemonic] : prev.filter(c => c !== mnemonic));
  };

  const handleSelectAllCurves = (checked) => {
    if (!lasData) return;
    setSelectedCurves(checked ? lasData.curves.map(c => c.mnemonic).filter(m => m !== lasData.curves[0].mnemonic) : []);
  };

  // MAIN: import LAS once + create logset + child log pointers
  const handleLasImport = async () => {
    if (!lasData || !parentWell || !user) {
      toast({ variant: 'destructive', title: 'Missing required data for LAS import.' });
      return;
    }
    if (selectedCurves.length === 0) {
      toast({ variant: 'destructive', title: 'Pick at least one curve.' });
      return;
    }

    setIsLoading(true);
    try {
      // 1) upload original LAS to storage
      const baseName = fileName.replace(/\.las$/i, '');
      const filePath = `${user.id}/${projectId}/${parentWell.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('ss-assets').upload(filePath, fileObject, { upsert: true });
      if (uploadError) throw uploadError;

      // 2) create LOGSET carrier with alias map + curves metadata
      const depth = lasData.curves[0]; // first is depth by our parser
      const logsetMeta = {
        source: 'las',
        fileName,
        filePath,
        depthUnit: depth?.unit || null,
        curves: lasData.curves.map(c => ({
          mnemonic: c.mnemonic,
          alias: c.alias,
          unit: c.unit || null,
          index: c.index,
        })),
        aliasMap: Object.fromEntries(lasData.curves.map(c => [c.mnemonic, c.alias])),
        samples: Array.isArray(lasData.data) ? lasData.data.length : 0,
      };

      const { data: logset, error: logsetErr } = await supabase.from('ss_assets').insert({
        project_id: projectId,
        parent_id: parentWell.id,
        created_by: user.id,
        name: `${baseName} (LAS)`,
        type: 'logset',
        uri: filePath,
        meta: logsetMeta,
      }).select().single();
      if (logsetErr) throw logsetErr;

      // 3) create child “log” pointers for selected curves
      const depthMnemonic = depth.mnemonic;
      const childrenPayload = selectedCurves
        .filter(m => m !== depthMnemonic)
        .map((mn) => {
          const c = lasData.curves.find(x => x.mnemonic === mn);
          return {
            project_id: projectId,
            parent_id: parentWell.id,
            created_by: user.id,
            name: `${baseName}_${c.alias}`,
            type: 'log',
            uri: filePath, // same LAS
            meta: {
              parent_filePath: filePath,
              parent_asset_id: logset?.id || null,
              original_file: fileName,
              mnemonic: c.mnemonic,
              alias: c.alias,
              unit: c.unit || null,
              index: c.index,
              depth_mnemonic: depthMnemonic,
              depth_unit: depth?.unit || null,
              source: 'las',
            },
          };
        });

      let inserted = [];
      if (childrenPayload.length) {
        const { data: kids, error: kidsErr } = await supabase.from('ss_assets').insert(childrenPayload).select();
        if (kidsErr) throw kidsErr;
        inserted = kids;
      }

      toast({ title: 'LAS Import Complete', description: `Created 1 logset and ${inserted.length} logs.` });
      onImportComplete([logset, ...inserted]);
      handleOpenChange(false);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Import failed', description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // CSV/TXT imports (unchanged)
  const handleGenericImport = async () => {
    if (!fileObject || !parentWell || !user) {
      toast({ variant: 'destructive', title: 'Missing required data for import.' });
      return;
    }
    setIsLoading(true);

    let assetType = '';
    let meta = {};
    const name = fileName.split('.').slice(0, -1).join('.') || fileName;

    switch (activeTab) {
      case 'deviation': assetType = 'survey'; meta = { format: 'csv', columns: ['MD', 'INC', 'AZM'] }; break;
      case 'time-depth': assetType = 'time-depth'; meta = { format: 'csv', columns: ['OWT', 'DEPTH'] }; break;
      case 'well-tops': assetType = 'tops'; meta = { format: 'csv', columns: ['TOP_NAME', 'DEPTH'] }; break;
      default:
        toast({ variant: 'destructive', title: 'Unknown import type' });
        setIsLoading(false);
        return;
    }

    try {
      const filePath = `${user.id}/${projectId}/${parentWell.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('ss-assets').upload(filePath, fileObject, { upsert: true });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase.from('ss_assets').insert({
        project_id: projectId, parent_id: parentWell.id, created_by: user.id,
        name, type: assetType, uri: filePath, meta,
      }).select().single();

      if (error) throw error;
      toast({ title: 'Import Successful', description: `${name} added to the well.` });
      onImportComplete(data);
      handleOpenChange(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = activeTab === 'logs' && lasData ? handleLasImport : handleGenericImport;

  const canImport = useMemo(() => {
    if (activeTab === 'logs' && lasData) return selectedCurves.length > 0;
    return !!fileObject;
  }, [fileObject, lasData, selectedCurves, activeTab]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Data for Well: {parentWell?.name}</DialogTitle>
          <DialogDescription>Select the data type and upload the file.</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logs">Logs (LAS)</TabsTrigger>
            <TabsTrigger value="deviation">Deviation</TabsTrigger>
            <TabsTrigger value="time-depth">Time-Depth</TabsTrigger>
            <TabsTrigger value="well-tops">Well Tops</TabsTrigger>
          </TabsList>
          <div className="pt-6">
            <TabsContent value="logs">
              <FileUploader onFileUpload={handleFileUpload} fileType="LAS" description="Upload a standard LAS file." />
              {lasData && (
                <LasCurveSelector
                  curves={lasData.curves}
                  selectedCurves={selectedCurves}
                  onSelectionChange={handleCurveSelectionChange}
                  onSelectAll={handleSelectAllCurves}
                />
              )}
            </TabsContent>
            <TabsContent value="deviation">
              <FileUploader onFileUpload={handleFileUpload} fileType="TXT/CSV" description="Columns: MD, INC, AZM" />
            </TabsContent>
            <TabsContent value="time-depth">
              <FileUploader onFileUpload={handleFileUpload} fileType="TXT/CSV" description="Columns: OWT, DEPTH" />
            </TabsContent>
            <TabsContent value="well-tops">
              <FileUploader onFileUpload={handleFileUpload} fileType="TXT/CSV" description="Columns: TOP_NAME, DEPTH" />
            </TabsContent>
          </div>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={!canImport || isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : activeTab === 'well-tops' ? <Milestone className="w-4 h-4 mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            {activeTab === 'logs' ? `Import ${selectedCurves.length} Logs` : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WellDataImportWizard;