import { useState, useEffect, useMemo } from 'react';
import { Search, Building, ArrowRight, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEVELOPERS_PER_PAGE = 18;

function groupPropertiesByDeveloper(properties) {
  const map = new Map();
  for (const property of properties) {
    const devName = property.developer || 'Verified Developer';
    if (!map.has(devName)) {
      map.set(devName, {
        id: devName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: devName,
        logo: property.developerLogo || null,
        project_count: 0,
        minPrice: Number.POSITIVE_INFINITY,
        maxPrice: 0,
        primaryTypes: new Set(),
      });
    }
    const entry = map.get(devName);
    entry.project_count += 1;

    const price = property.price || 0;
    if (price > 0) {
      entry.minPrice = Math.min(entry.minPrice, price);
      entry.maxPrice = Math.max(entry.maxPrice, price);
    }
    if (property.type) entry.primaryTypes.add(property.type);
    if (!entry.logo && property.developerLogo) entry.logo = property.developerLogo;
  }

  return Array.from(map.values())
    .map((entry) => ({
      ...entry,
      types: Array.from(entry.primaryTypes).slice(0, 3),
      minPrice: Number.isFinite(entry.minPrice) ? entry.minPrice : 0,
    }))
    .sort((a, b) => b.project_count - a.project_count);
}

function formatRange(min, max) {
  const compact = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `AED ${(num / 1000000).toFixed(1)}M`;
    return `AED ${(num / 1000).toFixed(0)}K`;
  };
  if (!min && !max) return 'Price on request';
  if (min && max && min !== max) return `${compact(min)} - ${compact(max)}`;
  return compact(min || max);
}

export default function Developers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const { fetchLocalProperties } = await import('../services/localDataService');
        const properties = await fetchLocalProperties();
        const grouped = groupPropertiesByDeveloper(properties);
        setDevelopers(grouped);
        setError(null);
      } catch (err) {
        console.error('Error building developers page:', err);
        setError(err.message || 'Failed to load developers');
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const filteredDevelopers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return developers;
    return developers.filter((dev) => {
      if (dev.name.toLowerCase().includes(query)) return true;
      return dev.types.some((type) => String(type).toLowerCase().includes(query));
    });
  }, [developers, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredDevelopers.length / DEVELOPERS_PER_PAGE));
  const start = (currentPage - 1) * DEVELOPERS_PER_PAGE;
  const pageDevelopers = filteredDevelopers.slice(start, start + DEVELOPERS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center text-red-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <p>Error loading developers: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1a1a2e] py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Developers</h1>
          <p className="text-stone-400 mt-3 max-w-2xl">
            Browse active developers and jump into their property catalog.
          </p>
        </div>
      </div>

      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {pageDevelopers.map((dev) => (
              <article
                key={dev.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                    {dev.logo ? (
                      <img src={dev.logo} alt={dev.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building className="w-4 h-4 text-primary-blue shrink-0" />
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-stone-800 truncate">{dev.name}</h2>
                </div>
                <p className="text-sm text-stone-500 mt-1">{dev.project_count} properties</p>
                <div className="mt-4 space-y-2 text-sm text-stone-600">
                  <p><span className="text-stone-500">Price Range:</span> {formatRange(dev.minPrice, dev.maxPrice)}</p>
                  <p className="line-clamp-1"><span className="text-stone-500">Types:</span> {dev.types.length ? dev.types.join(', ') : 'N/A'}</p>
                </div>
                <Link
                  to={`/properties?developer=${encodeURIComponent(dev.name)}`}
                  className="mt-4 inline-flex items-center gap-2 text-primary-blue font-semibold hover:underline"
                >
                  View properties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Developers pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-3 text-sm text-stone-600">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}

          {filteredDevelopers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 mt-6">
              <p className="text-gray-500 text-lg">No developers found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
