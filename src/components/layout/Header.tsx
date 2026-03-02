'use client';

import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/80 px-8 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F5C3E] text-white text-xs font-bold">
          CEC
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Community Environmental Council</h2>
          <p className="text-xs text-muted-foreground">Santa Barbara County, California</p>
        </div>
      </div>
      <Badge variant="outline" className="border-[#4CAF81] bg-[#E8F5EE] text-[#1F5C3E] text-xs">
        Powered by Regen Claims Engine
      </Badge>
    </header>
  );
}
