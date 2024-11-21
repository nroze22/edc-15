import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';
import App from './App';
import './index.css';

// Create router with future flags enabled
const router = createBrowserRouter([
  {
    path: '*',
    element: <App />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);