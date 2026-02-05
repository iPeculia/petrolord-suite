import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';

const RiskAssessmentPanel = () => {
    const { toast } = useToast();

    React.useEffect(() => {
        toast({
            title: "🚧 Feature In Development",
            description: "The Risk Assessment panel isn't fully implemented yet. You can request it in a future prompt! 🚀",
        });
    }, [toast]);
    
    return (
        <Card className="bg-slate-800/50 border-slate-700 h-full">
            <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-5/6 text-slate-400">
                <AlertCircle className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Risk Assessment Not Implemented</h3>
                <p className="text-center">This section will provide tools for assessing wellbore stability, sand production, and other risks.</p>
            </CardContent>
        </Card>
    );
};

export default RiskAssessmentPanel;