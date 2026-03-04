import { useState } from 'react';
import { MapPin, Home as House, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroStats } from '../../data/features';

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('Buy');

  return (
    <section className="relative min-h-[90vh] flex items-center">
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
      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 bg-[#3b82f6]/20 text-[#3b82f6] text-sm font-medium rounded-full mb-6">
            Dubai's Premier Real Estate
          </span>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Discover Your
            <span className="block text-[#3b82f6]">Dream Property</span>
            in Dubai
          </h1>

          {/* Description */}
          <p className="text-lg text-stone-300 mb-10 leading-relaxed">
            Explore exclusive properties from Dubai's most prestigious developers. From iconic waterfront residences to luxury penthouses with breathtaking views.
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 p-1">
              <button
                onClick={() => setActiveTab('Buy')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'Buy'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('Rent')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'Rent'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Rent
              </button>
              <button
                onClick={() => setActiveTab('Off plan')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
                <select className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] appearance-none cursor-pointer">
                  <option value="">All Locations</option>
                  <option value="downtown">Downtown Dubai</option>
                  <option value="palm">Palm Jumeirah</option>
                  <option value="marina">Dubai Marina</option>
                  <option value="business-bay">Business Bay</option>
                  <option value="dubai-hills">Dubai Hills Estate</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <House className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] appearance-none cursor-pointer">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              <Link 
                to="/properties"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#2d2d2d] transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap gap-8 mt-12">
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

