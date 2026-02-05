import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useResponsive } from './ResponsiveLayoutManager';

const ResponsiveTestingPanel = () => {
    const { width, height, isMobile, isTablet, isDesktop } = useResponsive();

    return (
        <Card className="bg-slate-950 border-slate-800 absolute top-4 right-4 z-50 w-64 opacity-50 hover:opacity-100 transition-opacity pointer-events-auto shadow-2xl">
            <CardHeader className="p-3 pb-0">
                <CardTitle className="text-xs text-slate-400">Viewport Debugger</CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-xs text-slate-200 font-mono space-y-1">
                <div className="flex justify-between">
                    <span>Width:</span> <span>{width}px</span>
                </div>
                <div className="flex justify-between">
                    <span>Height:</span> <span>{height}px</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 mt-1">
                    <span className={`flex items-center gap-1 ${isMobile ? 'text-green-400' : 'text-slate-600'}`}>
                        <Smartphone className="h-3 w-3"/> Mobile
                    </span>
                    <span className={`flex items-center gap-1 ${isTablet ? 'text-green-400' : 'text-slate-600'}`}>
                        <Tablet className="h-3 w-3"/> Tablet
                    </span>
                    <span className={`flex items-center gap-1 ${isDesktop ? 'text-green-400' : 'text-slate-600'}`}>
                        <Monitor className="h-3 w-3"/> Desktop
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResponsiveTestingPanel;