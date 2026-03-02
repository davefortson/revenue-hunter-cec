import { Organization, Claim, Document, Opportunity, Assessment } from './types';
import { SEED_ORG, SEED_CLAIMS, SEED_DOCUMENTS, SEED_OPPORTUNITY, CEC_ORG_ID } from './seed-data';
import { v4 as uuidv4 } from 'uuid';

// In-memory data store — seeded with demo data
// When Supabase env vars are set, this can be swapped for real DB calls

interface Store {
  organizations: Organization[];
  claims: Claim[];
  documents: Document[];
  opportunities: Opportunity[];
  assessments: Assessment[];
}

const store: Store = {
  organizations: [SEED_ORG],
  claims: [...SEED_CLAIMS],
  documents: [...SEED_DOCUMENTS],
  opportunities: [SEED_OPPORTUNITY],
  assessments: [],
};

// --- Organizations ---

export async function getOrganization(id?: string): Promise<Organization | null> {
  const orgId = id || CEC_ORG_ID;
  return store.organizations.find(o => o.id === orgId) || null;
}

// --- Claims ---

export async function getClaims(orgId?: string, filters?: {
  theme?: string;
  claim_type?: string;
  search?: string;
  human_reviewed?: boolean;
}): Promise<Claim[]> {
  let claims = store.claims.filter(c => c.org_id === (orgId || CEC_ORG_ID));

  if (filters?.theme) {
    claims = claims.filter(c => c.theme_tags.includes(filters.theme!));
  }
  if (filters?.claim_type) {
    claims = claims.filter(c => c.claim_type === filters.claim_type);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    claims = claims.filter(c => c.narrative.toLowerCase().includes(q));
  }
  if (filters?.human_reviewed !== undefined) {
    claims = claims.filter(c => c.human_reviewed === filters.human_reviewed);
  }

  return claims.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getClaim(id: string): Promise<Claim | null> {
  return store.claims.find(c => c.id === id) || null;
}

export async function addClaims(claims: Omit<Claim, 'id' | 'created_at' | 'human_reviewed' | 'ledger_anchored' | 'status'>[]): Promise<Claim[]> {
  const newClaims: Claim[] = claims.map(c => ({
    ...c,
    id: uuidv4(),
    status: 'self_reported' as const,
    human_reviewed: false,
    ledger_anchored: false,
    created_at: new Date().toISOString(),
  }));
  store.claims.push(...newClaims);
  return newClaims;
}

export async function updateClaimReviewStatus(claimIds: string[], reviewed: boolean): Promise<void> {
  for (const id of claimIds) {
    const claim = store.claims.find(c => c.id === id);
    if (claim) {
      claim.human_reviewed = reviewed;
    }
  }
}

// --- Documents ---

export async function getDocuments(orgId?: string): Promise<Document[]> {
  return store.documents
    .filter(d => d.org_id === (orgId || CEC_ORG_ID))
    .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
}

export async function addDocument(doc: Omit<Document, 'id' | 'upload_date'>): Promise<Document> {
  const newDoc: Document = {
    ...doc,
    id: uuidv4(),
    upload_date: new Date().toISOString(),
  };
  store.documents.push(newDoc);
  return newDoc;
}

export async function updateDocumentStatus(id: string, status: Document['status'], claimsExtracted?: number): Promise<void> {
  const doc = store.documents.find(d => d.id === id);
  if (doc) {
    doc.status = status;
    if (claimsExtracted !== undefined) {
      doc.claims_extracted = claimsExtracted;
    }
  }
}

// --- Opportunities ---

export async function getOpportunities(orgId?: string): Promise<Opportunity[]> {
  return store.opportunities
    .filter(o => o.org_id === (orgId || CEC_ORG_ID))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  return store.opportunities.find(o => o.id === id) || null;
}

export async function addOpportunity(opp: Omit<Opportunity, 'id' | 'created_at'>): Promise<Opportunity> {
  const newOpp: Opportunity = {
    ...opp,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  store.opportunities.push(newOpp);
  return newOpp;
}

// --- Assessments ---

export async function getAssessment(opportunityId: string): Promise<Assessment | null> {
  return store.assessments.find(a => a.opportunity_id === opportunityId) || null;
}

export async function addAssessment(assessment: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment> {
  // Remove existing assessment for this opportunity
  store.assessments = store.assessments.filter(a => a.opportunity_id !== assessment.opportunity_id);

  const newAssessment: Assessment = {
    ...assessment,
    id: uuidv4(),
    created_at: new Date().toISOString(),
  };
  store.assessments.push(newAssessment);
  return newAssessment;
}

// --- Stats ---

export async function getStats(orgId?: string): Promise<{
  totalClaims: number;
  documentsUploaded: number;
  opportunitiesAssessed: number;
  avgReadinessScore: number | null;
}> {
  const oid = orgId || CEC_ORG_ID;
  const claims = store.claims.filter(c => c.org_id === oid);
  const docs = store.documents.filter(d => d.org_id === oid);
  const assessments = store.assessments.filter(a => a.org_id === oid);

  const avgScore = assessments.length > 0
    ? Math.round(assessments.reduce((sum, a) => sum + (a.readiness_score || 0), 0) / assessments.length)
    : null;

  return {
    totalClaims: claims.length,
    documentsUploaded: docs.length,
    opportunitiesAssessed: assessments.length,
    avgReadinessScore: avgScore,
  };
}

export async function getClaimsByTheme(orgId?: string): Promise<Record<string, number>> {
  const claims = store.claims.filter(c => c.org_id === (orgId || CEC_ORG_ID));
  const counts: Record<string, number> = {};
  for (const claim of claims) {
    for (const tag of claim.theme_tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
}
