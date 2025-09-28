import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExcelData {
  data: any[][];
  headers: string[];
  sheetNames: string[];
}

interface FileUploadProps {
  onDataUpload: (data: ExcelData, fileName?: string) => void;
  isProcessing?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload, isProcessing = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processExcelFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid Excel file (.xlsx or .xls)');
      }

      setUploadProgress(25);
      const arrayBuffer = await file.arrayBuffer();
      setUploadProgress(50);
      
      const workbook = XLSX.read(arrayBuffer);
      setUploadProgress(75);
      
      // Get the first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON with header option
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        throw new Error('The Excel file appears to be empty');
      }

      const headers = jsonData[0] as string[];
      const data = jsonData.slice(1) as any[][];

      // Validate headers
      if (!headers || headers.length === 0) {
        throw new Error('No headers found in the Excel file');
      }

      // Validate data
      if (!data || data.length === 0) {
        throw new Error('No data rows found in the Excel file');
      }

      setUploadProgress(90);

      const excelData: ExcelData = {
        data,
        headers,
        sheetNames: workbook.SheetNames
      };

      setUploadProgress(100);
      onDataUpload(excelData, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process the Excel file');
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [onDataUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processExcelFile(file);
    }
  }, [processExcelFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isLoading || isProcessing,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size exceeds 10MB limit');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Please upload a valid Excel file (.xlsx or .xls)');
      } else {
        setError('File upload failed. Please try again.');
      }
    }
  });

  return (
    <Card className="p-6 shadow-card">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth
          ${isDragActive 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-primary/30 hover:border-primary/50 bg-gradient-chart'
          }
          ${(isLoading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">{uploadProgress}%</span>
              </div>
            </div>
          ) : (
            <FileSpreadsheet className={`h-12 w-12 text-primary/60 ${isDragActive ? 'scale-110' : ''} transition-smooth`} />
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isLoading ? 'Processing...' : isProcessing ? 'Processing...' : 'Upload Excel File'}
            </h3>
            <p className="text-muted-foreground">
              {isDragActive
                ? 'Drop the Excel file here...'
                : isLoading
                ? 'Reading and processing your file...'
                : 'Drag & drop an Excel file here, or click to select'
              }
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports .xlsx and .xls files (max 10MB)
            </p>
            {isLoading && uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {!isLoading && !isProcessing && (
            <Button variant="upload" disabled={isLoading || isProcessing}>
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert className="mt-4 border-destructive/30 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
};