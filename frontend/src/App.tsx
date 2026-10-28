import { env } from './config/env';

export function App() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>AI Hotel Operations Workforce</h1>
      <p>Frontend scaffold initialized on branch <code>frontend</code>.</p>
      <section style={{ marginTop: '1.5rem', background: '#f4f4f5', padding: '1rem', borderRadius: '4px' }}>
        <h2>Environment & API Configuration</h2>
        <p><strong>Target API Base URL:</strong> <code>{env.apiBaseUrl}</code></p>
        <p><strong>Mock Strategy Enabled:</strong> <code>{String(env.enableMockData)}</code></p>
      </section>
    </main>
  );
}

export default App;
