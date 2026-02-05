import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockVideos } from '@/data/help/mockHelpData';
import { Play, Clock } from 'lucide-react';

const VideoTutorials = ({ searchQuery }) => {
    const filteredVideos = mockVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
                <Card key={video.id} className="bg-slate-900 border-slate-800 overflow-hidden group cursor-pointer">
                    <div className="relative aspect-video bg-slate-950">
                        <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            {video.duration}
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <div className="text-xs text-red-400 font-medium mb-1">{video.category}</div>
                        <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                            {video.title}
                        </h3>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default VideoTutorials;