
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical Runtime Error:", err);
    rootElement.innerHTML = `
      <div style="background:#000; color:#fff; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; padding:20px; text-align:center;">
        <h1 style="font-size:4rem; font-weight:900; color:#ef4444; margin:0;">SYSTEM FAILURE</h1>
        <p style="margin:20px 0; color:#888;">The high-performance environment failed to initialize.</p>
        <pre style="background:#111; padding:20px; border-radius:10px; color:#666; font-size:12px; max-width:100%; overflow:auto; text-align:left;">${err instanceof Error ? err.stack : String(err)}</pre>
        <button onclick="window.location.reload()" style="margin-top:30px; background:#fff; color:#000; border:none; padding:15px 30px; font-weight:bold; cursor:pointer; border-radius:5px;">FORCE RESTART</button>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
