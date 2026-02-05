import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, GitMerge, Wand2 } from 'lucide-react';

const CrossSectionCorrelationPanel = ({ onAutoCorrelate }) => {
    return (
        <div className="space-y-4 p-4">
            <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">Correlation Tools</div>
            
            <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-3 space-y-2">
                    <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => onAutoCorrelate('formation')}>
                        <Wand2 className="w-3 h-3 mr-2 text-purple-400"/> Auto-Match Horizons
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                        <Link2 className="w-3 h-3 mr-2 text-blue-400"/> Connect Selected Tops
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                        <GitMerge className="w-3 h-3 mr-2 text-green-400"/> Flatten on Horizon
                    </Button>
                </CardContent>
            </Card>

            <div className="text-[10px] text-slate-500 italic">
                Select tops in the view to manually connect. Use 'Auto-Match' to suggest correlations based on depth and log signature.
            </div>
        </div>
    );
};

export default CrossSectionCorrelationPanel;