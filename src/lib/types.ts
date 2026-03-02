export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  location: string;
  focus_areas: string[];
  created_at: string;
}

export interface Claim {
  id: string;
  org_id: string;
  narrative: string;
  claim_type: 'ecological' | 'social' | 'financial' | 'governance';
  status: 'self_reported' | 'peer_reviewed' | 'verified';
  start_date?: string;
  end_date?: string;
  location?: string;
  quantity?: string;
  quantity_unit?: string;
  sdg_tags: string[];
  theme_tags: string[];
  evidence_summary?: string;
  methodology?: string;
  ai_confidence: number;
  source_document?: string;
  source_section?: string;
  human_reviewed: boolean;
  ledger_anchored: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  org_id: string;
  filename: string;
  doc_type: 'annual_report' | 'grant_application' | 'monitoring_report' | 'other';
  upload_date: string;
  claims_extracted: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export interface OpportunityRequirement {
  requirement: string;
  type: 'eligibility' | 'data' | 'geographic' | 'thematic' | 'reporting' | 'evidence';
  critical: boolean;
}

export interface Opportunity {
  id: string;
  org_id: string;
  name: string;
  funder: string;
  description: string;
  deadline?: string;
  amount?: string;
  requirements: OpportunityRequirement[];
  source_document?: string;
  created_at: string;
}

export interface MatchedRequirement {
  requirement: string;
  matched_claim_ids: string[];
  match_quality: 'full' | 'partial' | 'none';
  notes: string;
}

export interface Gap {
  gap_description: string;
  gap_type: 'missing_claim' | 'insufficient_evidence' | 'geographic_mismatch' | 'data_quality';
  priority: 'critical' | 'important' | 'minor';
  recommendation: string;
}

export interface Assessment {
  id: string;
  org_id: string;
  opportunity_id: string;
  readiness_score: number;
  score_explanation?: string;
  matched_claims: string[];
  matched_requirements?: MatchedRequirement[];
  gaps: Gap[];
  strengths?: string[];
  draft_narrative?: string;
  created_at: string;
}

export interface ClaimExtractionResult {
  claims: Omit<Claim, 'id' | 'org_id' | 'created_at' | 'human_reviewed' | 'ledger_anchored' | 'status'>[];
  count: number;
}

export interface OpportunityParseResult {
  name: string;
  funder: string;
  description: string;
  deadline?: string;
  amount?: string;
  requirements: OpportunityRequirement[];
}

export interface ReadinessAssessmentResult {
  readiness_score: number;
  score_explanation: string;
  matched_requirements: MatchedRequirement[];
  gaps: Gap[];
  strengths: string[];
  draft_narrative: string;
}

// Theme tag display configuration
export const THEME_COLORS: Record<string, { label: string; color: string }> = {
  solar_energy: { label: 'Solar Energy', color: 'bg-amber-100 text-amber-800' },
  regenerative_agriculture: { label: 'Regenerative Ag', color: 'bg-green-100 text-green-800' },
  transportation_electrification: { label: 'EV/Transport', color: 'bg-blue-100 text-blue-800' },
  water: { label: 'Water', color: 'bg-cyan-100 text-cyan-800' },
  biodiversity: { label: 'Biodiversity', color: 'bg-emerald-100 text-emerald-800' },
  policy_advocacy: { label: 'Policy', color: 'bg-purple-100 text-purple-800' },
  community_engagement: { label: 'Community', color: 'bg-pink-100 text-pink-800' },
  education: { label: 'Education', color: 'bg-indigo-100 text-indigo-800' },
  carbon: { label: 'Carbon', color: 'bg-gray-100 text-gray-800' },
};

export const CLAIM_TYPE_COLORS: Record<string, { label: string; color: string }> = {
  ecological: { label: 'Ecological', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  social: { label: 'Social', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  financial: { label: 'Financial', color: 'bg-green-100 text-green-800 border-green-200' },
  governance: { label: 'Governance', color: 'bg-purple-100 text-purple-800 border-purple-200' },
};
