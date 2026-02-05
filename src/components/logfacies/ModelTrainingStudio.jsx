import React from 'react';
import { UploadCloud, PlayCircle, Target, CheckSquare, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ModelTrainingStudio = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Target className="w-5 h-5" />
                        Training Dataset
                    </CardTitle>
                    <CardDescription>Upload labeled data (Truth Logs) to fine-tune the model.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer bg-slate-950/30">
                        <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-300 font-medium">Drag & Drop Labeled LAS/CSV</p>
                        <p className="text-xs text-slate-500 mt-1">Must contain a 'FACIES' curve or equivalent categorical column</p>
                    </div>
                    
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Loaded Truth Logs</h4>
                        <div className="space-y-2">
                            <div className="bg-slate-950 rounded-lg p-3 text-sm text-slate-300 border border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-4 h-4 text-green-500" />
                                    <span>Well_A-01_Core_Interpreted.las</span>
                                </div>
                                <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-800">3,450 samples</Badge>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 text-sm text-slate-300 border border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileCheck className="w-4 h-4 text-green-500" />
                                    <span>Well_B-04_Expert_QC.csv</span>
                                </div>
                                <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-800">1,200 samples</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Training Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Validation Loss</span>
                                <span className="text-slate-200 font-mono">0.342</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Epochs</span>
                                <span className="text-slate-200">0 / 100</span>
                            </div>
                            <Progress value={0} className="h-2 mt-2" />
                         </div>
                         
                         <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                            <PlayCircle className="w-5 h-5 mr-2" /> Start Fine-Tuning
                         </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Model Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-center">
                                <div className="text-xs text-slate-500 uppercase mb-1">Accuracy</div>
                                <div className="text-xl font-bold text-slate-200">--%</div>
                            </div>
                            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-center">
                                <div className="text-xs text-slate-500 uppercase mb-1">F1-Score</div>
                                <div className="text-xl font-bold text-slate-200">--</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-slate-950 rounded border border-slate-800">
                            <div className="text-xs text-slate-500 uppercase mb-2">Feature Importance</div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400"><span>GR</span><span>--</span></div>
                                <div className="flex justify-between text-xs text-slate-400"><span>RHOB</span><span>--</span></div>
                                <div className="flex justify-between text-xs text-slate-400"><span>NPHI</span><span>--</span></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ModelTrainingStudio;