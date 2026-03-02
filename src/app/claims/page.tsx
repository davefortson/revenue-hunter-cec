import { getClaims } from '@/lib/db';
import { ClaimsGrid } from '@/components/claims/ClaimsGrid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClaimsPage() {
  const claims = await getClaims();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claims Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, filter, and explore CEC&apos;s structured impact claims.
          </p>
        </div>
        <Link href="/upload">
          <Button className="bg-[#1F5C3E] hover:bg-[#174a31]">
            <Upload className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
        </Link>
      </div>

      {claims.length > 0 ? (
        <ClaimsGrid claims={claims} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No claims yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Upload your annual reports, grant applications, or monitoring reports and Regen AI will extract structured impact claims.
          </p>
          <Link href="/upload" className="mt-4">
            <Button className="bg-[#1F5C3E] hover:bg-[#174a31]">
              Upload Your First Document
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
