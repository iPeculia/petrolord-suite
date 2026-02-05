import React, { useState, useCallback } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { FileUp, FileText, Map, Waves, Loader2 } from 'lucide-react';
    import { useDropzone } from 'react-dropzone';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { v4 as uuidv4 } from 'uuid';
    import { useImport } from '@/contexts/ImportContext';

    const ImportStep = ({ onFileSelect }) => {
        const onDrop = useCallback((acceptedFiles) => {
            onFileSelect(acceptedFiles);
        }, [onFileSelect]);
        
        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

        return (
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-cyan-400 bg-slate-800' : 'border-slate-600 hover:border-cyan-500'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center text-slate-400">
                    <FileUp className="w-12 h-12 mb-4" />
                    {isDragActive ? (
                        <p className="text-lg font-semibold text-white">Drop the files here...</p>
                    ) : (
                        <>
                            <p className="text-lg font-semibold text-white">Drag 'n' drop files here, or click to select</p>
                            <p className="text-sm mt-2">Supported: LAS, ZMap+, SEG-Y</p>
                        </>
                    )}
                </div>
            </div>
        );
    };
    
    const FileReviewStep = ({ files, onConfirm, onCancel, isImporting }) => {
        const getFileIcon = (fileName) => {
            const ext = fileName.split('.').pop().toLowerCase();
            if (['las'].includes(ext)) return <FileText className="w-6 h-6 text-yellow-400" />;
            if (['zmap', 'zmap+'].includes(ext)) return <Map className="w-6 h-6 text-green-400" />;
            if (['sgy', 'segy'].includes(ext)) return <Waves className="w-6 h-6 text-blue-400" />;
            return <FileText className="w-6 h-6 text-slate-400" />;
        }
        
        return (
            <div>
                <h3 className="text-lg font-semibold mb-4">Files to Import:</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto bg-slate-800 p-3 rounded-md">
                    {files.map((file, i) => (
                        <li key={i} className="flex items-center justify-between p-2 rounded bg-slate-700">
                           <div className="flex items-center space-x-3">
                                {getFileIcon(file.name)}
                                <span className="text-sm font-mono">{file.name}</span>
                           </div>
                           <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</span>
                        </li>
                    ))}
                </ul>
                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onCancel} disabled={isImporting}>Back</Button>
                    <Button onClick={() => onConfirm(files)} disabled={isImporting}>
                        {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isImporting ? 'Importing...' : 'Start Import'}
                    </Button>
                </DialogFooter>
            </div>
        )
    }

    const ImportCenter = ({ projectId }) => {
        const { toast } = useToast();
        const { user } = useAuth();
        const { isImportCenterOpen, handleOpenChange, files, setFiles, step, setStep, reset } = useImport();
        const [isImporting, setIsImporting] = useState(false);

        const handleFileSelect = (selectedFiles) => {
            if (selectedFiles.length > 0) {
                setFiles(selectedFiles);
                setStep(2);
            }
        };
        
        const triggerJobRunner = (jobId) => {
            supabase.functions.invoke('ems-job-runner', {
                body: { jobId: jobId },
            }).then(({ error: functionError }) => {
                if (functionError) {
                     console.error(`Background Job Runner Error for job ${jobId}:`, functionError.message);
                     // Optionally update the job status to failed here
                }
            });
        };

        const handleStartImport = async (filesToImport) => {
            setIsImporting(true);
            
            const importPromises = filesToImport.map(async (file) => {
                try {
                    const fileExt = file.name.split('.').pop();
                    const filePath = `${user.id}/${projectId}/${uuidv4()}.${fileExt}`;
                    
                    const fileOptions = {};
                    if(file.name.toLowerCase().endsWith('.las')){
                      fileOptions.contentType = 'text/plain';
                    }

                    const { error: uploadError } = await supabase.storage
                        .from('ss-assets')
                        .upload(filePath, file, fileOptions);

                    if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

                    const { data: job, error: jobError } = await supabase
                        .from('ss_jobs')
                        .insert({
                            project_id: projectId,
                            kind: 'import',
                            status: 'pending',
                            input: {
                                fileName: file.name,
                                fileSize: file.size,
                                fileType: file.type,
                                filePath: filePath,
                            },
                            created_by: user.id,
                        })
                        .select()
                        .single();

                    if (jobError) throw new Error(`Job Creation Error: ${jobError.message}`);
                    
                    triggerJobRunner(job.id);

                    toast({
                        title: "Import Started",
                        description: `"${file.name}" is being imported in the background.`,
                    });

                } catch (error) {
                    toast({
                        title: `Import Failed for ${file.name}`,
                        description: error.message,
                        variant: 'destructive',
                    });
                }
            });
            
            await Promise.all(importPromises);

            setIsImporting(false);
            handleOpenChange(false);
        };

        const handleBack = () => {
            setStep(1);
            setFiles([]);
        }

        const onOpenChange = (open) => {
            handleOpenChange(open);
            if(!open) {
                setTimeout(() => reset(), 300);
            }
        }

        return (
            <Dialog open={isImportCenterOpen} onOpenChange={onOpenChange}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Import Center</DialogTitle>
                        <DialogDescription>Add data to your project. Drag and drop supported files.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {step === 1 && <ImportStep onFileSelect={handleFileSelect} />}
                        {step === 2 && <FileReviewStep files={files} onConfirm={handleStartImport} onCancel={handleBack} isImporting={isImporting} />}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    export default ImportCenter;