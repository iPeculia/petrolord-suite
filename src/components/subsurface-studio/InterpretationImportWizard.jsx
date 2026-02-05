import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { UploadCloud, FileText, Loader2, Layers, Grid } from 'lucide-react';

const formatOptions = {
    horizon: [
        { value: 'zmap', label: 'ZMAP+' },
        { value: 'xyz', label: 'XYZ ASCII' },
    ],
    fault: [
        { value: 'xyz_multi', label: 'XYZ (Multi-Segment)' },
        { value: 'gocad_tsurf', label: 'GoCAD TSurf' },
    ],
};

const InterpretationImportWizard = ({ open, onOpenChange, projectId, onImportComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();

    const [dataType, setDataType] = useState('horizon');
    const [format, setFormat] = useState(formatOptions['horizon'][0].value);
    const [domain, setDomain] = useState('time');
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            if (!name) {
                setName(selectedFile.name.split('.').slice(0, -1).join('.') || selectedFile.name);
            }
        }
    }, [name]);

    const handleDataTypeChange = (value) => {
        setDataType(value);
        setFormat(formatOptions[value][0].value);
    };

    const resetWizard = () => {
        setDataType('horizon');
        setFormat(formatOptions['horizon'][0].value);
        setDomain('time');
        setName('');
        setFile(null);
        setIsLoading(false);
    };

    const handleOpenChange = (isOpen) => {
        if (!isOpen) {
            resetWizard();
        }
        onOpenChange(isOpen);
    };

    const handleImport = async () => {
        if (!file || !name || !dataType || !format || !projectId || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all fields and select a file.' });
            return;
        }
        if (projectId === 'local-project') {
            toast({ variant: 'destructive', title: 'Demo Project', description: "Cannot import data into the demo project." });
            return;
        }

        setIsLoading(true);

        try {
            const filePath = `interpretations/${projectId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage.from('ss-assets').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            // Here you would typically call an edge function to parse the file and create the data json
            // For now, we'll just store metadata and a pointer to the raw file
            const dataToInsert = {
                project_id: projectId,
                created_by: user.id,
                kind: dataType, // 'horizon' or 'fault'
                name: name,
                data: { 
                    sourceFile: {
                        uri: filePath,
                        format: format,
                        domain: domain
                    },
                    // Parsed data would go here in a real implementation
                },
                style: dataType === 'horizon' 
                    ? { color: '#FF5733', width: 2 } 
                    : { color: '#33A4FF', width: 2 }
            };

            const { data, error: insertError } = await supabase.from('ss_interpretations').insert(dataToInsert).select().single();
            if (insertError) throw insertError;
            
            onImportComplete(data);
            toast({ title: 'Import Successful', description: `${name} has been added to the project.` });
            handleOpenChange(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

    const currentFormatOptions = useMemo(() => formatOptions[dataType], [dataType]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Import Seismic Interpretation</DialogTitle>
                    <DialogDescription>Import faults or horizons from various file formats.</DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Data Type</Label>
                        <Select value={dataType} onValueChange={handleDataTypeChange}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="horizon"><Layers className="w-4 h-4 mr-2" />Horizon</SelectItem>
                                <SelectItem value="fault"><Grid className="w-4 h-4 mr-2" />Fault</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Format</Label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {currentFormatOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Domain</Label>
                            <Select value={domain} onValueChange={setDomain}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="time">Time</SelectItem>
                                    <SelectItem value="depth">Depth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="interp-name">Name</Label>
                        <Input id="interp-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Top Chalk Horizon" />
                    </div>
                    
                    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 hover:border-cyan-500 bg-slate-800'}`}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-center">
                            <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
                            {file ? (
                                <p className="text-sm text-green-400 flex items-center"><FileText className="w-4 h-4 mr-2" />{file.name}</p>
                            ) : (
                                <p className="font-semibold text-white">Drag & drop a file here, or click to select</p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleImport} disabled={!file || !name || isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                        Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InterpretationImportWizard;