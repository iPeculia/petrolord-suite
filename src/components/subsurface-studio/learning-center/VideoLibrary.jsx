import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Play } from 'lucide-react';

const VideoLibrary = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Video className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Video Assets</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
                {[1,2,3].map(i => (
                    <div key={i} className="aspect-video bg-slate-900 rounded border border-slate-800 flex items-center justify-center group cursor-pointer">
                        <Play className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);
export default VideoLibrary;