import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowRight, Loader2 } from 'lucide-react';
import Badge from '../ui/Badge';

export default function DevelopersSection() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoErrors, setLogoErrors] = useState(() => new Set());

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/developers?min_projects=1`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          // Sort: Logos firsts
          const sorted = data.data.sort((a, b) => {
            const aHasLogo = a.Company?.logo ? 1 : 0;
            const bHasLogo = b.Company?.logo ? 1 : 0;
            return bHasLogo - aHasLogo;
          });
          setDevelopers(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error("Error loading developers:", err);
        // Fallback to local data when API fails (e.g. VITE_API_URL not set or server down)
        try {
          const { developers: localDevelopers } = await import('../../data/developers');
          if (localDevelopers && localDevelopers.length > 0) {
            const mapped = localDevelopers.slice(0, 6).map(d => ({
              id: d.id,
              dev_name: d.name,
              Company: { name: d.name, logo: d.logo },
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

  // Helper for name
  const getDevName = (dev) => {
    return dev.Company?.name || dev.dev_name || "Verified Developer";
  };

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0 text-left">
            <Badge variant="outline" className="bg-primary-blue/10 border-primary-blue text-primary-blue mb-4">
              TRUSTED PARTNERS
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-dark mb-4">
              Premier Developers
            </h2>
            <p className="text-text-gray max-w-2xl">
              We partner with Dubai's most prestigious developers to bring you exceptional properties.
            </p>
          </div>
          <Link
            to="/developers"
            className="inline-flex items-center text-primary-blue font-semibold hover:underline group"
          >
            View All Developers
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Developer Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Unable to load developers.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {developers.map((developer) => (
              <Link
                key={developer.id}
                to={`/developers/${developer.id}`}
                className="bg-bg-light rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300 block"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden p-4">
                    {developer.Company?.logo && !logoErrors.has(developer.id) ? (
                      <img
                        src={developer.Company.logo}
                        alt={getDevName(developer)}
                        className="w-full h-full object-contain"
                        onError={() => setLogoErrors(prev => new Set(prev).add(developer.id))}
                      />
                    ) : (
                      <Building className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-2">
                  {getDevName(developer)}
                </h3>
                <p className="text-text-gray text-sm">
                  {developer.project_count || 0} Projects
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

