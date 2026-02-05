import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudio } from '@/contexts/StudioContext';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Map, BarChart3 as BarChart3D, Waypoints, AreaChart, FileText, Printer, Trash2, Plus, Settings, PanelLeftOpen, PanelLeftClose } from 'lucide-react';

import MapView from './MapView';
import ThreeDWindow from './ThreeDWindow';
import WellSectionView from './WellSectionView';
import CrossplotView from './CrossplotView';

const ItemTypes = {
    VIEW: 'view',
};

const DraggableSidebarItem = ({ type, icon, label }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.VIEW,
        item: { type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="flex flex-col items-center justify-center p-2 m-1 rounded-lg cursor-grab bg-slate-700 hover:bg-slate-600 transition-colors"
        >
            {icon}
            <span className="text-xs mt-1 text-center">{label}</span>
        </div>
    );
};

const CanvasView = ({ id, type, position, size, onResizeStop, onDragStop, onRemove, children }) => {
    return (
        <Rnd
            size={size}
            position={position}
            onDragStop={(e, d) => onDragStop(id, { x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
                onResizeStop(id, { width: ref.style.width, height: ref.style.height }, position);
            }}
            minWidth={200}
            minHeight={150}
            bounds="parent"
            className="border-2 border-slate-500 bg-slate-800 shadow-lg overflow-hidden"
        >
            <div className="w-full h-full relative">
                {children}
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6 z-20"
                    onClick={() => onRemove(id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Rnd>
    );
};

const PlottingStudioComponent = () => {
    const { toast } = useToast();
    const { visibleAssets, allAssets, allInterpretations } = useStudio();
    const [views, setViews] = useState([]);
    const [nextId, setNextId] = useState(1);
    const [isPanelOpen, setPanelOpen] = useState(true);
    const [pageSetup, setPageSetup] = useState({
        orientation: 'landscape',
        size: 'a4',
        title: 'My Plot',
    });
    const canvasRef = useRef(null);

    const handleDrop = useCallback((item, monitor) => {
        const offset = monitor.getClientOffset();
        const canvasBounds = canvasRef.current.getBoundingClientRect();
        const x = offset.x - canvasBounds.left;
        const y = offset.y - canvasBounds.top;

        const newView = {
            id: nextId,
            type: item.type,
            position: { x, y },
            size: { width: 400, height: 300 },
        };
        setViews((prevViews) => [...prevViews, newView]);
        setNextId(nextId + 1);
    }, [nextId]);

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.VIEW,
        drop: handleDrop,
    }));

    const handleResizeStop = (id, size, position) => {
        setViews((prevViews) =>
            prevViews.map((view) =>
                view.id === id ? { ...view, size, position } : view
            )
        );
    };

    const handleDragStop = (id, position) => {
        setViews((prevViews) =>
            prevViews.map((view) =>
                view.id === id ? { ...view, position } : view
            )
        );
    };

    const handleRemoveView = (id) => {
        setViews((prevViews) => prevViews.filter((view) => view.id !== id));
    };

    const handleExportPDF = async () => {
        toast({ title: 'Generating PDF...', description: 'This may take a moment.' });
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        try {
            const canvas = await html2canvas(canvasElement, {
                allowTaint: true,
                useCORS: true,
                backgroundColor: '#1e293b', // slate-800
                scale: 2,
            });
            const imgData = canvas.toDataURL('image/png');

            const { orientation, size } = pageSetup;
            const pdf = new jsPDF(orientation, 'mm', size);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${pageSetup.title.replace(/\s/g, '_')}.pdf`);
            toast({ title: 'PDF Exported Successfully!' });
        } catch (error) {
            console.error('PDF export failed:', error);
            toast({ variant: 'destructive', title: 'PDF Export Failed', description: error.message });
        }
    };

    const pageDimensions = {
        a4: { landscape: { width: '297mm', height: '210mm' }, portrait: { width: '210mm', height: '297mm' } },
        letter: { landscape: { width: '279mm', height: '216mm' }, portrait: { width: '216mm', height: '279mm' } },
    };

    const canvasStyle = pageDimensions[pageSetup.size][pageSetup.orientation];

    const renderViewComponent = (view) => {
        switch (view.type) {
            case 'map':
                return <MapView assets={visibleAssets} interpretations={allInterpretations} />;
            case '3d':
                return <ThreeDWindow visibleAssets={visibleAssets} allAssets={allAssets} />;
            case 'section':
                return <WellSectionView />;
            case 'crossplot':
                return <CrossplotView />;
            case 'text':
                return <div className="p-4"><Input defaultValue="Text Box" className="bg-transparent border-0 text-lg focus:ring-0" /></div>;
            default:
                return <div>Unknown View Type</div>;
        }
    };

    const sidebarItems = [
        { type: 'map', icon: <Map className="w-8 h-8 text-cyan-300" />, label: 'Map View' },
        { type: '3d', icon: <BarChart3D className="w-8 h-8 text-lime-300" />, label: '3D View' },
        { type: 'section', icon: <Waypoints className="w-8 h-8 text-amber-300" />, label: 'Section' },
        { type: 'crossplot', icon: <AreaChart className="w-8 h-8 text-rose-300" />, label: 'Crossplot' },
        { type: 'text', icon: <FileText className="w-8 h-8 text-slate-300" />, label: 'Text Box' },
    ];

    return (
        <div className="h-full w-full flex bg-slate-900 text-white">
            {isPanelOpen && (
                <div className="w-80 flex-shrink-0 bg-slate-800/50 p-2 flex flex-col border-r border-slate-700">
                    <h3 className="text-lg font-bold mb-2 p-2 flex items-center"><Settings className="w-5 h-5 mr-2" />Page Setup</h3>
                    <div className="space-y-4 p-2">
                        <div>
                            <Label htmlFor="plot-title">Plot Title</Label>
                            <Input id="plot-title" value={pageSetup.title} onChange={(e) => setPageSetup(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Page Size</Label>
                            <Select value={pageSetup.size} onValueChange={(v) => setPageSetup(p => ({ ...p, size: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a4">A4</SelectItem>
                                    <SelectItem value="letter">Letter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Orientation</Label>
                            <Select value={pageSetup.orientation} onValueChange={(v) => setPageSetup(p => ({ ...p, orientation: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="landscape">Landscape</SelectItem>
                                    <SelectItem value="portrait">Portrait</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold my-2 p-2 flex items-center"><Plus className="w-5 h-5 mr-2" />Add Views</h3>
                    <ScrollArea className="flex-grow">
                        <div className="grid grid-cols-2 gap-2 p-2">
                            {sidebarItems.map(item => <DraggableSidebarItem key={item.type} {...item} />)}
                        </div>
                    </ScrollArea>
                    <div className="p-2 mt-auto">
                        <Button onClick={handleExportPDF} className="w-full"><Printer className="w-4 h-4 mr-2" />Export to PDF</Button>
                    </div>
                </div>
            )}
            <div className="flex-grow relative">
                <Button variant="ghost" size="icon" className="absolute top-2 left-2 z-20 bg-slate-800/50 hover:bg-slate-700" onClick={() => setPanelOpen(p => !p)}>
                    {isPanelOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
                </Button>
                <ScrollArea className="w-full h-full p-8">
                    <div
                        ref={drop}
                        className="relative bg-slate-800 shadow-2xl mx-auto"
                        style={{ ...canvasStyle }}
                    >
                        <div ref={canvasRef} className="w-full h-full relative bg-slate-800">
                            <h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-white pointer-events-none">{pageSetup.title}</h1>
                            {views.map((view) => (
                                <CanvasView
                                    key={view.id}
                                    {...view}
                                    onResizeStop={handleResizeStop}
                                    onDragStop={handleDragStop}
                                    onRemove={handleRemoveView}
                                >
                                    {renderViewComponent(view)}
                                </CanvasView>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

const PlottingStudio = () => (
    <DndProvider backend={HTML5Backend}>
        <PlottingStudioComponent />
    </DndProvider>
);

export default PlottingStudio;