import { createContext, useContext, useState } from 'react'

const AdminAuthContext = createContext(null)
const TOKEN_KEY = 'admin-token'

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  function login(newToken) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
  }

  return (
    <AdminAuthContext.Provider value={{ token, isAdmin: Boolean(token), login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
