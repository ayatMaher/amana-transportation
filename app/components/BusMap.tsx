'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BusStop } from '../types';

// أيقونة الباص
const busIcon = new L.Icon({
  iconUrl: '/icons/bus-stop.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// أيقونة المحطة العادية
const stopIcon = new L.Icon({
  iconUrl: '/icons/pin.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -25],
});

// أيقونة للمحطة التالية (next stop)
const nextStopIcon = new L.Icon({
  iconUrl: '/icons/next-pin.png', // أيقونة خضراء
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -25],
});

interface BusMapProps {
  stops: BusStop[];
}

export default function BusMap({ stops }: BusMapProps) {
  if (!stops || stops.length === 0) {
    return <div className="h-96 flex items-center justify-center">No stops available</div>;
  }

  const center: [number, number] = [stops[0].latitude, stops[0].longitude];
  const routeLatLngs = stops.map(s => [s.latitude, s.longitude] as [number, number]);

  return (
    <MapContainer center={center} zoom={13} className="h-96 w-full rounded-lg" scrollWheelZoom={true}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* خط سير الباص */}
      <Polyline positions={routeLatLngs} color="black" weight={2} />

      {/* علامات المحطات والباص */}
      {stops.map((stop, i) => (
        <Marker
          key={stop.id}
          position={[stop.latitude, stop.longitude]}
          icon={i === 0 ? busIcon : stop.is_next_stop ? nextStopIcon : stopIcon}
        >
          <Popup>
            <strong>{stop.name}</strong>
            <br />
            Next arrival: {stop.estimated_arrival}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
