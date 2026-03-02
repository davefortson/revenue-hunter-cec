'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DraftNarrativeProps {
  narrative: string;
}

export function DraftNarrative({ narrative }: DraftNarrativeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(narrative);
      setCopied(true);
      toast.success('Narrative copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Draft Grant Narrative</CardTitle>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed whitespace-pre-wrap">
            {narrative}
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <p>This draft is based on your registered claims. Review and edit before submitting.</p>
        </div>
      </CardContent>
    </Card>
  );
}
