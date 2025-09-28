import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 shadow-card">
          <Alert className="border-destructive/30 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Something went wrong</h3>
                  <p className="text-sm mt-1">
                    An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                  </p>
                </div>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={this.handleReset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </Card>
      );
    }

    return this.props.children;
  }
}


