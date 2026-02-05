import React, { useEffect } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import TemplateSelector from '../TemplateSelector';
import { templates } from '../../TemplateData';

const TemplateSelectorStep = () => {
    const { state, dispatch } = useGuidedMode();

    const handleSelectTemplate = (template) => {
        dispatch({ type: 'SET_TEMPLATE', payload: template });
    };

    useEffect(() => {
        const isValid = state.template !== null;
        dispatch({ type: 'SET_VALIDATION', payload: { step: 1, isValid } });
    }, [state.template, dispatch]);

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Select a Project Template</CardTitle>
                    <CardDescription className="text-slate-400">
                        Choose a template that best matches your project environment. This will set initial parameters which you can adjust later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TemplateSelector
                        templates={templates}
                        selectedTemplate={state.template}
                        onSelectTemplate={handleSelectTemplate}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default TemplateSelectorStep;