'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';

interface DocumentDropzoneProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

export function DocumentDropzone({ onFileSelected, isProcessing }: DocumentDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const isValidFile = (file: File) => {
    const valid = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return valid.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.pdf') || file.name.endsWith('.docx');
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  return (
    <Card className={`border-2 border-dashed transition-colors ${dragOver ? 'border-[#4CAF81] bg-[#E8F5EE]' : 'border-border'}`}>
      <CardContent className="p-8">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="rounded-full bg-[#E8F5EE] p-4">
            <Upload className="h-8 w-8 text-[#1F5C3E]" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">
              Drop your documents here, or{' '}
              <label className="cursor-pointer text-[#4CAF81] hover:underline">
                browse
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload annual reports, grant applications, monitoring reports, program descriptions — anything that describes your impact work.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports PDF, .docx, and .txt files
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3">
              <FileText className="h-5 w-5 text-[#1F5C3E]" />
              <div className="text-left">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              {!isProcessing && (
                <button onClick={() => setSelectedFile(null)} className="ml-2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {selectedFile && !isProcessing && (
            <Button onClick={handleUpload} className="bg-[#1F5C3E] hover:bg-[#174a31]">
              <Upload className="mr-2 h-4 w-4" />
              Extract Claims
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
