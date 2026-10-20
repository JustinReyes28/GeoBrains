import { worldCountries } from './world';
export interface CurrencyData {
    country: string;
    currencyName: string;
    currencyCode: string;
    symbol: string;
    region: string;
}
export const currenciesData: CurrencyData[] = worldCountries.filter(c => c.currencies.length > 0).map(c => ({ country: c.name, currencyName: c.currencies[0].name, currencyCode: c.currencies[0].code, symbol: c.currencies[0].symbol ?? '', region: c.region }));
