import React from 'react';

class SafetyBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Layout Safety Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg m-4">
          <h3 className="text-lg font-semibold text-red-400">Layout Error</h3>
          <p className="text-sm text-red-200">The interface encountered an error. Attempting to recover...</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-600 rounded hover:bg-red-500 text-white text-xs"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafetyBoundary;