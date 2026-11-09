import { useEffect } from 'react'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { AppProvider } from './lib/store'
import { Footer, Header, MobileNav, Toasts } from './components/Layout'
import { DialogHost } from './components/Dialogs'
import { EmptyState } from './components/ui'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import DoctorProfile from './pages/DoctorProfile'
import Consult from './pages/Consult'
import Bookings from './pages/Bookings'
import Plus from './pages/Plus'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="container-page max-w-xl pt-16">
      <EmptyState
        icon={Compass}
        title="Page not found"
        body="The page you’re looking for doesn’t exist."
        action={
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
        }
      />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      {/* Hash routing works on any static host (GitHub Pages) without server config. */}
      <HashRouter>
        <ScrollToTop />
        <button
          type="button"
          onClick={() => document.getElementById('main')?.focus()}
          className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </button>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main id="main" tabIndex={-1} className="grow pb-24 outline-none lg:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/plus" element={<Plus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <MobileNav />
        <DialogHost />
        <Toasts />
      </HashRouter>
    </AppProvider>
  )
}
