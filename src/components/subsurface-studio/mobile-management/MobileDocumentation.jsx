import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

const MobileDocumentation = () => (
    <ScrollArea className="h-full p-4 text-slate-300 text-sm leading-relaxed bg-slate-950 rounded-lg border border-slate-800">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-400" /> Mobile Dev Guide
        </h1>
        <p className="mb-4">
            Guidelines for developing responsive, touch-friendly interfaces for EarthModel Studio.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Key Principles</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Touch Targets:</strong> Minimum 44x44px.</li>
            <li><strong>Gestures:</strong> Use `TouchGestureHandler` for complex interactions.</li>
            <li><strong>Layout:</strong> Use `ResponsiveLayoutManager` for adaptive UI.</li>
        </ul>
    </ScrollArea>
);

export default MobileDocumentation;