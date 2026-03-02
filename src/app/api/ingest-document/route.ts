import { NextRequest, NextResponse } from 'next/server';
import { addClaims, addDocument, updateDocumentStatus } from '@/lib/db';
import { extractClaims } from '@/lib/ai';
import { CEC_ORG_ID } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { documentText, filename } = await request.json();

    if (!documentText || !filename) {
      return NextResponse.json(
        { error: 'documentText and filename are required' },
        { status: 400 }
      );
    }

    // Create document record
    const doc = await addDocument({
      org_id: CEC_ORG_ID,
      filename,
      doc_type: 'other',
      claims_extracted: 0,
      status: 'processing',
    });

    try {
      // Extract claims via AI (or mock)
      const result = await extractClaims(documentText, filename);

      // Add claims to store
      const newClaims = await addClaims(
        result.claims.map((c) => ({
          org_id: CEC_ORG_ID,
          narrative: c.narrative || '',
          claim_type: (c.claim_type as 'ecological' | 'social' | 'financial' | 'governance') || 'ecological',
          start_date: c.start_date,
          end_date: c.end_date,
          location: c.location,
          quantity: c.quantity,
          quantity_unit: c.quantity_unit,
          sdg_tags: c.sdg_tags || [],
          theme_tags: c.theme_tags || [],
          evidence_summary: c.evidence_summary,
          methodology: c.methodology,
          ai_confidence: c.ai_confidence || 0.7,
          source_document: filename,
          source_section: c.source_section,
        }))
      );

      // Update document status
      await updateDocumentStatus(doc.id, 'complete', newClaims.length);

      return NextResponse.json({ claims: newClaims, count: newClaims.length, documentId: doc.id });
    } catch (aiError) {
      await updateDocumentStatus(doc.id, 'error');
      throw aiError;
    }
  } catch (error) {
    console.error('Error ingesting document:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}
