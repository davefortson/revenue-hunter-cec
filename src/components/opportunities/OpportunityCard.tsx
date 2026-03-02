'use client';

import { Opportunity } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Building2 } from 'lucide-react';
import Link from 'next/link';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:border-[#4CAF81]/40">
        <CardContent className="p-5">
          <h3 className="text-base font-semibold text-foreground">{opportunity.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {opportunity.funder && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {opportunity.funder}
              </div>
            )}
            {opportunity.amount && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                {opportunity.amount}
              </div>
            )}
            {opportunity.deadline && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {opportunity.deadline}
              </div>
            )}
          </div>
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {opportunity.requirements.length} requirements
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
