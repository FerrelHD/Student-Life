import {Component, StrictMode, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

registerSW({ immediate: true });

class ErrorBoundary extends Component<{children: ReactNode}, {crashed: boolean}> {
  state = {crashed: false};
  static getDerivedStateFromError() {
    return {crashed: true};
  }
  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary]', error);
  }
  render() {
    if (this.state.crashed) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-6">
          <div>
            <p className="font-bold mb-2">Something went wrong.</p>
            <button className="underline" onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
