import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { JournalistProvider } from './hooks/useJournalistStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JournalistProvider>
      <App />
    </JournalistProvider>
  </StrictMode>,
)
