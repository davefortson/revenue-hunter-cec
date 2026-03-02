'use client';

import { useState } from 'react';
import { DocumentDropzone } from '@/components/upload/DocumentDropzone';
import { ExtractionProgress } from '@/components/upload/ExtractionProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function UploadPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<'reading' | 'extracting' | 'saving' | 'complete'>('reading');
  const [currentFilename, setCurrentFilename] = useState('');
  const [lastResult, setLastResult] = useState<{ count: number; filename: string } | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ filename: string; claimsCount: number; date: string }>>([]);

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    setCurrentFilename(file.name);
    setStage('reading');

    try {
      // Read file as text
      let text = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        // For PDFs and docx, send as base64 and let the server handle it
        // For v0, we'll extract text client-side for txt, and use a simpler approach for others
        text = await file.text().catch(() => '');
        if (!text || text.length < 50) {
          // Fallback: read as array buffer and send raw text representation
          const buffer = await file.arrayBuffer();
          const decoder = new TextDecoder('utf-8', { fatal: false });
          text = decoder.decode(buffer);
          // Clean up non-printable characters
          text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        }
      }

      if (!text || text.length < 20) {
        toast.error('Could not extract text from this file. Try a .txt file or paste the text content directly.');
        setIsProcessing(false);
        return;
      }

      setStage('extracting');

      // Call API to extract claims
      const response = await fetch('/api/ingest-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: text.slice(0, 50000), filename: file.name }),
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      setStage('saving');
      const data = await response.json();

      setStage('complete');
      setLastResult({ count: data.count, filename: file.name });
      setUploadedDocs(prev => [
        { filename: file.name, claimsCount: data.count, date: new Date().toLocaleDateString() },
        ...prev,
      ]);

      toast.success(`Found ${data.count} claims in ${file.name}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process document. Please try again.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your impact documents and Regen AI will extract structured claims automatically.
        </p>
      </div>

      <DocumentDropzone onFileSelected={handleFileSelected} isProcessing={isProcessing} />

      {isProcessing && (
        <ExtractionProgress filename={currentFilename} stage={stage} />
      )}

      {lastResult && !isProcessing && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Found {lastResult.count} claims in {lastResult.filename}
                </p>
                <p className="text-xs text-green-600">Claims have been added to your inventory.</p>
              </div>
            </div>
            <Link href="/claims">
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                View Claims <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {uploadedDocs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently Uploaded</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {uploadedDocs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.filename}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-[#E8F5EE] text-[#1F5C3E]">
                  {doc.claimsCount} claims
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
