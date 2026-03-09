import { useState } from 'react';
import { MapPin, Home as House, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { heroStats } from '../../data/features';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    const listingMap = {
      Buy: 'buy',
      Rent: 'rent',
      'Off plan': 'off-plan',
    };
    params.set('listing', listingMap[activeTab] || 'buy');
    if (selectedLocation) params.set('location', selectedLocation.trim());
    if (selectedType) params.set('type', selectedType.trim());
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80" 
          alt="Dubai Skyline" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/90 via-[#1a1a2e]/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 bg-[#3b82f6]/20 text-[#3b82f6] text-sm font-medium rounded-full mb-6">
            Dubai's Premier Real Estate
          </span>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Discover Your
            <span className="block text-[#3b82f6]">Dream Property</span>
            in Dubai
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-stone-300 mb-8 md:mb-10 leading-relaxed">
            Explore exclusive properties from Dubai's most prestigious developers. From iconic waterfront residences to luxury penthouses with breathtaking views.
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 p-1 overflow-x-auto whitespace-nowrap no-scrollbar">
              <button
                onClick={() => setActiveTab('Buy')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'Buy'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('Rent')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'Rent'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Rent
              </button>
              <button
                onClick={() => setActiveTab('Off plan')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'Off plan'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Off plan
              </button>
            </div>

            {/* Search Inputs */}
            <div className="flex flex-col md:flex-row gap-3 p-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Business Bay">Business Bay</option>
                  <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <House className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] appearance-none cursor-pointer"
                >
                  <option value="">Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-4 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#2d2d2d] transition-colors w-full md:w-auto"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap gap-6 md:gap-8 mt-10 md:mt-12">
            {heroStats.map((stat, index) => (
              <div key={index} className="text-white">
                <p className="text-3xl font-bold text-[#3b82f6]">{stat.value}</p>
                <p className="text-sm text-stone-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

