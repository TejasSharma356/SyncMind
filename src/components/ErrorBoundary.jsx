import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false, 
            error: null,
            errorInfo: null
        });
        // Optionally reload the page
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white p-6">
                    <div className="max-w-md w-full">
                        <div className="bg-red-900/30 border border-red-600 rounded-lg p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <AlertCircle size={48} className="text-red-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Application Error</h1>
                            <p className="text-gray-300 mb-6">
                                Something went wrong. Check the browser console for details.
                            </p>
                            
                            {/* Error Details (Dev Mode) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="mb-6 text-left">
                                    <details className="text-xs bg-gray-800 rounded p-4 max-h-48 overflow-auto">
                                        <summary className="font-mono text-red-400 cursor-pointer mb-2">
                                            Error Details
                                        </summary>
                                        <pre className="whitespace-pre-wrap break-words text-gray-400">
                                            {this.state.error.toString()}
                                        </pre>
                                        {this.state.errorInfo && (
                                            <pre className="whitespace-pre-wrap break-words text-gray-400 mt-2">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        )}
                                    </details>
                                </div>
                            )}

                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                            >
                                <RefreshCw size={20} />
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
