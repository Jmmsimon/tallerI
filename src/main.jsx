import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Topic from './views/topic/topic.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Topic />
  </StrictMode>,
)
