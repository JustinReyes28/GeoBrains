import { NextResponse } from 'next/server';
import { countriesData } from '@/src/lib/data/countries';
import { parseQuizQuery } from '@/src/lib/quiz/schema';
import { shuffle } from '@/src/lib/quiz/random';
export const dynamic='force-dynamic';
export async function GET(request:Request) {
 const parsed=parseQuizQuery(request.url);
 if(!parsed.success) return NextResponse.json({error:'Invalid quiz parameters.'},{status:400});
 const {region,count}=parsed.data;
 const pool=countriesData.filter(c=>(region==='World'||c.region===region)&&Number.isFinite(c.centerLat)&&Number.isFinite(c.centerLng)&&Math.abs(c.centerLat)<=90&&Math.abs(c.centerLng)<=180);
 return NextResponse.json(shuffle(pool).slice(0,count),{headers:{'Cache-Control':'no-store'}});
}
