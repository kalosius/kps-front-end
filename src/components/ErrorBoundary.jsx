import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong rendering this page.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff4f4', padding: 12, borderRadius: 6 }}>{String(this.state.error)}</pre>
          <div>Please check the browser console for details.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
