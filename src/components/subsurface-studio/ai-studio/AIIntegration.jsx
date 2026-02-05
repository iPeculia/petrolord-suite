import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'lucide-react';

const AIIntegration = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Link className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">External Providers</h3>
            <p className="text-sm text-slate-500 mt-2">Connect OpenAI, Azure ML, AWS SageMaker.</p>
        </CardContent>
    </Card>
);

export default AIIntegration;