import { worldCountries } from './world';
export interface CountryData {
    name: string;
    code: string;
    region: string;
    centerLat: number;
    centerLng: number;
}
export const countriesData: CountryData[] = worldCountries.map(({name,code,region,centerLat,centerLng})=>({name,code,region,centerLat,centerLng}));
