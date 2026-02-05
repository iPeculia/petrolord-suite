import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Youtube, HelpCircle, ExternalLink, Keyboard } from 'lucide-react';

const MBHelpPanel = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] bg-slate-950 border-slate-800 text-slate-200 flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" /> Help & Documentation
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-6">
                
                {/* Quick Start */}
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Book className="w-4 h-4" /> Quick Start
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="font-semibold text-blue-400 mb-2">1. Import Data</div>
                            <p className="text-xs text-slate-400">
                                Start by importing your production history, pressure data, and PVT tables using the Import panel on the left.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="font-semibold text-blue-400 mb-2">2. Configure Tank</div>
                            <p className="text-xs text-slate-400">
                                Set reservoir properties like Porosity, Saturation, and Compressibility in the Tank Setup form.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="font-semibold text-blue-400 mb-2">3. Run Diagnostics</div>
                            <p className="text-xs text-slate-400">
                                Use the Diagnostics tab to identify the drive mechanism (Volumetric, Water Drive, Gas Cap) using Campbell plots.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="font-semibold text-blue-400 mb-2">4. Forecast</div>
                            <p className="text-xs text-slate-400">
                                Generate production forecasts and predict pressure decline in the Forecast & Scenarios tab.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Accordion */}
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Common Questions
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-slate-800">
                            <AccordionTrigger className="text-sm hover:no-underline hover:text-blue-400">How do I format my CSV files?</AccordionTrigger>
                            <AccordionContent className="text-xs text-slate-400">
                                Ensure your CSV files have the correct headers. You can download sample templates from the Data Import panel. Date formats should be YYYY-MM-DD.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-slate-800">
                            <AccordionTrigger className="text-sm hover:no-underline hover:text-blue-400">Why is my simulation not converging?</AccordionTrigger>
                            <AccordionContent className="text-xs text-slate-400">
                                Check for outliers in your pressure data. Large fluctuations can cause regression errors. Use the Data Quality panel to identify issues.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-slate-800">
                            <AccordionTrigger className="text-sm hover:no-underline hover:text-blue-400">Can I export the results?</AccordionTrigger>
                            <AccordionContent className="text-xs text-slate-400">
                                Yes, go to the "Export & Links" tab to download charts as images and data tables as CSV/Excel files.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Keyboard Shortcuts */}
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Keyboard className="w-4 h-4" /> Shortcuts
                    </h3>
                    <div className="bg-slate-900 rounded border border-slate-800 overflow-hidden">
                        <div className="grid grid-cols-2 border-b border-slate-800 p-2 bg-slate-900/50 text-xs font-semibold text-slate-500">
                            <div>Action</div>
                            <div>Shortcut</div>
                        </div>
                        <div className="grid grid-cols-2 p-2 text-xs text-slate-300 border-b border-slate-800/50">
                            <div>Save Project</div>
                            <div className="font-mono">Ctrl + S</div>
                        </div>
                        <div className="grid grid-cols-2 p-2 text-xs text-slate-300 border-b border-slate-800/50">
                            <div>New Project</div>
                            <div className="font-mono">Ctrl + N</div>
                        </div>
                        <div className="grid grid-cols-2 p-2 text-xs text-slate-300 border-b border-slate-800/50">
                            <div>Open Project</div>
                            <div className="font-mono">Ctrl + O</div>
                        </div>
                        <div className="grid grid-cols-2 p-2 text-xs text-slate-300">
                            <div>Help</div>
                            <div className="font-mono">Ctrl + H</div>
                        </div>
                    </div>
                </section>

                {/* External Resources */}
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Resources
                    </h3>
                    <div className="flex gap-4">
                        <a href="#" className="flex items-center gap-2 text-xs text-blue-400 hover:underline">
                            <Youtube className="w-4 h-4" /> Video Tutorials
                        </a>
                        <a href="#" className="flex items-center gap-2 text-xs text-blue-400 hover:underline">
                            <Book className="w-4 h-4" /> Full Documentation
                        </a>
                    </div>
                </section>

            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MBHelpPanel;