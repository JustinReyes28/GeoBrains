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
    { name: "Netherlands", code: "NL", region: "Europe", centerLat: 52.1326, centerLng: 5.2913 },
    { name: "Belgium", code: "BE", region: "Europe", centerLat: 50.5039, centerLng: 4.4699 },
    { name: "Switzerland", code: "CH", region: "Europe", centerLat: 46.8182, centerLng: 8.2275 },
    { name: "Austria", code: "AT", region: "Europe", centerLat: 47.5162, centerLng: 14.5501 },
    { name: "Portugal", code: "PT", region: "Europe", centerLat: 39.3999, centerLng: -8.2245 },

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
    { name: "Philippines", code: "PH", region: "Asia", centerLat: 12.8797, centerLng: 121.7740 },
    { name: "Malaysia", code: "MY", region: "Asia", centerLat: 4.2105, centerLng: 101.9758 },
    { name: "Pakistan", code: "PK", region: "Asia", centerLat: 30.3753, centerLng: 69.3451 },
    { name: "Bangladesh", code: "BD", region: "Asia", centerLat: 23.6850, centerLng: 90.3563 },
    { name: "United Arab Emirates", code: "AE", region: "Asia", centerLat: 23.4241, centerLng: 53.8478 },
    { name: "Iraq", code: "IQ", region: "Asia", centerLat: 33.2232, centerLng: 43.6793 },
    { name: "Iran", code: "IR", region: "Asia", centerLat: 32.4279, centerLng: 53.6880 },
    { name: "Israel", code: "IL", region: "Asia", centerLat: 31.0461, centerLng: 34.8516 },
    { name: "Jordan", code: "JO", region: "Asia", centerLat: 30.5852, centerLng: 36.2384 },
    { name: "Lebanon", code: "LB", region: "Asia", centerLat: 33.8547, centerLng: 35.8623 },
    { name: "Syria", code: "SY", region: "Asia", centerLat: 34.8021, centerLng: 38.9968 },
    { name: "Yemen", code: "YE", region: "Asia", centerLat: 15.5527, centerLng: 48.5164 },
    { name: "Oman", code: "OM", region: "Asia", centerLat: 21.5126, centerLng: 55.9233 },
    { name: "Qatar", code: "QA", region: "Asia", centerLat: 25.3548, centerLng: 51.1839 },
    { name: "Kuwait", code: "KW", region: "Asia", centerLat: 29.3117, centerLng: 47.4818 },
    { name: "Kazakhstan", code: "KZ", region: "Asia", centerLat: 48.0196, centerLng: 66.9237 },
    { name: "Uzbekistan", code: "UZ", region: "Asia", centerLat: 41.3775, centerLng: 64.5853 },
    { name: "Nepal", code: "NP", region: "Asia", centerLat: 28.3949, centerLng: 84.1240 },
    { name: "Sri Lanka", code: "LK", region: "Asia", centerLat: 7.8731, centerLng: 80.7718 },
    { name: "Cambodia", code: "KH", region: "Asia", centerLat: 12.5657, centerLng: 104.9910 },

    // Americas
    { name: "United States", code: "US", region: "Americas", centerLat: 37.0902, centerLng: -95.7129 },
    { name: "Canada", code: "CA", region: "Americas", centerLat: 56.1304, centerLng: -106.3468 },
    { name: "Brazil", code: "BR", region: "Americas", centerLat: -14.2350, centerLng: -51.9253 },
    { name: "Mexico", code: "MX", region: "Americas", centerLat: 23.6345, centerLng: -102.5528 },
    { name: "Argentina", code: "AR", region: "Americas", centerLat: -38.4161, centerLng: -63.6167 },
    { name: "Colombia", code: "CO", region: "Americas", centerLat: 4.5709, centerLng: -74.2973 },
    { name: "Peru", code: "PE", region: "Americas", centerLat: -9.1900, centerLng: -75.0152 },
    { name: "Chile", code: "CL", region: "Americas", centerLat: -35.6751, centerLng: -71.5430 },
    { name: "Venezuela", code: "VE", region: "Americas", centerLat: 6.4238, centerLng: -66.5897 },
    { name: "Ecuador", code: "EC", region: "Americas", centerLat: -1.8312, centerLng: -78.1834 },

    // Africa
    { name: "Egypt", code: "EG", region: "Africa", centerLat: 26.8206, centerLng: 30.8025 },
    { name: "South Africa", code: "ZA", region: "Africa", centerLat: -30.5595, centerLng: 22.9375 },
    { name: "Nigeria", code: "NG", region: "Africa", centerLat: 9.0820, centerLng: 8.6753 },
    { name: "Kenya", code: "KE", region: "Africa", centerLat: -0.0236, centerLng: 37.9062 },
    { name: "Morocco", code: "MA", region: "Africa", centerLat: 31.7917, centerLng: -7.0926 },
    { name: "Ethiopia", code: "ET", region: "Africa", centerLat: 9.1450, centerLng: 40.4897 },
    { name: "Ghana", code: "GH", region: "Africa", centerLat: 7.9465, centerLng: -1.0232 },
    { name: "Tanzania", code: "TZ", region: "Africa", centerLat: -6.3690, centerLng: 34.8888 },
    { name: "Algeria", code: "DZ", region: "Africa", centerLat: 28.0339, centerLng: 1.6596 },
    { name: "Uganda", code: "UG", region: "Africa", centerLat: 1.3733, centerLng: 32.2903 },
    { name: "Sudan", code: "SD", region: "Africa", centerLat: 12.8628, centerLng: 30.2176 },
    { name: "Angola", code: "AO", region: "Africa", centerLat: -11.2027, centerLng: 17.8739 },
    { name: "Mozambique", code: "MZ", region: "Africa", centerLat: -18.6657, centerLng: 35.5296 },
    { name: "Madagascar", code: "MG", region: "Africa", centerLat: -18.7669, centerLng: 46.8691 },
    { name: "Cameroon", code: "CM", region: "Africa", centerLat: 7.3697, centerLng: 12.3547 },
    { name: "Ivory Coast", code: "CI", region: "Africa", centerLat: 7.5400, centerLng: -5.5471 },
    { name: "Senegal", code: "SN", region: "Africa", centerLat: 14.4974, centerLng: -14.4524 },
    { name: "Zambia", code: "ZM", region: "Africa", centerLat: -13.1339, centerLng: 27.8493 },
    { name: "Zimbabwe", code: "ZW", region: "Africa", centerLat: -19.0154, centerLng: 29.1549 },
    { name: "Tunisia", code: "TN", region: "Africa", centerLat: 33.8869, centerLng: 9.5375 },

    // Oceania
    { name: "Australia", code: "AU", region: "Oceania", centerLat: -25.2744, centerLng: 133.7751 },
    { name: "New Zealand", code: "NZ", region: "Oceania", centerLat: -40.9006, centerLng: 174.8860 },
    { name: "Fiji", code: "FJ", region: "Oceania", centerLat: -16.5782, centerLng: 179.4144 },
    { name: "Papua New Guinea", code: "PG", region: "Oceania", centerLat: -6.3149, centerLng: 143.9556 },
];
