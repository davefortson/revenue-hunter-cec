import { getClaim } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { THEME_COLORS, CLAIM_TYPE_COLORS } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClaimDetailPage({ params }: Props) {
  const { id } = await params;
  const claim = await getClaim(id);

  if (!claim) {
    notFound();
  }

  const typeConfig = CLAIM_TYPE_COLORS[claim.claim_type];
  const confidenceLabel = claim.ai_confidence >= 0.9 ? 'High' : claim.ai_confidence >= 0.8 ? 'Medium' : 'Low';
  const confidenceColor = claim.ai_confidence >= 0.9 ? 'text-green-600' : claim.ai_confidence >= 0.8 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/claims" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Claims
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-snug">{claim.narrative}</CardTitle>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={typeConfig?.color || ''}>
                  {typeConfig?.label || claim.claim_type}
                </Badge>
                <Badge variant={claim.human_reviewed ? 'default' : 'secondary'} className={claim.human_reviewed ? 'bg-green-600' : ''}>
                  {claim.human_reviewed ? (
                    <><CheckCircle2 className="mr-1 h-3 w-3" /> Reviewed</>
                  ) : (
                    <><AlertCircle className="mr-1 h-3 w-3" /> Unreviewed</>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {claim.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quantity */}
          {claim.quantity && (
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Quantity</p>
              <p className="text-2xl font-bold text-[#1F5C3E]">{claim.quantity} <span className="text-base font-normal text-foreground">{claim.quantity_unit}</span></p>
            </div>
          )}

          <Separator />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {claim.location && (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Location</p>
                <p className="text-sm">{claim.location}</p>
              </div>
            )}
            {(claim.start_date || claim.end_date) && (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Time Period</p>
                <p className="text-sm">{claim.start_date}{claim.end_date ? ` – ${claim.end_date}` : ''}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">AI Confidence</p>
              <p className={`text-sm font-medium ${confidenceColor}`}>
                {Math.round(claim.ai_confidence * 100)}% ({confidenceLabel})
              </p>
            </div>
            {claim.source_document && (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Source Document</p>
                <p className="text-sm">{claim.source_document}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Theme tags */}
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Themes</p>
            <div className="flex flex-wrap gap-2">
              {claim.theme_tags.map((tag) => {
                const tc = THEME_COLORS[tag];
                return (
                  <span key={tag} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tc?.color || 'bg-gray-100 text-gray-700'}`}>
                    {tc?.label || tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* SDG tags */}
          {claim.sdg_tags.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-2">SDG Alignment</p>
              <div className="flex flex-wrap gap-2">
                {claim.sdg_tags.map((sdg) => (
                  <Badge key={sdg} variant="outline" className="text-xs">{sdg}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          {claim.evidence_summary && (
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Evidence Summary</p>
              <p className="text-sm text-foreground/80">{claim.evidence_summary}</p>
            </div>
          )}

          {claim.source_section && (
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Source Section</p>
              <p className="text-sm text-foreground/80">{claim.source_section}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
