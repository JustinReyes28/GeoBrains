import { readFile, writeFile, mkdir } from 'node:fs/promises';

// Deliberate, reviewable refresh: download a pinned countries.json first.
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/import-countries.mjs <countries.json>');
const raw = JSON.parse(await readFile(source, 'utf8'));
const countries = raw.filter(c => c.independent === true || c.cca2 === 'PS').map(c => ({
    name: c.name.common, code: c.cca2, cca3: c.cca3, region: c.region,
    centerLat: c.latlng[0], centerLng: c.latlng[1],
    capitals: c.cca2 === 'LK' ? ['Sri Jayawardenepura Kotte'] : c.capital,
    languages: Object.values(c.languages),
    currencies: Object.entries(c.currencies).map(([code, value]) => ({ code, ...value })),
    borders: c.borders, area: c.area,
})).sort((a, b) => a.code.localeCompare(b.code, 'en'));
// Local corrections and sources are documented in docs/CONTENT_SOURCES.md.
countries.find(c => c.code === 'FM').currencies = [{code:'USD', name:'United States dollar', symbol:'$'}];
countries.find(c => c.code === 'ZW').currencies = [{code:'ZWG', name:'Zimbabwe Gold', symbol:'ZiG'}, {code:'USD', name:'United States dollar', symbol:'$'}];
if (countries.length !== 195 || new Set(countries.map(c => c.code)).size !== 195) throw new Error('Unexpected country coverage; review the upstream snapshot.');
await mkdir('src/lib/data', {recursive:true});
await writeFile('src/lib/data/world.json', JSON.stringify(countries, null, 2) + '\n');
console.log('Imported ' + countries.length + ' country records.');
