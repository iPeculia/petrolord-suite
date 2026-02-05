
import React, { useState, useMemo, useCallback } from 'react';
    import Map, { NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
    import DeckGL from '@deck.gl/react';
    import { ScatterplotLayer, PathLayer, GeoJsonLayer } from '@deck.gl/layers';
    import { MapPin, Satellite, Sun, Moon, Layers, Grid } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
    
    const MAP_STYLES = {
        'Light': 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        'Dark': 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        'Satellite': 'https://api.maptiler.com/maps/satellite/style.json?key=get_your_own_OpDv9BIe3yO2n5P0vB2L',
    };

    const graticuleLayer = {
        id: 'graticule',
        type: 'line',
        source: 'graticule',
        paint: {
            'line-color': 'rgba(255, 255, 255, 0.3)',
            'line-width': 1,
            'line-dasharray': [2, 2]
        }
    };
    
    const generateGraticule = (bounds) => {
        const features = [];
        if (!bounds) return { type: 'FeatureCollection', features };
        
        const [west, south, east, north] = bounds;
        const span = Math.max(east - west, north - south);
        let interval = 10;
        if (span < 1) interval = 0.1;
        else if (span < 5) interval = 1;
        else if (span < 20) interval = 5;

        for (let lon = Math.floor(west / interval) * interval; lon < east; lon += interval) {
            features.push({
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: [[lon, south], [lon, north]] },
                properties: { value: lon.toFixed(2) }
            });
        }
        for (let lat = Math.floor(south / interval) * interval; lat < north; lat += interval) {
            features.push({
                type: 'Feature',
                geometry: { type: 'LineString', coordinates: [[west, lat], [east, lat]] },
                properties: { value: lat.toFixed(2) }
            });
        }
        return { type: 'FeatureCollection', features };
    };

    const MapView = ({ assets, interpretations, onWellClick }) => {
        const [viewState, setViewState] = useState({
            longitude: -100,
            latitude: 40,
            zoom: 3,
            pitch: 0,
            bearing: 0
        });
        const [hoverInfo, setHoverInfo] = useState(null);
        const [baseMap, setBaseMap] = useState('Dark');
        const [showBaseMap, setShowBaseMap] = useState(true);
        const [showGrid, setShowGrid] = useState(false);
        const [mapRef, setMapRef] = useState(null);

        const graticuleGeoJSON = useMemo(() => {
            if (!mapRef || !showGrid) return { type: 'FeatureCollection', features: [] };
            const bounds = mapRef.getBounds().toArray().flat();
            return generateGraticule(bounds);
        }, [viewState, mapRef, showGrid]);
        

        const wellPoints = useMemo(() => 
            assets.filter(a => a.type === 'well' && a.meta?.location).map(a => ({
                ...a,
                coordinates: [a.meta.location[1], a.meta.location[0]] // lon, lat
            })), 
        [assets]);

        const wellTrajectories = useMemo(() => 
            assets.filter(a => a.type === 'trajectory' && a.meta?.path).map(a => ({
                ...a,
                path: a.meta.path
            })), 
        [assets]);

        const polygons = useMemo(() =>
            assets.filter(a => a.type === 'polygon' && a.meta?.geojson),
        [assets]);

        const handleHover = ({object, x, y}) => {
            setHoverInfo(object ? { object, x, y } : null);
        };

        const handleClick = ({object}) => {
            if (object && object.type === 'well') {
                onWellClick(object);
            }
        };

        const onMapLoad = useCallback((evt) => {
            setMapRef(evt.target);
        }, []);

        const layers = [
            new ScatterplotLayer({
                id: 'well-heads',
                data: wellPoints,
                getPosition: d => d.coordinates,
                getFillColor: [255, 140, 0],
                getRadius: 50,
                radiusScale: 1,
                radiusMinPixels: 3,
                radiusMaxPixels: 20,
                pickable: true,
            }),
            new PathLayer({
                id: 'well-trajectories',
                data: wellTrajectories,
                getPath: d => d.path,
                getColor: [0, 255, 255],
                getWidth: 2,
                widthMinPixels: 1,
                pickable: true,
            }),
            new GeoJsonLayer({
                id: 'polygons',
                data: polygons.map(p => p.meta.geojson),
                stroked: true,
                filled: true,
                getFillColor: [160, 160, 180, 50],
                getLineColor: [0, 255, 0, 200],
                getLineWidth: 2,
                lineWidthMinPixels: 1,
                pickable: true,
            })
        ];

        const MapTooltip = () => {
            if (!hoverInfo || !hoverInfo.object) return null;
            const { object, x, y } = hoverInfo;
            
            return (
                <div style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', left: x, top: y }}
                    className="bg-slate-800 text-white text-sm p-2 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-full -mt-2">
                    {object.name || 'Unnamed Asset'}
                </div>
            );
        };
        
        return (
            <div className="h-full w-full relative">
                <DeckGL
                    layers={layers}
                    viewState={viewState}
                    controller={true}
                    onViewStateChange={e => setViewState(e.viewState)}
                    onHover={handleHover}
                    onClick={handleClick}
                    getCursor={() => hoverInfo ? 'pointer' : 'grab'}
                >
                    {showBaseMap && (
                        <Map 
                            reuseMaps
                            mapStyle={MAP_STYLES[baseMap]}
                            onLoad={onMapLoad}
                        >
                            <NavigationControl position="top-left" />
                            {showGrid && (
                                <Source id="graticule" type="geojson" data={graticuleGeoJSON}>
                                    <Layer {...graticuleLayer} />
                                </Source>
                            )}
                        </Map>
                    )}
                    <MapTooltip />
                </DeckGL>

                 <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                    <TooltipProvider>
                        {Object.entries(MAP_STYLES).map(([name, url]) => (
                            <Tooltip key={name}>
                                <TooltipTrigger asChild>
                                     <Button variant="outline" size="icon" onClick={() => setBaseMap(name)} className={`bg-slate-800 hover:bg-slate-700 text-white shadow-md ${baseMap === name && showBaseMap ? 'border-cyan-400 border-2' : 'border-slate-600'}`}>
                                        {name === 'Light' && <Sun className="h-5 w-5" />}
                                        {name === 'Dark' && <Moon className="h-5 w-5" />}
                                        {name === 'Satellite' && <Satellite className="h-5 w-5" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left"><p>{name}</p></TooltipContent>
                            </Tooltip>
                        ))}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setShowBaseMap(s => !s)} className={`bg-slate-800 hover:bg-slate-700 text-white shadow-md ${!showBaseMap ? 'border-cyan-400 border-2' : 'border-slate-600'}`}>
                                    <Layers className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left"><p>{showBaseMap ? "Hide Basemap" : "Show Basemap"}</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setShowGrid(s => !s)} className={`bg-slate-800 hover:bg-slate-700 text-white shadow-md ${showGrid ? 'border-cyan-400 border-2' : 'border-slate-600'}`}>
                                    <Grid className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left"><p>{showGrid ? "Hide Grid" : "Show Grid"}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        );
    };
    
    export default MapView;
