import { worldCountries } from './world';
export interface LanguageData {
    country: string;
    language: string;
    region: string;
}
export const languagesData: LanguageData[] = worldCountries.filter(c => c.languages.length > 0).map(c => ({ country: c.name, language: c.languages[0], region: c.region }));
