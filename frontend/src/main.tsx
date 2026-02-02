import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logger } from './utils/logger.ts'

logger.banner()
logger.info("[MSG]", "Hello, Welcome to my website project")


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
