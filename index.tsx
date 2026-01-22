import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component

// Ensure the root element exists in the HTML
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Use StrictMode for development best practices
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
