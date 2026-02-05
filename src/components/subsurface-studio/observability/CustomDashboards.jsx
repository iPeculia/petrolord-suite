import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';

const CustomDashboards = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <LayoutGrid className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Dashboard Builder</h3>
            <p className="text-sm text-slate-500 mt-2">Drag-and-drop widget configuration.</p>
        </CardContent>
    </Card>
);
export default CustomDashboards;