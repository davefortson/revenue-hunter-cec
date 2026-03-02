import { NextRequest, NextResponse } from 'next/server';
import { addOpportunity } from '@/lib/db';
import { parseOpportunity } from '@/lib/ai';
import { CEC_ORG_ID } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { documentText, filename } = await request.json();

    if (!documentText) {
      return NextResponse.json(
        { error: 'documentText is required' },
        { status: 400 }
      );
    }

    // Parse opportunity via AI (or mock)
    const parsed = await parseOpportunity(documentText, filename || 'Pasted text');

    // Save to store
    const opportunity = await addOpportunity({
      org_id: CEC_ORG_ID,
      name: parsed.name,
      funder: parsed.funder,
      description: parsed.description,
      deadline: parsed.deadline,
      amount: parsed.amount,
      requirements: parsed.requirements,
      source_document: filename,
    });

    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error('Error ingesting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to process opportunity' },
      { status: 500 }
    );
  }
}
