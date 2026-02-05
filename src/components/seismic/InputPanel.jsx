import React from 'react';
    import { useDropzone } from 'react-dropzone';
    import { useToast } from '@/components/ui/use-toast';
    import { UploadCloud, Waves, Mountain, PenTool, Search, Download, Settings, FileText, Play } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Slider } from '@/components/ui/slider';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const InputPanel = ({
        onFileUpload,
        onLoadDemo,
        isLoading,
        seismicData,
        displayParams,
        setDisplayParams,
        slice,
        setSlice,
        interpretationMode,
        toggleInterpretationMode
    }) => {
        const { toast } = useToast();

        const onDrop = (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]);
            } else {
                toast({
                    title: "File type not supported",
                    description: "Please upload a .sgy or .segy file.",
                    variant: "destructive"
                });
            }
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: { 'application/x-segy': ['.sgy', '.segy'] },
            multiple: false,
            disabled: isLoading,
        });
        
        const handleNotImplemented = () => {
            toast({
                title: "🚧 Feature Not Implemented",
                description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
            });
        };

        return (
            <div className="h-full flex flex-col space-y-4 p-4 bg-slate-800/50 rounded-lg">
                <Card className="bg-white/5 border-white/10 text-white backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg"><FileText className="mr-2 text-cyan-300" />Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-amber-400 bg-amber-900/20' : 'border-gray-500 hover:border-amber-500'}`}>
                            <input {...getInputProps()} />
                            <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm font-semibold text-white">Upload SEG-Y File</p>
                            <p className="text-xs text-gray-400">Drag & drop or click</p>
                        </div>
                        <Button onClick={onLoadDemo} disabled={isLoading} className="w-full bg-indigo-500/80 hover:bg-indigo-500">
                            <Play className="mr-2 h-4 w-4" /> Load Demo Data
                        </Button>
                    </CardContent>
                </Card>

                {seismicData && (
                    <>
                        <Card className="bg-white/5 border-white/10 text-white backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg"><Settings className="mr-2 text-cyan-300" />Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="slice-type">Slice Type</Label>
                                    <Select value={slice.type} onValueChange={(v) => setSlice(p => ({...p, type: v, index: p.index }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inline">Inline</SelectItem>
                                            <SelectItem value="xline">Crossline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Slice Index: {slice.index}</Label>
                                    <Slider value={[slice.index]} onValueChange={(v) => setSlice(p => ({...p, index: v[0]}))} min={seismicData.inlineRange[0]} max={seismicData.inlineRange[1]} step={1} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gain: {displayParams.gain.toFixed(1)}</Label>
                                    <Slider value={[displayParams.gain]} onValueChange={(v) => setDisplayParams(p => ({...p, gain: v[0]}))} min={0.1} max={5} step={0.1} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Percentile Clip: {displayParams.pclip}%</Label>
                                    <Slider value={[displayParams.pclip]} onValueChange={(v) => setDisplayParams(p => ({...p, pclip: v[0]}))} min={80} max={100} step={1} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 text-white backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg"><PenTool className="mr-2 text-amber-300" />Interpretation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant={interpretationMode === 'Horizon' ? 'secondary' : 'outline'} className="w-full justify-start" onClick={() => toggleInterpretationMode('Horizon')}><Waves className="mr-2 h-4 w-4 text-blue-400" />Pick Horizon</Button>
                                <Button variant={interpretationMode === 'Fault' ? 'secondary' : 'outline'} className="w-full justify-start" onClick={() => toggleInterpretationMode('Fault')}><Mountain className="mr-2 h-4 w-4 text-red-400" />Pick Fault</Button>
                                <Button variant="outline" className="w-full justify-start mt-4" onClick={handleNotImplemented}><Download className="mr-2 h-4 w-4" />Export Picks</Button>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        );
    };

    export default InputPanel;