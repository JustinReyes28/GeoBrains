import { NextResponse } from 'next/server';
import { countriesData } from '@/src/lib/data/countries';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10', 10);

    // Filter out invalid data if any
    const validCountries = countriesData.filter(c => c.centerLat !== undefined && c.centerLng !== undefined);

    // Shuffle array
    const shuffled = [...validCountries].sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    const selected = shuffled.slice(0, count);

    return NextResponse.json(selected);
}
