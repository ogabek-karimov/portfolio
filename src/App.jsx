import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import MobileNav from './components/MobileNav'
import HomePage from './pages/HomePage'
import ExperiencePage from './pages/ExperiencePage'
import CertificatesPage from './pages/CertificatesPage'
import ProjectsPage from './pages/ProjectsPage'
import ResumePage from './pages/ResumePage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import { LanguageProvider } from './i18n/LanguageContext'
import { ThemeProvider } from './theme/ThemeContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'

// A new page opens at its top; links with a #hash are scrolled by the home page itself.
function ScrollResetOnPageChange() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <BrowserRouter basename="/portfolio">
            <ScrollResetOnPageChange />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <BackToTop />
            <MobileNav />
          </BrowserRouter>
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
