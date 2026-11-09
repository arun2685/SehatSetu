// Slot generation + date formatting helpers (all local time).

const SLOT_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
]

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

export const startOfDay = (d = new Date()) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const atTime = (day, hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  const x = new Date(day)
  x.setHours(h, m, 0, 0)
  return x
}

export const timeLabel = (date) =>
  date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).replace('am', 'AM').replace('pm', 'PM')

const periodOf = (hhmm) => {
  const h = Number(hhmm.slice(0, 2))
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'
}

/** All slots for a doctor on a day; ~70% available, past slots (with 30 min buffer) disabled. */
export function slotsFor(doctor, day, mode = 'clinic') {
  const now = Date.now() + 30 * 60 * 1000
  const key = dayKey(day)
  return SLOT_TIMES.filter((t) => (mode === 'clinic' ? t <= '19:30' : true)).map((t) => {
    const at = atTime(day, t)
    const available = at.getTime() > now && hash(`${doctor.id}|${key}|${t}|${mode}`) % 10 < 7
    return { time: t, at, label: timeLabel(at), period: periodOf(t), available }
  })
}

export function nextAvailable(doctor, mode = doctor.video ? 'video' : 'clinic') {
  const today = startOfDay()
  for (let i = 0; i < 14; i++) {
    const slot = slotsFor(doctor, addDays(today, i), mode).find((s) => s.available)
    if (slot) return slot.at
  }
  return null
}

export function relativeDay(date) {
  const diff = Math.round((startOfDay(date) - startOfDay()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export const whenLabel = (date) => `${relativeDay(date)}, ${timeLabel(date)}`

export const fullDate = (date) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

export const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`
