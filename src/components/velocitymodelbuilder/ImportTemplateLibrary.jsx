import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileQuestion } from 'lucide-react';

const ImportTemplateLibrary = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
        <CardHeader className="pb-3 border-b border-slate-800">
             <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" /> Import Templates & Guides
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="petrel" className="border-b border-slate-800 px-4">
                    <AccordionTrigger className="text-xs text-slate-300 hover:text-white py-3">Petrel Import Guide</AccordionTrigger>
                    <AccordionContent className="text-xs text-slate-400 pb-4">
                        <p className="mb-2">To import velocity functions into Petrel:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Export file as <strong>ASCII (.txt)</strong></li>
                            <li>In Petrel, right click 'Velocity Models' folder</li>
                            <li>Select 'Import (on selection)...'</li>
                            <li>Choose 'Petrel Velocity Function ASCII'</li>
                            <li>Map columns: Well, X, Y, V0, k</li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="kingdom" className="border-b border-slate-800 px-4">
                    <AccordionTrigger className="text-xs text-slate-300 hover:text-white py-3">Kingdom T-D Charts</AccordionTrigger>
                    <AccordionContent className="text-xs text-slate-400 pb-4">
                        <p className="mb-2">Format requirements for Kingdom:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Use 'Shared Time-Depth' format.</li>
                            <li>Ensure Datum matches project datum.</li>
                            <li>Time in milliseconds (Two-Way Time).</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="formats" className="border-b border-slate-800 px-4">
                    <AccordionTrigger className="text-xs text-slate-300 hover:text-white py-3">Supported Formats</AccordionTrigger>
                    <AccordionContent className="text-xs text-slate-400 pb-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-950 p-2 rounded">LAS 2.0</div>
                            <div className="bg-slate-950 p-2 rounded">ZMap+</div>
                            <div className="bg-slate-950 p-2 rounded">GeoTIFF</div>
                            <div className="bg-slate-950 p-2 rounded">NetCDF</div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileQuestion className="w-4 h-4" />
                    <span>Need a custom format? Contact Support.</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default ImportTemplateLibrary;