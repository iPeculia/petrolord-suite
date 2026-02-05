import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileText, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SurfaceImportDialog = ({ open, onOpenChange, onImport }) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [importData, setImportData] = useState({
        name: '',
        format: 'xyz',
        rawData: '',
        file: null
    });
    const [isParsing, setIsParsing] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImportData({ ...importData, file, name: file.name.split('.')[0] });
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImportData(prev => ({ ...prev, rawData: ev.target.result }));
            };
            reader.readAsText(file);
        }
    };

    const parseData = async () => {
        setIsParsing(true);
        try {
            // Simulated parsing logic
            const lines = importData.rawData.split('\n').filter(l => l.trim().length > 0);
            if (lines.length < 3) throw new Error("File too short or empty");

            // Mock points for demo
            const points = lines.slice(0, 100).map(line => {
                const parts = line.trim().split(/[\s,]+/);
                return { x: parseFloat(parts[0]), y: parseFloat(parts[1]), z: parseFloat(parts[2]) };
            }).filter(p => !isNaN(p.z));

            const zValues = points.map(p => p.z);
            const minZ = Math.min(...zValues);
            const maxZ = Math.max(...zValues);

            const surface = {
                id: crypto.randomUUID(),
                name: importData.name || 'Imported Surface',
                format: importData.format,
                points: points,
                minZ,
                maxZ,
                pointCount: lines.length,
                createdAt: new Date().toISOString()
            };

            onImport(surface);
            onOpenChange(false);
            setStep(1);
            setImportData({ name: '', format: 'xyz', rawData: '', file: null });
            
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Parse Error", description: "Could not parse surface file. Ensure XYZ format." });
        } finally {
            setIsParsing(false);
        }
    };

    // FIX: Use simple conditionals instead of mapping step objects to avoid "isActive" errors
    // This is much safer than a complex stepper component
    const renderStepContent = () => {
        if (step === 1) {
            return (
                <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleFileChange}
                            accept=".txt,.csv,.dat,.xyz"
                        />
                        <UploadCloud className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                        <p className="text-sm text-slate-300 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">Supported: XYZ, CSV, CPS-3</p>
                    </div>
                    
                    {importData.file && (
                        <div className="flex items-center p-2 bg-slate-800 rounded border border-slate-700">
                            <FileText className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-sm truncate flex-1">{importData.file.name}</span>
                            <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Surface Name</Label>
                        <Input 
                            value={importData.name} 
                            onChange={e => setImportData({...importData, name: e.target.value})}
                            placeholder="e.g. Top Reservoir"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Format</Label>
                        <Tabs value={importData.format} onValueChange={v => setImportData({...importData, format: v})}>
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="xyz">XYZ (Grid)</TabsTrigger>
                                <TabsTrigger value="cps3">CPS-3</TabsTrigger>
                                <TabsTrigger value="zmap">ZMap</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Surface</DialogTitle>
                </DialogHeader>
                
                {renderStepContent()}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button 
                        onClick={parseData} 
                        disabled={!importData.file || !importData.name || isParsing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isParsing ? "Importing..." : "Import Surface"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SurfaceImportDialog;