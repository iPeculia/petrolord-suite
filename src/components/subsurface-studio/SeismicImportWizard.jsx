import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { UploadCloud, Loader2, SlidersHorizontal, ChevronRight, CheckCircle, XCircle, Zap, Server } from 'lucide-react';
import { useJobMonitor } from '@/hooks/useJobMonitor';

const WizardStep = ({ title, children, isActive }) => {
    if (!isActive) return null;
    return (
        <div className="animate-in fade-in-50">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">{title}</h3>
            {children}
        </div>
    );
};

const SeismicImportWizard = ({ open, onOpenChange, projectId, onImportComplete }) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [headers, setHeaders] = useState(null);
    const [importConfig, setImportConfig] = useState({
        inlineKey: 'INLINE_3D',
        crosslineKey: 'CROSSLINE_3D',
    });
    const [importMode, setImportMode] = useState('full');
    const [isImporting, setIsImporting] = useState(false);
    const [jobId, setJobId] = useState(null);

    const { job, error: jobError } = useJobMonitor(jobId);

    useEffect(() => {
        if (job && importMode === 'full') {
            if (job.status === 'completed') {
                toast({
                    title: 'Full Mode Processing Complete!',
                    description: `Seismic volume "${job.result?.name || file.name}" is ready.`,
                    variant: 'success'
                });
                if (onImportComplete) {
                    onImportComplete(job.result);
                }
                setTimeout(() => {
                    onOpenChange(false);
                    resetWizard();
                }, 1000);
            } else if (job.status === 'error') {
                toast({
                    variant: 'destructive',
                    title: 'Processing Failed',
                    description: job.error || 'An unknown error occurred in the worker.',
                });
                setIsImporting(false);
                setStep(3);
            }
        }
    }, [job, importMode, onImportComplete, toast, file]);
    
    useEffect(() => {
        if(jobError) {
             toast({
                variant: 'destructive',
                title: 'Job Monitor Error',
                description: jobError,
            });
            setIsImporting(false);
            setStep(3);
        }
    }, [jobError, toast]);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.name.toLowerCase().endsWith('.sgy') || selectedFile.name.toLowerCase().endsWith('.segy')) {
                setFile(selectedFile);
                parseHeaders(selectedFile);
            } else {
                toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a SEG-Y file (.sgy or .segy).' });
            }
        }
    }, [toast]);

    const parseHeaders = (fileToParse) => {
        setStep(2);
        setIsParsing(true);
        setTimeout(() => {
            setHeaders({
                traceCount: 1200,
                sampleCount: 1500,
                sampleInterval: 2000,
                format: 'IBM Float',
                headerFields: ['INLINE_3D', 'CROSSLINE_3D', 'CDP_X', 'CDP_Y', 'SAMPLE_INTERVAL'],
            });
            setIsParsing(false);
            setStep(3);
        }, 1000);
    };

    const handleConfigChange = (key, value) => {
        setImportConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleStartImport = async () => {
        if (importMode === 'lite') {
            handleStartLiteImport();
        } else {
            handleStartFullImport();
        }
    };
    
    const handleStartLiteImport = () => {
        setIsImporting(true);
        setStep(4);
        toast({ title: "Starting Lite Import", description: "Parsing seismic data in your browser..." });

        setTimeout(() => {
             const mockAsset = {
                id: `local-${Date.now()}`,
                project_id: projectId,
                name: `(Lite) ${file.name}`,
                type: 'seis.volume',
                uri: `local://${file.name}`,
                meta: {
                    local: true,
                    file: file,
                    // Mock meta from headers for viewer
                    il_min: 100, il_max: 500,
                    xl_min: 1000, xl_max: 2000,
                    nsamp: headers.sampleCount,
                    dt_ms: 2,
                },
                created_by: supabase.auth.user?.id,
            };

            onImportComplete(mockAsset);
            toast({ title: 'Lite Import Successful!', description: `${file.name} is ready for temporary viewing.`, variant: 'success' });
            onOpenChange(false);
            resetWizard();
        }, 2000);
    };

    const handleStartFullImport = async () => {
        setIsImporting(true);
        setStep(4);
        setJobId(null);
        
        toast({ title: 'Starting Full Import', description: 'Uploading raw file...' });
        const filePath = `seismic/uploads/${projectId}/${Date.now()}-${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ss-assets')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });
        
        if (uploadError) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: uploadError.message });
            resetWizard();
            return;
        }

        toast({ title: 'File Uploaded', description: 'Enqueuing processing job...' });
        
        const { data, error: functionError } = await supabase.functions.invoke('seis-tile-job', {
            body: { projectId, filePath, fileName: file.name, importConfig }
        });

        if (functionError) {
            toast({ variant: 'destructive', title: 'Job Start Failed', description: functionError.message });
            resetWizard();
            return;
        }
        
        toast({ title: "Job Enqueued!", description: `Worker will now process ${file.name}.`, variant: 'success' });
        setJobId(data.id);
    };

    const resetWizard = () => {
        setStep(1);
        setFile(null);
        setHeaders(null);
        setIsParsing(false);
        setIsImporting(false);
        setJobId(null);
    };
    
    const getProgress = () => {
        if (importMode === 'lite') return isImporting ? 50 : 0;
        if (!job) return isImporting ? 10 : 0; // upload progress for full mode
        if (job.status === 'processing') return 10 + (job.progress || 0) * 0.9;
        if (job.status === 'completed') return 100;
        return 10;
    };

    const getStatusMessage = () => {
        if (importMode === 'lite') return "Parsing data in browser...";
        if (jobError) return "Error monitoring job.";
        if (!isImporting) return "Ready to start.";
        if (!jobId) return "Uploading and enqueuing job...";
        if (job) {
             switch (job.status) {
                case 'queued': return "Job is queued and waiting for a worker...";
                case 'processing': return `Worker is processing... (${job.progress || 0}%)`;
                case 'completed': return "Processing complete!";
                case 'error': return "Job failed.";
                default: return "Awaiting job status...";
            }
        }
        return "Initializing...";
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: { 'application/octet-stream': ['.sgy', '.segy'] } });

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isImporting) { onOpenChange(isOpen); if (!isOpen) resetWizard(); } }}>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Seismic Import Wizard</DialogTitle>
                    <DialogDescription>Follow the steps to import your SEG-Y data.</DialogDescription>
                </DialogHeader>

                <div className="py-6 min-h-[300px]">
                    <WizardStep title="Step 1: Upload SEG-Y File" isActive={step === 1}>
                        <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${isDragActive ? 'border-lime-400 bg-slate-800' : 'border-slate-600 hover:border-slate-500'}`}>
                            <input {...getInputProps()} />
                            <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                            <p className="font-semibold text-slate-200">Drag & drop a .sgy or .segy file here</p>
                            <p className="text-sm text-slate-400">or click to select a file</p>
                        </div>
                    </WizardStep>

                    <WizardStep title="Step 2: Parsing File Headers..." isActive={step === 2}>
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Loader2 className="w-12 h-12 text-lime-400 animate-spin mb-4" />
                            <p className="text-lg font-semibold text-slate-200">Analyzing {file?.name}</p>
                            <p className="text-slate-400">This is a quick mock scan. Full analysis will be done by the backend worker.</p>
                        </div>
                    </WizardStep>

                    <WizardStep title="Step 3: Configure Import" isActive={step === 3}>
                        {headers && (
                            <div className="space-y-6">
                                <RadioGroup defaultValue="full" onValueChange={setImportMode} className="grid grid-cols-2 gap-4">
                                    <Label htmlFor="mode-lite" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-blue-400 ${importMode === 'lite' ? 'border-blue-500 bg-blue-900/30' : 'border-slate-700'}`}>
                                        <RadioGroupItem value="lite" id="mode-lite" className="sr-only" />
                                        <Zap className="w-8 h-8 mb-2 text-blue-400" />
                                        <span className="font-bold text-white">Lite Mode</span>
                                        <span className="text-xs text-slate-400 text-center">Quick view, in-browser parsing. Good for small files.</span>
                                    </Label>
                                    <Label htmlFor="mode-full" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-lime-400 ${importMode === 'full' ? 'border-lime-500 bg-lime-900/30' : 'border-slate-700'}`}>
                                        <RadioGroupItem value="full" id="mode-full" className="sr-only" />
                                        <Server className="w-8 h-8 mb-2 text-lime-400" />
                                        <span className="font-bold text-white">Full Mode</span>
                                        <span className="text-xs text-slate-400 text-center">Reliable backend processing. Best for large files.</span>
                                    </Label>
                                </RadioGroup>
                                <div className="p-4 bg-slate-800 rounded-md grid grid-cols-2 gap-4">
                                    <div><span className="font-semibold">Mock Traces:</span> {headers.traceCount}</div>
                                    <div><span className="font-semibold">Mock Samples:</span> {headers.sampleCount}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="inline-key">Inline Key</Label>
                                        <Select value={importConfig.inlineKey} onValueChange={(v) => handleConfigChange('inlineKey', v)}>
                                            <SelectTrigger id="inline-key" className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>{headers.headerFields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="crossline-key">Crossline Key</Label>
                                        <Select value={importConfig.crosslineKey} onValueChange={(v) => handleConfigChange('crosslineKey', v)}>
                                            <SelectTrigger id="crossline-key" className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>{headers.headerFields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </WizardStep>
                     <WizardStep title="Step 4: Processing Seismic Volume..." isActive={step === 4}>
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            {job?.status === 'completed' || (importMode === 'lite' && getProgress() > 99) ? <CheckCircle className="w-12 h-12 text-green-400 mb-4" /> :
                             job?.status === 'error' ? <XCircle className="w-12 h-12 text-red-500 mb-4" /> :
                             <Loader2 className="w-12 h-12 text-lime-400 animate-spin mb-4" />
                            }
                            <p className="text-lg font-semibold text-slate-200">{getStatusMessage()}</p>
                            <Progress value={getProgress()} className="w-full mt-4" />
                            {jobId && <p className="text-xs text-slate-500 mt-4">Job ID: {jobId}</p>}
                        </div>
                    </WizardStep>
                </div>

                <DialogFooter>
                    {step === 3 && (
                        <Button onClick={handleStartImport} className="bg-lime-600 hover:bg-lime-700 text-white">
                           {`Start ${importMode === 'lite' ? 'Lite' : 'Full'} Import`} <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SeismicImportWizard;