import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Camera, MapPin } from 'lucide-react';

const NativeIntegration = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-pink-400" /> Native Capabilities
        </h3>
        <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                <div className="flex items-center gap-3">
                    <Camera className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">Camera Access</span>
                </div>
                <span className="text-xs text-green-400">Granted</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">Geolocation</span>
                </div>
                <span className="text-xs text-green-400">When In Use</span>
            </div>
        </div>
    </div>
);

export default NativeIntegration;