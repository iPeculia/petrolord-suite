import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LifeBuoy } from 'lucide-react';

const ProductionSupport = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <LifeBuoy className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Support Desk</h3>
            <p className="text-sm text-slate-500 mt-2">Open Tickets: 4 (Low Priority).</p>
        </CardContent>
    </Card>
);
export default ProductionSupport;