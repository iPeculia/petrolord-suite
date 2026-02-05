import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { fiscalTemplates } from '@/utils/fiscalTemplates';

    const TemplateSelector = ({ isOpen, onOpenChange, onSelectTemplate }) => {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[625px] bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-lime-300">Fiscal Regime Templates</DialogTitle>
              <DialogDescription className="text-gray-400">
                Select a country template to quickly load a common fiscal regime. You can edit it afterward.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fiscalTemplates.map((template, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                    </div>
                    <Button 
                      onClick={() => onSelectTemplate(template)} 
                      className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Apply Template
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      );
    };

    export default TemplateSelector;