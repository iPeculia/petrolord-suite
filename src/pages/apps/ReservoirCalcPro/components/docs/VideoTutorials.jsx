import React from 'react';
import { PlayCircle } from 'lucide-react';

const VideoTutorials = () => (
    <div className="space-y-6">
        <h1>Video Tutorials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Getting Started', 'Importing Surfaces', 'Creating Polygons', 'Advanced Integration'].map(title => (
                <div key={title} className="aspect-video bg-slate-900 rounded border border-slate-800 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-colors">
                    <PlayCircle className="w-12 h-12 text-slate-600 group-hover:text-blue-500 mb-2" />
                    <span className="text-slate-400 group-hover:text-white font-medium">{title}</span>
                </div>
            ))}
        </div>
    </div>
);

export default VideoTutorials;