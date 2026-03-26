import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Context/userContext.jsx'
import { PostProvider } from './Context/postsContext.jsx'
import { ProfileProvider } from './Context/profileContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <PostProvider>
        <ProfileProvider>
        <App />
        </ProfileProvider>
      </PostProvider>
    </UserProvider>

  </StrictMode>
)
