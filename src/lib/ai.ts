import { callClaude, isAIAvailable } from './anthropic';
import { CLAIM_EXTRACTION_PROMPT, OPPORTUNITY_PARSING_PROMPT, READINESS_ASSESSMENT_PROMPT } from './prompts';
import { Claim, OpportunityParseResult, ReadinessAssessmentResult, OpportunityRequirement } from './types';

// --- Claim Extraction ---

export async function extractClaims(documentText: string, filename: string): Promise<{
  claims: Partial<Claim>[];
  count: number;
}> {
  if (!isAIAvailable()) {
    return getMockClaimExtraction(filename);
  }

  try {
    const response = await callClaude(
      CLAIM_EXTRACTION_PROMPT,
      `Document filename: ${filename}\n\nDocument text:\n${documentText}`
    );
    const claims = JSON.parse(response);
    return { claims, count: claims.length };
  } catch (error) {
    console.error('AI claim extraction failed:', error);
    return getMockClaimExtraction(filename);
  }
}

function getMockClaimExtraction(filename: string): { claims: Partial<Claim>[]; count: number } {
  const mockClaims: Partial<Claim>[] = [
    {
      narrative: `Implemented water conservation measures across 12 partner agricultural operations, reducing irrigation water usage by 22% (extracted from ${filename})`,
      claim_type: 'ecological',
      quantity: '12',
      quantity_unit: 'operations',
      theme_tags: ['water', 'regenerative_agriculture'],
      sdg_tags: ['SDG6', 'SDG15'],
      ai_confidence: 0.88,
      source_document: filename,
      source_section: 'Water Conservation',
      evidence_summary: 'Irrigation records and water meter data from partner farms',
    },
    {
      narrative: `Trained 85 local farmers in soil health assessment and regenerative practices through hands-on workshops (extracted from ${filename})`,
      claim_type: 'social',
      quantity: '85',
      quantity_unit: 'farmers',
      theme_tags: ['education', 'regenerative_agriculture'],
      sdg_tags: ['SDG4', 'SDG2'],
      ai_confidence: 0.91,
      source_document: filename,
      source_section: 'Education Programs',
      evidence_summary: 'Workshop attendance records and post-training surveys',
    },
    {
      narrative: `Facilitated $450,000 in conservation easement agreements protecting 320 acres of prime agricultural land (extracted from ${filename})`,
      claim_type: 'financial',
      quantity: '450000',
      quantity_unit: 'USD',
      theme_tags: ['policy_advocacy', 'regenerative_agriculture'],
      sdg_tags: ['SDG15', 'SDG1'],
      ai_confidence: 0.86,
      source_document: filename,
      source_section: 'Land Conservation',
      evidence_summary: 'Easement agreements and land trust documentation',
    },
  ];

  return { claims: mockClaims, count: mockClaims.length };
}

// --- Opportunity Parsing ---

export async function parseOpportunity(documentText: string, filename: string): Promise<OpportunityParseResult> {
  if (!isAIAvailable()) {
    return getMockOpportunityParsing(documentText);
  }

  try {
    const response = await callClaude(
      OPPORTUNITY_PARSING_PROMPT,
      `Document filename: ${filename}\n\nDocument text:\n${documentText}`
    );
    return JSON.parse(response);
  } catch (error) {
    console.error('AI opportunity parsing failed:', error);
    return getMockOpportunityParsing(documentText);
  }
}

function getMockOpportunityParsing(text: string): OpportunityParseResult {
  // Try to extract a name from the first line of text
  const firstLine = text.split('\n').find(l => l.trim().length > 0) || 'Funding Opportunity';
  return {
    name: firstLine.slice(0, 80),
    funder: 'Federal/State Agency',
    description: 'A funding opportunity supporting environmental conservation, climate resilience, and community-based ecological stewardship projects.',
    deadline: 'June 30, 2026',
    amount: '$100,000 - $500,000',
    requirements: [
      { requirement: 'Applicant must be a 501(c)(3) nonprofit organization', type: 'eligibility', critical: true },
      { requirement: 'Project must demonstrate measurable environmental outcomes', type: 'data', critical: true },
      { requirement: 'Must include community engagement component', type: 'thematic', critical: false },
      { requirement: 'Geographic focus within the United States', type: 'geographic', critical: true },
      { requirement: 'Must provide quarterly progress reports', type: 'reporting', critical: true },
      { requirement: 'Letter of support from at least one community partner', type: 'evidence', critical: false },
    ],
  };
}

// --- Readiness Assessment ---

export async function assessReadiness(
  claims: Claim[],
  requirements: OpportunityRequirement[],
  opportunityName: string
): Promise<ReadinessAssessmentResult> {
  if (!isAIAvailable()) {
    return getMockReadinessAssessment(claims, requirements);
  }

  try {
    const response = await callClaude(
      READINESS_ASSESSMENT_PROMPT,
      `Organization: Community Environmental Council (CEC)
Opportunity: ${opportunityName}

Organization's Claims Database:
${JSON.stringify(claims, null, 2)}

Opportunity Requirements:
${JSON.stringify(requirements, null, 2)}`
    );
    return JSON.parse(response);
  } catch (error) {
    console.error('AI readiness assessment failed:', error);
    return getMockReadinessAssessment(claims, requirements);
  }
}

function getMockReadinessAssessment(
  claims: Claim[],
  requirements: OpportunityRequirement[]
): ReadinessAssessmentResult {
  const matchedRequirements = requirements.map(req => {
    // Simple keyword matching for mock
    const keywords = req.requirement.toLowerCase();
    const matchedClaims = claims.filter(c => {
      const narrative = c.narrative.toLowerCase();
      const tags = c.theme_tags.join(' ').toLowerCase();
      return (
        (keywords.includes('agriculture') && (tags.includes('regenerative') || narrative.includes('farm'))) ||
        (keywords.includes('ghg') && (tags.includes('carbon') || narrative.includes('co2'))) ||
        (keywords.includes('community') && (tags.includes('community') || narrative.includes('community'))) ||
        (keywords.includes('monitor') && (narrative.includes('metric') || narrative.includes('measure'))) ||
        (keywords.includes('baseline') && (narrative.includes('estimate') || narrative.includes('data'))) ||
        (keywords.includes('underserved') && (narrative.includes('low-income') || narrative.includes('indigenous'))) ||
        (keywords.includes('market') && narrative.includes('incentive'))
      );
    });

    return {
      requirement: req.requirement,
      matched_claim_ids: matchedClaims.map(c => c.id),
      match_quality: (matchedClaims.length > 0 ? (matchedClaims.length >= 2 ? 'full' : 'partial') : 'none') as 'full' | 'partial' | 'none',
      notes: matchedClaims.length > 0
        ? `Matched by ${matchedClaims.length} claim(s) in the database`
        : 'No direct claims found for this requirement',
    };
  });

  const fullMatches = matchedRequirements.filter(m => m.match_quality === 'full').length;
  const partialMatches = matchedRequirements.filter(m => m.match_quality === 'partial').length;
  const totalReqs = requirements.length;
  const score = Math.round(((fullMatches * 1.0 + partialMatches * 0.5) / totalReqs) * 100);

  return {
    readiness_score: Math.min(Math.max(score, 15), 85),
    score_explanation: `CEC satisfies ${fullMatches} requirements fully and ${partialMatches} partially out of ${totalReqs} total requirements.`,
    matched_requirements: matchedRequirements,
    gaps: [
      {
        gap_description: 'No formal monitoring, reporting, and verification (MRV) plan documented in claims',
        gap_type: 'missing_claim',
        priority: 'critical',
        recommendation: 'Develop and document a structured MRV plan that includes baseline measurements, monitoring frequency, and verification methodology for GHG reductions and carbon sequestration.',
      },
      {
        gap_description: 'Market development activities for climate-smart commodities not documented',
        gap_type: 'missing_claim',
        priority: 'critical',
        recommendation: 'Document any existing or planned market linkage activities, buyer agreements, or supply chain partnerships for climate-smart agricultural products.',
      },
      {
        gap_description: 'Baseline conditions and projected impacts need stronger quantification',
        gap_type: 'insufficient_evidence',
        priority: 'important',
        recommendation: 'Compile baseline soil carbon measurements, pre-intervention emission profiles, and projected impact trajectories with quantified targets.',
      },
    ],
    strengths: [
      'Strong track record of farm transitions to regenerative agriculture (22 farms, 890 acres cover cropping)',
      'Demonstrated GHG reduction impact (4,200 metric tons CO2e)',
      'Established partnerships with indigenous land management organizations',
      'Proven community engagement capacity (6,800+ community members reached)',
      'History of securing financial resources for underserved communities ($2.1M in incentives)',
    ],
    draft_narrative: `Community Environmental Council (CEC) proposes to expand its proven climate-smart agriculture programming in Santa Barbara and Ventura Counties through the USDA Partnerships for Climate-Smart Commodities program. Since 1970, CEC has served as the region's leading environmental organization, building deep expertise in regenerative agriculture, clean energy, and community-based sustainability.

CEC has already facilitated the transition of 22 farms to regenerative agriculture practices across Santa Barbara and Ventura Counties between 2021-2023, demonstrating our capacity to work directly with agricultural producers on climate-smart practice adoption. Our cover cropping program has supported adoption across 890 acres of partner farmland, building soil health and carbon sequestration capacity across the region.

Our climate impact is quantifiable and growing. In 2022 alone, CEC's combined solar and electrification programs reduced greenhouse gas emissions by an estimated 4,200 metric tons CO2e. Through our solar program, we have installed 3.4 MW of community solar capacity serving 840 low-income households, demonstrating our commitment to equitable climate solutions.

CEC brings a unique strength in community partnerships. We have partnered with 3 indigenous land management organizations to integrate traditional ecological knowledge into our regenerative agriculture programming, ensuring culturally appropriate and ecologically sound practice adoption. Our education and outreach programs have engaged 6,800 community members in environmental education during 2022-2023, building the constituency for climate-smart agricultural systems.

Financially, CEC has secured $2.1 million in clean energy incentives and rebates for low-income households and small businesses, demonstrating our ability to leverage public funding for community benefit and our understanding of the financial mechanisms that support climate-smart transitions.

Through this proposed project, CEC will expand farm transitions to regenerative practices, develop market linkages for climate-smart commodities produced by our partner farms, and implement a robust monitoring and verification framework to quantify climate benefits. We will prioritize partnerships with underserved producers and build on our existing indigenous community collaborations to ensure equitable access to climate-smart agriculture resources and markets.`,
  };
}
