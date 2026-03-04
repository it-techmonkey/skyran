import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, MapPin, Phone, Mail, Loader2, AlertCircle } from 'lucide-react';
import PropertyCard from '../components/home/PropertyCard';

export default function DeveloperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [developerProperties, setDeveloperProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error('API URL not configured');

        const response = await fetch(`${apiUrl}/developers/${id}?page=1&limit=20`);
        if (!response.ok) {
          throw new Error('Failed to fetch developer details');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON');
        }
        const data = await response.json();

        if (data.success && data.data) {
          const devData = data.data;
          // Map Developer Data
          const mappedDeveloper = {
            id: devData._id,
            name: devData.Company?.name || "Unknown Developer",
            description: devData.Company?.description || "No description available.",
            logo: devData.Company?.logo,
            established: "N/A", // API doesn't provide this currently
            projects: devData.project_count || 0
          };
          setDeveloper(mappedDeveloper);

          // Map Projects Data if available
          if (devData.projects && Array.isArray(devData.projects.data)) {
            const mappedProjects = devData.projects.data.map(p => {
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
              else bedCount = parseInt(minBed) || (p.bedrooms || 2);

              // Image logic: Prioritize image_urls array, then cover_image
              let image = "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80";
              if (p.image_urls && p.image_urls.length > 0) image = p.image_urls[0];
              else if (p.cover_image) image = p.cover_image;

              return {
                id: p._id || p.id,
                title: p.title || p.project_name || p.name || "Untitled Project",
                status: [statusStr],
                location: { area: p.locality || p.location_name || p.city || "Dubai" },
                price: p.min_price || p.price || 0,
                developer: p.developer_name || devData.Company?.name || "Unknown Developer",
                bedrooms: bedCount,
                bathrooms: p.min_bathrooms || p.bathrooms || 2,
                squareFeet: p.min_sq_ft || p.size || 0,
                image: image,
                type: (p.type && p.type.length > 0) ? p.type[0] : (p.project_type || "Apartment"),
                description: p.description
              };
            });
            setDeveloperProperties(mappedProjects);
          }

        } else {
          throw new Error('Developer not found');
        }
      } catch (err) {
        console.error("Error fetching developer:", err);
        // Fallback to local data when API fails or returns HTML instead of JSON
        try {
          const { developers: localDevelopers } = await import('../data/developers');
          const local = localDevelopers.find(d => d.id === parseInt(id, 10));
          if (local) {
            setDeveloper({
              id: local.id,
              name: local.name,
              description: local.description || 'No description available.',
              logo: local.logo,
              established: 'N/A',
              projects: local.projects ?? 0
            });
            // Show local properties that match this developer
            const { properties: localProperties } = await import('../data/properties');
            const byDeveloper = (localProperties || []).filter(p => p.developer === local.name).map(p => ({
              id: p.id,
              title: p.title,
              status: p.status || ['Available'],
              location: p.location || { area: 'Dubai' },
              price: p.price,
              developer: p.developer,
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
              squareFeet: p.squareFeet,
              image: p.image,
              type: p.type || 'Apartment',
              description: p.description
            }));
            setDeveloperProperties(byDeveloper);
            setError(null);
            return;
          }
        } catch (_) { /* ignore */ }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDeveloper();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Error Loading Developer</h1>
          <p className="mb-4">{error || 'Developer not found'}</p>
          <Link to="/developers" className="text-[#3b82f6] hover:underline">
            Back to Developers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen bg-stone-50">
        {/* Back Button Section */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link
              to="/developers"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-[#3b82f6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Developers
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Developer Header */}
          <div className="bg-white rounded-2xl p-8 border border-stone-100 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Icon */}
              <div className="w-32 h-32 rounded-2xl bg-stone-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {developer.logo ? (
                  <img src={developer.logo} alt={developer.name} className="w-full h-full object-contain p-4" />
                ) : (
                  <Building className="w-16 h-16 text-stone-300" />
                )}
              </div>

              {/* Developer Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                  {developer.name}
                </h1>
                <p className="text-stone-600 leading-relaxed mb-6">
                  {developer.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Calendar className="w-5 h-5 text-stone-400" />
                    <span className="font-medium">Est. {developer.established}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Building className="w-5 h-5 text-stone-400" />
                    <span className="font-medium">{developer.projects} Projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Properties */}
          {developerProperties.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-800 mb-6">
                Properties by {developer.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developerProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="bg-white rounded-2xl p-8 border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Contact {developer.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-stone-600 mb-4">
                  Interested in properties from {developer.name}? Our team can help you explore their portfolio and find the perfect property for you.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+97142725641"
                    className="flex items-center gap-3 text-stone-700 hover:text-[#3b82f6] transition-colors"
                  >
                    <Phone className="w-5 h-5 text-stone-400" />
                    <span>+971 4 272 5641</span>
                  </a>
                  <a
                    href="mailto:info@skyran.ae"
                    className="flex items-center gap-3 text-stone-700 hover:text-[#3b82f6] transition-colors"
                  >
                    <Mail className="w-5 h-5 text-stone-400" />
                    <span>info@skyran.ae</span>
                  </a>
                </div>
              </div>
              <div>
                <button className="w-full px-6 py-3 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#2d2d2d] transition-colors mb-3">
                  Request Information
                </button>
                <button className="w-full px-6 py-3 border border-[#3b82f6] text-[#3b82f6] font-medium rounded-xl hover:bg-[#3b82f6]/10 transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

