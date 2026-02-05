import React from 'react';
import { useResponsive } from './ResponsiveLayoutManager';
import { Card } from '@/components/ui/card';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MobileViewWrapper = ({ children, title, tools }) => {
    const { isMobile } = useResponsive();
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    if (!isMobile) return children;

    const toggleFullscreen = () => {
        const elem = document.getElementById('mobile-view-container');
        if (!document.fullscreenElement) {
            elem?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div id="mobile-view-container" className={`relative h-full w-full flex flex-col bg-black ${isFullscreen ? 'p-0' : ''}`}>
            {/* Mobile Toolbar Overlay */}
            <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-white shadow-lg">
                    {title}
                </div>
                <div className="pointer-events-auto flex gap-2">
                    {tools}
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg bg-slate-900/80 border border-slate-700" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-grow relative overflow-hidden touch-none">
                {children}
            </div>
        </div>
    );
};

export default MobileViewWrapper;