'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BusStop ,BusLine } from '../types';


// أيقونة الباص
const busIcon = new L.Icon({
  iconUrl: '/icons/bus-stop.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});
// أيقونة الباص في الصيانة
const busMaintenanceIcon = new L.Icon({
  iconUrl: '/icons/bus-maintenance.png', // ستحتاج إلى إضافة هذه الأيقونة في مجلد /public/icons
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
  route: BusLine;
}

export default function BusMap({ route }: BusMapProps) {
  if (!route || route.bus_stops.length === 0) {
    return <div className="h-96 flex items-center justify-center">No stops available</div>;
  }
  const stops = route.bus_stops;
  const center: [number, number] = [stops[0].latitude, stops[0].longitude];
  const routeLatLngs = stops.map(s => [s.latitude, s.longitude] as [number, number]);
  const nextStop =stops.find(stop => stop.is_next_stop);


  // تحديد أيقونة الباص بناءً على حالته
  const currentBusIcon = route.status === 'Maintenance' ? busMaintenanceIcon : busIcon;
 

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
          icon={i === 0 ? currentBusIcon : stop.is_next_stop ? nextStopIcon : stopIcon}
        >
          <Popup className="bus-popup">
            {/* تحديد المحتوى بناء على نوع الأيقونة */}
            {i === 0 ? (
              // محتوى أيقونة الباص (المحطة الأولى)
              <div className=" bg-green-50 text-black p-2 rounded-md shadow-md">
                <strong>Bus: {route.name}</strong>
                <br />
                Status: {route.status} 
                <br />
                Capacity: {route.passengers.capacity} passengers
                <br />
                Next Stop: {nextStop ? nextStop.name : 'N/A'}
                <hr className="my-2 border-gray-300" /> {/* فاصل بين المعلومات */}
                <strong>Driver Info:</strong>
                <br />
                Name: {route.driver.name}
                <br />
                <hr className="my-2 border-gray-300" /> {/* فاصل بين المعلومات */}
                <strong>Vehicle Info:</strong>
                <br />
                Plate: {route.vehicle_info.license_plate}
                <br />
                Last Maintenance: {route.vehicle_info.last_maintenance}
              </div>
            ) : (
              // محتوى أيقونة المحطة العادية
              <div className="bg-red-50 text-black p-2 rounded-md shadow-md">
                <strong>Bus Stop: {stop.name}</strong>
                <br />
                Next arrival: {stop.estimated_arrival}
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}