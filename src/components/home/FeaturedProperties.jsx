import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import PropertyCard from './PropertyCard';
import Badge from '../ui/Badge';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await import('../../services/projectService').then(module =>
          module.fetchProjects(1, 3)
        );

        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map(p => {
            // Normalize status
            let statusStr = p.category || "Available";
            if (statusStr === 'Off_plan') statusStr = 'Off-Plan';

            // Normalize bedrooms
            let bedCount = 0;
            const minBed = p.min_bedrooms ? p.min_bedrooms.toLowerCase() : '';
            if (minBed === 'studio') bedCount = 0;
            else if (minBed === 'one') bedCount = 1;
            else if (minBed === 'two') bedCount = 2;
            else if (minBed === 'three') bedCount = 3;
            else if (minBed === 'four') bedCount = 4;
            else if (minBed === 'five' || minBed === 'five+') bedCount = 5;
            else bedCount = parseInt(minBed) || 2;

            return {
              id: p.id,
              title: p.title || p.project_name || "Untitled Property",
              status: [statusStr],
              location: { area: p.locality || p.city || "Dubai" },
              price: p.min_price || 0,
              developer: p.developer_name || "Private Seller",
              bedrooms: bedCount,
              bathrooms: p.min_bathrooms || 2,
              squareFeet: p.min_sq_ft || p.max_sq_ft || 0,
              image: (p.image_urls && p.image_urls.length > 0) ? p.image_urls[0] : "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80",
              type: (p.type && p.type.length > 0) ? p.type[0] : "Apartment"
            };
          });
          setProperties(mapped);
        } else {
          throw new Error('Failed to load featured properties');
        }
      } catch (err) {
        console.error("Error loading featured:", err);
        // Fallback to local data when API fails
        try {
          const { properties: localProperties } = await import('../../data/properties');
          if (localProperties && localProperties.length > 0) {
            setProperties(localProperties.slice(0, 3));
            setError(null);
            return;
          }
        } catch (_) { /* ignore */ }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);
  return (
    <section className="py-20 lg:py-24 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <Badge variant="outline" className="bg-primary-blue/10 border-primary-blue text-primary-blue mb-4">
              EXCLUSIVE LISTINGS
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-dark mb-4">
              Featured Properties
            </h2>
            <p className="text-text-gray max-w-2xl">
              Handpicked selection of Dubai's most exceptional off-plan opportunities.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center text-primary-blue font-semibold hover:underline group"
          >
            View All Properties
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            <p>Unable to load featured properties.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

