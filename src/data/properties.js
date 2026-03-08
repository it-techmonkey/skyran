export const properties = [
    {
        id: 1,
        title: "Luxury Downtown Apartment",
        type: "Apartment",
        status: ["Ready"],
        price: 2500000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        developer: "Emaar Properties",
        location: {
            area: "Downtown Dubai",
            city: "Dubai",
            latitude: 25.1972,
            longitude: 55.2744
        },
        description: "Stunning views of Burj Khalifa and the Dubai Fountain. Direct access to Dubai Mall.",
        amenities: ["Pool", "Gym", "Parking", "Concierge", "Security"],
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"
    },
    {
        id: 2,
        title: "Palm Jumeirah Villa",
        type: "Villa",
        status: ["Ready"],
        price: 15000000,
        bedrooms: 5,
        bathrooms: 6,
        squareFeet: 5000,
        developer: "Nakheel",
        location: {
            area: "Palm Jumeirah",
            city: "Dubai",
            latitude: 25.1124,
            longitude: 55.1390
        },
        description: "Exclusive beachfront living on the world-famous Palm Jumeirah. Private beach access.",
        amenities: ["Private Beach", "Pool", "Garden", "Maid's Room", "Security"],
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80"
    },
    {
        id: 3,
        title: "Dubai Hills Estate Mansion",
        type: "Villa",
        status: ["Off-Plan"],
        price: 25000000,
        bedrooms: 6,
        bathrooms: 7,
        squareFeet: 8000,
        developer: "Emaar Properties",
        location: {
            area: "Dubai Hills Estate",
            city: "Dubai",
            latitude: 25.1173,
            longitude: 55.2010
        },
        description: "Ultra-luxury mansion overlooking the championship golf course. The epitome of modern living.",
        amenities: ["Golf Course", "Clubhouse", "Park", "Pool", "Gym"],
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"
    },
    {
        id: 4,
        title: "Business Bay Penthouse",
        type: "Apartment",
        status: ["Ready"],
        price: 4200000,
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 2800,
        developer: "Emaar Properties",
        location: {
            area: "Business Bay",
            city: "Dubai",
            latitude: 25.1852,
            longitude: 55.2810
        },
        description: "Stunning penthouse with panoramic views of Dubai Canal and skyline.",
        amenities: ["Pool", "Gym", "Concierge", "Parking", "Security"],
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
    },
    {
        id: 5,
        title: "JBR Beachfront Apartment",
        type: "Apartment",
        status: ["Ready"],
        price: 3800000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1500,
        developer: "Meraas",
        location: {
            area: "Jumeirah Beach Residence",
            city: "Dubai",
            latitude: 25.0782,
            longitude: 55.1280
        },
        description: "Beachfront living with direct access to the walk and sea views.",
        amenities: ["Beach Access", "Pool", "Gym", "Parking"],
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
    },
    {
        id: 6,
        title: "Arabian Ranches Family Villa",
        type: "Villa",
        status: ["Ready"],
        price: 5200000,
        bedrooms: 4,
        bathrooms: 5,
        squareFeet: 3500,
        developer: "Emaar Properties",
        location: {
            area: "Arabian Ranches",
            city: "Dubai",
            latitude: 25.0595,
            longitude: 55.3650
        },
        description: "Spacious family villa in a peaceful community with golf and parks.",
        amenities: ["Golf", "Park", "Pool", "Garden", "Security"],
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
    },
    {
        id: 7,
        title: "Dubai Marina Tower",
        type: "Apartment",
        status: ["Off-Plan"],
        price: 1950000,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 750,
        developer: "DAMAC Properties",
        location: {
            area: "Dubai Marina",
            city: "Dubai",
            latitude: 25.0800,
            longitude: 55.1390
        },
        description: "Modern studio and one-bed units with marina and sea views.",
        amenities: ["Marina View", "Gym", "Pool", "Parking"],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
    },
    {
        id: 8,
        title: "Meydan Heights Apartment",
        type: "Apartment",
        status: ["Ready"],
        price: 3100000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1400,
        developer: "Sobha Realty",
        location: {
            area: "Meydan",
            city: "Dubai",
            latitude: 25.1310,
            longitude: 55.2080
        },
        description: "Contemporary apartment near Meydan Racecourse and Downtown.",
        amenities: ["Pool", "Gym", "Parking", "Concierge"],
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"
    },
    {
        id: 9,
        title: "Creek Beach Residency",
        type: "Apartment",
        status: ["Off-Plan"],
        price: 1650000,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 650,
        developer: "Emaar Properties",
        location: {
            area: "Dubai Creek Harbour",
            city: "Dubai",
            latitude: 25.1930,
            longitude: 55.3280
        },
        description: "Affordable off-plan units with creek and city views.",
        amenities: ["Pool", "Gym", "Beach", "Parking"],
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80"
    }
];

export const formatPrice = (price) => {
    if (price >= 1000000) {
        return `AED ${(price / 1000000).toFixed(2)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
};

export const formatSquareFeet = (sqft) => {
    return `${sqft.toLocaleString()} sq.ft`;
};

export const getPropertyById = (id) => {
    return properties.find(p => p.id === parseInt(id));
};
