import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Scan } from 'lucide-react';

const ImageRecognition = () => {
    return (
        <div className="space-y-4 h-full p-1">
            <div className="border-2 border-dashed border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-950/50 hover:bg-slate-900/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mb-2 text-slate-600" />
                <p className="text-xs">Drag & Drop Seismic Images or Log Scans</p>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                         <ImageIcon className="w-4 h-4 text-purple-400" />
                         <span className="text-sm font-bold text-slate-200">Recent Scans</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-900 h-24 rounded flex items-center justify-center relative">
                            <Scan className="w-6 h-6 text-slate-700" />
                            <div className="absolute bottom-1 right-1 bg-green-900/80 text-green-400 text-[10px] px-1 rounded">Processed</div>
                        </div>
                         <div className="bg-slate-900 h-24 rounded flex items-center justify-center">
                            <Scan className="w-6 h-6 text-slate-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ImageRecognition;