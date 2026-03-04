import { Shield, Target, Heart, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aboutStats, values, team } from '../data/team';
import Badge from '../components/ui/Badge';

const valueIconMap = {
  Shield,
  Target,
  Heart,
  Eye,
};

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy-dark py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
          <span className="text-[#3b82f6] text-sm font-medium uppercase tracking-wider">About Us</span>
          <br></br>Dubai's Most Trusted{' '}<br></br>
            <span className="text-primary-blue">Real Estate Partner</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl  leading-relaxed text-left">
            With over 15 years of experience, LUXE Dubai Properties has established itself as the premier destination for luxury real estate in Dubai. We connect discerning clients with exceptional properties from the region's most prestigious developers.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <span className="text-[#3b82f6] text-sm font-medium uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">A Legacy of Excellence in Dubai Real Estate</h2>
              <p className="text-stone-600 mt-6 leading-relaxed">
                Founded in 2009, LUXE Dubai Properties was born from a vision to redefine the real estate experience in one of the world's most dynamic property markets. What started as a boutique agency has grown into a full-service real estate consultancy, serving a global clientele of investors, homeowners, and corporations.
              </p>
              <p className="text-stone-600 mt-4 leading-relaxed">
                Our deep-rooted partnerships with Dubai's leading developers—including Emaar, Damac, Meraas, and Nakheel—allow us to offer exclusive access to the most sought-after properties before they hit the market.
              </p>
              
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                {aboutStats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-3xl font-bold text-[#3b82f6]">{stat.value}</p>
                    <p className="text-stone-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Luxury Property"
                className="rounded-2xl shadow-2xl"
              />
              {/* RERA Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-6 h-6 text-[#3b82f6]">
                      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                      <circle cx="12" cy="8" r="6"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">RERA Certified</p>
                    <p className="text-sm text-stone-500">Licensed Broker</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="bg-primary-blue/10 border-primary-blue text-primary-blue mb-4">
              OUR VALUES
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-dark mb-4">
              What Drives Us Forward
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = valueIconMap[value.icon];
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-primary-blue" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-gray text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#3b82f6] text-sm font-medium uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">Meet The Experts</h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">
              Our dedicated team of real estate professionals brings decades of combined experience and local market expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {team.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-stone-300 text-sm">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a2e] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Your Journey?</h2>
          <p className="text-stone-400 mt-4 text-lg">Let our experts guide you to your perfect property in Dubai.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/properties">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] px-8 py-6 text-base">
                Browse Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-9 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

