'use client';

import { Claim, THEME_COLORS, CLAIM_TYPE_COLORS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ClaimCardProps {
  claim: Claim;
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const typeConfig = CLAIM_TYPE_COLORS[claim.claim_type];

  return (
    <Link href={`/claims/${claim.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:border-[#4CAF81]/40">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-foreground line-clamp-2 flex-1">{claim.narrative}</p>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  claim.ai_confidence >= 0.9
                    ? 'bg-green-500'
                    : claim.ai_confidence >= 0.8
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                title={`AI Confidence: ${Math.round(claim.ai_confidence * 100)}%`}
              />
              {claim.human_reviewed && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
          </div>

          {claim.quantity && (
            <p className="mt-2 text-lg font-bold text-[#1F5C3E]">
              {claim.quantity} <span className="text-sm font-normal text-muted-foreground">{claim.quantity_unit}</span>
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className={`text-xs ${typeConfig?.color || ''}`}>
              {typeConfig?.label || claim.claim_type}
            </Badge>
            {claim.theme_tags.map((tag) => {
              const tc = THEME_COLORS[tag];
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                    tc?.color || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tc?.label || tag}
                </span>
              );
            })}
          </div>

          {claim.source_document && (
            <p className="mt-2 text-xs text-muted-foreground truncate">
              Source: {claim.source_document}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
