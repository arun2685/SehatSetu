import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { addDays, atTime, startOfDay } from './time'

const KEY = 'ss-state-v1'
const Ctx = createContext(null)

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && typeof s === 'object') return { user: null, bookings: [], city: 'Agartala', readNotifications: false, ...s }
  } catch {
    /* ignore */
  }
  return { user: null, bookings: [], city: 'Agartala', readNotifications: false, seeded: false }
}

const newId = () => `SS${Math.floor(100000 + Math.random() * 900000)}`

/** Demo history so the Bookings page isn't empty on first sign-in. */
function demoBookings(user) {
  const today = startOfDay()
  const soon = new Date()
  soon.setMinutes(soon.getMinutes() < 30 ? 30 : 60, 0, 0)
  soon.setHours(soon.getHours() + 2)
  const first = soon.getHours() >= 21 || soon.getHours() < 9 ? atTime(addDays(today, 1), '10:00') : soon
  return [
    { id: newId(), doctorId: 'debabrata-roy', mode: 'video', at: first.toISOString(), patient: user.name, relation: 'Self', fee: 399, status: 'upcoming', reason: 'Fever and body ache' },
    { id: newId(), doctorId: 'arindam-mukherjee', mode: 'video', at: atTime(addDays(today, 2), '18:00').toISOString(), patient: 'Ramen Das', relation: 'Father', fee: 700, status: 'upcoming', reason: 'BP follow-up' },
    { id: newId(), doctorId: 'priyanka-bhattacharya', mode: 'clinic', at: atTime(addDays(today, -4), '11:00').toISOString(), patient: user.name, relation: 'Self', fee: 600, status: 'completed', reason: 'Acne on cheeks' },
    { id: newId(), doctorId: 'sunita-goswami', mode: 'video', at: atTime(addDays(today, -12), '17:30').toISOString(), patient: 'Riya Das', relation: 'Child', fee: 350, status: 'completed', reason: 'Cough and cold' },
  ]
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)
  const [dialog, setDialog] = useState(null)
  const [toasts, setToasts] = useState([])
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('ss-theme2') || 'light' } catch { return 'light' }
  })
  const toastId = useRef(0)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f1819' : '#1F7A7A')
    }
    apply()
    try { localStorage.setItem('ss-theme2', theme) } catch { /* ignore */ }
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const toast = useCallback((message, tone = 'success') => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }, [])

  // seed: add demo booking history the first time someone signs in (not for guest checkout).
  const signIn = useCallback((user, { seed = true } = {}) => {
    setState((s) => ({
      ...s,
      user,
      bookings: s.seeded || !seed ? s.bookings : [...s.bookings, ...demoBookings(user)],
      seeded: true,
    }))
  }, [])

  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), [])

  const addBooking = useCallback((b) => {
    const booking = { id: newId(), status: 'upcoming', ...b }
    setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }))
    return booking
  }, [])

  const updateBooking = useCallback((id, patch) => {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      theme,
      setTheme: setThemeState,
      setCity: (city) => setState((s) => ({ ...s, city })),
      markNotificationsRead: () => setState((s) => ({ ...s, readNotifications: true })),
      signIn,
      signOut,
      addBooking,
      updateBooking,
      toast,
      toasts,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
      dialog,
      openDialog: (type, props = {}) => setDialog({ type, props }),
      closeDialog: () => setDialog(null),
      resetDemo: () => {
        setState({ user: null, bookings: [], city: 'Agartala', readNotifications: false, seeded: false })
      },
    }),
    [state, theme, signIn, signOut, addBooking, updateBooking, toast, toasts, dialog],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
