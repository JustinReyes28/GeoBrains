import { worldCountries, countryByCode } from './world';
export interface CountryBorderData {
    name: string;
    code: string;
    cca3: string;
    region: string;
    borders: string[];
    centerLat: number;
    centerLng: number;
}
// Limit choices to resolvable countries. Other recorded neighbors are still excluded as distractors.
export const bordersData: CountryBorderData[] = worldCountries;
export const getCountryNameByCode = (code: string): string => countryByCode.get(code)?.name ?? code;
