import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting data migration...");

    // Dynamically import data to avoid TS compilation issues in Node/MJS
    // Note: This script should be run with `npx tsx prisma/migrate-data.mjs`
    const { countriesData } = await import("../src/lib/data/countries.ts");
    const { capitalsData } = await import("../src/lib/data/capitals.ts");
    const { famousPeopleData } = await import("../src/lib/data/famous_people.ts");
    const { landmarksData } = await import("../src/lib/data/landmarks.ts");
    const { currenciesData } = await import("../src/lib/data/currencies.ts");
    const { languagesData } = await import("../src/lib/data/languages.ts");

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
            throw error;
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
        }
    }

    // 3. Famous People
    console.log(`Migrating ${famousPeopleData.length} famous people...`);
    for (const person of famousPeopleData) {
        // Check existence to prevent duplicates
        const existing = await prisma.famousPerson.findFirst({
            where: { name: person.person, country: person.country }
        });

        if (!existing) {
            await prisma.famousPerson.create({
                data: {
                    name: person.person,
                    country: person.country,
                    description: person.description,
                    region: person.region,
                    imageUrl: person.imageUrl
                }
            });
        }
    }

    // 4. Landmarks
    console.log(`Migrating ${landmarksData.length} landmarks...`);
    for (const landmark of landmarksData) {
        const existing = await prisma.landmark.findFirst({
            where: { name: landmark.name, country: landmark.country }
        });

        if (!existing) {
            await prisma.landmark.create({
                data: {
                    name: landmark.name,
                    country: landmark.country,
                    description: `Located in ${landmark.city}, ${landmark.region}`,
                    imageUrl: landmark.imagePath,
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
