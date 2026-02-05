import React, { useEffect } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const ReviewStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { projectDetails, template, inputs } = state;

    useEffect(() => {
        dispatch({ type: 'SET_VALIDATION', payload: { step: 6, isValid: true } });
    }, [dispatch]);

    const ReviewItem = ({ title, value, status }) => (
        <div className="flex justify-between items-center py-3 px-4 bg-slate-800/50 rounded-md">
            <span className="text-slate-300">{title}</span>
            <div className="flex items-center gap-2">
                <span className="text-slate-100 font-medium truncate max-w-[200px]">{value}</span>
                {status === 'ok' && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
        </div>
    );
    
    return (
        <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Review Your Inputs</CardTitle>
                    <CardDescription className="text-slate-400">
                        Please confirm all inputs are correct before running the calculation. You can go back to any previous step to make changes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Project Setup</h3>
                        <div className="space-y-2">
                            <ReviewItem title="Project Name" value={projectDetails.name} status="ok" />
                            <ReviewItem title="Template" value={template?.name || 'N/A'} status="ok" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Data Inputs</h3>
                         <div className="space-y-2">
                            <ReviewItem title="Log File" value={inputs.logs ? 'Loaded' : 'Missing'} status={inputs.logs ? 'ok' : 'bad'} />
                            <ReviewItem title="Curves Mapped" value={`${Object.values(inputs.curveMap).filter(Boolean).length} curves`} status="ok" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">Parameters</h3>
                         <div className="space-y-2">
                            {/* This would be populated from state */}
                            <ReviewItem title="Poisson's Ratio" value="0.25 (default)" status="ok" />
                            <ReviewItem title="Friction Angle" value="30° (default)" status="ok" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewStep;