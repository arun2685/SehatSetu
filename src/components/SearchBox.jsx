import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Search, Stethoscope } from 'lucide-react'
import { doctors } from '../data/doctors'
import { SPECIALTIES } from '../data/content'
import { useApp } from '../lib/store'
import { useDismiss } from './ui'

/** Hero search with live suggestions for specialties, doctors and a symptom-check fallback. */
export function SearchBox({ className = '' }) {
  const navigate = useNavigate()
  const { openDialog } = useApp()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const ref = useRef(null)
  useDismiss(ref, open, setOpen)

  const items = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const specs = SPECIALTIES.filter((s) => s.name.toLowerCase().includes(t) || s.blurb.toLowerCase().includes(t))
      .slice(0, 4)
      .map((s) => ({ kind: 'spec', label: s.name, sub: s.blurb, icon: s.icon, go: () => navigate(`/doctors?specialty=${encodeURIComponent(s.name)}`) }))
    const docs = doctors
      .filter((d) => d.name.toLowerCase().includes(t) || d.hospital.toLowerCase().includes(t))
      .slice(0, 4)
      .map((d) => ({ kind: 'doc', label: d.name, sub: `${d.specialty} · ${d.area}`, icon: Stethoscope, go: () => navigate(`/doctors/${d.id}`) }))
    return [
      ...specs,
      ...docs,
      { kind: 'sym', label: `Check symptoms: “${q.trim()}”`, sub: 'Get a specialist suggestion', icon: Bot, go: () => openDialog('symptoms', { initial: q.trim() }) },
    ]
  }, [q, navigate, openDialog])

  const submit = (e) => {
    e.preventDefault()
    if (active >= 0 && items[active]) return pick(items[active])
    navigate(q.trim() ? `/doctors?q=${encodeURIComponent(q.trim())}` : '/doctors')
  }
  const pick = (it) => {
    setOpen(false)
    it.go()
  }

  const onKeyDown = (e) => {
    if (!open || !items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1))
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={submit} role="search" className="flex items-center gap-2 rounded-full border border-line/70 bg-surface p-2 pl-3 shadow-lift focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <Search className="ml-2 size-5 shrink-0 text-muted" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Doctor, specialty or symptom"
          aria-label="Search doctors, specialties or symptoms"
          aria-expanded={open && items.length > 0}
          aria-controls="hero-search-list"
          aria-activedescendant={active >= 0 ? `hero-opt-${active}` : undefined}
          role="combobox"
          aria-autocomplete="list"
          className="h-12 min-w-0 grow bg-transparent text-base text-ink outline-none placeholder:text-muted/80"
        />
        <button type="submit" className="btn btn-primary shrink-0 px-6">
          Search
        </button>
      </form>

      {open && items.length > 0 && (
        <ul
          id="hero-search-list"
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 animate-rise overflow-hidden rounded-3xl border border-line/70 bg-surface p-2 shadow-lift"
        >
          {items.map((it, i) => (
            <li key={it.kind + it.label} id={`hero-opt-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onClick={() => pick(it)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${i === active ? 'bg-surface-2' : ''}`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full ${
                    it.kind === 'sym' ? 'bg-accent-soft text-accent-ink' : 'bg-primary-soft text-primary-ink'
                  }`}
                >
                  <it.icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{it.label}</span>
                  <span className="block truncate text-xs text-muted">{it.sub}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
