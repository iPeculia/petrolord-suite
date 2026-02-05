import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContextualHelpAssistant = () => {
  return (
    <Card className="bg-blue-950/90 border-blue-800 shadow-lg backdrop-blur-sm w-64">
        <CardContent className="p-3 relative">
            <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-5 w-5 text-blue-400 hover:text-white hover:bg-blue-900/50">
                <X className="w-3 h-3" />
            </Button>
            <div className="flex gap-3">
                <div className="mt-1">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-blue-100">AI Tip</h4>
                    <p className="text-[10px] text-blue-200/80 mt-1 leading-tight">
                        It looks like you're editing the salt layer. Try using a Constant Velocity model for better results in this section.
                    </p>
                    <Button variant="link" className="h-auto p-0 text-[10px] text-white underline mt-2">
                        Apply Constant V
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default ContextualHelpAssistant;