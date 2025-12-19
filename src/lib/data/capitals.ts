export interface CountryData {
    country: string;
    capital: string;
    region: string;
    lat?: number;
    lng?: number; // Approximate capital coordinates
}

export const capitalsData: CountryData[] = [
    { country: "France", capital: "Paris", region: "Europe", lat: 48.8566, lng: 2.3522 },
    { country: "Germany", capital: "Berlin", region: "Europe", lat: 52.5200, lng: 13.4050 },
    { country: "United Kingdom", capital: "London", region: "Europe", lat: 51.5074, lng: -0.1278 },
    { country: "Italy", capital: "Rome", region: "Europe", lat: 41.9028, lng: 12.4964 },
    { country: "Spain", capital: "Madrid", region: "Europe", lat: 40.4168, lng: -3.7038 },
    { country: "Portugal", capital: "Lisbon", region: "Europe", lat: 38.7223, lng: -9.1393 },
    { country: "Netherlands", capital: "Amsterdam", region: "Europe", lat: 52.3676, lng: 4.9041 },
    { country: "Belgium", capital: "Brussels", region: "Europe", lat: 50.8503, lng: 4.3517 },
    { country: "Sweden", capital: "Stockholm", region: "Europe", lat: 59.3293, lng: 18.0686 },
    { country: "Norway", capital: "Oslo", region: "Europe", lat: 59.9139, lng: 10.7522 },
    { country: "Denmark", capital: "Copenhagen", region: "Europe", lat: 55.6761, lng: 12.5683 },
    { country: "Finland", capital: "Helsinki", region: "Europe", lat: 60.1695, lng: 24.9354 },
    { country: "Poland", capital: "Warsaw", region: "Europe", lat: 52.2297, lng: 21.0122 },
    { country: "Greece", capital: "Athens", region: "Europe", lat: 37.9838, lng: 23.7275 },
    { country: "Russia", capital: "Moscow", region: "Europe", lat: 55.7558, lng: 37.6173 },
    { country: "Japan", capital: "Tokyo", region: "Asia", lat: 35.6762, lng: 139.6503 },
    { country: "China", capital: "Beijing", region: "Asia", lat: 39.9042, lng: 116.4074 },
    { country: "India", capital: "New Delhi", region: "Asia", lat: 28.6139, lng: 77.2090 },
    { country: "South Korea", capital: "Seoul", region: "Asia", lat: 37.5665, lng: 126.9780 },
    { country: "Thailand", capital: "Bangkok", region: "Asia", lat: 13.7563, lng: 100.5018 },
    { country: "Vietnam", capital: "Hanoi", region: "Asia", lat: 21.0285, lng: 105.8542 },
    { country: "Indonesia", capital: "Jakarta", region: "Asia", lat: -6.2088, lng: 106.8456 },
    { country: "Australia", capital: "Canberra", region: "Oceania", lat: -35.2809, lng: 149.1300 },
    { country: "New Zealand", capital: "Wellington", region: "Oceania", lat: -41.2865, lng: 174.7762 },
    { country: "United States", capital: "Washington, D.C.", region: "Americas", lat: 38.9072, lng: -77.0369 },
    { country: "Canada", capital: "Ottawa", region: "Americas", lat: 45.4215, lng: -75.6972 },
    { country: "Mexico", capital: "Mexico City", region: "Americas", lat: 19.4326, lng: -99.1332 },
    { country: "Brazil", capital: "Brasília", region: "Americas", lat: -15.7975, lng: -47.8919 },
    { country: "Argentina", capital: "Buenos Aires", region: "Americas", lat: -34.6037, lng: -58.3816 },
    { country: "Egypt", capital: "Cairo", region: "Africa", lat: 30.0444, lng: 31.2357 },
    { country: "South Africa", capital: "Pretoria", region: "Africa", lat: -25.7479, lng: 28.2293 }, // Executive capital
    { country: "Nigeria", capital: "Abuja", region: "Africa", lat: 9.0765, lng: 7.3986 },
    { country: "Kenya", capital: "Nairobi", region: "Africa", lat: -1.2921, lng: 36.8219 },
    { country: "Morocco", capital: "Rabat", region: "Africa", lat: 34.0209, lng: -6.8416 }
];
