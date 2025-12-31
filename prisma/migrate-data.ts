import { PrismaClient } from "@prisma/client";
import { countriesData } from "../src/lib/data/countries";
import { capitalsData } from "../src/lib/data/capitals";
import { famousPeopleData } from "../src/lib/data/famous_people";
import { landmarksData } from "../src/lib/data/landmarks";
import { currenciesData } from "../src/lib/data/currencies";
import { languagesData } from "../src/lib/data/languages";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting data migration...");

    // 1. Countries
    console.log(`Migrating ${countriesData.length} countries...`);
    for (const country of countriesData) {
        try {
            await prisma.country.upsert({
                where: { name: country.name },
                update: {
                    code: country.code,
                    region: country.region,
                    centerLat: country.centerLat,
                    centerLng: country.centerLng
                },
                create: {
                    name: country.name,
                    code: country.code,
                    region: country.region,
                    centerLat: country.centerLat,
                    centerLng: country.centerLng
                }
            });
        } catch (error) {
            console.error(`Failed to migrate country: ${country.name}`, error);
            throw error; // Re-throw to stop
        }
    }

    // 2. Capitals
    console.log(`Migrating ${capitalsData.length} capitals...`);
    for (const capital of capitalsData) {
        const country = await prisma.country.findUnique({
            where: { name: capital.country }
        });

        if (country) {
            await prisma.capital.upsert({
                where: { countryId: country.id },
                update: {
                    name: capital.capital
                },
                create: {
                    name: capital.capital,
                    countryId: country.id
                }
            });
        } else {
            console.warn(`Country not found for capital: ${capital.capital} (${capital.country})`);
        }
    }

    // 3. Famous People
    console.log(`Migrating ${famousPeopleData.length} famous people...`);
    for (const person of famousPeopleData) {
        await prisma.famousPerson.create({
            data: {
                name: person.person, // person field in TS -> name in DB
                country: person.country,
                description: person.description,
                region: person.region,
                imageUrl: person.imageUrl
            }
        });
    }

    // 4. Landmarks
    console.log(`Migrating ${landmarksData.length} landmarks...`);
    for (const landmark of landmarksData) {
        // Landmarks data might have duplicates if we run this multiple times, so ideally upsert or just create.
        // There is no unique key on landmark name in schema, but for migration safety let's use check-then-create or delete-all-first.
        // Since we are migrating fresh, let's just create. Or actually, upserting by ID would be safest if we kept ID.
        // But schema ID is CUID. So we will just CREATE. To allow re-runs, maybe findMany first?
        // Let's assume unique name+country for now? No, simple CREATE is fine for one-off.

        // Actually, to prevent duplicates on multiple runs, let's check existence.
        const existing = await prisma.landmark.findFirst({
            where: { name: landmark.name, country: landmark.country }
        });

        if (!existing) {
            await prisma.landmark.create({
                data: {
                    name: landmark.name,
                    country: landmark.country,
                    description: `Located in ${landmark.city}, ${landmark.region}`, // Compose description or leave blank? 
                    // Wait, legacy data doesn't have 'description' field?
                    // TS Interface: id, name, country, city, region, imagePath, coordinates.
                    // DB Model: name, country, description, imageUrl, hints.
                    // Uh oh. The previous file view showed 'description' field in TS interface?
                    // Let's re-verify Step 145 output.
                    // Step 145: "export interface LandmarkData { ... name, country, city, region, imagePath, coordinates }"
                    // NO 'description' field in legacy data! 
                    // But 'FamousPersonData' has 'description'.
                    // So for Landmark, I should synthesize description or leave empty.
                    // I will synthesize: "Located in {city}, {region}."

                    imageUrl: landmark.imagePath,
                    // hints: []
                }
            });
        }
    }

    // 5. Currencies
    console.log(`Migrating ${currenciesData.length} currencies...`);
    for (const curr of currenciesData) {
        const existing = await prisma.currency.findFirst({
            where: { name: curr.currencyName, country: curr.country }
        });
        if (!existing) {
            await prisma.currency.create({
                data: {
                    name: curr.currencyName,
                    symbol: curr.symbol,
                    country: curr.country
                }
            });
        }
    }

    // 6. Languages
    console.log(`Migrating ${languagesData.length} languages...`);
    for (const lang of languagesData) {
        const existing = await prisma.language.findFirst({
            where: { name: lang.language, country: lang.country }
        });
        if (!existing) {
            await prisma.language.create({
                data: {
                    name: lang.language,
                    country: lang.country
                }
            });
        }
    }

    console.log("Migration completed successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
