'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { THEME_COLORS } from '@/lib/types';

interface ClaimsByThemeProps {
  themeCounts: Record<string, number>;
}

export function ClaimsByTheme({ themeCounts }: ClaimsByThemeProps) {
  const sorted = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Claims by Theme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map(([theme, count]) => {
          const config = THEME_COLORS[theme] || { label: theme, color: 'bg-gray-100 text-gray-800' };
          const pct = Math.round((count / maxCount) * 100);
          return (
            <div key={theme} className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4CAF81] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-foreground w-6 text-right">{count}</span>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">No claims yet. Upload documents to get started.</p>
        )}
      </CardContent>
    </Card>
  );
}
