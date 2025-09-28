import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from './FileUpload';
import { DataPreview } from './DataPreview';
import { ChartGenerator } from './ChartGenerator';
import { BarChart3, Upload, Clock, TrendingUp, Users, FileSpreadsheet, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExcelData {
  data: any[][];
  headers: string[];
  sheetNames: string[];
}

interface UploadHistory {
  id: string;
  fileName: string;
  uploadDate: Date;
  rowCount: number;
  columnCount: number;
}

export const Dashboard: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<ExcelData | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDataUpload = useCallback((data: ExcelData, fileName?: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Validate data
      if (!data || !data.data || data.data.length === 0) {
        throw new Error('No data found in the uploaded file');
      }
      
      if (!data.headers || data.headers.length === 0) {
        throw new Error('No headers found in the uploaded file');
      }

      setUploadedData(data);
      
      // Add to history with proper filename
      const newUpload: UploadHistory = {
        id: Date.now().toString(),
        fileName: fileName || 'excel-file.xlsx',
        uploadDate: new Date(),
        rowCount: data.data.length,
        columnCount: data.headers.length,
      };
      
      setUploadHistory(prev => [newUpload, ...prev.slice(0, 4)]); // Keep last 5
      setCurrentFileName(newUpload.fileName);
      
      toast({
        title: "File uploaded successfully",
        description: `Processed ${data.data.length} rows with ${data.headers.length} columns`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const handleReset = useCallback(() => {
    setUploadedData(null);
    setCurrentFileName('');
    setError(null);
    toast({
      title: "Data cleared",
      description: "Ready for a new file upload",
    });
  }, [toast]);

  const stats = useMemo(() => [
    {
      title: 'Total Uploads',
      value: uploadHistory.length.toString(),
      icon: Upload,
      color: 'text-blue-600',
      trend: uploadHistory.length > 0 ? '+1' : '0'
    },
    {
      title: 'Charts Generated',
      value: uploadedData ? '1' : '0',
      icon: BarChart3,
      color: 'text-green-600',
      trend: uploadedData ? '+1' : '0'
    },
    {
      title: 'Data Points',
      value: uploadedData ? (uploadedData.data.length * uploadedData.headers.length).toLocaleString() : '0',
      icon: TrendingUp,
      color: 'text-purple-600',
      trend: uploadedData ? `+${(uploadedData.data.length * uploadedData.headers.length).toLocaleString()}` : '0'
    },
    {
      title: 'File Size',
      value: uploadedData ? `${Math.round((uploadedData.data.length * uploadedData.headers.length * 0.1) / 1024)}KB` : '0KB',
      icon: Users,
      color: 'text-orange-600',
      trend: uploadedData ? 'Active' : 'Inactive'
    }
  ], [uploadHistory.length, uploadedData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Data Analysis Platform</h1>
              <p className="text-blue-100">Upload Excel files and generate interactive charts</p>
            </div>
            <Button variant="secondary" size="lg">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 shadow-card hover:shadow-chart transition-smooth group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-smooth`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {!uploadedData ? (
              <FileUpload onDataUpload={handleDataUpload} isProcessing={isProcessing} />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Data Analysis</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>
                <DataPreview 
                  data={uploadedData.data} 
                  headers={uploadedData.headers}
                  fileName={currentFileName}
                />
                <ChartGenerator 
                  data={uploadedData.data} 
                  headers={uploadedData.headers}
                />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Upload History */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Recent Uploads</h3>
              </div>
              
              {uploadHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">No uploads yet</p>
              ) : (
                <div className="space-y-3">
                  {uploadHistory.map((upload) => (
                    <div key={upload.id} className="p-3 bg-gradient-chart rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{upload.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {upload.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {upload.rowCount}×{upload.columnCount}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New File
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </Card>

            {/* Features Coming Soon */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Coming Soon</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🤖 AI-powered insights</p>
                <p>📊 Advanced chart types</p>
                <p>👥 Team collaboration</p>
                <p>📱 Mobile app</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};