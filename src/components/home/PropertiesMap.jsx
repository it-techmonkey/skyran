import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchLocalPropertiesWithCoords } from '../../services/localDataService';
import { Loader2 } from 'lucide-react';

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [map, points]);
  return null;
}

export default function PropertiesMap() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchLocalPropertiesWithCoords()
      .then((list) => {
        if (!cancelled) setProperties(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-dark mb-4">Properties on the Map</h2>
          <p className="text-text-gray max-w-2xl mb-8">Explore our listings by location.</p>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-stone-100 flex items-center justify-center h-[320px] sm:h-[420px] md:h-[480px]">
            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-dark mb-4">Properties on the Map</h2>
          <p className="text-text-gray">
            {error ? `Unable to load map: ${error}` : 'No properties with location data to display.'}
          </p>
        </div>
      </section>
    );
  }

  const defaultCenter = [25.2048, 55.2708];
  const defaultZoom = 6;
  const points = properties.map((p) => ({ ...p, lat: p.latitude, lng: p.longitude }));

  return (
    <section className="py-16 lg:py-20 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-text-dark mb-4">Properties on the Map</h2>
        <p className="text-text-gray max-w-2xl mb-8">
          Explore our listings by location. Each circle represents a development.
        </p>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 h-[320px] sm:h-[420px] md:h-[480px]">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
            attributionControl={false}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.length > 0 && <FitBounds points={properties} />}
            {properties.map((property) => (
              <CircleMarker
                key={property.id}
                center={[property.latitude, property.longitude]}
                radius={10}
                pathOptions={{
                  fillColor: '#3B82F6',
                  color: '#1d4ed8',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.7,
                }}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.setStyle({ fillOpacity: 0.95, weight: 3 });
                    e.target.bringToFront();
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ fillOpacity: 0.7, weight: 2 });
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <strong className="text-stone-800 block mb-1">{property.title}</strong>
                    {property.location?.area && (
                      <span className="text-stone-500 text-sm block mb-2">{property.location.area}</span>
                    )}
                    <Link
                      to={`/properties/${property.id}`}
                      className="text-[#3b82f6] text-sm font-medium hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
