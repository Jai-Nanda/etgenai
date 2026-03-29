import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import InsightsPage from './pages/InsightsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

function Shell({ children }) {
  return (
    <div className="relative flex flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[100px] transition-opacity duration-500"
      />
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[110px] transition-opacity duration-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(173,198,255,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(79,219,200,0.06),transparent_40%),radial-gradient(circle_at_50%_120%,rgba(192,193,255,0.05),transparent_55%)]"
      />
      <Navbar />
      <main className="relative z-10 flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  )
}

function AuthShell({ children }) {
  return (
    <div className="relative overflow-x-hidden">
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[100px] transition-opacity duration-500"
      />
      <div
        aria-hidden
        className="ambient-orb pointer-events-none absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[110px] transition-opacity duration-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(173,198,255,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(79,219,200,0.06),transparent_40%),radial-gradient(circle_at_50%_120%,rgba(192,193,255,0.05),transparent_55%)]"
      />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <AuthProvider>
          <div className="bg-background text-on-surface font-body antialiased selection:bg-primary/25 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <AuthShell>
                    <LoginPage />
                  </AuthShell>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthShell>
                    <SignupPage />
                  </AuthShell>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthShell>
                    <ForgotPasswordPage />
                  </AuthShell>
                }
              />
              
              {/* Protected Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Shell>
                      <UploadPage />
                    </Shell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Shell>
                      <DashboardPage />
                    </Shell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <Shell>
                      <InsightsPage />
                    </Shell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <Shell>
                      <AboutPage />
                    </Shell>
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
