'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BusLine } from './types';
import data from './data/buses.json';

// Dynamically import BusMap to avoid SSR issues
const BusMap = dynamic(() => import('./components/BusMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});


export default function Home() {
  const [busData, setBusData] = useState<BusLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBus, setActiveBus] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
      try {
        setBusData(data.bus_lines);
         if (data.bus_lines.length > 0) {
      setActiveBus(data.bus_lines[0].id); // اختيار أول Bus تلقائياً
    }
      } catch (err) {
        console.error(err);
        setError('Failed to load data from local file');
      } finally {
        setLoading(false);
      }
  }, []);

  const activeRoute = busData.find(bus => bus.id === activeBus);

  // تحويل البيانات لتتناسب مع BusMap
  // تحويل البيانات لتتناسب مع BusMap
const stopsForMap = activeRoute?.bus_stops.map(stop => ({
  id: stop.id,
  name: stop.name,
  latitude: stop.latitude,           // بدل lat
  longitude: stop.longitude,         // بدل lng
  estimated_arrival: stop.estimated_arrival, // بدل next_arrival_time
  is_next_stop: stop.is_next_stop,   // لتلوين next stop
}));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-black text-white px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Amana Logo</div>
          <button
            className="sm:hidden flex flex-col space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
          <div className="hidden sm:block text-gray-300">Menu</div>
        </div>
        {menuOpen && (
          <div className="sm:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-300 hover:text-white">Home</a>
              <a href="#" className="text-gray-300 hover:text-white">Buses</a>
              <a href="#" className="text-gray-300 hover:text-white">About</a>
            </div>
          </div>
        )}
      </nav>

      {/* Company Title */}
      <div className="bg-green-400 py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-black">Amana Transportation</h1>
        <p className="text-lg text-black">Proudly Servicing Malaysian Bus Riders Since 2019!</p>
      </div>

      <main className="flex-1 container mx-auto p-4 space-y-8">
        {/* Active Bus Map Section */}
        <section className="bg-yellow-100 py-4 px-4 text-center rounded-xl">
          <h2 className="text-xl font-semibold text-black">Active Bus Map</h2>
        </section>

        {/* Bus Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {busData.map(bus => (
            <button
              key={bus.id}
              onClick={() => setActiveBus(bus.id)}
              className={`px-4 py-2 rounded-lg border ${
                activeBus === bus.id
                  ? 'bg-green-500 border-green-700 text-white'
                  : 'bg-gray-300 border-gray-500 text-black'
              }`}
            >
              {bus.name}
            </button>
          ))}
        </div>

        {/* Map */}
        <section className="bg-gray-50 p-6 rounded-xl shadow-inner">
          {loading ? (
            <div className="h-96 flex items-center justify-center">Loading bus data...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            
            activeRoute && stopsForMap && <BusMap stops={stopsForMap} />
          )}
        </section>
         {/* Bus Schedule Section */}
        <section className="bg-yellow-100 py-4 px-4 text-center rounded-xl">
          <h2 className="text-xl font-semibold text-black">Bus Schedule</h2>
        </section>

        {/* Bus Buttons again */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {busData.map((bus) => (
            <button
              key={bus.id}
              onClick={() => setActiveBus(bus.id)}
              className={`px-4 py-2 rounded-lg border ${
                activeBus === bus.id
                  ? 'bg-green-500 border-green-700 text-white'
                  : 'bg-gray-300 border-gray-500 text-black'
              }`}
            >
              {bus.name}
            </button>
          ))}
        </div>

        {/* Table */}
        <section className="overflow-x-auto mt-4">
          {activeRoute ? (
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border">Bus Stop</th>
                  <th className="px-4 py-2 border">Next Time of Arrival</th>
                </tr>
              </thead>
              <tbody>
                {activeRoute.bus_stops.map((stop, i) => (
                  <tr
                    key={stop.id}
                    className={i === 0 ? 'bg-orange-200' : ''}
                  >
                    <td className="px-4 py-2 border">{stop.name}</td>
                    <td className="px-4 py-2 border">
                      {stop.estimated_arrival}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500">
              Select a bus route to view schedule
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 px-4">
        <p>Copyright 2025 Amana Industries (Group 7)</p>
      </footer>
    </div>
  );
}
