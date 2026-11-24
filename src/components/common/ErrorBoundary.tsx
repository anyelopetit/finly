import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Finly ErrorBoundary] Caught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-error/20 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-error-container/40 text-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-label-lg font-bold text-on-surface">
            {this.props.fallbackTitle || 'Hubo un problema al cargar esta sección'}
          </h3>
          <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
            No te preocupes, tus datos están a salvo. Puedes intentar recargar la sección.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reintentar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
