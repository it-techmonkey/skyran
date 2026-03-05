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
        const { fetchLocalProperties } = await import('../../services/localDataService');
        const all = await fetchLocalProperties();
        const sorted = [...all].sort((a, b) => {
          const score = (p) => (p.status || []).some((s) => String(s).toLowerCase() === 'ready') ? 2 : 1;
          return score(b) - score(a);
        });
        setProperties(sorted.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error('Error loading featured:', err);
        try {
          const { properties: localProperties } = await import('../../data/properties');
          if (localProperties?.length) {
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

