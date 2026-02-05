import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Play, RefreshCw, CheckCircle, XCircle, Plus } from 'lucide-react';

const MLModelManager = () => {
    const [models, setModels] = useState([
        { id: 1, name: 'Seismic Fault Detector v2', type: 'CNN', status: 'Ready', accuracy: '94.5%', lastTrained: '2025-11-20' },
        { id: 2, name: 'Permeability Predictor', type: 'XGBoost', status: 'Training', accuracy: '-', lastTrained: 'In Progress' },
        { id: 3, name: 'Lithology Classifier', type: 'Random Forest', status: 'Needs Retraining', accuracy: '78.2%', lastTrained: '2025-10-15' },
    ]);

    return (
        <div className="space-y-4 h-full overflow-y-auto p-1">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" /> Model Registry
                </h3>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4 mr-2" /> New Model</Button>
            </div>
            
            <Card className="bg-slate-950 border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                            <TableHead className="text-slate-400">Model Name</TableHead>
                            <TableHead className="text-slate-400">Type</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-slate-400">Accuracy</TableHead>
                            <TableHead className="text-slate-400">Last Trained</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {models.map(model => (
                            <TableRow key={model.id} className="border-slate-800 hover:bg-slate-900/50">
                                <TableCell className="font-medium text-slate-200">{model.name}</TableCell>
                                <TableCell className="text-slate-400">{model.type}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                                        ${model.status === 'Ready' ? 'border-green-500 text-green-400' : 
                                          model.status === 'Training' ? 'border-blue-500 text-blue-400 animate-pulse' : 
                                          'border-yellow-500 text-yellow-400'}
                                    `}>
                                        {model.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-300">{model.accuracy}</TableCell>
                                <TableCell className="text-slate-500 text-xs">{model.lastTrained}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-purple-400">
                                        <Play className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400">
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default MLModelManager;