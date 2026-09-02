import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const AdminAuthContext = createContext(null)
const TOKEN_KEY = 'admin-token'
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000
const CHECK_INTERVAL_MS = 15 * 1000
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [expiredReason, setExpiredReason] = useState(null)
  const lastActivityRef = useRef(Date.now())

  function login(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setExpiredReason(null)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
  }

  const expireSession = useCallback((reason) => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setExpiredReason(reason)
  }, [])

  useEffect(() => {
    if (!token) return undefined
    lastActivityRef.current = Date.now()
    const markActivity = () => {
      lastActivityRef.current = Date.now()
    }
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, markActivity))
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_LIMIT_MS) {
        expireSession('inactivity')
      }
    }, CHECK_INTERVAL_MS)
    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, markActivity))
      clearInterval(interval)
    }
  }, [token, expireSession])

  return (
    <AdminAuthContext.Provider
      value={{ token, isAdmin: Boolean(token), login, logout, expiredReason, expireSession }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
