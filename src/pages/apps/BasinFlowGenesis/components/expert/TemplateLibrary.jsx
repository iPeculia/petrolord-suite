import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BasinTemplates } from '../../data/BasinTemplates';
import { BookOpen, ArrowRight, Copy } from 'lucide-react';
import { useBasinFlow } from '../../contexts/BasinFlowContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const TemplateLibrary = () => {
    const { dispatch } = useBasinFlow();
    const { toast } = useToast();

    const handleApplyTemplate = (template) => {
        // Convert template stratigraphy to project compatible layers
        const layers = template.defaultStratigraphy.map(l => ({
            ...l,
            id: uuidv4(),
            // Ensure required fields
            ageStart: l.ageStart || 0,
            ageEnd: l.ageEnd || 0,
            thickness: l.thickness || 0,
            lithology: l.lithology || 'shale',
            sourceRock: l.sourceRock || { isSource: false },
            color: '#888' // Should use helper ideally
        }));

        dispatch({ 
            type: 'LOAD_PROJECT', 
            payload: { 
                name: `${template.name} Basin Model`,
                stratigraphy: layers 
            } 
        });
        
        toast({ title: "Template Applied", description: `Loaded ${template.name} configuration.` });
    };

    return (
        <div className="h-full p-6 bg-slate-950 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-emerald-400" /> Template Library
                    </h2>
                    <p className="text-slate-400">Standard basin configurations to jumpstart your modeling.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BasinTemplates.map(t => (
                        <Card key={t.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group">
                            <div className="h-32 bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url(${t.image})` }} />
                            <CardHeader>
                                <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                                    {t.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-3 min-h-[3rem]">
                                    {t.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {t.useCases.slice(0,2).map((u, i) => (
                                        <span key={i} className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-500 border border-slate-800">
                                            {u}
                                        </span>
                                    ))}
                                </div>
                                <Button 
                                    className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-all"
                                    onClick={() => handleApplyTemplate(t)}
                                >
                                    Use Template <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {/* Custom Template Placeholder */}
                    <Card className="bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center min-h-[300px] hover:bg-slate-900/50 transition-colors cursor-pointer group">
                        <div className="p-4 bg-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Copy className="w-6 h-6 text-slate-500" />
                        </div>
                        <h3 className="text-slate-400 font-medium">Save Current as Template</h3>
                        <p className="text-xs text-slate-600 mt-2 max-w-[200px] text-center">
                            Create a custom template from your active project state.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TemplateLibrary;