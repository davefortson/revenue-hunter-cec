import { getOpportunities } from '@/lib/db';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funding Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload grant applications or RFPs to see your readiness score.
          </p>
        </div>
        <Link href="/opportunities/new">
          <Button className="bg-[#1F5C3E] hover:bg-[#174a31]">
            <Plus className="mr-2 h-4 w-4" />
            Add Opportunity
          </Button>
        </Link>
      </div>

      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No opportunities yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Upload a grant application or RFP to see how your claims match up.
          </p>
          <Link href="/opportunities/new" className="mt-4">
            <Button className="bg-[#1F5C3E] hover:bg-[#174a31]">
              Add Your First Opportunity
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
