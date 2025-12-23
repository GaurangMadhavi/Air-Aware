import { Card1, CardContent1, CardDescription1, CardHeader1, CardTitle1 } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location } from '@/types/index';
import { getNearestAQI } from '@/services/api';

interface AQIMapProps {
  center: Location;
  aqi: number;
}

export function AQIMap({ center, aqi }: AQIMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer: L.layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const getColor = (aqiValue: number) => {
      if (aqiValue <= 50) return '#16a34a';
      if (aqiValue <= 100) return '#eab308';
      if (aqiValue <= 150) return '#f97316';
      return '#ef4444';
    };

    const color = getColor(aqi);

    L.circleMarker([center.lat, center.lng], {
      radius: 20,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7
    })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<strong>AQI: ${aqi}</strong><br/>${center.address || 'Current Location'}`);

    const radius = 5000;
    const points = 8;
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const lat = center.lat + (radius / 111320) * Math.cos(angle);
      const lng = center.lng + (radius / (111320 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
      
      const predictedAqi = aqi + Math.random() * 20 - 10;
      const predictedColor = getColor(aqi);
      

      L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: predictedColor,
        color: '#fff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.5
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<strong>Predicted AQI: ${Math.round(predictedAqi)}</strong>`);
    }

    mapInstanceRef.current.setView([center.lat, center.lng], 13);
  }, [center, aqi]);

  return (

    <div className="h-screen flex flex-col">
  {/* MAP SECTION (80%) */}
  <div className="h-[80vh] p-4">
    <div
      ref={mapRef}
      className="h-full w-full rounded-xl overflow-hidden shadow-lg"
    />
  </div>

  {/* BOTTOM CONTENT (20%) */}
  <div className="flex-1 px-6 pb-6">
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-600" />
        <span className="text-sm">Safe (0-50)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500" />
        <span className="text-sm">Moderate (51-100)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-orange-500" />
        <span className="text-sm">Unhealthy (101-150)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500" />
        <span className="text-sm">Hazardous (151+)</span>
      </div>
    </div>
  </div>
</div>

  
  );
}

const MapPage = () => {
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
  const [aqi, setAQI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setLocation({ lat, lng });

      try {
        const res = await getNearestAQI(lat, lng);
        setAQI(res.data.currentAQI);

        // Get address for location
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const geoData = await geoRes.json();
          const address = geoData.address || {};
          const detailedLocation = [
            address.neighbourhood,
            address.suburb,
            address.city || address.town || address.village,
          ]
            .filter(Boolean)
            .join(", ");
          
          setLocation({ lat, lng, address: detailedLocation || "Current Location" });
        } catch {
          setLocation({ lat, lng, address: "Current Location" });
        }
      } catch (err) {
        console.error("Failed to fetch AQI", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  if (location.lat === 0 && location.lng === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Location access is required to display the map.</p>
      </div>
    );
  }

  return <AQIMap center={location} aqi={aqi} />;
};

export default MapPage;