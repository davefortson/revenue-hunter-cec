import { NextRequest, NextResponse } from 'next/server';
import { getClaims } from '@/lib/db';
import { CEC_ORG_ID } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme') || undefined;
    const claim_type = searchParams.get('claim_type') || undefined;
    const search = searchParams.get('search') || undefined;

    const claims = await getClaims(CEC_ORG_ID, { theme, claim_type, search });
    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}
