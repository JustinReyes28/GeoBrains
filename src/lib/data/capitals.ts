import { worldCountries } from './world';
export interface CountryData {
    country: string;
    capital: string;
    region: string;
    lat?: number;
    lng?: number;
    capital_formatted?: string;
}
// Country centers are intentionally not presented as capital coordinates.
// Nauru has no official capital; Palestinian capital status needs a dedicated prompt.
export const capitalsData: CountryData[] = worldCountries.filter(c => c.capitals.length > 0 && !['NR', 'PS'].includes(c.code)).map(c => ({ country: c.name, capital: c.capitals[0], region: c.region }));
