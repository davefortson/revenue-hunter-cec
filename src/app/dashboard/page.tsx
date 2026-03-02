import { getOrganization, getStats, getClaimsByTheme, getClaims } from '@/lib/db';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { ClaimsByTheme } from '@/components/dashboard/ClaimsByTheme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { THEME_COLORS, CLAIM_TYPE_COLORS } from '@/lib/types';
import Link from 'next/link';
import { Upload, Target, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const org = await getOrganization();
  const stats = await getStats();
  const themeCounts = await getClaimsByTheme();
  const recentClaims = (await getClaims()).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Org Header */}
      <Card className="border-[#4CAF81]/20 bg-gradient-to-r from-[#E8F5EE] to-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1F5C3E]">{org?.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{org?.location}</p>
              <p className="mt-2 max-w-2xl text-sm text-foreground/80">{org?.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {org?.focus_areas.map((area) => {
                  const config = THEME_COLORS[area] || { label: area, color: 'bg-gray-100 text-gray-800' };
                  return (
                    <span key={area} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <StatsBar
        totalClaims={stats.totalClaims}
        documentsUploaded={stats.documentsUploaded}
        opportunitiesAssessed={stats.opportunitiesAssessed}
        avgReadinessScore={stats.avgReadinessScore}
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Claims by Theme */}
        <div className="lg:col-span-1">
          <ClaimsByTheme themeCounts={themeCounts} />
        </div>

        {/* Recent Claims */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Claims</CardTitle>
              <Link href="/claims" className="text-xs text-[#4CAF81] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentClaims.map((claim) => {
                const typeConfig = CLAIM_TYPE_COLORS[claim.claim_type];
                return (
                  <div key={claim.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{claim.narrative}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${typeConfig?.color || ''}`}>
                          {typeConfig?.label || claim.claim_type}
                        </Badge>
                        {claim.quantity && (
                          <span className="text-xs font-semibold text-[#1F5C3E]">
                            {claim.quantity} {claim.quantity_unit}
                          </span>
                        )}
                        {claim.theme_tags.slice(0, 2).map((tag) => {
                          const tc = THEME_COLORS[tag];
                          return (
                            <span key={tag} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tc?.color || 'bg-gray-100 text-gray-700'}`}>
                              {tc?.label || tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`h-2 w-2 rounded-full ${claim.ai_confidence >= 0.9 ? 'bg-green-500' : claim.ai_confidence >= 0.8 ? 'bg-amber-500' : 'bg-red-500'}`} title={`AI Confidence: ${Math.round(claim.ai_confidence * 100)}%`} />
                      {claim.human_reviewed && (
                        <span className="text-xs text-green-600">Reviewed</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {recentClaims.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No claims yet. Upload documents to extract your first claims.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/upload">
          <Button className="bg-[#1F5C3E] hover:bg-[#174a31]">
            <Upload className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
        </Link>
        <Link href="/opportunities">
          <Button variant="outline" className="border-[#4CAF81] text-[#1F5C3E] hover:bg-[#E8F5EE]">
            <Target className="mr-2 h-4 w-4" />
            Assess an Opportunity
          </Button>
        </Link>
      </div>
    </div>
  );
}
