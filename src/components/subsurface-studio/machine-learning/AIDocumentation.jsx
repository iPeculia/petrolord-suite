import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const AIDocumentation = () => {
    return (
        <ScrollArea className="h-full">
            <div className="space-y-4 p-1">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center text-slate-200"><Book className="w-4 h-4 mr-2 text-slate-400"/> AI Platform Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs text-slate-400">
                        <section>
                            <h4 className="font-bold text-slate-200 mb-1">Overview</h4>
                            <p>The EarthModel Studio AI platform provides a suite of tools for automated interpretation, predictive modeling, and advanced analytics.</p>
                        </section>
                        <section>
                            <h4 className="font-bold text-slate-200 mb-1">Best Practices</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Always validate auto-picked horizons visually in the 3D window.</li>
                                <li>Normalize well logs before running facies classification.</li>
                                <li>Use data augmentation for small training datasets to prevent overfitting.</li>
                            </ul>
                        </section>
                        <section>
                            <h4 className="font-bold text-slate-200 mb-1">Supported Models</h4>
                            <p>CNN (Seismic), LSTM (Production Forecasting), Random Forest (Lithology), XGBoost (Property Prediction).</p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default AIDocumentation;