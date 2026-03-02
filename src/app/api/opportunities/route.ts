import { NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/db';
import { CEC_ORG_ID } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const opportunities = await getOpportunities(CEC_ORG_ID);
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}
