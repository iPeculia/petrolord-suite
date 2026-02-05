import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MachineLearningService } from '@/services/fdp/MachineLearningService';

const PredictiveAnalyticsEngine = () => {
    const models = MachineLearningService.getAvailableModels();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model) => (
                    <Card key={model.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{model.name}</h3>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-400">{model.type}</Badge>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 h-10">{model.description}</p>
                            <Button variant="outline" className="w-full border-slate-700 text-blue-400 hover:bg-slate-800">
                                Configure Model
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white text-sm">Active Training Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500">
                        No active training jobs. Select a model to begin.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PredictiveAnalyticsEngine;