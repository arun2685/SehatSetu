import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell, Building2, CalendarCheck, Check, ChevronDown, CircleCheck, Crown, House, Info, LogOut, MapPin, Monitor, Moon,
  Phone, Search, Siren, Stethoscope, Sun, UserRound, Video, X,
} from 'lucide-react'
import { Avatar, Logo, useDismiss } from './ui'
import { useApp } from '../lib/store'
import { CITIES, NOTIFICATIONS } from '../data/content'

const NAV = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/doctors', label: 'Find Doctors', short: 'Doctors', icon: Stethoscope },
  { to: '/consult', label: 'Video Consult', short: 'Consult', icon: Video },
  { to: '/bookings', label: 'My Bookings', short: 'Bookings', icon: CalendarCheck },
  { to: '/plus', label: 'Care Plus', icon: Crown, wide: true },
]

export function Header() {
  const { user, openDialog } = useApp()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-xl">
      <div className="container-page flex h-[4.25rem] items-center gap-2">
        <Link to="/" className="mr-2 shrink-0 rounded-lg" aria-label="SehatSetu home">
          <Logo className="h-[22px] sm:h-[30px]" />
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex xl:ml-4" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors xl:px-4 xl:text-[0.9375rem] ${n.wide ? 'hidden xl:block' : ''} ${
                  isActive ? 'bg-primary-soft text-primary-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <CityPicker />
          <button type="button" className="icon-btn lg:hidden" aria-label="Search doctors" onClick={() => navigate('/doctors?focus=1')}>
            <Search className="size-5" />
          </button>
          <ThemeToggle className="hidden sm:inline-flex" />
          <Notifications />
          {user ? (
            <UserMenu />
          ) : (
            <button type="button" className="btn btn-primary btn-sm ml-1 hidden sm:inline-flex" onClick={() => openDialog('signin')}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function CityPicker() {
  const { city, setCity, toast } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(ref, open, setOpen)
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-10 items-center gap-1 rounded-full px-2.5 text-[0.9375rem] font-semibold text-ink hover:bg-surface-2 sm:gap-1.5 sm:px-3"
      >
        <MapPin className="size-4 text-primary-ink" aria-hidden="true" />
        <span className="max-w-[5.5rem] truncate sm:max-w-[7rem]">{city}</span>
        <ChevronDown className="hidden size-4 text-muted sm:block" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 animate-rise rounded-3xl border border-line/70 bg-surface p-2 shadow-lift sm:left-0 sm:right-auto">
          <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted">Choose your city</p>
          <ul role="listbox" aria-label="City">
            {CITIES.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c === city}
                  onClick={() => {
                    setCity(c)
                    setOpen(false)
                    if (c !== city) toast(`Location set to ${c}`)
                  }}
                  className="flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left hover:bg-surface-2"
                >
                  {c}
                  {c === city && <Check className="size-4 text-accent-ink" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useApp()
  const next = { light: 'dark', dark: 'system', system: 'light' }
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
  return (
    <button
      type="button"
      className={`icon-btn ${className}`}
      onClick={() => setTheme(next[theme])}
      aria-label={`Theme: ${theme}. Switch to ${next[theme]}`}
      title={`Theme: ${theme}`}
    >
      <Icon className="size-5" />
    </button>
  )
}

function Notifications() {
  const { readNotifications, markNotificationsRead } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(ref, open, setOpen)
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="icon-btn relative"
        aria-label={`Notifications${readNotifications ? '' : ', 2 unread'}`}
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o)
          markNotificationsRead()
        }}
      >
        <Bell className="size-5" />
        {!readNotifications && <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-bg" />}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-[4.5rem] z-50 animate-rise rounded-3xl border border-line/70 bg-surface p-2 shadow-lift sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-80">
          <p className="px-3 pt-2 pb-1 text-sm font-semibold">Notifications</p>
          <ul>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="flex gap-3 rounded-2xl px-3 py-3 hover:bg-surface-2">
                <div className="icon-circle mt-0.5 size-9">
                  <Info className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-muted">{n.body}</p>
                  <p className="mt-0.5 text-xs text-muted">{n.ago} ago</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { user, signOut, toast } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  useDismiss(ref, open, setOpen)
  return (
    <div ref={ref} className="relative ml-1 hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full p-1 pr-2.5 hover:bg-surface-2"
      >
        <Avatar name={user.name} size="sm" className="[&>div]:size-9 [&>div]:text-xs" />
        <ChevronDown className="size-4 text-muted" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 animate-rise rounded-3xl border border-line/70 bg-surface p-2 shadow-lift">
          <div className="px-3 py-2.5">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted">+91 {user.phone}</p>
          </div>
          <div className="my-1 h-px bg-line" />
          {[
            ['My bookings', CalendarCheck, '/bookings'],
            ['Care Plus', Crown, '/plus'],
          ].map(([label, Icon, to]) => (
            <button
              key={to}
              type="button"
              onClick={() => {
                setOpen(false)
                navigate(to)
              }}
              className="flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 hover:bg-surface-2"
            >
              <Icon className="size-4 text-muted" aria-hidden="true" /> {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              signOut()
              toast('Signed out')
            }}
            className="flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

/** Bottom tab bar for phones/tablets. */
export function MobileNav() {
  const { user, openDialog } = useApp()
  const items = NAV.slice(0, 4)
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      aria-label="Main"
    >
      <div className="mx-auto grid h-[4.25rem] max-w-xl grid-cols-5">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                isActive ? 'text-primary-ink' : 'text-muted hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${isActive ? 'bg-primary-soft' : ''}`}>
                  <n.icon className="size-5" aria-hidden="true" />
                </span>
                {n.short ?? n.label}
              </>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => openDialog(user ? 'account' : 'signin')}
          className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-muted hover:text-ink"
        >
          <span className="grid h-7 w-12 place-items-center rounded-full">
            {user ? (
              <span className="grid size-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            ) : (
              <UserRound className="size-5" aria-hidden="true" />
            )}
          </span>
          {user ? 'Account' : 'Sign in'}
        </button>
      </div>
    </nav>
  )
}

export function Footer() {
  const { openDialog, toast } = useApp()
  const soon = () => toast('This page is coming soon', 'info')
  const cols = [
    {
      title: 'For patients',
      links: [
        ['Find a doctor', '/doctors'],
        ['Instant video consult', '/consult'],
        ['Symptom checker', () => openDialog('symptoms')],
        ['My bookings', '/bookings'],
        ['Care Plus membership', '/plus'],
      ],
    },
    {
      title: 'For doctors & clinics',
      links: [['Join as a doctor', soon], ['Register your clinic', soon], ['Digital prescriptions', soon], ['Pharmacy partners', soon]],
    },
    {
      title: 'Company',
      links: [['About us', soon], ['Medical review board', soon], ['Privacy policy', soon], ['Terms of service', soon], ['Help & contact', soon]],
    },
  ]
  return (
    <footer className="mt-24 bg-sand text-ink sm:mt-32">
      <div className="border-b border-ink/5 bg-blush">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <p className="flex items-center gap-2.5">
            <Siren className="size-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
            <span>
              <strong>Medical emergency?</strong> Don’t wait for an online consult — call now.
            </span>
          </p>
          <div className="flex grow gap-2 sm:grow-0 [&>*]:grow sm:[&>*]:grow-0">
            <a href="tel:108" className="btn btn-sm bg-red-600 text-white hover:bg-red-700">
              <Phone className="size-4" aria-hidden="true" /> Ambulance 108
            </a>
            <a href="tel:112" className="btn btn-sm btn-secondary">
              Emergency 112
            </a>
          </div>
        </div>
      </div>

      <div className="container-page flex-fill gap-10 py-16 [--min:10rem]">
        <div className="grow-[1.6]! basis-[min(100%,18rem)]!">
          <Logo className="h-8" />
          <p className="mt-4 max-w-xs text-muted">
            Connecting patients with verified doctors and clinics across North-East India and beyond.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {['ABDM integrated', '256-bit encryption', 'NMC-registered doctors'].map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-muted shadow-soft">
                <CircleCheck className="size-4 text-primary-ink" aria-hidden="true" /> {b}
              </li>
            ))}
          </ul>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-sans font-semibold text-ink">{c.title}</h3>
            <ul className="mt-4 space-y-3">
              {c.links.map(([label, to]) => (
                <li key={label}>
                  {typeof to === 'string' ? (
                    <Link to={to} className="text-muted hover:text-primary-ink">
                      {label}
                    </Link>
                  ) : (
                    <button type="button" onClick={to} className="text-left text-muted hover:text-primary-ink">
                      {label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink/8">
        <div className="container-page py-7 text-sm text-muted">
          <p className="max-w-4xl">
            <strong className="text-ink">Medical disclaimer:</strong> SehatSetu helps you find and book verified doctors. It does not
            replace emergency care. For severe chest pain, head injury, breathing difficulty or stroke symptoms, go to the nearest emergency
            room immediately.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} SehatSetu Healthcare Technologies Pvt. Ltd.</p>
            <p className="flex items-center gap-1.5">
              <Building2 className="size-3.5" aria-hidden="true" /> Made in Agartala, Tripura
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm animate-rise items-center gap-3 rounded-2xl bg-ink px-4 py-3.5 text-[0.9375rem] text-bg shadow-lift"
        >
          {t.tone === 'info' ? (
            <Info className="size-5 shrink-0 text-leaf-300 dark:text-forest-600" aria-hidden="true" />
          ) : (
            <CircleCheck className="size-5 shrink-0 text-leaf-300 dark:text-leaf-600" aria-hidden="true" />
          )}
          <p className="grow">{t.message}</p>
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="-mr-1 rounded-md p-1 opacity-70 hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
