import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Share2, Heart, MapPin, Bed, Bath, Square, Building2, Mail, Calendar, Phone, Check, Loader2, AlertCircle } from 'lucide-react';

// Helper functions (moved from data/properties.js to decouple)
const formatPrice = (price) => {
  if (!price) return 'Price on Request';
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(2)}M`;
  }
  return `AED ${(price / 1000).toFixed(0)}K`;
};

const formatSquareFeet = (sqft) => {
  if (!sqft) return 'N/A sq.ft';
  return `${sqft.toLocaleString()} sq.ft`;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { getLocalPropertyById, getDescriptionForProperty } = await import('../services/localDataService');
        let mappedProperty = await getLocalPropertyById(id);

        if (mappedProperty) {
          const richDescription = await getDescriptionForProperty(mappedProperty);
          if (richDescription) {
            mappedProperty = { ...mappedProperty, description: richDescription, descriptionIsHtml: true };
          } else {
            mappedProperty = { ...mappedProperty, description: mappedProperty.description || 'No description available.', descriptionIsHtml: false };
          }
          mappedProperty.amenities = mappedProperty.amenities || ['24/7 Security', 'Parking', 'Gym', 'Pool'];
          setProperty(mappedProperty);
          setLoading(false);
          return;
        }

        const response = await import('../services/projectService').then((module) => module.fetchProjectById(id));
        let mapped = null;
        if (response.success && response.data) {
          mapped = Array.isArray(response.data) ? response.data[0] : response.data;
        }

        if (mapped) {
          let statusStr = mapped.category || 'Available';
          if (statusStr === 'Off_plan') statusStr = 'Off-Plan';
          let bedCount = 0;
          const minBed = mapped.min_bedrooms ? mapped.min_bedrooms.toLowerCase() : '';
          if (minBed === 'studio') bedCount = 0;
          else if (minBed === 'one') bedCount = 1;
          else if (minBed === 'two') bedCount = 2;
          else if (minBed === 'three') bedCount = 3;
          else if (minBed === 'four') bedCount = 4;
          else if (minBed === 'five' || minBed === 'five+') bedCount = 5;
          else bedCount = parseInt(minBed, 10) || (mapped.bedrooms || 2);

          let imageList = [];
          if (mapped.image_urls?.length) imageList = mapped.image_urls;
          else if (mapped.images?.length) imageList = mapped.images;
          else imageList = [mapped.cover_image || 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80'];
          if (imageList.length === 0) imageList = ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80'];

          const devName = mapped.developer_name || mapped.Developer?.Company?.name || mapped.dev?.Company?.name || mapped.developer?.Company?.name || mapped.dev_name || 'Private Seller';
          const devLogo = mapped.Developer?.Company?.logo || mapped.dev?.Company?.logo || mapped.developer?.Company?.logo || null;
          const richDescription = await getDescriptionForProperty({
            slug: mapped.slug || mapped.slug_id,
            title: mapped.title || mapped.project_name || mapped.name,
            id: mapped._id || mapped.id,
          });

          const mappedProperty = {
            id: mapped._id || mapped.id,
            title: mapped.title || mapped.project_name || mapped.name || 'Untitled Project',
            status: [statusStr],
            location: { area: mapped.locality || mapped.location_name || mapped.address || 'Dubai' },
            price: mapped.min_price || mapped.price || 0,
            developer: devName,
            developerLogo: devLogo,
            bedrooms: bedCount,
            bathrooms: mapped.min_bathrooms || mapped.bathrooms || 2,
            squareFeet: mapped.min_sq_ft || mapped.size || 0,
            image: imageList[0],
            images: imageList,
            type: (mapped.type?.length ? mapped.type[0] : null) || mapped.project_type || 'Apartment',
            description: richDescription || mapped.description || 'No description available.',
            descriptionIsHtml: !!richDescription,
            amenities: (mapped.amenities?.length && mapped.amenities) || ['24/7 Security', 'Parking', 'Gym', 'Pool']
          };
          setProperty(mappedProperty);
        } else {
          throw new Error('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        try {
          const { getPropertyById } = await import('../data/properties');
          const local = getPropertyById(id);
          if (local) {
            setProperty({
              ...local,
              images: [local.image],
              description: local.description || 'No description available.',
              descriptionIsHtml: false,
              amenities: Array.isArray(local.amenities) && local.amenities.length > 0 ? local.amenities : ['24/7 Security', 'Parking', 'Gym', 'Pool']
            });
            setError(null);
            setLoading(false);
            return;
          }
        } catch (_) { /* ignore */ }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Error Loading Property</h1>
          <p className="mb-4">{error || 'Property not found'}</p>
          <Link to="/properties" className="text-[#3b82f6] hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [property.image];
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const enquirySubject = encodeURIComponent(`Enquiry for ${property.title}`);
  const enquiryBody = encodeURIComponent(
    `Hello SkyRan Team,\n\nI am interested in this property:\n${property.title}\nLocation: ${property.location?.area || 'Dubai'}\nPrice: ${formatPrice(property.price)}\nLink: ${window.location.href}\n\nPlease contact me with more details.\n`
  );
  const enquiryMailto = `mailto:info@skyran.ae?subject=${enquirySubject}&body=${enquiryBody}`;
  const whatsappText = encodeURIComponent(
    `Hello, I am interested in "${property.title}" (${formatPrice(property.price)}). Please share more details.\n${window.location.href}`
  );
  const whatsappUrl = `https://wa.me/97142725641?text=${whatsappText}`;

  return (
    <main className="pb-24 lg:pb-0"> {/* Add padding bottom for mobile sticky bar */}
      <div className="min-h-screen bg-stone-50">
        {/* Back Button Section */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-[#3b82f6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Properties
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-200">
                <div className="aspect-[16/10] cursor-pointer relative">
                  <img
                    src={currentImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Buttons */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Status Badge */}
                  {property.status.includes('Ready') && (
                    <div className="inline-flex items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 absolute top-4 left-4 bg-emerald-500 text-white border-0 px-4 py-1.5 text-sm font-medium">
                      Ready
                    </div>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 text-white text-sm rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 p-4">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => selectImage(index)}
                        className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                          ? 'border-[#B8860B]'
                          : 'border-transparent'
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info Card */}
              <div className="bg-white rounded-2xl p-5 md:p-8 border border-stone-100">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-stone-500">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location.area}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-full"
                      aria-label="Share property"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-full ${isFavorited ? 'text-red-500' : ''
                        }`}
                      aria-label="Add to favorites"
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="text-3xl font-bold text-[#1a1a1a] mb-8">
                  {formatPrice(property.price, true)}
                </p>

                {/* Property Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-stone-100">
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-stone-50 flex items-center justify-center mb-2">
                        <Bed className="w-5 h-5 text-stone-600" />
                      </div>
                      <p className="text-lg font-semibold text-stone-800">{property.bedrooms}</p>
                      <p className="text-sm text-stone-500">Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-stone-50 flex items-center justify-center mb-2">
                        <Bath className="w-5 h-5 text-stone-600" />
                      </div>
                      <p className="text-lg font-semibold text-stone-800">{property.bathrooms}</p>
                      <p className="text-sm text-stone-500">Bathrooms</p>
                    </div>
                  )}
                  {property.squareFeet > 0 && (
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-stone-50 flex items-center justify-center mb-2">
                        <Square className="w-5 h-5 text-stone-600" />
                      </div>
                      <p className="text-lg font-semibold text-stone-800">
                        {property.squareFeet.toLocaleString()}
                      </p>
                      <p className="text-sm text-stone-500">Sq. Ft.</p>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-stone-50 flex items-center justify-center mb-2">
                      <Building2 className="w-5 h-5 text-stone-600" />
                    </div>
                    <p className="text-lg font-semibold text-stone-800">{property.type}</p>
                    <p className="text-sm text-stone-500">Type</p>
                  </div>
                </div>
              </div>

              {/* About This Property */}
              <div className="bg-white rounded-2xl p-5 md:p-8 border border-stone-100">
                <h2 className="text-xl font-bold text-stone-800 mb-4">About This Property</h2>
                {property.descriptionIsHtml ? (
                  <div
                    className="text-stone-600 leading-relaxed [&_p]:mb-3 [&_ul]:my-3 [&_li]:my-1 [&_a]:text-[#3b82f6] [&_a]:underline [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                ) : (
                  <div className="text-stone-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-5 md:p-8 border border-stone-100">
                <h2 className="text-xl font-bold text-stone-800 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-stone-700 text-sm md:text-base">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="hidden lg:block sticky top-28 space-y-6">
                {/* Developer Info */}
                <div className="bg-white rounded-2xl p-6 border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                      {property.developerLogo ? (
                        <img src={property.developerLogo} alt={property.developer} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-7 h-7 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stone-500">Developer</p>
                      <p className="font-semibold text-stone-800 truncate">{property.developer}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-white rounded-2xl p-6 border border-stone-100">
                  <h3 className="text-lg font-bold text-stone-800 mb-4">
                    Interested in this property?
                  </h3>
                  <p className="text-stone-500 text-sm mb-6">
                    Contact our team for more information or to schedule a viewing.
                  </p>
                  <div className="space-y-3">
                    <a href={enquiryMailto} className="block w-full">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow h-9 px-4 py-2 w-full bg-[#1a1a1a] text-white hover:bg-[#2d2d2d]">
                        <Mail className="w-4 h-4" />
                        Request Information
                      </button>
                    </a>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border bg-background shadow-sm h-9 px-4 py-2 w-full border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10">
                        <Calendar className="w-4 h-4" />
                        Schedule Viewing
                      </button>
                    </a>
                    <a href="tel:+97142725641" className="block w-full">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full">
                        <Phone className="w-4 h-4" />
                        +971 4 272 5641
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Developer Info (Vertical Stack on Mobile) */}
              <div className="lg:hidden mt-8 space-y-6">
                {/* Developer Info */}
                <div className="bg-white rounded-2xl p-5 border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                      {property.developerLogo ? (
                        <img src={property.developerLogo} alt={property.developer} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-7 h-7 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stone-500">Developer</p>
                      <p className="font-semibold text-stone-800 truncate">{property.developer}</p>
                    </div>
                  </div>
                </div>
                {/* Contact Card is hidden on mobile in this section, will use sticky bar instead */}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center gap-3">
        <a href="tel:+97142725641" className="flex-1">
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium h-12 border border-stone-200 bg-white text-stone-800 hover:bg-stone-50">
            <Phone className="w-4 h-4" />
            Call
          </button>
        </a>
        <a href={enquiryMailto} className="flex-1">
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium h-12 bg-[#1a1a1a] text-white hover:bg-[#2d2d2d]">
            <Calendar className="w-4 h-4" />
            Enquire
          </button>
        </a>
      </div>

    </main>
  );
}

