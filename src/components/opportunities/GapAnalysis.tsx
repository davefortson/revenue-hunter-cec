'use client';

import { Gap } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface GapAnalysisProps {
  gaps: Gap[];
}

const priorityConfig = {
  critical: { icon: AlertTriangle, color: 'bg-red-100 text-red-800 border-red-200', iconColor: 'text-red-500' },
  important: { icon: AlertCircle, color: 'bg-amber-100 text-amber-800 border-amber-200', iconColor: 'text-amber-500' },
  minor: { icon: Info, color: 'bg-blue-100 text-blue-800 border-blue-200', iconColor: 'text-blue-500' },
};

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  if (gaps.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gaps.map((gap, i) => {
          const config = priorityConfig[gap.priority];
          const Icon = config.icon;
          return (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{gap.gap_description}</p>
                    <Badge variant="outline" className={`text-xs shrink-0 ${config.color}`}>
                      {gap.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
