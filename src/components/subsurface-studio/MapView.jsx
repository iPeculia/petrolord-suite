import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip as LeafletTooltip, useMap, useMapEvents, FeatureGroup, Polyline } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';

import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Layers, Compass, Ruler, ChevronRight, Settings, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useStudio } from '@/contexts/StudioContext';

// Sub-components
import MapFaultTracesLayer from './MapFaultTracesLayer';
import MapHorizonContoursLayer from './MapHorizonContoursLayer';
import MapGridOutlineLayer from './MapGridOutlineLayer';
import MapSeismicLinesLayer from './MapSeismicLinesLayer';
import MapLayerManager from './MapLayerManager';
import MapCartographyControls from './MapCartographyControls';
import MapMeasurementTools from './MapMeasurementTools';
import MapExportControls from './MapExportControls';

if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
    try {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    } catch (e) { console.warn("Leaflet icon fix failed", e); }
}

// --- Cross Section Layer ---
const CrossSectionLayer = ({ sectionLine }) => {
    if (!sectionLine || sectionLine.length < 2) return null;
    const positions = sectionLine.map(p => [p.y, p.x]); // {x,y} -> [lat, lng]
    
    return (
        <FeatureGroup>
            <Polyline positions={positions} color="#A78BFA" weight={4} dashArray="5, 10" />
            {positions.map((p, i) => (
                <Marker key={i} position={p} icon={L.divIcon({ className: 'bg-purple-500 rounded-full w-3 h-3 border-2 border-white shadow-sm' })} />
            ))}
        </FeatureGroup>
    );
};

class LocalMapErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Map Internal Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-900/90 text-white p-4 text-center backdrop-blur-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold">Map Rendering Error</h3>
          <Button onClick={() => this.setState({ hasError: false })} variant="outline" className="border-red-500 text-red-500 mt-4">Reload Map</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ... [Existing Helper Components: MapController, CoordinatesDisplay, MeasurementLayer] ...
const MapController = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (map && bounds && bounds.isValid()) {
            try { map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 }); } catch(e) { console.warn("FitBounds error", e); }
        }
    }, [bounds, map]);
    return null;
};

const CoordinatesDisplay = () => {
    const [coords, setCoords] = useState({ lat: 0, lng: 0 });
    useMapEvents({ mousemove(e) { if(e && e.latlng) setCoords(e.latlng); } });
    return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-[10px] text-slate-300 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-700 z-[400] font-mono shadow-lg flex gap-4 pointer-events-none">
            <span>Lat: {(coords?.lat || 0).toFixed(6)}</span><span>Lng: {(coords?.lng || 0).toFixed(6)}</span>
        </div>
    );
};

const MeasurementLayer = ({ activeTool, points, setPoints }) => {
    useMapEvents({ click(e) { if (activeTool !== 'none' && e?.latlng) setPoints(prev => [...(prev || []), e.latlng]); } });
    if (!points || points.length === 0) return null;
    return (
        <FeatureGroup>
            {points.map((p, i) => <Marker key={i} position={p} icon={L.divIcon({ className: 'bg-yellow-400 rounded-full w-3 h-3 border-2 border-black shadow-sm' })} />)}
            {activeTool === 'dist' && points.length > 1 && <Polyline positions={points} color="#EAB308" dashArray="5, 10" weight={3} />}
            {activeTool === 'area' && points.length > 2 && <L.Polygon positions={points} color="#EAB308" fillColor="#EAB308" fillOpacity={0.2} />}
        </FeatureGroup>
    );
};

const MapView = ({ projectId, assets = [], interpretations = [], baseMapLayer: initialBaseMap, setBaseMapLayer, onSaveInterpretation, style }) => {
    const { toast } = useToast();
    const { selectAssetAndParentWell, setActiveTab, selectedAsset } = useStudio();
    
    const [activeBaseMap, setActiveBaseMap] = useState(initialBaseMap || 'OSM');
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [mapInstance, setMapInstance] = useState(null);

    const [layers, setLayers] = useState({
        wells: { visible: true, opacity: 1 },
        faults: { visible: true, opacity: 1, color: '#DC2626' },
        horizons: { visible: true, opacity: 0.8, color: '#10B981' },
        seismic: { visible: true, opacity: 0.9, color: '#F59E0B' },
        grid: { visible: true, opacity: 0.5, color: '#6366F1' },
        drawings: { visible: true, opacity: 1, color: '#EAB308' },
        section: { visible: true, opacity: 1 } // New layer
    });

    const [mapSettings, setMapSettings] = useState({ showGrid: false, showNorth: true, showScale: true, showLabels: true });
    const [measureTool, setMeasureTool] = useState('none'); 
    const [measurePoints, setMeasurePoints] = useState([]);

    // Derive Active Section Line from Selection if applicable
    const activeSectionLine = useMemo(() => {
        if (selectedAsset?.type === 'cross-section' && selectedAsset.meta?.points) {
            return selectedAsset.meta.points;
        }
        return null;
    }, [selectedAsset]);

    const safeAssets = Array.isArray(assets) ? assets : [];
    const safeInterps = Array.isArray(interpretations) ? interpretations : [];

    const wells = useMemo(() => safeAssets.filter(a => a?.type === 'well' && Array.isArray(a.meta?.location)), [safeAssets]);
    const seismicLines = useMemo(() => safeAssets.filter(a => (a?.type === 'seismic' || a?.type === 'seis.volume' || a?.type === 'seis.line') && a?.meta?.geojson), [safeAssets]);
    const grids = useMemo(() => safeAssets.filter(a => a?.type === 'grid' && a?.meta?.geojson), [safeAssets]);
    const faults = useMemo(() => safeInterps.filter(i => i?.kind === 'fault' && i?.geojson), [safeInterps]);
    const horizons = useMemo(() => safeInterps.filter(i => (i?.kind === 'horizon' || i?.kind === 'surface') && i?.geojson), [safeInterps]);

    const mapBounds = useMemo(() => {
        try {
            if (wells.length === 0 && seismicLines.length === 0 && faults.length === 0) return null;
            const latLngs = [];
            wells.forEach(w => latLngs.push(w.meta.location));
            if (latLngs.length === 0) return null;
            const b = L.latLngBounds(latLngs);
            return b.isValid() ? b : null;
        } catch (e) { return null; }
    }, [wells, seismicLines, faults]);

    const handleWellClick = (well) => {
        if(!well) return;
        if (selectAssetAndParentWell) selectAssetAndParentWell(well);
        if (setActiveTab) setActiveTab('Well Correlation');
        toast({ title: "Well Selected", description: well.name });
    };

    const handleDrawCreated = (e) => {
        if (!e || !e.layer) return;
        try {
            const geojson = e.layer.toGeoJSON();
            if (onSaveInterpretation) {
                onSaveInterpretation({
                    name: `New ${e.layerType} ${new Date().toLocaleTimeString()}`,
                    kind: e.layerType === 'polyline' ? 'fault' : 'polygon', 
                    geojson,
                    style: { color: '#EAB308' }
                });
            }
        } catch (err) { console.error("Draw error", err); }
    };

    const createWellIcon = (well) => {
        const color = well?.meta?.well_color || '#FFFFFF';
        const safeColor = color.startsWith('#') ? color : '#FFFFFF';
        const svg = `
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="${safeColor}" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="11" fill="none" stroke="black" stroke-width="1.5"/>
            </svg>`;
        return L.divIcon({ html: svg, className: 'leaflet-well-icon', iconSize: [24, 24], iconAnchor: [12, 12] });
    };

    return (
        <div className="flex h-full w-full bg-slate-950 overflow-hidden relative">
            <div className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-[500] absolute left-0 top-0 bottom-0 shadow-2xl ${isLeftPanelOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'}`}>
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur">
                    <div className="flex items-center gap-2 text-lime-400 font-bold"><Settings className="w-4 h-4" /><span>Map Controls</span></div>
                    <Button variant="ghost" size="icon" onClick={() => setIsLeftPanelOpen(false)}><ChevronLeft className="w-4 h-4 text-slate-400" /></Button>
                </div>
                <ScrollArea className="flex-grow">
                    <Accordion type="single" collapsible defaultValue="layers" className="w-full">
                        <AccordionItem value="layers">
                            <AccordionTrigger className="px-4 py-3 hover:bg-slate-800"><Layers className="w-4 h-4 mr-2 text-blue-400" /> Data Layers</AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 bg-slate-900/50"><MapLayerManager layers={layers} setLayers={setLayers} /></AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="cartography">
                            <AccordionTrigger className="px-4 py-3 hover:bg-slate-800"><Compass className="w-4 h-4 mr-2 text-orange-400" /> Cartography</AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 bg-slate-900/50"><MapCartographyControls mapSettings={mapSettings} setMapSettings={setMapSettings} activeBaseMap={activeBaseMap} setActiveBaseMap={setActiveBaseMap} /></AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tools">
                             <AccordionTrigger className="px-4 py-3 hover:bg-slate-800"><Ruler className="w-4 h-4 mr-2 text-teal-400" /> Tools</AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 bg-slate-900/50"><MapMeasurementTools activeTool={measureTool} setActiveTool={setMeasureTool} measurePoints={measurePoints} setMeasurePoints={setMeasurePoints} /></AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </ScrollArea>
            </div>

            <div className={`flex-grow relative h-full transition-all duration-300 ${isLeftPanelOpen ? 'ml-80' : 'ml-0'}`}>
                {!isLeftPanelOpen && (
                    <Button variant="secondary" size="icon" className="absolute top-4 left-4 z-[400] bg-slate-800 text-white border-slate-600" onClick={() => setIsLeftPanelOpen(true)}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                )}
                <LocalMapErrorBoundary>
                    <MapContainer center={[0, 0]} zoom={3} className="h-full w-full bg-slate-900" zoomControl={false} ref={setMapInstance}>
                        <L.Control.Zoom position="bottomright" />
                        {activeBaseMap === 'OSM' && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />}
                        {activeBaseMap === 'Satellite' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />}
                        {activeBaseMap === 'Dark' && <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CartoDB' />}

                        <MapController bounds={mapBounds} />
                        <CoordinatesDisplay />
                        <MeasurementLayer activeTool={measureTool} points={measurePoints} setPoints={setMeasurePoints} />
                        
                        <FeatureGroup>
                             <EditControl position="topleft" onCreated={handleDrawCreated} draw={{ rectangle: false, circle: false, circlemarker: false, marker: true, polyline: true, polygon: true }} />
                        </FeatureGroup>

                        {layers.grid?.visible && <MapGridOutlineLayer grids={grids} style={layers.grid} visible={layers.grid.visible} />}
                        {layers.faults?.visible && <MapFaultTracesLayer faults={faults} style={layers.faults} visible={layers.faults.visible} labelsVisible={mapSettings.showLabels} />}
                        {layers.horizons?.visible && <MapHorizonContoursLayer horizons={horizons} style={layers.horizons} visible={layers.horizons.visible} labelsVisible={mapSettings.showLabels} />}
                        {layers.seismic?.visible && <MapSeismicLinesLayer lines={seismicLines} style={layers.seismic} visible={layers.seismic.visible} labelsVisible={mapSettings.showLabels} />}
                        
                        {/* Visualize Active Cross Section */}
                        {layers.section?.visible && <CrossSectionLayer sectionLine={activeSectionLine} />}

                        {layers.wells?.visible && wells.map(w => (
                            <Marker 
                                key={w.id} 
                                position={w.meta.location} 
                                icon={createWellIcon(w)}
                                eventHandlers={{ click: () => handleWellClick(w) }}
                                opacity={layers.wells.opacity}
                            >
                                {mapSettings.showLabels && (
                                    <LeafletTooltip direction="top" offset={[0, -15]} opacity={0.9} permanent={false} className="font-bold text-[10px] border border-slate-600 bg-slate-900/90 text-white px-2 py-0.5 rounded shadow-lg">
                                        {w.name}
                                    </LeafletTooltip>
                                )}
                            </Marker>
                        ))}
                    </MapContainer>
                </LocalMapErrorBoundary>
            </div>
        </div>
    );
};

export default MapView;