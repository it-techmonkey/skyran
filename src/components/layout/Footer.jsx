import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '../../assets/skyran_logo.png';

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Skyran Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted partner in finding the perfect property in Dubai. We connect you with the finest developments from top-tier developers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm hover:text-primary-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm hover:text-primary-blue transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/developers" className="text-sm hover:text-primary-blue transition-colors">
                  Developers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary-blue transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Areas</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/properties?area=downtown" className="text-sm hover:text-primary-blue transition-colors">
                  Downtown Dubai
                </Link>
              </li>
              <li>
                <Link to="/properties?area=palm" className="text-sm hover:text-primary-blue transition-colors">
                  Palm Jumeirah
                </Link>
              </li>
              <li>
                <Link to="/properties?area=marina" className="text-sm hover:text-primary-blue transition-colors">
                  Dubai Marina
                </Link>
              </li>
              <li>
                <Link to="/properties?area=business-bay" className="text-sm hover:text-primary-blue transition-colors">
                  Business Bay
                </Link>
              </li>
              <li>
                <Link to="/properties?area=dubai-hills" className="text-sm hover:text-primary-blue transition-colors">
                  Dubai Hills Estate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-primary-blue" />
                <span className="text-sm">
                  Ontario Tower - Business Bay - Dubai - United Arab Emirates
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-primary-blue" />
                <a href="tel:+97142725641" className="text-sm hover:text-primary-blue transition-colors">
                  +971 4 272 5641
                </a>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">
                  24 Hours<br /><span className="text-xs text-gray-500">Sundays and Public holidays available for viewing on call</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 text-center md:text-left">
          <p>Copyright © 2025 SkyRan Real Estate L.L.C - All Rights Reserved.</p>

        </div>
      </div>
    </footer>
  );
}

