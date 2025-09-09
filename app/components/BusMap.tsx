'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BusStop, BusLine } from '../types';
import { useEffect } from 'react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


interface BusMapProps {
  stops: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    estimated_arrival: string;
    is_next_stop: boolean;
  }[];
}


// 🚌 أيقونة الباص
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61212.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// 📍 أيقونة المحطة
const stopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -25],
});

export default function BusMap({ stops }: BusMapProps) {
  // إذا مافي محطات نوقف
  if (!stops || stops.length === 0) {
    return <div className="h-96 flex items-center justify-center">No stops available</div>;
  }

  // نحدد موقع الخريطة (مبدئياً على أول محطة)
  const center: [number, number] = [stops[0].latitude, stops[0].longitude];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-96 w-full rounded-lg z-0"
      scrollWheelZoom={true}
    >
      {/* طبقة الخريطة (أبيض وأسود) */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* markers للمحطات */}
      {stops.map((stop, i) => (
        <Marker
          key={stop.id}
          position={[stop.latitude, stop.longitude]}
          icon={i === 0 ? busIcon : stopIcon} // أول محطة = الباص الحالي
        >
          <Popup>
            <div>
              <strong>{stop.name}</strong>
              <br />
              Next arrival: {stop.estimated_arrival}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
