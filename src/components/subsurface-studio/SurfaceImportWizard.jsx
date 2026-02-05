import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { UploadCloud, FileText, Loader2, Layers } from 'lucide-react';

const formatOptions = [
    { value: 'zmap', label: 'Zmap Grid' },
    { value: 'xyz', label: 'XYZ / DAT' },
    { value: 'cps3', label: 'CPS-3 Grid' },
    { value: 'gocad_tsurf', label: 'GoCAD TSURF (.ts)' },
];

const SurfaceImportWizard = ({ open, onOpenChange, projectId, onImportComplete }) => {
    const { toast } = useToast();
    const { user } = useAuth();

    const [format, setFormat] = useState(formatOptions[0].value);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            if (!name) {
                const fileNameWithoutExt = selectedFile.name.split('.').slice(0, -1).join('.');
                setName(fileNameWithoutExt || selectedFile.name);
            }
        }
    }, [name]);

    const resetWizard = () => {
        setFormat(formatOptions[0].value);
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
        if (!file || !name || !format || !projectId || !user) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all fields and select a file.' });
            return;
        }
        if (projectId === 'local-project') {
            toast({ variant: 'destructive', title: 'Demo Project', description: "Cannot import data into the demo project." });
            return;
        }

        setIsLoading(true);

        try {
            const filePath = `surfaces/${projectId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage.from('ss-assets').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            const dataToInsert = {
                project_id: projectId,
                created_by: user.id,
                type: 'surface',
                name: name,
                uri: filePath,
                meta: { 
                    sourceFile: {
                        format: format,
                    },
                },
            };

            const { data, error: insertError } = await supabase.from('ss_assets').insert(dataToInsert).select().single();
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Import Surface</DialogTitle>
                    <DialogDescription>Import gridded or triangulated surfaces from various formats.</DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="surface-name">Name</Label>
                            <Input id="surface-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Top Reservoir Surface" />
                        </div>
                        <div className="space-y-2">
                            <Label>Format</Label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {formatOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-cyan-400 bg-cyan-900/20' : 'border-slate-600 hover:border-cyan-500 bg-slate-800'}`}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-center">
                            <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
                            {file ? (
                                <p className="text-sm text-green-400 flex items-center"><FileText className="w-4 h-4 mr-2" />{file.name}</p>
                            ) : (
                                <p className="font-semibold text-white">Drag & drop a surface file here, or click to select</p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleImport} disabled={!file || !name || isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Layers className="w-4 h-4 mr-2" />}
                        Import Surface
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SurfaceImportWizard;