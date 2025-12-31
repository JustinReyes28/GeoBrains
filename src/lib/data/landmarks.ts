export interface LandmarkData {
    id: string;
    name: string;
    country: string;
    city: string;
    region: string;
    imagePath: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

const PLACEHOLDER_IMAGE = "/landmarks/placeholder.png";

export const landmarksData: LandmarkData[] = [
    {
        id: "taj-mahal",
        name: "Taj Mahal",
        country: "India",
        city: "Agra",
        region: "Asia",
        imagePath: "/landmarks/Taj-Mahal.jpeg",
        coordinates: { lat: 27.1751, lng: 78.0421 }
    },
    {
        id: "great-wall",
        name: "Great Wall of China",
        country: "China",
        city: "Beijing",
        region: "Asia",
        imagePath: "/landmarks/great-wall-china.jpg",
        coordinates: { lat: 40.4319, lng: 116.5704 }
    },
    {
        id: "eiffel-tower",
        name: "Eiffel Tower",
        country: "France",
        city: "Paris",
        region: "Europe",
        imagePath: "/landmarks/Eiffel-Tower.webp",
        coordinates: { lat: 48.8584, lng: 2.2945 }
    },
    {
        id: "colosseum",
        name: "Colosseum",
        country: "Italy",
        city: "Rome",
        region: "Europe",
        imagePath: "/landmarks/colosseum.jpg",
        coordinates: { lat: 41.8902, lng: 12.4922 }
    },
    {
        id: "statue-of-liberty",
        name: "Statue of Liberty",
        country: "USA",
        city: "New York",
        region: "Americas",
        imagePath: "/landmarks/Statue-of-liberty.jpg",
        coordinates: { lat: 40.6892, lng: -74.0445 }
    },
    {
        id: "machu-picchu",
        name: "Machu Picchu",
        country: "Peru",
        city: "Cusco Region",
        region: "Americas",
        imagePath: "/landmarks/Machu-Picchu.jpg",
        coordinates: { lat: -13.1631, lng: -72.5450 }
    },
    {
        id: "christ-redeemer",
        name: "Christ the Redeemer",
        country: "Brazil",
        city: "Rio de Janeiro",
        region: "Americas",
        imagePath: "/landmarks/christ-the-redeemer.jpg",
        coordinates: { lat: -22.9519, lng: -43.2105 }
    },
    {
        id: "sydney-opera-house",
        name: "Sydney Opera House",
        country: "Australia",
        city: "Sydney",
        region: "Oceania",
        imagePath: "/landmarks/sydney opera house.jpg",
        coordinates: { lat: -33.8568, lng: 151.2153 }
    },
    {
        id: "pyramids-giza",
        name: "Pyramids of Giza",
        country: "Egypt",
        city: "Giza",
        region: "Africa",
        imagePath: "/landmarks/Giza Pyramid.jpg",
        coordinates: { lat: 29.9792, lng: 31.1342 }
    },
    {
        id: "big-ben",
        name: "Big Ben",
        country: "United Kingdom",
        city: "London",
        region: "Europe",
        imagePath: "/landmarks/big ben.jpg",
        coordinates: { lat: 51.5007, lng: -0.1246 }
    },
    {
        id: "burj-khalifa",
        name: "Burj Khalifa",
        country: "UAE",
        city: "Dubai",
        region: "Asia",
        imagePath: "/landmarks/burj khalifa.jpg",
        coordinates: { lat: 25.1972, lng: 55.2744 }
    },
    {
        id: "golden-gate-bridge",
        name: "Golden Gate Bridge",
        country: "USA",
        city: "San Francisco",
        region: "Americas",
        imagePath: "/landmarks/golden gate bridge.jpg",
        coordinates: { lat: 37.8199, lng: -122.4783 }
    },
    {
        id: "mount-fuji",
        name: "Mount Fuji",
        country: "Japan",
        city: "Honshu",
        region: "Asia",
        imagePath: "/landmarks/mount fuji.jpg",
        coordinates: { lat: 35.3606, lng: 138.7274 }
    },
    {
        id: "santorini",
        name: "Santorini",
        country: "Greece",
        city: "Santorini",
        region: "Europe",
        imagePath: "/landmarks/santorini.jpg",
        coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    {
        id: "angkor-wat",
        name: "Angkor Wat",
        country: "Cambodia",
        city: "Siem Reap",
        region: "Asia",
        imagePath: "/landmarks/Angkor Wat.jpg",
        coordinates: { lat: 13.4125, lng: 103.8670 }
    },
    {
        id: "petra",
        name: "Petra",
        country: "Jordan",
        city: "Ma'an",
        region: "Asia",
        imagePath: "/landmarks/Petra.jpg",
        coordinates: { lat: 30.3285, lng: 35.4444 }
    },
    {
        id: "stonehenge",
        name: "Stonehenge",
        country: "United Kingdom",
        city: "Wiltshire",
        region: "Europe",
        imagePath: "/landmarks/Stonehenge.jpg",
        coordinates: { lat: 51.1789, lng: -1.8262 }
    },
    {
        id: "leaning-tower-pisa",
        name: "Leaning Tower of Pisa",
        country: "Italy",
        city: "Pisa",
        region: "Europe",
        imagePath: "/landmarks/leaning-tower-pisa.jpg",
        coordinates: { lat: 43.7230, lng: 10.3966 }
    },
    {
        id: "sagrada-familia",
        name: "Sagrada Familia",
        country: "Spain",
        city: "Barcelona",
        region: "Europe",
        imagePath: "/landmarks/Sagrada Familia.jpg",
        coordinates: { lat: 41.4036, lng: 2.1744 }
    },
    {
        id: "brandenburg-gate",
        name: "Brandenburg Gate",
        country: "Germany",
        city: "Berlin",
        region: "Europe",
        imagePath: "/landmarks/Brandenburg Gate.jpg",
        coordinates: { lat: 52.5163, lng: 13.3777 }
    },
    {
        id: "neuschwanstein",
        name: "Neuschwanstein Castle",
        country: "Germany",
        city: "Schwangau",
        region: "Europe",
        imagePath: "/landmarks/Neuschwanstein Castle.jpg",
        coordinates: { lat: 47.5576, lng: 10.7498 }
    },
    {
        id: "chichen-itza",
        name: "Chichen Itza",
        country: "Mexico",
        city: "Yucatan",
        region: "Americas",
        imagePath: "/landmarks/Chichen Itza.jpg",
        coordinates: { lat: 20.6843, lng: -88.5678 }
    },
    {
        id: "niagara-falls",
        name: "Niagara Falls",
        country: "USA/Canada",
        city: "Ontario/New York",
        region: "Americas",
        imagePath: "/landmarks/Niagara Falls.jpg",
        coordinates: { lat: 43.0962, lng: -79.0377 }
    },
    {
        id: "victoria-falls",
        name: "Victoria Falls",
        country: "Zambia/Zimbabwe",
        city: "Livingstone",
        region: "Africa",
        imagePath: "/landmarks/Victoria Falls.jpg",
        coordinates: { lat: -17.9243, lng: 25.8572 }
    },
    {
        id: "table-mountain",
        name: "Table Mountain",
        country: "South Africa",
        city: "Cape Town",
        region: "Africa",
        imagePath: "/landmarks/Table Mountain.jpg",
        coordinates: { lat: -33.9628, lng: 18.4098 }
    },
    {
        id: "mount-rushmore",
        name: "Mount Rushmore",
        country: "USA",
        city: "South Dakota",
        region: "Americas",
        imagePath: "/landmarks/Mount Rushmore.jpg",
        coordinates: { lat: 43.8791, lng: -103.4591 }
    },
    {
        id: "acropolis",
        name: "Acropolis",
        country: "Greece",
        city: "Athens",
        region: "Europe",
        imagePath: "/landmarks/Acropolis.jpg",
        coordinates: { lat: 37.9715, lng: 23.7257 }
    },
    {
        id: "hagia-sophia",
        name: "Hagia Sophia",
        country: "Turkey",
        city: "Istanbul",
        region: "Asia",
        imagePath: "/landmarks/Hagia Sophia.jpg",
        coordinates: { lat: 41.0086, lng: 28.9802 }
    },
    {
        id: "tower-bridge",
        name: "Tower Bridge",
        country: "United Kingdom",
        city: "London",
        region: "Europe",
        imagePath: "/landmarks/Tower Bridge.jpg",
        coordinates: { lat: 51.5055, lng: -0.0754 }
    },
    {
        id: "arc-de-triomphe",
        name: "Arc de Triomphe",
        country: "France",
        city: "Paris",
        region: "Europe",
        imagePath: "/landmarks/Arc de Triomphe.jpg",
        coordinates: { lat: 48.8738, lng: 2.2950 }
    }
];
