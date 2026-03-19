import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'
import { auth } from './firebase'
import About from './components/About'
import AuthPage from './components/AuthPage'
import Chefs from './components/Chefs'
import Footer from './components/Footer'
import Menu from './components/Menu'
import Navbar from './components/Navbar'

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/chefs" element={<Chefs />} />
        <Route path="/about" element={<About user={user} />} />
        <Route
          path="/auth"
          element={<AuthPage user={user} authLoading={authLoading} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
