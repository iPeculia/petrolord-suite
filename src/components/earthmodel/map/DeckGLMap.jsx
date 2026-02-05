import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';

const INITIAL_VIEW_STATE = {
  longitude: -100,
  latitude: 40,
  zoom: 3,
  pitch: 0,
  bearing: 0
};

const DeckGLMap = ({ wells = [], surfaces = [], polygons = [] }) => {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const layers = [
        new ScatterplotLayer({
            id: 'wells-layer',
            data: wells,
            getPosition: d => [d.longitude || 0, d.latitude || 0],
            getFillColor: [255, 140, 0],
            getRadius: 100,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 6,
            radiusMinPixels: 4,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,
        }),
        // Placeholder for polygons/faults
        new GeoJsonLayer({
            id: 'polygons-layer',
            data: polygons,
            stroked: true,
            filled: true,
            lineWidthMinPixels: 2,
            getLineColor: [255, 255, 255],
            getFillColor: [0, 100, 200, 100]
        })
    ];

    return (
        <div className="w-full h-full relative">
            <DeckGL
                initialViewState={viewState}
                controller={true}
                layers={layers}
                onViewStateChange={({viewState}) => setViewState(viewState)}
            >
                {/* MapLibre Base Map */}
                <Map
                    mapLib={maplibregl}
                    mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                    reuseMaps
                />
            </DeckGL>
            
            {/* Map Controls Overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/90 p-2 rounded border border-slate-700 backdrop-blur">
                <h4 className="text-xs font-bold text-slate-300 mb-2">Layers</h4>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Wells</span>
                </div>
            </div>
        </div>
    );
};

export default DeckGLMap;