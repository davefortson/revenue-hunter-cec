'use client';

import { useState, useMemo } from 'react';
import { Claim, THEME_COLORS, CLAIM_TYPE_COLORS } from '@/lib/types';
import { ClaimCard } from './ClaimCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ClaimsGridProps {
  claims: Claim[];
}

export function ClaimsGrid({ claims }: ClaimsGridProps) {
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = claims;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.narrative.toLowerCase().includes(q));
    }
    if (themeFilter !== 'all') {
      result = result.filter(c => c.theme_tags.includes(themeFilter));
    }
    if (typeFilter !== 'all') {
      result = result.filter(c => c.claim_type === typeFilter);
    }
    if (reviewFilter === 'reviewed') {
      result = result.filter(c => c.human_reviewed);
    } else if (reviewFilter === 'unreviewed') {
      result = result.filter(c => !c.human_reviewed);
    }
    return result;
  }, [claims, search, themeFilter, typeFilter, reviewFilter]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={themeFilter} onValueChange={setThemeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {Object.entries(THEME_COLORS).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(CLAIM_TYPE_COLORS).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={reviewFilter} onValueChange={setReviewFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Review Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="unreviewed">Unreviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {claims.length} claims
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No claims match your filters.</p>
        </div>
      )}
    </div>
  );
}
