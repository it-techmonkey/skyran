import { Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-14 md:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80" 
              alt="Dubai Luxury Property" 
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/80 to-[#1a1a2e]/60"></div>
          </div>

          {/* Content */}
          <div className="relative px-5 py-12 sm:px-8 sm:py-16 md:p-20">
            <div className="max-w-2xl">
              {/* Badge */}
              <span className="inline-block px-4 py-1.5 bg-[#3b82f6]/20 text-[#3b82f6] text-sm font-medium rounded-full mb-6">
                Start Your Journey
              </span>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Find Your
                <span className="block text-[#3b82f6]">Perfect Property?</span>
              </h2>

              {/* Description */}
              <p className="text-stone-300 mt-6 text-base md:text-lg leading-relaxed">
                Our expert consultants are here to guide you through every step. Schedule a free consultation today and discover exclusive opportunities in Dubai's finest developments.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                {/* Left Button - Very Dark */}
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#2d2d2d] transition-colors w-full sm:w-auto"
                >
                  Book Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Right Button - Semi-transparent with border */}
                <a 
                  href="tel:+971501234567"
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-white/10 backdrop-blur-md text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10 w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5" />
                  +971 4 272 5641
                </a>
              </div>

              {/* Feature List with Green Dots */}
              <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-white/10">
                <div className="flex items-center gap-2 text-stone-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  Available 7 Days a Week
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  Free Property Consultation
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  No Obligation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

