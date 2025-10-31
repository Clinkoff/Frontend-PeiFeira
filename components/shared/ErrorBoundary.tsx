'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center space-y-4 p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600">Oops! Algo deu errado</h2>
            <p className="text-gray-600">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>
            {this.state.error && (
              <details className="text-sm text-left bg-gray-100 p-4 rounded">
                <summary className="cursor-pointer font-semibold">Detalhes do erro</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
              </details>
            )}
            <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
