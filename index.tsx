
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Itzler Performance Planner: Initializing...");

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Critical Error: Root element '#root' not found.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Itzler Performance Planner: Mounted.");
  } catch (error) {
    console.error("Critical Error during React mount:", error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 40px; font-family: 'Inter', sans-serif; text-align: center; background: #000; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="color: #ef4444; font-weight: 900; font-style: italic; font-size: 3rem; margin-bottom: 20px;">BROWN BAG ERROR</h1>
        <p style="color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">The app hit a wall. Check the console for details.</p>
        <div style="margin-top: 30px; background: #111; padding: 20px; border-radius: 12px; border: 1px solid #222; max-width: 600px; text-align: left;">
          <code style="color: #ef4444; font-size: 12px;">${error instanceof Error ? error.message : String(error)}</code>
        </div>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
