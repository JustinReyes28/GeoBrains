export interface CountryStats {
    code: string;
    name: string;
    population: number; // in millions
    area: number; // in thousand sq km
}

export const statsData: CountryStats[] = [
    // Europe
    { code: "FR", name: "France", population: 68.3, area: 551.7 },
    { code: "DE", name: "Germany", population: 83.2, area: 357.0 },
    { code: "GB", name: "United Kingdom", population: 67.3, area: 242.5 },
    { code: "IT", name: "Italy", population: 58.9, area: 301.3 },
    { code: "ES", name: "Spain", population: 47.4, area: 505.9 },
    { code: "PL", name: "Poland", population: 37.7, area: 312.7 },
    { code: "UA", name: "Ukraine", population: 38.0, area: 603.5 },
    { code: "RU", name: "Russia", population: 144.1, area: 17098.2 },
    { code: "NL", name: "Netherlands", population: 17.6, area: 41.5 },
    { code: "BE", name: "Belgium", population: 11.6, area: 30.5 },
    { code: "CH", name: "Switzerland", population: 8.7, area: 41.3 },
    { code: "SE", name: "Sweden", population: 10.4, area: 450.3 },
    { code: "NO", name: "Norway", population: 5.4, area: 385.2 },
    { code: "FI", name: "Finland", population: 5.5, area: 338.4 },
    { code: "GR", name: "Greece", population: 10.6, area: 131.9 },

    // Asia
    { code: "CN", name: "China", population: 1411.8, area: 9597.0 },
    { code: "IN", name: "India", population: 1408.0, area: 3287.3 },
    { code: "JP", name: "Japan", population: 125.7, area: 377.9 },
    { code: "KR", name: "South Korea", population: 51.7, area: 100.2 },
    { code: "ID", name: "Indonesia", population: 273.8, area: 1904.6 },
    { code: "PK", name: "Pakistan", population: 231.4, area: 796.1 },
    { code: "BD", name: "Bangladesh", population: 169.4, area: 147.6 },
    { code: "TH", name: "Thailand", population: 71.6, area: 513.1 },
    { code: "VN", name: "Vietnam", population: 97.5, area: 331.2 },
    { code: "PH", name: "Philippines", population: 113.9, area: 300.0 },
    { code: "TR", name: "Turkey", population: 84.8, area: 783.6 },
    { code: "SA", name: "Saudi Arabia", population: 35.9, area: 2149.7 },
    { code: "IL", name: "Israel", population: 9.4, area: 22.1 },
    { code: "AE", name: "United Arab Emirates", population: 9.4, area: 83.6 },

    // Americas
    { code: "US", name: "United States", population: 331.9, area: 9833.5 },
    { code: "CA", name: "Canada", population: 38.2, area: 9984.7 },
    { code: "BR", name: "Brazil", population: 214.3, area: 8515.8 },
    { code: "MX", name: "Mexico", population: 126.7, area: 1964.4 },
    { code: "AR", name: "Argentina", population: 45.8, area: 2780.4 },
    { code: "CO", name: "Colombia", population: 51.5, area: 1141.7 },
    { code: "PE", name: "Peru", population: 33.4, area: 1285.2 },
    { code: "CL", name: "Chile", population: 19.2, area: 756.1 },

    // Africa
    { code: "NG", name: "Nigeria", population: 213.4, area: 923.8 },
    { code: "EG", name: "Egypt", population: 109.3, area: 1002.5 },
    { code: "ZA", name: "South Africa", population: 59.4, area: 1221.0 },
    { code: "ET", name: "Ethiopia", population: 120.3, area: 1104.3 },
    { code: "KE", name: "Kenya", population: 53.0, area: 580.4 },
    { code: "MA", name: "Morocco", population: 37.1, area: 446.6 },
    { code: "DZ", name: "Algeria", population: 44.2, area: 2381.7 },
    { code: "CD", name: "DR Congo", population: 95.9, area: 2344.9 },

    // Oceania
    { code: "AU", name: "Australia", population: 25.7, area: 7692.0 },
    { code: "NZ", name: "New Zealand", population: 5.1, area: 268.0 },
];
