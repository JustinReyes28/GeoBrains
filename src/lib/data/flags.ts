import { countriesData } from './countries';

export interface FlagQuestionData {
    name: string;
    code: string;
    region: string;
    centerLat: number;
    centerLng: number;
}

// We can reuse the countries data as it already contains ISO codes needed for flags
export const flagsData: FlagQuestionData[] = countriesData;
