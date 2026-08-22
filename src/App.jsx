import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ExperiencePage from './pages/ExperiencePage'
import CertificatesPage from './pages/CertificatesPage'
import ResumePage from './pages/ResumePage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import { LanguageProvider } from './i18n/LanguageContext'
import { ThemeProvider } from './theme/ThemeContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <BrowserRouter basename="/portfolio">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
