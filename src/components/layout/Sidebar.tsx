'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Database, Upload, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/claims', label: 'My Claims', icon: Database },
  { href: '/upload', label: 'Upload Documents', icon: Upload },
  { href: '/opportunities', label: 'Funding Opportunities', icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-white">
      {/* Logo / Org Section */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F5C3E] text-white font-bold text-sm">
          RH
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Revenue Hunter</p>
          <p className="text-xs text-muted-foreground">Claims Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#E8F5EE] text-[#1F5C3E]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <span className="font-medium text-[#1F5C3E]">Regen Network</span>
        </p>
      </div>
    </aside>
  );
}
