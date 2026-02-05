import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const CompetitorMap = ({ markers }) => {
  const position = [15, 0]; // Default center

  return (
    <MapContainer center={position} zoom={2} style={{ height: '400px', width: '100%', backgroundColor: '#1e293b', borderRadius: '8px' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>
            <div className="text-black">
              <h3 className="font-bold">{marker.company}</h3>
              <p>{marker.activity}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CompetitorMap;