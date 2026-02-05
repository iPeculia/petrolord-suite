import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RecommendationEngine = ({ recommendations = [] }) => {
    const { toast } = useToast();

    if (recommendations.length === 0) {
        recommendations.push({
            id: 1,
            title: 'Suggested Mud Weight',
            description: 'Based on initial analysis, a mud weight of 9.8 ppg is recommended for the upper section.',
            confidence: 'high'
        });
    }

     const notImplemented = () => {
        toast({
            title: "🚧 Feature not implemented",
            description: "This feature isn't wired up yet. You can request it in your next prompt!",
        });
    }

    const ConfidenceBadge = ({ level }) => {
        const styles = {
            high: 'bg-green-500/20 text-green-400',
            medium: 'bg-yellow-500/20 text-yellow-400',
            low: 'bg-orange-500/20 text-orange-400',
        };
        return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[level]}`}>{level}</span>;
    };

    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center text-lg text-white">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400"/>
                    Automated Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recommendations.map(rec => (
                    <div key={rec.id} className="p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-slate-200">{rec.title}</h4>
                                <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                            </div>
                            <ConfidenceBadge level={rec.confidence} />
                        </div>
                         <div className="flex justify-end gap-2 mt-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={notImplemented}>
                                <X className="h-3 w-3 mr-1"/> Reject
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-green-400 hover:bg-green-500/10 hover:text-green-300" onClick={notImplemented}>
                                <Check className="h-3 w-3 mr-1"/> Accept
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default RecommendationEngine;