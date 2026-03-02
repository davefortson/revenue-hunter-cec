import { NextRequest, NextResponse } from 'next/server';
import { getClaims, getOpportunity, addAssessment } from '@/lib/db';
import { assessReadiness } from '@/lib/ai';
import { CEC_ORG_ID } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { opportunityId } = await request.json();

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId is required' },
        { status: 400 }
      );
    }

    // Fetch claims and opportunity
    const [claims, opportunity] = await Promise.all([
      getClaims(CEC_ORG_ID),
      getOpportunity(opportunityId),
    ]);

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Run readiness assessment via AI (or mock)
    const result = await assessReadiness(claims, opportunity.requirements, opportunity.name);

    // Save assessment
    const assessment = await addAssessment({
      org_id: CEC_ORG_ID,
      opportunity_id: opportunityId,
      readiness_score: result.readiness_score,
      score_explanation: result.score_explanation,
      matched_claims: result.matched_requirements.flatMap(m => m.matched_claim_ids),
      matched_requirements: result.matched_requirements,
      gaps: result.gaps,
      strengths: result.strengths,
      draft_narrative: result.draft_narrative,
    });

    return NextResponse.json({ assessment });
  } catch (error) {
    console.error('Error assessing readiness:', error);
    return NextResponse.json(
      { error: 'Failed to assess readiness' },
      { status: 500 }
    );
  }
}
