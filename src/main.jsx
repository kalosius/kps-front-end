import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Global error handlers to surface uncaught exceptions during development
if (import.meta.env.DEV) {
  window.addEventListener('error', (e) => {
    // eslint-disable-next-line no-console
    console.error('Global error caught', e.error || e.message || e);
  });
  window.addEventListener('unhandledrejection', (e) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled rejection', e.reason || e);
  });
}
