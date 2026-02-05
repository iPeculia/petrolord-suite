import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';
const CDNIntegration = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Globe className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">CDN Status</h3>
            <p className="text-sm text-slate-500 mt-2">Assets served via Cloudflare Edge.</p>
            <p className="text-xs text-green-400 mt-1">Hit Rate: 98.5%</p>
        </CardContent>
    </Card>
);
export default CDNIntegration;