import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

const VideoTutorialLibrary = () => {
  const videos = [
    { title: "Getting Started in 5 Minutes", duration: "5:30", thumb: "bg-blue-900/20" },
    { title: "Building Your First Model", duration: "12:45", thumb: "bg-purple-900/20" },
    { title: "Advanced Anisotropy Workflow", duration: "22:10", thumb: "bg-emerald-900/20" },
    { title: "Exporting to Petrel & Kingdom", duration: "8:15", thumb: "bg-orange-900/20" },
    { title: "Handling Multi-Z Layers", duration: "15:00", thumb: "bg-red-900/20" },
    { title: "Collaboration Features Overview", duration: "6:50", thumb: "bg-cyan-900/20" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">Video Tutorials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((vid, i) => (
                <Card key={i} className="bg-slate-900 border-slate-800 cursor-pointer group overflow-hidden">
                    <div className={`h-32 w-full ${vid.thumb} flex items-center justify-center relative`}>
                        <PlayCircle className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300" />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                            {vid.duration}
                        </span>
                    </div>
                    <CardContent className="p-3">
                        <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{vid.title}</h4>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default VideoTutorialLibrary;