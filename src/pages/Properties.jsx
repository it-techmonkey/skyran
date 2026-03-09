import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronDown, LayoutGrid, List, Check, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/home/PropertyCard';

const PROPERTIES_PER_PAGE = 12;
const DEFAULT_FILTERS = {
  location: 'All Locations',
  type: 'All Types',
  developer: 'All Developers',
  status: 'All Status',
  beds: 'Any Beds',
  price: 'Any Price'
};

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

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

  const [currentPage, setCurrentPage] = useState(1);
  const listingMode = String(searchParams.get('listing') || 'buy').toLowerCase();
  const heroLocation = String(searchParams.get('location') || '').trim();
  const heroType = String(searchParams.get('type') || '').trim();
  const presetDeveloper = searchParams.get('developer') || '';
  const presetSearch = searchParams.get('q') || '';
  const hasAppliedUrlPresetRef = useRef(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { fetchLocalProperties } = await import('../services/localDataService');
      const mappedProperties = await fetchLocalProperties();

      // Client-side Sort: Ready > Off-Plan > Others
      mappedProperties.sort((a, b) => {
        const getScore = (p) => {
          const s = (p.status || []).map((x) => String(x).toLowerCase());
          if (s.includes('ready')) return 3;
          if (s.includes('off-plan')) return 2;
          return 1;
        };
        return getScore(b) - getScore(a);
      });

      setAllProperties(mappedProperties);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Derive options from dynamic data
  const locations = useMemo(
    () => ['All Locations', ...new Set(allProperties.map((p) => p.location?.area).filter(Boolean))],
    [allProperties]
  );
  const types = useMemo(() => {
    const preferred = ['Apartment', 'Townhouse', 'Studio', 'Villa', 'Penthouse'];
    const dynamic = Array.from(new Set(allProperties.map((p) => p.type).filter(Boolean)));
    const ordered = [...preferred.filter((t) => dynamic.includes(t)), ...dynamic.filter((t) => !preferred.includes(t))];
    return ['All Types', ...ordered];
  }, [allProperties]);
  const developers = useMemo(
    () => ['All Developers', ...new Set(allProperties.map((p) => p.developer).filter(Boolean))],
    [allProperties]
  );
  // Keep static options for consistent UI
  const statuses = ['All Status', 'Ready', 'Off-Plan', 'Under Construction'];
  const beds = ['Any Beds', 'Studio (0)', '1', '2', '3', '4', '5+'];
  const prices = ['Any Price', 'Under 1M', '1M - 3M', '3M - 5M', '5M - 10M', 'Above 10M'];

  useEffect(() => {
    if (!allProperties.length) return;
    if (hasAppliedUrlPresetRef.current) return;

    const findMatch = (options, value) =>
      options.find((option) => String(option).trim().toLowerCase() === String(value).trim().toLowerCase());

    const nextFilters = { ...DEFAULT_FILTERS };
    nextFilters.status =
      listingMode === 'off-plan'
        ? 'Off-Plan'
        : listingMode === 'rent'
          ? 'Ready'
          : DEFAULT_FILTERS.status;
    nextFilters.location = findMatch(locations, heroLocation) || DEFAULT_FILTERS.location;
    nextFilters.type = findMatch(types, heroType) || DEFAULT_FILTERS.type;
    nextFilters.developer = findMatch(developers, presetDeveloper) || DEFAULT_FILTERS.developer;

    setFilters(nextFilters);

    const fallbackParts = [];
    if (heroLocation && nextFilters.location === DEFAULT_FILTERS.location) fallbackParts.push(heroLocation);
    if (heroType && nextFilters.type === DEFAULT_FILTERS.type) fallbackParts.push(heroType);
    if (presetSearch) fallbackParts.push(presetSearch);
    setSearchQuery(fallbackParts.join(' ').trim());
    hasAppliedUrlPresetRef.current = true;
  }, [allProperties, listingMode, heroLocation, heroType, presetDeveloper, presetSearch, locations, types, developers]);

  const handleFilterSelect = (category, value) => {
    setFilters(prev => ({ ...prev, [category]: value }));
    setActiveDropdown(null);
  };

  // Client-side Filtering Logic (Preserved)
  const filteredProperties = allProperties.filter(property => {
    const normalizedArea = String(property.location?.area || '').trim().toLowerCase();
    const normalizedType = String(property.type || '').trim().toLowerCase();
    const normalizedDeveloper = String(property.developer || '').trim().toLowerCase();

    // Search Query
    if (searchQuery) {
      const query = searchQuery.trim().toLowerCase();
      const match = String(property.title || '').toLowerCase().includes(query) ||
        normalizedArea.includes(query) ||
        normalizedDeveloper.includes(query);
      if (!match) return false;
    }

    // Dropdown Filters
    if (filters.location !== 'All Locations' && normalizedArea !== String(filters.location).trim().toLowerCase()) return false;
    if (filters.type !== 'All Types' && normalizedType !== String(filters.type).trim().toLowerCase()) return false;
    if (filters.developer !== 'All Developers' && normalizedDeveloper !== String(filters.developer).trim().toLowerCase()) return false;

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

  // Pagination: reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters.location, filters.type, filters.developer, filters.status, filters.beds, filters.price]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE));
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push('…');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

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
      <div className="bg-[#1a1a2e] py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Explore Properties</h1>
          <p className="text-stone-400 mt-3 max-w-xl">
            Discover Dubai's finest properties from world-renowned developers. Use the filters below to find your perfect match.
            {listingMode === 'off-plan' ? ' Showing off-plan opportunities.' : listingMode === 'rent' ? ' Showing ready-to-move properties for rent mode.' : ''}
          </p>
        </div>
      </div>

      {/* Filters and Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-stone-600">
            <span className="font-semibold text-stone-800">{filteredProperties.length}</span> properties found
            {filteredProperties.length > 0 && (
              <span className="text-stone-500 ml-1">
                (showing {startIndex + 1}–{Math.min(startIndex + PROPERTIES_PER_PAGE, filteredProperties.length)})
              </span>
            )}
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
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-stone-500">
              <p className="text-lg">No properties found matching your criteria.</p>
              <button
                onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                className="mt-4 text-[#3b82f6] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && filteredProperties.length > 0 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, i) =>
                page === '…' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-stone-400">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#1a1a2e] text-white'
                        : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}

      </div>
    </div>
  );
}
