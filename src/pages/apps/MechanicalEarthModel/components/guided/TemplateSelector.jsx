import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const TemplateSelector = ({ templates, selectedTemplate, onSelectTemplate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
                <Card 
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className={cn(
                        "cursor-pointer bg-slate-800 border-slate-700 hover:border-blue-500 transition-all transform hover:-translate-y-1",
                        selectedTemplate?.id === template.id && "border-blue-500 ring-2 ring-blue-500"
                    )}
                >
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                            {selectedTemplate?.id === template.id ? (
                                <CheckCircle className="text-blue-500 h-6 w-6" />
                            ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-slate-500"></div>
                            )}
                        </div>
                        <CardDescription className="text-slate-400 pt-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Recommended For:</h4>
                        <ul className="space-y-1 text-xs text-slate-400">
                            {template.useCases.map((useCase, i) => (
                                <li key={i} className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                    {useCase}
                                </li>
                            ))}
                            {template.id === 'custom' && (
                                 <li className="flex items-center">
                                    <SlidersHorizontal className="h-3 w-3 mr-2 text-orange-400" />
                                    Full manual control
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TemplateSelector;