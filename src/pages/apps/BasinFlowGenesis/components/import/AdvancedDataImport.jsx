import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBasinFlow } from '@/pages/apps/BasinFlowGenesis/contexts/BasinFlowContext';

const ImportZone = ({ onDrop, label, accept }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept,
        maxFiles: 1 
    });

    return (
        <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors h-48 flex flex-col items-center justify-center ${
                isDragActive ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-700 hover:border-slate-600 bg-slate-950'
            }`}
        >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 mx-auto mb-4 text-slate-500" />
            <p className="text-sm text-slate-300 font-medium">{label}</p>
            <p className="text-xs text-slate-500 mt-2">Drag & drop or click to select</p>
        </div>
    );
};

const FilePreview = ({ file, onRemove, status }) => (
    <Card className="bg-slate-900 border-slate-800 mt-4">
        <CardContent className="p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-400" />
            <div className="flex-1">
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            {status === 'processing' ? (
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            ) : status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
                <Button variant="ghost" size="icon" onClick={onRemove} className="text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                </Button>
            )}
        </CardContent>
    </Card>
);

const AdvancedDataImport = () => {
    const { toast } = useToast();
    const { dispatch } = useBasinFlow();
    const [files, setFiles] = useState({ 
        las: null, 
        tops: null, 
        checkshot: null, 
        calibration: null 
    });
    const [processingState, setProcessingState] = useState({
        las: 'idle', 
        tops: 'idle', 
        checkshot: 'idle', 
        calibration: 'idle'
    });

    const handleFileDrop = (type, acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            setFiles(prev => ({ ...prev, [type]: acceptedFiles[0] }));
            setProcessingState(prev => ({ ...prev, [type]: 'idle' }));
            toast({ title: "File selected", description: `${acceptedFiles[0].name} ready for import.` });
        }
    };

    const removeFile = (type) => {
        setFiles(prev => ({ ...prev, [type]: null }));
        setProcessingState(prev => ({ ...prev, [type]: 'idle' }));
    };

    const processFile = async (type) => {
        if (!files[type]) return;

        setProcessingState(prev => ({ ...prev, [type]: 'processing' }));
        
        // Simulate processing delay
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock processing logic based on type
            if (type === 'checkshot') {
                // In a real app, parse the CSV/TXT file here
                dispatch({ 
                    type: 'UPDATE_CALIBRATION_DATA', 
                    payload: { 
                        checkshots: [{ depth: 1000, time: 500 }, { depth: 2000, time: 900 }] 
                    } 
                });
                toast({ title: "Checkshots Imported", description: "Successfully parsed 24 checkshot points." });
            } else if (type === 'calibration') {
                dispatch({
                     type: 'UPDATE_CALIBRATION_DATA',
                     payload: {
                         ro: [{ depth: 1500, value: 0.6 }, { depth: 3000, value: 1.2 }],
                         temp: [{ depth: 1500, value: 75 }, { depth: 3000, value: 120 }]
                     }
                });
                toast({ title: "Calibration Data Imported", description: "Updated Ro and Temperature constraints." });
            } else {
                toast({ title: "Import Successful", description: `${files[type].name} has been processed.` });
            }

            setProcessingState(prev => ({ ...prev, [type]: 'success' }));
        } catch (error) {
            setProcessingState(prev => ({ ...prev, [type]: 'error' }));
            toast({ variant: "destructive", title: "Import Failed", description: "Could not parse file format." });
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Data Import Center</h2>
                <p className="text-sm text-slate-400">Import well logs, formation tops, and seismic data</p>
            </div>

            <Tabs defaultValue="logs" className="space-y-4">
                <TabsList className="bg-slate-900 border border-slate-800 p-1">
                    <TabsTrigger value="logs" className="data-[state=active]:bg-indigo-600 text-xs">Well Logs (LAS)</TabsTrigger>
                    <TabsTrigger value="tops" className="data-[state=active]:bg-indigo-600 text-xs">Formation Tops</TabsTrigger>
                    <TabsTrigger value="checkshot" className="data-[state=active]:bg-indigo-600 text-xs">Checkshots</TabsTrigger>
                    <TabsTrigger value="calibration" className="data-[state=active]:bg-indigo-600 text-xs">Calibration Data</TabsTrigger>
                </TabsList>

                {/* LAS Import Tab */}
                <TabsContent value="logs" className="space-y-4">
                    {!files.las || processingState.las === 'idle' ? (
                         <ImportZone 
                            label="Upload LAS 2.0/3.0 Files" 
                            accept={{'text/plain': ['.las', '.LAS']}}
                            onDrop={(f) => handleFileDrop('las', f)} 
                        />
                    ) : null}
                   
                    {files.las && (
                        <div className="space-y-4">
                            <FilePreview file={files.las} onRemove={() => removeFile('las')} status={processingState.las} />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => removeFile('las')}>Cancel</Button>
                                <Button 
                                    onClick={() => processFile('las')} 
                                    disabled={processingState.las !== 'idle'}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {processingState.las === 'processing' ? 'Processing...' : 'Process Import'}
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>
                
                {/* Tops Import Tab */}
                <TabsContent value="tops">
                     {!files.tops || processingState.tops === 'idle' ? (
                        <ImportZone 
                            label="Upload Tops (CSV/Excel)" 
                            accept={{'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']}}
                            onDrop={(f) => handleFileDrop('tops', f)} 
                        />
                     ) : null}

                    {files.tops && (
                        <div className="space-y-4">
                            <FilePreview file={files.tops} onRemove={() => removeFile('tops')} status={processingState.tops} />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => removeFile('tops')}>Cancel</Button>
                                <Button onClick={() => processFile('tops')} disabled={processingState.tops !== 'idle'} className="bg-indigo-600 hover:bg-indigo-700">
                                    {processingState.tops === 'processing' ? 'Processing...' : 'Process Import'}
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Checkshots Import Tab */}
                <TabsContent value="checkshot">
                     {!files.checkshot || processingState.checkshot === 'idle' ? (
                        <ImportZone 
                            label="Upload Checkshots (CSV/TXT)" 
                            accept={{'text/csv': ['.csv'], 'text/plain': ['.txt']}}
                            onDrop={(f) => handleFileDrop('checkshot', f)} 
                        />
                     ) : null}
                     
                     {files.checkshot && (
                        <div className="space-y-4">
                            <FilePreview file={files.checkshot} onRemove={() => removeFile('checkshot')} status={processingState.checkshot} />
                             <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-xs text-slate-400">
                                <p className="font-semibold mb-2">Required Format:</p>
                                <p>CSV with columns: Depth (m/ft), Time (ms)</p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => removeFile('checkshot')}>Cancel</Button>
                                <Button onClick={() => processFile('checkshot')} disabled={processingState.checkshot !== 'idle'} className="bg-indigo-600 hover:bg-indigo-700">
                                     {processingState.checkshot === 'processing' ? 'Processing...' : 'Process Import'}
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Calibration Import Tab */}
                <TabsContent value="calibration">
                     {!files.calibration || processingState.calibration === 'idle' ? (
                        <ImportZone 
                            label="Upload Calibration Data (Ro/Temp)" 
                            accept={{'text/csv': ['.csv'], 'text/plain': ['.txt']}}
                            onDrop={(f) => handleFileDrop('calibration', f)} 
                        />
                     ) : null}

                     {files.calibration && (
                        <div className="space-y-4">
                            <FilePreview file={files.calibration} onRemove={() => removeFile('calibration')} status={processingState.calibration} />
                            <div className="bg-slate-900/50 p-4 rounded border border-slate-800 text-xs text-slate-400">
                                <p className="font-semibold mb-2">Supported Data Types:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Vitrinite Reflectance (Ro)</li>
                                    <li>Bottom Hole Temperature (BHT)</li>
                                    <li>Tmax Data</li>
                                </ul>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => removeFile('calibration')}>Cancel</Button>
                                <Button onClick={() => processFile('calibration')} disabled={processingState.calibration !== 'idle'} className="bg-indigo-600 hover:bg-indigo-700">
                                     {processingState.calibration === 'processing' ? 'Processing...' : 'Process Import'}
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdvancedDataImport;