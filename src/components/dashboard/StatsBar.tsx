'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Database, FileText, Target, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  totalClaims: number;
  documentsUploaded: number;
  opportunitiesAssessed: number;
  avgReadinessScore: number | null;
}

export function StatsBar({ totalClaims, documentsUploaded, opportunitiesAssessed, avgReadinessScore }: StatsBarProps) {
  const stats = [
    { label: 'Total Claims', value: totalClaims, icon: Database, color: 'text-[#1F5C3E]' },
    { label: 'Documents Uploaded', value: documentsUploaded, icon: FileText, color: 'text-[#3B82F6]' },
    { label: 'Opportunities Assessed', value: opportunitiesAssessed, icon: Target, color: 'text-[#F59E0B]' },
    { label: 'Avg Readiness Score', value: avgReadinessScore !== null ? `${avgReadinessScore}%` : '—', icon: TrendingUp, color: 'text-[#8B5CF6]' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
