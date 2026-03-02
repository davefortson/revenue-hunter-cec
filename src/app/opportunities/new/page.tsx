'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    let documentText = text;

    if (file && !text) {
      try {
        documentText = await file.text();
      } catch {
        toast.error('Could not read file. Try pasting the text instead.');
        return;
      }
    }

    if (!documentText || documentText.length < 20) {
      toast.error('Please paste the opportunity text or upload a document.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ingest-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: documentText.slice(0, 50000),
          filename: file?.name || 'Pasted text',
        }),
      });

      if (!response.ok) throw new Error('Failed to process');

      const data = await response.json();
      toast.success(`Opportunity "${data.opportunity.name}" analyzed successfully!`);
      router.push(`/opportunities/${data.opportunity.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to process opportunity. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add Funding Opportunity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste the grant requirements, RFP text, or application instructions and Regen AI will analyze your readiness.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opportunity Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Paste opportunity text</Label>
            <Textarea
              placeholder="Paste the full grant requirements, RFP text, or application instructions here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1.5 min-h-[200px]"
              disabled={isProcessing}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div>
            <Label>Upload a document</Label>
            {file ? (
              <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <FileText className="h-5 w-5 text-[#1F5C3E]" />
                <span className="text-sm flex-1">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 hover:border-[#4CAF81] hover:bg-[#E8F5EE]/30 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Choose a PDF, .docx, or .txt file</span>
                <input type="file" accept=".pdf,.txt,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isProcessing || (!text && !file)}
            className="w-full bg-[#1F5C3E] hover:bg-[#174a31]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Opportunity...
              </>
            ) : (
              'Analyze Opportunity'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
