import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Maximize2, 
    Minimize2, 
    LayoutTemplate, 
    Box, 
    Map as MapIcon, 
    Save, 
    GalleryHorizontalEnd,
    AlertCircle
} from 'lucide-react';
import { useReservoirCalc } from '../contexts/ReservoirCalcContext';
import ContourMapViewer from './tools/ContourMapViewer';
import PaintedSurfaceViewer from './tools/PaintedSurfaceViewer';
import MapGallery from './gallery/MapGallery';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapStorageService } from '../services/MapStorageService';
import { useToast } from '@/components/ui/use-toast';
import { SurfaceInterpolator } from '../services/SurfaceInterpolator';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Visualization Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 text-slate-400 p-6 text-center border border-red-900/30 rounded m-2">
                    <AlertCircle className="w-8 h-8 mb-3 text-red-500" />
                    <h3 className="text-sm font-medium text-red-400">Visualization Error</h3>
                    <p className="text-xs mt-1 mb-4 max-w-xs opacity-70">{this.state.error?.message || "Something went wrong rendering the view."}</p>
                    <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false })} className="h-7 text-xs border-slate-700">
                        Retry
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}

const ExpertVisPanel = () => {
    const { state, getActiveSurface } = useReservoirCalc();
    const { toast } = useToast();
    
    const [viewMode, setViewMode] = useState('split'); 
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Robust Data Extraction
    const activeSurface = getActiveSurface ? getActiveSurface() : null;
    
    const gridData = useMemo(() => {
        if (!activeSurface) return null;
        
        // Check for valid grid if it already exists
        if (activeSurface.grid && activeSurface.grid.z && activeSurface.grid.z.length > 0) {
            return activeSurface.grid;
        }
        
        // If no grid but points exist, generate grid on-the-fly for visualization
        if (activeSurface.points && activeSurface.points.length > 0) {
            try {
                console.log(`Generating visualization grid for ${activeSurface.name} (${activeSurface.points.length} pts)`);
                const interp = new SurfaceInterpolator(activeSurface.points);
                // Use 80x80 resolution for quick interactive visualization
                return interp.generateGrid(80);
            } catch (err) {
                console.error("On-the-fly grid generation failed:", err);
                return null;
            }
        }
        
        return null;
    }, [activeSurface]);

    const unitSystem = state.unitSystem || 'field';

    const handleSaveView = async () => {
        if (!activeSurface || !gridData) return;
        try {
            await MapStorageService.saveMap({
                name: `${activeSurface.name} - ${viewMode.toUpperCase()}`,
                type: viewMode === '3d' ? '3d' : '2d',
                surfaceId: activeSurface.id,
                surfaceName: activeSurface.name,
                data: gridData,
                unitSystem,
                inputs: { ...state.inputs }
            });
            toast({ title: "View Saved", description: "Visualization saved to Gallery." });
        } catch (error) {
            console.error("Save error:", error);
            toast({ variant: "destructive", title: "Save Failed", description: "Could not save view." });
        }
    };

    const toggleFullscreen = () => {
        const elem = document.getElementById('vis-panel-container');
        if (!document.fullscreenElement) {
            elem?.requestFullscreen().catch(err => console.error(err));
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(err => console.error(err));
            setIsFullscreen(false);
        }
    };

    return (
        <div 
            id="vis-panel-container" 
            className={`flex flex-col w-full h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-inner transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : ''}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 h-12 shrink-0">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        Visualization
                        {activeSurface && <span className="text-xs font-normal text-slate-500 px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700 max-w-[150px] truncate">{activeSurface.name}</span>}
                    </h3>
                    
                    <div className="h-6 w-px bg-slate-800 mx-2" />
                    
                    <div className="flex bg-slate-800 rounded-md p-0.5 border border-slate-700">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className={`h-7 w-8 p-0 rounded-sm ${viewMode === '2d' ? 'bg-slate-700 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                        onClick={() => setViewMode('2d')}
                                    >
                                        <MapIcon className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>2D Map View</p></TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className={`h-7 w-8 p-0 rounded-sm ${viewMode === 'split' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                        onClick={() => setViewMode('split')}
                                    >
                                        <LayoutTemplate className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Split View</p></TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className={`h-7 w-8 p-0 rounded-sm ${viewMode === '3d' ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                        onClick={() => setViewMode('3d')}
                                    >
                                        <Box className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>3D Model View</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <Button 
                        variant="ghost" size="sm" 
                        className="h-7 w-7 p-0 text-slate-400 hover:text-white ml-1" 
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" size="sm" 
                        className="h-8 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => setIsGalleryOpen(true)}
                    >
                        <GalleryHorizontalEnd className="w-3.5 h-3.5 mr-1.5" /> Gallery
                    </Button>
                    <Button 
                        variant="outline" size="sm" 
                        className="h-8 text-xs border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-emerald-400"
                        onClick={handleSaveView}
                        disabled={!gridData}
                    >
                        <Save className="w-3.5 h-3.5 mr-1.5" /> Save View
                    </Button>
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden">
                <ErrorBoundary>
                    {!activeSurface ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800">
                                <Box className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm font-medium">No Surface Selected</p>
                            <p className="text-xs mt-1 opacity-70">Select a surface from the library to visualize</p>
                        </div>
                    ) : !gridData ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-600/70">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p className="text-sm font-medium">Processing Data...</p>
                            <p className="text-xs mt-1 max-w-[200px] text-center opacity-80">
                                Grid generation in progress. Large surfaces may take a moment.
                            </p>
                        </div>
                    ) : (
                        <>
                            {viewMode === '2d' && (
                                <div className="w-full h-full">
                                    <ContourMapViewer gridData={gridData} unitSystem={unitSystem} />
                                </div>
                            )}
                            
                            {viewMode === '3d' && (
                                <div className="w-full h-full">
                                    <PaintedSurfaceViewer gridData={gridData} unitSystem={unitSystem} />
                                </div>
                            )}

                            {viewMode === 'split' && (
                                <div className="w-full h-full flex flex-col md:flex-row">
                                    <div className="flex-1 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-slate-800 relative">
                                        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-slate-950/50 backdrop-blur px-2 py-0.5 rounded text-[10px] text-blue-400 font-medium border border-slate-800">Structure Map</div>
                                        <ContourMapViewer gridData={gridData} unitSystem={unitSystem} />
                                    </div>
                                    <div className="flex-1 h-1/2 md:h-full relative">
                                        <div className="absolute top-3 left-3 z-10 pointer-events-none bg-slate-950/50 backdrop-blur px-2 py-0.5 rounded text-[10px] text-emerald-400 font-medium border border-slate-800">3D Model</div>
                                        <PaintedSurfaceViewer gridData={gridData} unitSystem={unitSystem} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </ErrorBoundary>
            </div>

            <MapGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
        </div>
    );
};

export default ExpertVisPanel;