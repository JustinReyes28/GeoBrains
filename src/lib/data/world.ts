import snapshot from './world.json';
export interface WorldCountry {
    name: string;
    code: string;
    cca3: string;
    region: string;
    centerLat: number;
    centerLng: number;
    capitals: string[];
    languages: string[];
    currencies: {
        code: string;
        name: string;
        symbol?: string;
    }[];
    borders: string[];
    area: number;
}
export const worldCountries: WorldCountry[] = snapshot;
export const countryByCode = new Map(worldCountries.map(country => [country.cca3, country]));
export const CONTENT_VERSION = 'world-2026-10-v1';
