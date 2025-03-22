
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PhotoProvider } from './context/PhotoContext'

createRoot(document.getElementById("root")!).render(
  <PhotoProvider>
    <App />
  </PhotoProvider>
);
