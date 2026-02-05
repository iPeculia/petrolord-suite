import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Compass } from 'lucide-react';

const MobileNavigation = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Compass className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Navigation Structure</h3>
            <p className="text-sm text-slate-500 mt-2">Bottom Tab Bar + Drawer configuration.</p>
            <div className="mt-4 flex justify-center gap-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-slate-900 rounded border border-slate-800"></div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default MobileNavigation;