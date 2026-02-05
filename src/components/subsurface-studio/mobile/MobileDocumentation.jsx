import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabletSmartphone, WifiOff, Fingerprint } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const MobileDocumentation = () => {
    return (
        <ScrollArea className="h-full p-4 bg-slate-950">
            <div className="space-y-4 max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Mobile Optimization Guide</h1>
                    <p className="text-slate-400">Using EarthModel Studio on touch devices.</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-200 flex items-center">
                            <Fingerprint className="mr-2 text-cyan-400" /> Touch Gestures
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-slate-400">
                        <p><strong className="text-white">One Finger Pan:</strong> Rotate 3D models or pan maps.</p>
                        <p><strong className="text-white">Two Finger Pinch:</strong> Zoom in/out of views.</p>
                        <p><strong className="text-white">Double Tap:</strong> Reset camera view or center map.</p>
                        <p><strong className="text-white">Long Press:</strong> Open context menus for data points.</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-200 flex items-center">
                            <WifiOff className="mr-2 text-orange-400" /> Offline Mode (PWA)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-400">
                        <p>Install the app to your home screen to enable basic offline capabilities. Cached projects can be viewed without an internet connection.</p>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default MobileDocumentation;