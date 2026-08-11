import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import Login from './pages/Login'
import Customers from './pages/Customers'
import Signatories from './pages/Signatories'
import Developer from './pages/Developer'
import HowToGuide from './components/HowToGuide'
import './index.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        fontSize: '14px',
      }}>
        กำลังโหลด...
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public — Login */}
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/" replace />}
        />

        {/* Protected — Customers (default) */}
        <Route
          path="/"
          element={
            session ? (
              <Layout session={session}>
                <Customers session={session} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected — Signatories */}
        <Route
          path="/signatories"
          element={
            session ? (
              <Layout session={session}>
                <Signatories />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected — Guide */}
        <Route
          path="/guide"
          element={
            session ? (
              <Layout session={session}>
                <HowToGuide />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected — Developer */}
        <Route
          path="/developer"
          element={
            session ? (
              <Layout session={session}>
                <Developer />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
