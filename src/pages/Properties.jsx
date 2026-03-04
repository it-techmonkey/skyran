import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, LayoutGrid, List, Check, Loader2, AlertCircle } from 'lucide-react';
import PropertyCard from '../components/home/PropertyCard';

export default function Properties() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    location: 'All Locations',
    type: 'All Types',
    developer: 'All Developers',
    status: 'All Status',
    beds: 'Any Beds',
    price: 'Any Price'
  });

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination & Data Fetching State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchProperties = async (pageNum = 1, append = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setLoading(true);

      const response = await import('../services/projectService').then(module =>
        module.fetchProjects(pageNum, 8)
      );

      if (response.success && Array.isArray(response.data)) {
        const projectsArray = response.data;

        const mappedProperties = projectsArray.map(p => {
          // Normalize status
          let statusStr = p.category || "Available";
          if (statusStr === 'Off_plan') statusStr = 'Off-Plan';
          const status = [statusStr];

          // Normalize bedrooms to number for filtering
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
            title: p.title || p.project_name || "Untitled Project",
            status: status,
            location: { area: p.locality || p.city || "Dubai" },
            price: p.min_price || 0,
            developer: p.developer_name || "Private Seller", // API doesn't allow include_developer details in the strictly requested curl
            bedrooms: bedCount,
            bathrooms: p.min_bathrooms || 2,
            squareFeet: p.min_sq_ft || p.max_sq_ft || 0,
            image: (p.image_urls && p.image_urls.length > 0) ? p.image_urls[0] : "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80",
            type: (p.type && p.type.length > 0) ? p.type[0] : "Apartment",
            description: p.description
          };
        });

        // Client-side Sort: Ready > Off-Plan > Others
        mappedProperties.sort((a, b) => {
          const getScore = (p) => {
            const s = p.status.map(x => x.toLowerCase());
            if (s.includes('ready')) return 3;
            if (s.includes('off-plan')) return 2;
            return 1;
          };
          return getScore(b) - getScore(a);
        });

        if (append) {
          setAllProperties(prev => [...prev, ...mappedProperties]);
        } else {
          setAllProperties(mappedProperties);
        }

        // If we got fewer items than limit, we reached the end
        if (projectsArray.length < 8) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      if (!append) {
        // Fallback to local data when API fails (e.g. network, CORS, or server down)
        try {
          const { properties: localProperties } = await import('../data/properties');
          if (localProperties && localProperties.length > 0) {
            setAllProperties(localProperties);
            setError(null);
            setHasMore(false);
            return;
          }
        } catch (_) { /* ignore */ }
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage, true);
  };

  // Derive options from dynamic data
  const locations = ['All Locations', ...new Set(allProperties.map(p => p.location.area))];
  const types = ['All Types', ...new Set(allProperties.map(p => p.type).filter(Boolean))];
  const developers = ['All Developers', ...new Set(allProperties.map(p => p.developer))];
  // Keep static options for consistent UI
  const statuses = ['All Status', 'Ready', 'Off-Plan', 'Under Construction'];
  const beds = ['Any Beds', 'Studio (0)', '1', '2', '3', '4', '5+'];
  const prices = ['Any Price', 'Under 1M', '1M - 3M', '3M - 5M', '5M - 10M', 'Above 10M'];

  const handleFilterSelect = (category, value) => {
    setFilters(prev => ({ ...prev, [category]: value }));
    setActiveDropdown(null);
  };

  // Client-side Filtering Logic (Preserved)
  const filteredProperties = allProperties.filter(property => {
    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const match = property.title.toLowerCase().includes(query) ||
        property.location.area.toLowerCase().includes(query) ||
        property.developer.toLowerCase().includes(query);
      if (!match) return false;
    }

    // Dropdown Filters
    if (filters.location !== 'All Locations' && property.location.area !== filters.location) return false;
    if (filters.type !== 'All Types' && property.type !== filters.type) return false;
    if (filters.developer !== 'All Developers' && property.developer !== filters.developer) return false;

    if (filters.status !== 'All Status') {
      // Check if any status in the property array matches the filter or vice versa
      const normalizedStatus = Array.isArray(property.status) ? property.status : [property.status];
      if (!normalizedStatus.some(s => s.toLowerCase().includes(filters.status.toLowerCase()))) return false;
    }

    if (filters.beds !== 'Any Beds') {
      const bedCount = property.bedrooms;
      if (filters.beds === 'Studio (0)' && bedCount !== 0) return false;
      if (filters.beds === '5+' && bedCount < 5) return false;
      if (['1', '2', '3', '4'].includes(filters.beds) && bedCount !== parseInt(filters.beds)) return false;
    }

    if (filters.price !== 'Any Price') {
      const p = property.price;
      if (filters.price === 'Under 1M' && p >= 1000000) return false;
      if (filters.price === '1M - 3M' && (p < 1000000 || p > 3000000)) return false;
      if (filters.price === '3M - 5M' && (p < 3000000 || p > 5000000)) return false;
      if (filters.price === '5M - 10M' && (p < 5000000 || p > 10000000)) return false;
      if (filters.price === 'Above 10M' && p <= 10000000) return false;
    }

    return true;
  });

  const FilterDropdown = ({ title, options, activeValue, category }) => (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdown(activeDropdown === category ? null : category);
        }}
        className={`flex w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring h-11 ${activeValue !== title ? 'border-[#3b82f6] text-[#3b82f6] bg-blue-50/50' : 'border-input text-stone-600'
          }`}
      >
        <span className="truncate">{activeValue}</span>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${activeDropdown === category ? 'rotate-180' : ''}`} />
      </button>

      {activeDropdown === category && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-lg shadow-xl border border-stone-100 z-50 animate-in fade-in zoom-in-95 duration-100 p-1 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleFilterSelect(category, option)}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${activeValue === option ? 'bg-blue-50 text-[#3b82f6]' : 'hover:bg-stone-50 text-stone-700'
                }`}
            >
              <span>{option}</span>
              {activeValue === option && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
          <p>Error loading properties: {error}</p>
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
    <div className="min-h-screen bg-white" onClick={() => setActiveDropdown(null)}>
      {/* Hero Section */}
      <div className="bg-[#1a1a2e] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Explore Properties</h1>
          <p className="text-stone-400 mt-3 max-w-xl">Discover Dubai's finest properties from world-renowned developers. Use the filters below to find your perfect match.</p>
        </div>
      </div>

      {/* Filters and Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter Card */}
        <div className="mb-8" ref={dropdownRef}>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <div className="relative mb-6">
              <Search className="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex w-full rounded-md border bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12 h-12 text-base border-stone-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                placeholder="Search properties by name, location..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <FilterDropdown
                title="All Locations"
                options={locations}
                activeValue={filters.location}
                category="location"
              />
              <FilterDropdown
                title="All Types"
                options={types}
                activeValue={filters.type}
                category="type"
              />
              <FilterDropdown
                title="All Developers"
                options={developers}
                activeValue={filters.developer}
                category="developer"
              />
              <FilterDropdown
                title="All Status"
                options={statuses}
                activeValue={filters.status}
                category="status"
              />
              <FilterDropdown
                title="Any Beds"
                options={beds}
                activeValue={filters.beds}
                category="beds"
              />
              <FilterDropdown
                title="Any Price"
                options={prices}
                activeValue={filters.price}
                category="price"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-600">
            <span className="font-semibold text-stone-800">{filteredProperties.length}</span> properties found
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] shadow' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] shadow' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-500">
              <p className="text-lg">No properties found matching your criteria.</p>
              <button
                onClick={() => setFilters({
                  location: 'All Locations',
                  type: 'All Types',
                  developer: 'All Developers',
                  status: 'All Status',
                  beds: 'Any Beds',
                  price: 'Any Price'
                })}
                className="mt-4 text-[#3b82f6] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && !loading && !searchQuery && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-stone-200 text-stone-700 font-medium rounded-full hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'View More Properties'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
