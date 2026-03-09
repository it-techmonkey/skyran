import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { contactInfo } from '../data/contact';
import { properties as staticProperties } from '../data/properties';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// Fix Leaflet default marker icon with bundlers (Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const iconMap = {
  MapPin,
  Phone,
  Mail,
  Clock,
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [mapProperties, setMapProperties] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchLocalPropertiesWithCoords } = await import('../services/localDataService');
        const withCoords = await fetchLocalPropertiesWithCoords();
        if (!cancelled && Array.isArray(withCoords) && withCoords.length > 0) {
          setMapProperties(withCoords);
          return;
        }
      } catch (_) { /* ignore */ }
      if (!cancelled) setMapProperties(staticProperties);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, you would send this to a backend
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy-dark py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-[#3b82f6] text-sm font-medium uppercase tracking-wider">GET IN TOUCH</span>
          <br></br>
          <h1 className="text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl text-left">
            Have questions about a property or need expert advice? Our team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Layout */}
      <section className="py-16 lg:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Contact Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = iconMap[info.icon];
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-dark mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.content.map((line, idx) => (
                            <p key={idx} className="text-sm text-text-gray">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-2">
                Send Us a Message
              </h2>
              <p className="text-text-gray mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text-dark mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+971 4 272 5xxx"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us how we can help you..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  icon={Send}
                  iconPosition="right"
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - property markers with latitude/longitude */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden shadow-xl h-[340px] sm:h-[420px] md:h-[500px]">
            <MapContainer
              center={[25.2048, 55.2708]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
              attributionControl={false}
            >
              <TileLayer
                attribution=""
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
              />
              {mapProperties
                .filter((p) => {
                  const lat = p.latitude ?? p.location?.latitude;
                  const lng = p.longitude ?? p.location?.longitude;
                  return lat != null && lng != null;
                })
                .map((property) => {
                  const lat = property.latitude ?? property.location?.latitude;
                  const lng = property.longitude ?? property.location?.longitude;
                  const area = property.location?.area ?? 'Location';
                  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                  return (
                    <Marker
                      key={property.id}
                      position={[lat, lng]}
                    >
                      <Popup>
                        <strong>{property.title}</strong>
                        <br />
                        {area}
                        <br />
                        <span className="text-stone-500 text-xs">
                          {lat}, {lng}
                        </span>
                        <br />
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3b82f6] text-sm font-medium hover:underline mt-1 inline-block"
                        >
                          Open in Google Maps →
                        </a>
                      </Popup>
                    </Marker>
                  );
                })}
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

