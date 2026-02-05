import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const SetupPanel = ({ petroState, onLoad, onCurveUpdate }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (files?.length > 0) onLoad(files[0]);
    },
    accept: { 'text/plain': ['.las', '.txt'] },
    multiple: false
  });

  const CurveMapper = ({ label, type, mapped, options }) => (
    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md border border-slate-700">
      <div className="flex items-center gap-2">
         {mapped ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
         <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <div className="w-40">
        <Select value={mapped || ''} onValueChange={(val) => onCurveUpdate(type, val)}>
            <SelectTrigger className="h-8 text-xs bg-slate-900 border-slate-700">
                <SelectValue placeholder="Select curve..." />
            </SelectTrigger>
            <SelectContent>
                {options.map(c => (
                    <SelectItem key={c.mnemonic} value={c.mnemonic}>
                        {c.mnemonic} <span className="text-slate-500 text-[10px]">({c.unit})</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full">
        {/* File Upload Area */}
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-400" /> Data Import
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div 
                    {...getRootProps()} 
                    className={`
                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                        ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-blue-400 hover:bg-slate-800/50'}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-slate-800 rounded-full">
                            <UploadCloud className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-200 font-medium">Click or drag .LAS file here</p>
                            <p className="text-slate-500 text-xs mt-1">Supports LAS 1.2 and 2.0 standards</p>
                        </div>
                    </div>
                </div>
                
                {petroState.isLoaded && (
                    <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-emerald-400 font-semibold text-sm">Active File Loaded</span>
                             <span className="text-slate-400 text-xs">{petroState.fileName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                            <div><span className="text-slate-500">Well:</span> {petroState.wellName}</div>
                            <div><span className="text-slate-500">Rows:</span> {petroState.statistics.count}</div>
                            <div><span className="text-slate-500">Top:</span> {petroState.depthRange.min.toFixed(2)}</div>
                            <div><span className="text-slate-500">Base:</span> {petroState.depthRange.max.toFixed(2)}</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Curve Management */}
        {petroState.isLoaded && (
            <Card className="bg-slate-900 border-slate-800 flex-1">
                <CardHeader>
                    <CardTitle className="text-md">Curve Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Essential Curves</h4>
                            <CurveMapper label="Depth Reference" type="DEPTH" mapped={petroState.curveMap.DEPTH} options={petroState.curves} />
                            <CurveMapper label="Gamma Ray" type="GR" mapped={petroState.curveMap.GR} options={petroState.curves} />
                            <CurveMapper label="Resistivity (Deep)" type="RES_DEEP" mapped={petroState.curveMap.RES_DEEP} options={petroState.curves} />
                            <CurveMapper label="Density (RHOB)" type="RHOB" mapped={petroState.curveMap.RHOB} options={petroState.curves} />
                            <CurveMapper label="Neutron (NPHI)" type="NPHI" mapped={petroState.curveMap.NPHI} options={petroState.curves} />
                            
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 mt-4">Secondary Curves</h4>
                            <CurveMapper label="Sonic (DT)" type="DT" mapped={petroState.curveMap.DT} options={petroState.curves} />
                            <CurveMapper label="Caliper" type="CALI" mapped={petroState.curveMap.CALI} options={petroState.curves} />
                            <CurveMapper label="PE Factor" type="PEF" mapped={petroState.curveMap.PEF} options={petroState.curves} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        )}
    </div>
  );
};

export default SetupPanel;