import { MapPin, Building, Bed, Bath, Square, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, formatSquareFeet } from '../../data/properties';

export default function PropertyCard({ property }) {
  const statusColors = {
    'Ready': 'bg-emerald-500',
    'Featured': 'bg-white/20 backdrop-blur-md',
    'Off-Plan': 'bg-[#3b82f6]',
    'Under Construction': 'bg-blue-500'
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.status.map((status, index) => (
            status === 'Ready' ? (
              <div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 bg-emerald-500 text-white border-0 px-3 py-1 text-xs font-medium">
                {status}
              </div>
            ) : status === 'Featured' ? (
              <div key={index} className="inline-flex items-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 bg-white/20 backdrop-blur-md text-white border-0 px-3 py-1 text-xs">
                {status}
              </div>
            ) : status === 'Off-Plan' ? (
              <div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 bg-[#3b82f6] text-white border-0 px-3 py-1 text-xs font-medium">
                {status}
              </div>
            ) : (
              <div key={index} className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 bg-blue-500 text-white border-0 px-3 py-1 text-xs font-medium">
                {status}
              </div>
            )
          ))}
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <p className="text-2xl font-bold text-white">{formatPrice(property.price)}</p>
        </div>

        {/* Hover Arrow Icon */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-stone-800 group-hover:text-[#3b82f6] transition-colors line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 mt-2 text-stone-500 text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{property.location.area}</span>
        </div>

        {/* Specs - Restored & Responsive */}
        <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-stone-100">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-stone-600">
              <Bed className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5 text-stone-600">
              <Bath className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
          )}
          {property.squareFeet > 0 && (
            <div className="flex items-center gap-1.5 text-stone-600">
              <Square className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-medium">{formatSquareFeet(property.squareFeet)}</span>
            </div>
          )}
        </div>




      </div>
    </Link>
  );
}
