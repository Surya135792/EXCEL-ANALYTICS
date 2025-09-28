import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Database, Eye, EyeOff, Download, Filter } from 'lucide-react';

interface DataPreviewProps {
  data: any[][];
  headers: string[];
  fileName?: string;
}

export const DataPreview: React.FC<DataPreviewProps> = React.memo(({ data, headers, fileName }) => {
  const [showAllRows, setShowAllRows] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const totalRows = data.length;
  const maxPreviewRows = 10;
  
  const filteredAndSortedData = useMemo(() => {
    let filteredData = data;
    
    // Apply search filter
    if (searchTerm) {
      filteredData = data.filter(row => 
        row.some(cell => 
          String(cell).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    if (sortColumn) {
      const columnIndex = headers.indexOf(sortColumn);
      filteredData = [...filteredData].sort((a, b) => {
        const aVal = a[columnIndex];
        const bVal = b[columnIndex];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return filteredData;
  }, [data, headers, searchTerm, sortColumn, sortDirection]);

  const previewRows = showAllRows ? filteredAndSortedData : filteredAndSortedData.slice(0, maxPreviewRows);
  const hasMoreRows = filteredAndSortedData.length > maxPreviewRows;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Data Preview</h3>
          {fileName && (
            <Badge variant="outline" className="ml-2">
              {fileName}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>{totalRows} rows × {headers.length} columns</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search data"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllRows(!showAllRows)}
          disabled={!hasMoreRows}
          className="w-full sm:w-auto"
        >
          {showAllRows ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Show Less</span>
              <span className="sm:hidden">Less</span>
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Show All</span>
              <span className="sm:hidden">All</span>
            </>
          )}
        </Button>
      </div>

      <div className="bg-gradient-chart rounded-lg p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead 
                    key={index} 
                    className="font-semibold bg-primary/5 cursor-pointer hover:bg-primary/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => handleSort(header)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(header);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Sort by ${header}`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {sortColumn === header && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-primary/5">
                  {headers.map((_, colIndex) => (
                    <TableCell key={colIndex} className="max-w-[200px] truncate">
                      {row[colIndex] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {hasMoreRows && !showAllRows && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {maxPreviewRows} of {filteredAndSortedData.length} rows
            {searchTerm && ` (filtered from ${totalRows} total)`}
          </div>
        )}
        {showAllRows && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing all {filteredAndSortedData.length} rows
            {searchTerm && ` (filtered from ${totalRows} total)`}
          </div>
        )}
      </div>
    </Card>
  );
});