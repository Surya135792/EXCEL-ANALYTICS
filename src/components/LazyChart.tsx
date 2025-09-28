import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load the Plot component to improve initial bundle size
const Plot = lazy(() => import('react-plotly.js'));

interface LazyChartProps {
  data: any[];
  layout: any;
  style?: React.CSSProperties;
  config?: any;
}

export const LazyChart: React.FC<LazyChartProps> = ({ data, layout, style, config }) => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-[500px]">
          <LoadingSpinner size="lg" text="Loading chart..." />
        </div>
      }
    >
      <Plot
        data={data}
        layout={layout}
        style={style}
        config={config}
      />
    </Suspense>
  );
};


