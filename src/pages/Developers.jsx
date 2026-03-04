import { useState, useEffect } from 'react';
import { Search, Building, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Developers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoErrors, setLogoErrors] = useState(() => new Set());

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error('API URL not configured');

        const response = await fetch(`${apiUrl}/developers?page=1&min_projects=1`);
        if (!response.ok) {
          throw new Error('Failed to fetch developers');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON');
        }
        const data = await response.json();
        // The API returns { success: true, data: [...] }
        if (data.success && Array.isArray(data.data)) {
          // Filter out "Unknown Developer" and Sort: Images first
          const validDevelopers = data.data.filter(dev => {
            const name = dev.Company?.name || dev.dev_name;
            return name && name.toLowerCase() !== 'unknown developer';
          });

          const sorted = validDevelopers.sort((a, b) => {
            const aHasLogo = a.Company?.logo ? 1 : 0;
            const bHasLogo = b.Company?.logo ? 1 : 0;
            return bHasLogo - aHasLogo;
          });
          setDevelopers(sorted);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error("Error fetching developers:", err);
        // Fallback to local data when API fails or returns HTML instead of JSON
        try {
          const { developers: localDevelopers } = await import('../data/developers');
          if (localDevelopers && localDevelopers.length > 0) {
            const mapped = localDevelopers.map(d => ({
              id: d.id,
              dev_name: d.name,
              Company: { name: d.name, logo: d.logo, description: d.description },
              project_count: d.projects ?? 0
            }));
            setDevelopers(mapped);
            setError(null);
            return;
          }
        } catch (_) { /* ignore */ }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // Helper to get safe developer name
  const getDevName = (dev) => {
    if (dev.Company?.name) return dev.Company.name;
    if (dev.dev_name) return dev.dev_name;
    // Fallback - Use a clean placeholder instead of raw ID
    return "Verified Developer";
  };

  const filteredDevelopers = developers.filter(dev => {
    const name = getDevName(dev);
    const description = dev.Company?.description || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
      {/* Hero Section */}
      <div className="bg-[#1a1a2e] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Premier Developers</h1>
          <p className="text-stone-400 mt-3 max-w-xl">Explore Dubai's most prestigious real estate developers and their exceptional portfolio of projects.</p>
        </div>
      </div>

      {/* Search Bar */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
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

      {/* Developer Grid */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevelopers.map((dev) => (
              <Link
                key={dev.id}
                to={`/developers/${dev.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
              >
                {/* Icon Container */}
                <div className="aspect-[2/1] bg-stone-50 flex items-center justify-center group-hover:bg-stone-100 transition-colors relative overflow-hidden">
                  {dev.Company?.logo && !logoErrors.has(dev.id) ? (
                    <img
                      src={dev.Company.logo}
                      alt={getDevName(dev)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => setLogoErrors(prev => new Set(prev).add(dev.id))}
                    />
                  ) : (
                    <Building className="w-16 h-16 text-stone-200" />
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 group-hover:text-[#3b82f6] transition-colors line-clamp-1">
                    {getDevName(dev)}
                  </h3>
                  <p className="text-stone-500 text-sm mt-2 line-clamp-2 min-h-[40px]">
                    {dev.Company?.description || 'No description available for this developer.'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-4 text-sm text-stone-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Est. N/A</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{dev.project_count || 0} Projects</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredDevelopers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No developers found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

