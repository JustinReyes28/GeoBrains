export interface CountryBorderData {
    name: string;
    code: string; // CCA2
    cca3: string; // CCA3 - useful for linking
    region: string;
    borders: string[]; // CCA3 codes of neighbors
    centerLat: number;
    centerLng: number;
}

export const bordersData: CountryBorderData[] = [
    // Europe
    { name: "France", code: "FR", cca3: "FRA", region: "Europe", borders: ["AND", "BEL", "DEU", "ITA", "LUX", "MCO", "ESP", "CHE"], centerLat: 46.2276, centerLng: 2.2137 },
    { name: "Germany", code: "DE", cca3: "DEU", region: "Europe", borders: ["AUT", "BEL", "CZE", "DNK", "FRA", "LUX", "NLD", "POL", "CHE"], centerLat: 51.1657, centerLng: 10.4515 },
    { name: "Italy", code: "IT", cca3: "ITA", region: "Europe", borders: ["AUT", "FRA", "SMR", "SVN", "CHE", "VAT"], centerLat: 41.8719, centerLng: 12.5674 },
    { name: "Spain", code: "ES", cca3: "ESP", region: "Europe", borders: ["AND", "FRA", "GIB", "PRT", "MAR"], centerLat: 40.4637, centerLng: -3.7492 },
    { name: "Portugal", code: "PT", cca3: "PRT", region: "Europe", borders: ["ESP"], centerLat: 39.3999, centerLng: -8.2245 },
    { name: "United Kingdom", code: "GB", cca3: "GBR", region: "Europe", borders: ["IRL"], centerLat: 55.3781, centerLng: -3.4360 },
    { name: "Ireland", code: "IE", cca3: "IRL", region: "Europe", borders: ["GBR"], centerLat: 53.0000, centerLng: -8.0000 },
    { name: "Poland", code: "PL", cca3: "POL", region: "Europe", borders: ["BLR", "CZE", "DEU", "LTU", "RUS", "SVK", "UKR"], centerLat: 51.9194, centerLng: 19.1451 },
    { name: "Ukraine", code: "UA", cca3: "UKR", region: "Europe", borders: ["BLR", "HUN", "MDA", "POL", "ROU", "RUS", "SVK"], centerLat: 48.3794, centerLng: 31.1656 },
    { name: "Russia", code: "RU", cca3: "RUS", region: "Europe", borders: ["AZE", "BLR", "CHN", "EST", "FIN", "GEO", "KAZ", "PRK", "LVA", "LTU", "MNG", "NOR", "POL", "UKR"], centerLat: 60.0000, centerLng: 100.0000 },
    { name: "Belgium", code: "BE", cca3: "BEL", region: "Europe", borders: ["FRA", "DEU", "LUX", "NLD"], centerLat: 50.5039, centerLng: 4.4699 },
    { name: "Netherlands", code: "NL", cca3: "NLD", region: "Europe", borders: ["BEL", "DEU"], centerLat: 52.1326, centerLng: 5.2913 },
    { name: "Switzerland", code: "CH", cca3: "CHE", region: "Europe", borders: ["AUT", "FRA", "ITA", "LIE", "DEU"], centerLat: 46.8182, centerLng: 8.2275 },
    { name: "Austria", code: "AT", cca3: "AUT", region: "Europe", borders: ["CZE", "DEU", "HUN", "ITA", "LIE", "SVK", "SVN", "CHE"], centerLat: 47.5162, centerLng: 14.5501 },
    { name: "Czech Republic", code: "CZ", cca3: "CZE", region: "Europe", borders: ["AUT", "DEU", "POL", "SVK"], centerLat: 49.7500, centerLng: 15.5000 },
    { name: "Hungary", code: "HU", cca3: "HUN", region: "Europe", borders: ["AUT", "HRV", "ROU", "SRB", "SVK", "SVN", "UKR"], centerLat: 47.0000, centerLng: 20.0000 },
    { name: "Sweden", code: "SE", cca3: "SWE", region: "Europe", borders: ["FIN", "NOR"], centerLat: 60.1282, centerLng: 18.6435 },
    { name: "Norway", code: "NO", cca3: "NOR", region: "Europe", borders: ["FIN", "SWE", "RUS"], centerLat: 60.4720, centerLng: 8.4689 },
    { name: "Finland", code: "FI", cca3: "FIN", region: "Europe", borders: ["NOR", "SWE", "RUS"], centerLat: 61.9241, centerLng: 25.7482 },
    { name: "Denmark", code: "DK", cca3: "DNK", region: "Europe", borders: ["DEU"], centerLat: 56.0000, centerLng: 10.0000 },
    { name: "Romania", code: "RO", cca3: "ROU", region: "Europe", borders: ["BGR", "HUN", "MDA", "SRB", "UKR"], centerLat: 46.0000, centerLng: 25.0000 },
    { name: "Bulgaria", code: "BG", cca3: "BGR", region: "Europe", borders: ["GRC", "MKD", "ROU", "SRB", "TUR"], centerLat: 43.0000, centerLng: 25.0000 },
    { name: "Greece", code: "GR", cca3: "GRC", region: "Europe", borders: ["ALB", "BGR", "TUR", "MKD"], centerLat: 39.0000, centerLng: 22.0000 },
    { name: "Croatia", code: "HR", cca3: "HRV", region: "Europe", borders: ["BIH", "HUN", "MNE", "SRB", "SVN"], centerLat: 45.1000, centerLng: 15.5000 },
    { name: "Serbia", code: "RS", cca3: "SRB", region: "Europe", borders: ["BIH", "BGR", "HRV", "HUN", "UNK", "MKD", "MNE", "ROU"], centerLat: 44.0000, centerLng: 21.0000 },
    { name: "Slovakia", code: "SK", cca3: "SVK", region: "Europe", borders: ["AUT", "CZE", "HUN", "POL", "UKR"], centerLat: 48.6667, centerLng: 19.5000 },
    { name: "Belarus", code: "BY", cca3: "BLR", region: "Europe", borders: ["LVA", "LTU", "POL", "RUS", "UKR"], centerLat: 53.0000, centerLng: 28.0000 },
    { name: "Lithuania", code: "LT", cca3: "LTU", region: "Europe", borders: ["BLR", "LVA", "POL", "RUS"], centerLat: 56.0000, centerLng: 24.0000 },
    { name: "Latvia", code: "LV", cca3: "LVA", region: "Europe", borders: ["BLR", "EST", "LTU", "RUS"], centerLat: 57.0000, centerLng: 25.0000 },
    { name: "Estonia", code: "EE", cca3: "EST", region: "Europe", borders: ["LVA", "RUS"], centerLat: 59.0000, centerLng: 26.0000 },
    { name: "Moldova", code: "MD", cca3: "MDA", region: "Europe", borders: ["ROU", "UKR"], centerLat: 47.0000, centerLng: 29.0000 },
    { name: "Slovenia", code: "SI", cca3: "SVN", region: "Europe", borders: ["AUT", "HRV", "ITA", "HUN"], centerLat: 46.1167, centerLng: 14.8167 },

    // Asia
    { name: "China", code: "CN", cca3: "CHN", region: "Asia", borders: ["AFG", "BTN", "MMR", "HKG", "IND", "KAZ", "NPL", "PRK", "KGZ", "LAO", "MAC", "MNG", "PAK", "RUS", "TJK", "VNM"], centerLat: 35.8617, centerLng: 104.1954 },
    { name: "India", code: "IN", cca3: "IND", region: "Asia", borders: ["BGD", "BTN", "MMR", "CHN", "NPL", "PAK"], centerLat: 20.5937, centerLng: 78.9629 },
    { name: "Pakistan", code: "PK", cca3: "PAK", region: "Asia", borders: ["AFG", "CHN", "IND", "IRN"], centerLat: 30.3753, centerLng: 69.3451 },
    { name: "Afghanistan", code: "AF", cca3: "AFG", region: "Asia", borders: ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"], centerLat: 33.9391, centerLng: 67.7100 },
    { name: "Iran", code: "IR", cca3: "IRN", region: "Asia", borders: ["AFG", "ARM", "AZE", "IRQ", "PAK", "TUR", "TKM"], centerLat: 32.4279, centerLng: 53.6880 },
    { name: "Iraq", code: "IQ", cca3: "IRQ", region: "Asia", borders: ["IRN", "JOR", "KWT", "SAU", "SYR", "TUR"], centerLat: 33.2232, centerLng: 43.6793 },
    { name: "Saudi Arabia", code: "SA", cca3: "SAU", region: "Asia", borders: ["IRQ", "JOR", "KWT", "OMN", "QAT", "ARE", "YEM"], centerLat: 23.8859, centerLng: 45.0792 },
    { name: "Turkey", code: "TR", cca3: "TUR", region: "Asia", borders: ["ARM", "AZE", "BGR", "GEO", "GRC", "IRN", "IRQ", "SYR"], centerLat: 38.9637, centerLng: 35.2433 },
    { name: "Thailand", code: "TH", cca3: "THA", region: "Asia", borders: ["MMR", "KHM", "LAO", "MYS"], centerLat: 15.8700, centerLng: 100.9925 },
    { name: "Vietnam", code: "VN", cca3: "VNM", region: "Asia", borders: ["KHM", "CHN", "LAO"], centerLat: 14.0583, centerLng: 108.2772 },
    { name: "Laos", code: "LA", cca3: "LAO", region: "Asia", borders: ["MMR", "KHM", "CHN", "THA", "VNM"], centerLat: 19.8563, centerLng: 102.4955 },
    { name: "Cambodia", code: "KH", cca3: "KHM", region: "Asia", borders: ["LAO", "THA", "VNM"], centerLat: 12.5657, centerLng: 104.9910 },
    { name: "Myanmar", code: "MM", cca3: "MMR", region: "Asia", borders: ["BGD", "CHN", "IND", "LAO", "THA"], centerLat: 21.9162, centerLng: 95.9560 },
    { name: "Bangladesh", code: "BD", cca3: "BGD", region: "Asia", borders: ["MMR", "IND"], centerLat: 23.6850, centerLng: 90.3563 },
    { name: "Malaysia", code: "MY", cca3: "MYS", region: "Asia", borders: ["BRN", "IDN", "THA"], centerLat: 4.2105, centerLng: 101.9758 },
    { name: "Indonesia", code: "ID", cca3: "IDN", region: "Asia", borders: ["TLS", "MYS", "PNG"], centerLat: -0.7893, centerLng: 113.9213 },
    { name: "South Korea", code: "KR", cca3: "KOR", region: "Asia", borders: ["PRK"], centerLat: 35.9078, centerLng: 127.7669 },
    { name: "North Korea", code: "KP", cca3: "PRK", region: "Asia", borders: ["CHN", "KOR", "RUS"], centerLat: 40.3399, centerLng: 127.5101 },
    { name: "Kazakhstan", code: "KZ", cca3: "KAZ", region: "Asia", borders: ["CHN", "KGZ", "RUS", "TKM", "UZB"], centerLat: 48.0196, centerLng: 66.9237 },
    { name: "Mongolia", code: "MN", cca3: "MNG", region: "Asia", borders: ["CHN", "RUS"], centerLat: 46.8625, centerLng: 103.8467 },
    { name: "Uzbekistan", code: "UZ", cca3: "UZB", region: "Asia", borders: ["AFG", "KAZ", "KGZ", "TJK", "TKM"], centerLat: 41.3775, centerLng: 64.5853 },
    { name: "Nepal", code: "NP", cca3: "NPL", region: "Asia", borders: ["CHN", "IND"], centerLat: 28.3949, centerLng: 84.1240 },
    { name: "Israel", code: "IL", cca3: "ISR", region: "Asia", borders: ["EGY", "JOR", "LBN", "PSE", "SYR"], centerLat: 31.0461, centerLng: 34.8516 },
    { name: "Syria", code: "SY", cca3: "SYR", region: "Asia", borders: ["IRQ", "ISR", "JOR", "LBN", "TUR"], centerLat: 34.8021, centerLng: 38.9968 },
    { name: "Jordan", code: "JO", cca3: "JOR", region: "Asia", borders: ["IRQ", "ISR", "PSE", "SAU", "SYR"], centerLat: 30.5852, centerLng: 36.2384 },
    { name: "Yemen", code: "YE", cca3: "YEM", region: "Asia", borders: ["OMN", "SAU"], centerLat: 15.5527, centerLng: 48.5164 },
    { name: "Oman", code: "OM", cca3: "OMN", region: "Asia", borders: ["SAU", "ARE", "YEM"], centerLat: 21.5126, centerLng: 55.9233 },

    // Americas
    { name: "United States", code: "US", cca3: "USA", region: "Americas", borders: ["CAN", "MEX"], centerLat: 37.0902, centerLng: -95.7129 },
    { name: "Canada", code: "CA", cca3: "CAN", region: "Americas", borders: ["USA"], centerLat: 56.1304, centerLng: -106.3468 },
    { name: "Mexico", code: "MX", cca3: "MEX", region: "Americas", borders: ["BLZ", "GTM", "USA"], centerLat: 23.6345, centerLng: -102.5528 },
    { name: "Guatemala", code: "GT", cca3: "GTM", region: "Americas", borders: ["BLZ", "SLV", "HND", "MEX"], centerLat: 15.7835, centerLng: -90.2308 },
    { name: "Belize", code: "BZ", cca3: "BLZ", region: "Americas", borders: ["GTM", "MEX"], centerLat: 17.1899, centerLng: -88.4976 },
    { name: "Honduras", code: "HN", cca3: "HND", region: "Americas", borders: ["GTM", "SLV", "NIC"], centerLat: 15.2000, centerLng: -86.2419 },
    { name: "El Salvador", code: "SV", cca3: "SLV", region: "Americas", borders: ["GTM", "HND"], centerLat: 13.7942, centerLng: -88.8965 },
    { name: "Nicaragua", code: "NI", cca3: "NIC", region: "Americas", borders: ["CRI", "HND"], centerLat: 12.8654, centerLng: -85.2072 },
    { name: "Costa Rica", code: "CR", cca3: "CRI", region: "Americas", borders: ["NIC", "PAN"], centerLat: 9.7489, centerLng: -83.7534 },
    { name: "Panama", code: "PA", cca3: "PAN", region: "Americas", borders: ["COL", "CRI"], centerLat: 8.5380, centerLng: -80.7821 },
    { name: "Brazil", code: "BR", cca3: "BRA", region: "Americas", borders: ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"], centerLat: -14.2350, centerLng: -51.9253 },
    { name: "Argentina", code: "AR", cca3: "ARG", region: "Americas", borders: ["BOL", "BRA", "CHL", "PRY", "URY"], centerLat: -38.4161, centerLng: -63.6167 },
    { name: "Chile", code: "CL", cca3: "CHL", region: "Americas", borders: ["ARG", "BOL", "PER"], centerLat: -35.6751, centerLng: -71.5430 },
    { name: "Colombia", code: "CO", cca3: "COL", region: "Americas", borders: ["BRA", "ECU", "PAN", "PER", "VEN"], centerLat: 4.5709, centerLng: -74.2973 },
    { name: "Peru", code: "PE", cca3: "PER", region: "Americas", borders: ["BOL", "BRA", "CHL", "COL", "ECU"], centerLat: -9.1900, centerLng: -75.0152 },
    { name: "Venezuela", code: "VE", cca3: "VEN", region: "Americas", borders: ["BRA", "COL", "GUY"], centerLat: 6.4238, centerLng: -66.5897 },
    { name: "Bolivia", code: "BO", cca3: "BOL", region: "Americas", borders: ["ARG", "BRA", "CHL", "PRY", "PER"], centerLat: -16.2902, centerLng: -63.5887 },
    { name: "Paraguay", code: "PY", cca3: "PRY", region: "Americas", borders: ["ARG", "BOL", "BRA"], centerLat: -23.4425, centerLng: -58.4438 },
    { name: "Uruguay", code: "UY", cca3: "URY", region: "Americas", borders: ["ARG", "BRA"], centerLat: -32.5228, centerLng: -55.7658 },
    { name: "Ecuador", code: "EC", cca3: "ECU", region: "Americas", borders: ["COL", "PER"], centerLat: -1.8312, centerLng: -78.1834 },
    { name: "Guyana", code: "GY", cca3: "GUY", region: "Americas", borders: ["BRA", "SUR", "VEN"], centerLat: 4.8604, centerLng: -58.9302 },
    { name: "Suriname", code: "SR", cca3: "SUR", region: "Americas", borders: ["BRA", "GUF", "GUY"], centerLat: 3.9193, centerLng: -56.0278 },

    // Africa
    { name: "South Africa", code: "ZA", cca3: "ZAF", region: "Africa", borders: ["BWA", "LSO", "MOZ", "NAM", "SWZ", "ZWE"], centerLat: -30.5595, centerLng: 22.9375 },
    { name: "Egypt", code: "EG", cca3: "EGY", region: "Africa", borders: ["ISR", "LBY", "PSE", "SDN"], centerLat: 26.8206, centerLng: 30.8025 },
    { name: "Nigeria", code: "NG", cca3: "NGA", region: "Africa", borders: ["BEN", "CMR", "TCD", "NER"], centerLat: 9.0820, centerLng: 8.6753 },
    { name: "Kenya", code: "KE", cca3: "KEN", region: "Africa", borders: ["ETH", "SOM", "SSD", "TZA", "UGA"], centerLat: -0.0236, centerLng: 37.9062 },
    { name: "Ethiopia", code: "ET", cca3: "ETH", region: "Africa", borders: ["DJI", "ERI", "KEN", "SOM", "SSD", "SDN"], centerLat: 9.1450, centerLng: 40.4897 },
    { name: "Tanzania", code: "TZ", cca3: "TZA", region: "Africa", borders: ["BDI", "COD", "KEN", "MWI", "MOZ", "RWA", "UGA", "ZMB"], centerLat: -6.3690, centerLng: 34.8888 },
    { name: "Algeria", code: "DZ", cca3: "DZA", region: "Africa", borders: ["TUN", "LBY", "NER", "ESH", "MRT", "MLI", "MAR"], centerLat: 28.0339, centerLng: 1.6596 },
    { name: "Morocco", code: "MA", cca3: "MAR", region: "Africa", borders: ["DZA", "ESH", "ESP"], centerLat: 31.7917, centerLng: -7.0926 },
    { name: "Sudan", code: "SD", cca3: "SDN", region: "Africa", borders: ["CAF", "TCD", "EGY", "ERI", "ETH", "LBY", "SSD"], centerLat: 12.8628, centerLng: 30.2176 },
    { name: "Ghana", code: "GH", cca3: "GHA", region: "Africa", borders: ["BFA", "CIV", "TGO"], centerLat: 7.9465, centerLng: -1.0232 },
    { name: "Ivory Coast", code: "CI", cca3: "CIV", region: "Africa", borders: ["BFA", "GHA", "GIN", "LBR", "MLI"], centerLat: 7.5400, centerLng: -5.5471 },
    { name: "Angola", code: "AO", cca3: "AGO", region: "Africa", borders: ["COG", "COD", "ZMB", "NAM"], centerLat: -11.2027, centerLng: 17.8739 },
    { name: "Zambia", code: "ZM", cca3: "ZMB", region: "Africa", borders: ["AGO", "BWA", "COD", "MWI", "MOZ", "NAM", "TZA", "ZWE"], centerLat: -13.1339, centerLng: 27.8493 },
    { name: "Zimbabwe", code: "ZW", cca3: "ZWE", region: "Africa", borders: ["BWA", "MOZ", "ZAF", "ZMB"], centerLat: -19.0154, centerLng: 29.1549 },
    { name: "Botswana", code: "BW", cca3: "BWA", region: "Africa", borders: ["NAM", "ZAF", "ZMB", "ZWE"], centerLat: -22.3285, centerLng: 24.6849 },
    { name: "Namibia", code: "NA", cca3: "NAM", region: "Africa", borders: ["AGO", "BWA", "ZAF", "ZMB"], centerLat: -22.9576, centerLng: 18.4904 },
    { name: "Mozambique", code: "MZ", cca3: "MOZ", region: "Africa", borders: ["MWI", "ZAF", "SWZ", "TZA", "ZMB", "ZWE"], centerLat: -18.6657, centerLng: 35.5296 },
    { name: "DR Congo", code: "CD", cca3: "COD", region: "Africa", borders: ["AGO", "BDI", "CAF", "COG", "RWA", "SSD", "TZA", "UGA", "ZMB"], centerLat: -4.0383, centerLng: 21.7587 },
    { name: "Uganda", code: "UG", cca3: "UGA", region: "Africa", borders: ["COD", "KEN", "RWA", "SSD", "TZA"], centerLat: 1.3733, centerLng: 32.2903 },
    { name: "Cameroon", code: "CM", cca3: "CMR", region: "Africa", borders: ["CAF", "TCD", "COG", "GNQ", "GAB", "NGA"], centerLat: 7.3697, centerLng: 12.3547 },
    { name: "Senegal", code: "SN", cca3: "SEN", region: "Africa", borders: ["GMB", "GIN", "GNB", "MLI", "MRT"], centerLat: 14.4974, centerLng: -14.4524 },

    // Oceania - mostly islands, only a few have land borders (Papua New Guinea, Indonesia (Asia/Oceania), Timor-Leste)
    { name: "Papua New Guinea", code: "PG", cca3: "PNG", region: "Oceania", borders: ["IDN"], centerLat: -6.3149, centerLng: 143.9556 },
];

// Helper to look up country name by code
export const getCountryNameByCode = (cca3: string): string => {
    const country = bordersData.find(c => c.cca3 === cca3);
    if (country) return country.name;

    // Fallback for countries not in our simplified list but that appear as borders
    // This simple map covers some common neighbors that might be missing from the main list above
    const extraMap: Record<string, string> = {
        "AND": "Andorra", "MCO": "Monaco", "SMR": "San Marino", "VAT": "Vatican City", "LIE": "Liechtenstein", "LUX": "Luxembourg",
        "MKD": "North Macedonia", "ALB": "Albania", "MNE": "Montenegro", "BIH": "Bosnia and Herzegovina",
        "BLR": "Belarus", "MDA": "Moldova", "EST": "Estonia", "UNK": "Kosovo",
        "PRK": "North Korea", "KAZ": "Kazakhstan", "MNG": "Mongolia",
        "AFG": "Afghanistan", "BTN": "Bhutan", "MMR": "Myanmar", "KGZ": "Kyrgyzstan", "TJK": "Tajikistan",
        "ARM": "Armenia", "AZE": "Azerbaijan", "GEO": "Georgia",
        "KWT": "Kuwait", "ARE": "UAE", "OMN": "Oman", "QAT": "Qatar", "YEM": "Yemen",
        "LBN": "Lebanon", "PSE": "Palestine",
        "SUR": "Suriname", "GUY": "Guyana", "GUF": "French Guiana",
        "SLV": "El Salvador", "HND": "Honduras", "NIC": "Nicaragua",
        "LSO": "Lesotho", "SWZ": "Eswatini", "MWI": "Malawi", "RWA": "Rwanda", "BDI": "Burundi",
        "SSD": "South Sudan", "ERI": "Eritrea", "DJI": "Djibouti", "SOM": "Somalia",
        "GAB": "Gabon", "COG": "Republic of the Congo", "GNQ": "Equatorial Guinea",
        "CAF": "Central African Republic", "TCD": "Chad", "NER": "Niger",
        "DMA": "Dominica", "DOM": "Dominican Republic", "HTI": "Haiti",
        "TLS": "Timor-Leste", "PNG": "Papua New Guinea"
    };

    return extraMap[cca3] || cca3;
};
