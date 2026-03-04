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
            city: "Dubai"
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
            city: "Dubai"
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
            city: "Dubai"
        },
        description: "Ultra-luxury mansion overlooking the championship golf course. The epitome of modern living.",
        amenities: ["Golf Course", "Clubhouse", "Park", "Pool", "Gym"],
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80"
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
