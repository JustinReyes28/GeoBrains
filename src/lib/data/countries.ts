export interface CountryLocationData {
    name: string;
    code: string;
    region: string;
    centerLat: number;
    centerLng: number;
}

export const countriesData: CountryLocationData[] = [
    // Europe
    { name: "France", code: "FR", region: "Europe", centerLat: 46.2276, centerLng: 2.2137 },
    { name: "Germany", code: "DE", region: "Europe", centerLat: 51.1657, centerLng: 10.4515 },
    { name: "United Kingdom", code: "GB", region: "Europe", centerLat: 55.3781, centerLng: -3.4360 },
    { name: "Italy", code: "IT", region: "Europe", centerLat: 41.8719, centerLng: 12.5674 },
    { name: "Spain", code: "ES", region: "Europe", centerLat: 40.4637, centerLng: -3.7492 },
    { name: "Poland", code: "PL", region: "Europe", centerLat: 51.9194, centerLng: 19.1451 },
    { name: "Ukraine", code: "UA", region: "Europe", centerLat: 48.3794, centerLng: 31.1656 },
    { name: "Sweden", code: "SE", region: "Europe", centerLat: 60.1282, centerLng: 18.6435 },
    { name: "Norway", code: "NO", region: "Europe", centerLat: 60.4720, centerLng: 8.4689 },
    { name: "Finland", code: "FI", region: "Europe", centerLat: 61.9241, centerLng: 25.7482 },

    // Asia
    { name: "Japan", code: "JP", region: "Asia", centerLat: 36.2048, centerLng: 138.2529 },
    { name: "China", code: "CN", region: "Asia", centerLat: 35.8617, centerLng: 104.1954 },
    { name: "India", code: "IN", region: "Asia", centerLat: 20.5937, centerLng: 78.9629 },
    { name: "South Korea", code: "KR", region: "Asia", centerLat: 35.9078, centerLng: 127.7669 },
    { name: "Thailand", code: "TH", region: "Asia", centerLat: 15.8700, centerLng: 100.9925 },
    { name: "Vietnam", code: "VN", region: "Asia", centerLat: 14.0583, centerLng: 108.2772 },
    { name: "Indonesia", code: "ID", region: "Asia", centerLat: -0.7893, centerLng: 113.9213 },
    { name: "Turkey", code: "TR", region: "Asia", centerLat: 38.9637, centerLng: 35.2433 },
    { name: "Saudi Arabia", code: "SA", region: "Asia", centerLat: 23.8859, centerLng: 45.0792 },

    // Americas
    { name: "United States", code: "US", region: "Americas", centerLat: 37.0902, centerLng: -95.7129 },
    { name: "Canada", code: "CA", region: "Americas", centerLat: 56.1304, centerLng: -106.3468 },
    { name: "Brazil", code: "BR", region: "Americas", centerLat: -14.2350, centerLng: -51.9253 },
    { name: "Mexico", code: "MX", region: "Americas", centerLat: 23.6345, centerLng: -102.5528 },
    { name: "Argentina", code: "AR", region: "Americas", centerLat: -38.4161, centerLng: -63.6167 },
    { name: "Colombia", code: "CO", region: "Americas", centerLat: 4.5709, centerLng: -74.2973 },
    { name: "Peru", code: "PE", region: "Americas", centerLat: -9.1900, centerLng: -75.0152 },

    // Africa
    { name: "Egypt", code: "EG", region: "Africa", centerLat: 26.8206, centerLng: 30.8025 },
    { name: "South Africa", code: "ZA", region: "Africa", centerLat: -30.5595, centerLng: 22.9375 },
    { name: "Nigeria", code: "NG", region: "Africa", centerLat: 9.0820, centerLng: 8.6753 },
    { name: "Kenya", code: "KE", region: "Africa", centerLat: -0.0236, centerLng: 37.9062 },
    { name: "Morocco", code: "MA", region: "Africa", centerLat: 31.7917, centerLng: -7.0926 },
    { name: "Ethiopia", code: "ET", region: "Africa", centerLat: 9.1450, centerLng: 40.4897 },

    // Oceania
    { name: "Australia", code: "AU", region: "Oceania", centerLat: -25.2744, centerLng: 133.7751 },
    { name: "New Zealand", code: "NZ", region: "Oceania", centerLat: -40.9006, centerLng: 174.8860 },
];
