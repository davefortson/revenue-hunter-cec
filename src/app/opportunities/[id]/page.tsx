'use client';

import { useState, useEffect, use } from 'react';
import { Opportunity, Assessment } from '@/lib/types';
import { ReadinessGauge } from '@/components/opportunities/ReadinessGauge';
import { GapAnalysis } from '@/components/opportunities/GapAnalysis';
import { DraftNarrative } from '@/components/opportunities/DraftNarrative';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, DollarSign, Calendar, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Props {
  params: Promise<{ id: string }>;
}

export default function OpportunityDetailPage({ params }: Props) {
  const { id } = use(params);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/opportunities`);
        const data = await res.json();
        const opp = data.opportunities.find((o: Opportunity) => o.id === id);
        setOpportunity(opp || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const runAssessment = async () => {
    if (!opportunity) return;
    setAssessing(true);
    try {
      const res = await fetch('/api/assess-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: id }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAssessment(data.assessment);
      toast.success('Readiness assessment complete!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to run assessment. Please try again.');
    } finally {
      setAssessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#4CAF81]" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Opportunity not found.</p>
        <Link href="/opportunities" className="text-sm text-[#4CAF81] hover:underline mt-2 inline-block">
          Back to opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/opportunities" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{opportunity.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{opportunity.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {opportunity.funder && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" /> {opportunity.funder}
                  </div>
                )}
                {opportunity.amount && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" /> {opportunity.amount}
                  </div>
                )}
                {opportunity.deadline && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Deadline: {opportunity.deadline}
                  </div>
                )}
              </div>
            </div>

            {/* Score gauge */}
            {assessment ? (
              <ReadinessGauge score={assessment.readiness_score} />
            ) : (
              <Button
                onClick={runAssessment}
                disabled={assessing}
                className="bg-[#1F5C3E] hover:bg-[#174a31] shrink-0"
              >
                {assessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Assessment'
                )}
              </Button>
            )}
          </div>

          {assessment?.score_explanation && (
            <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
              {assessment.score_explanation}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Assessment Results */}
      {assessing && (
        <Card className="border-[#4CAF81]/30 bg-[#E8F5EE]/50">
          <CardContent className="flex items-center gap-3 p-6">
            <Loader2 className="h-5 w-5 animate-spin text-[#1F5C3E]" />
            <div>
              <p className="text-sm font-medium text-[#1F5C3E]">Regen AI is analyzing your claims against {opportunity.requirements.length} requirements...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take 10-20 seconds.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {assessment && (
        <>
          {/* Strengths */}
          {assessment.strengths && assessment.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-green-700">Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assessment.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{s}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Gap Analysis */}
          <GapAnalysis gaps={assessment.gaps} />

          {/* Matched Requirements */}
          {assessment.matched_requirements && assessment.matched_requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requirement Matching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assessment.matched_requirements.map((mr, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                      mr.match_quality === 'full' ? 'bg-green-500' :
                      mr.match_quality === 'partial' ? 'bg-amber-500' : 'bg-red-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{mr.requirement}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${
                          mr.match_quality === 'full' ? 'bg-green-50 text-green-700 border-green-200' :
                          mr.match_quality === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {mr.match_quality}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{mr.notes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Draft Narrative */}
          {assessment.draft_narrative && (
            <DraftNarrative narrative={assessment.draft_narrative} />
          )}
        </>
      )}

      {/* Requirements List (always shown) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requirements ({opportunity.requirements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {opportunity.requirements.map((req, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex-1">
                <p className="text-sm text-foreground">{req.requirement}</p>
                <div className="mt-1 flex gap-2">
                  <Badge variant="outline" className="text-xs">{req.type}</Badge>
                  {req.critical && (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Required</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
