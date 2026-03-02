'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ExtractionProgressProps {
  filename: string;
  stage: 'reading' | 'extracting' | 'saving' | 'complete';
}

const stages = {
  reading: { label: 'Reading document...', progress: 25 },
  extracting: { label: 'Regen AI is extracting impact claims...', progress: 60 },
  saving: { label: 'Saving claims to your inventory...', progress: 85 },
  complete: { label: 'Extraction complete!', progress: 100 },
};

export function ExtractionProgress({ filename, stage }: ExtractionProgressProps) {
  const current = stages[stage];

  return (
    <Card className="border-[#4CAF81]/30 bg-[#E8F5EE]/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {stage !== 'complete' ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#1F5C3E]" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <p className="text-sm font-medium text-[#1F5C3E]">{current.label}</p>
        </div>
        <Progress value={current.progress} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">Processing: {filename}</p>
      </CardContent>
    </Card>
  );
}
