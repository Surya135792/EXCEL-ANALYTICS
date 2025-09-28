import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, LineChart, PieChart, ScatterChart, Download, AlertCircle, RotateCcw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LazyChart } from './LazyChart';

interface ChartGeneratorProps {
  data: any[][];
  headers: string[];
}

type ChartType = 'bar' | 'line' | 'scatter' | 'pie' | 'bar3d' | 'scatter3d';

export const ChartGenerator: React.FC<ChartGeneratorProps> = React.memo(({ data, headers }) => {
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Auto-select first two columns if available
  React.useEffect(() => {
    if (headers.length >= 2 && !xAxis && !yAxis) {
      setXAxis(headers[0]);
      setYAxis(headers[1]);
    }
  }, [headers, xAxis, yAxis]);

  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || !data.length) return null;

    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) return null;

    const xValues = data.map(row => row[xIndex]);
    const yValues = data.map(row => row[yIndex]);

    // Validate data types for better chart generation
    const numericYValues = yValues.filter(val => !isNaN(Number(val)) && val !== null && val !== '');
    if (numericYValues.length === 0) {
      setError('Selected Y-axis column contains no numeric data');
      return null;
    }

    const baseTrace = {
      x: xValues,
      y: yValues,
      name: `${yAxis} vs ${xAxis}`,
    };

    switch (chartType) {
      case 'bar':
        return [{
          ...baseTrace,
          type: 'bar' as const,
          marker: {
            color: 'rgba(59, 130, 246, 0.8)',
            line: { color: 'rgba(59, 130, 246, 1)', width: 1 }
          }
        }];
      
      case 'line':
        return [{
          ...baseTrace,
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          line: { color: 'rgba(34, 197, 94, 0.8)', width: 3 },
          marker: { color: 'rgba(34, 197, 94, 1)', size: 6 }
        }];
      
      case 'scatter':
        return [{
          ...baseTrace,
          type: 'scatter' as const,
          mode: 'markers' as const,
          marker: { 
            color: 'rgba(168, 85, 247, 0.8)', 
            size: 8,
            line: { color: 'rgba(168, 85, 247, 1)', width: 1 }
          }
        }];
      
      case 'pie':
        return [{
          labels: xValues,
          values: yValues,
          type: 'pie' as const,
          hole: 0.3,
          marker: {
            colors: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ]
          }
        }];
      
      case 'bar3d':
        return [{
          ...baseTrace,
          type: 'bar' as const,
          marker: {
            color: yValues,
            colorscale: 'Viridis',
            showscale: true
          }
        }];
      
      case 'scatter3d':
        return [{
          ...baseTrace,
          type: 'scatter3d' as const,
          mode: 'markers' as const,
          marker: {
            size: 5,
            color: yValues,
            colorscale: 'Viridis',
            showscale: true
          }
        }];
      
      default:
        return [baseTrace];
    }
  }, [data, headers, xAxis, yAxis, chartType]);

  const layout = {
    title: {
      text: `${yAxis} vs ${xAxis}`,
      font: { size: 18, color: '#374151' }
    },
    xaxis: { title: xAxis },
    yaxis: { title: yAxis },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, l: 50, r: 50, b: 50 },
    font: { color: '#374151' }
  };

  const downloadChart = useCallback(() => {
    try {
    const plotElement = document.querySelector('.plotly') as any;
    if (plotElement && plotElement.downloadImage) {
      plotElement.downloadImage({
        format: 'png',
        width: 1200,
        height: 800,
        filename: `chart-${xAxis}-vs-${yAxis}`
        });
        toast({
          title: "Chart downloaded",
          description: "Your chart has been saved as PNG",
        });
      } else {
        throw new Error('Chart not ready for download');
      }
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Unable to download chart. Please try again.",
        variant: "destructive",
      });
    }
  }, [xAxis, yAxis, toast]);

  const resetChart = useCallback(() => {
    setXAxis('');
    setYAxis('');
    setChartType('bar');
    setError(null);
    toast({
      title: "Chart reset",
      description: "Chart settings have been cleared",
    });
  }, [toast]);

  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'bar3d', label: '3D Bar Chart', icon: BarChart3 },
    { value: 'scatter3d', label: '3D Scatter Plot', icon: ScatterChart },
  ];

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Generate Chart</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetChart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}
          
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="x-axis">X-Axis</Label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="y-axis">Y-Axis</Label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {chartData && (
          <div className="bg-gradient-chart rounded-lg p-4 shadow-chart">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Generated Chart</h4>
              <Button variant="chart" size="sm" onClick={downloadChart}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-card">
              <LazyChart
                data={chartData}
                layout={layout}
                style={{ width: '100%', height: '500px' }}
                config={{
                  displayModeBar: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ['pan2d', 'lasso2d']
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});