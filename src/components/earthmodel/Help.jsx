import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, FileText } from 'lucide-react';
import { helpContent } from '@/utils/help/helpContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 border-l border-slate-800 text-slate-100 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500"/> Help & Documentation
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            {helpContent.overview.content}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Modules</h3>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(helpContent.modules).map(([key, module]) => (
              <AccordionItem key={key} value={key} className="border-slate-800">
                <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline">
                  {module.title}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  {module.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6">
           <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Resources</h3>
           <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                 <FileText className="mr-2 h-4 w-4" /> Quick Start Guide
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                 <FileText className="mr-2 h-4 w-4" /> API Reference
              </Button>
           </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Help;