import { NextResponse } from 'next/server';
import { currenciesData, CurrencyData } from '../../../../src/lib/data/currencies';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Simple shuffling algorithm
    const shuffledCurrencies = [...currenciesData].sort(() => 0.5 - Math.random());
    const selectedCurrencies = shuffledCurrencies.slice(0, Math.min(count, currenciesData.length));

    const questions = selectedCurrencies.map((item) => {
        // Generate options: Correct answer + 3 random distractors
        const distractors = Array.from(new Set(
            currenciesData
                .filter(c => c.currencyName !== item.currencyName)
                .map(c => c.currencyName)
        ))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const options = [...distractors, item.currencyName].sort(() => 0.5 - Math.random());

        return {
            id: item.country,
            country: item.country,
            correctAnswer: item.currencyName,
            options: options,
            region: item.region,
            symbol: item.symbol,
            code: item.currencyCode
        };
    });

    return NextResponse.json(questions);
}
