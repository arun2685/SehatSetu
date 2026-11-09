import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpDown, Building2, LayoutGrid, Search, SearchX, Video, X } from 'lucide-react'
import { DoctorCard } from '../components/DoctorCard'
import { EmptyState, Segmented } from '../components/ui'
import { DEGREE_FILTERS, degreeTokens, doctors } from '../data/doctors'
import { SPECIALTIES } from '../data/content'
import { useApp } from '../lib/store'
import { nextAvailable, startOfDay } from '../lib/time'

const SORTS = [
  ['recommended', 'Recommended'],
  ['rating', 'Highest rated'],
  ['fee', 'Lowest fee'],
  ['exp', 'Most experienced'],
  ['soonest', 'Earliest available'],
]

export default function Doctors() {
  const { city } = useApp()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const specialty = params.get('specialty') ?? ''
  const mode = params.get('mode') ?? 'all'
  const degree = params.get('degree') ?? ''
  const sort = params.get('sort') ?? 'recommended'
  const today = params.get('today') === '1'

  const set = (patch) => {
    const next = new URLSearchParams(params)
    next.delete('focus')
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    const blurbMatch = t ? SPECIALTIES.filter((s) => s.blurb.toLowerCase().includes(t)).map((s) => s.name) : []
    const fee = (d) => (mode === 'video' ? d.videoFee : mode === 'clinic' ? d.clinicFee : Math.min(d.videoFee ?? Infinity, d.clinicFee))
    const endOfToday = startOfDay().getTime() + 86400000

    let list = doctors
      .filter((d) => !specialty || d.specialty === specialty)
      .filter((d) => mode !== 'video' || d.video)
      .filter((d) => !degree || degreeTokens(d).includes(degree))
      .filter((d) => {
        if (!t) return true
        const hay = `${d.name} ${d.specialty} ${d.hospital} ${d.area} ${d.city} ${d.degrees}`.toLowerCase()
        return hay.includes(t) || blurbMatch.includes(d.specialty)
      })
      .map((d) => ({ d, next: nextAvailable(d, mode === 'all' ? (d.video ? 'video' : 'clinic') : mode) }))
      .filter(({ next }) => !today || (next && next.getTime() < endOfToday))

    const by = {
      recommended: (a, b) => (b.d.city === city) - (a.d.city === city) || b.d.rating * Math.log(b.d.reviews) - a.d.rating * Math.log(a.d.reviews),
      rating: (a, b) => b.d.rating - a.d.rating,
      fee: (a, b) => fee(a.d) - fee(b.d),
      exp: (a, b) => b.d.exp - a.d.exp,
      soonest: (a, b) => (a.next?.getTime() ?? Infinity) - (b.next?.getTime() ?? Infinity),
    }
    return list.sort(by[sort] ?? by.recommended).map((x) => x.d)
  }, [q, specialty, mode, degree, sort, today, city])

  const activeFilters = [q, specialty, degree, today, mode !== 'all'].filter(Boolean).length

  return (
    <div className="container-page pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{specialty ? `${specialty}s` : 'Find a doctor'}</h1>
          <p className="mt-1 text-muted">Verified doctors with confirmed availability, near {city} and online.</p>
        </div>
      </div>

      {/* Search + mode */}
      <div className="sticky top-[4.25rem] z-30 -mx-4 mt-7 border-b border-line/60 bg-bg/90 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-[1.75rem] sm:border sm:bg-surface/90 sm:p-3 sm:shadow-soft">
        <div className="flex-fill gap-3 [--min:16rem]">
          <label className="relative grow-[2]!">
            <span className="sr-only">Search doctors</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              key={params.get('focus') ? 'f' : 'n'}
              autoFocus={params.get('focus') === '1'}
              className="input rounded-full pl-12"
              value={q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="Name, specialty, hospital or symptom (e.g. acne)"
              type="search"
            />
          </label>
          <Segmented
            label="Consultation type"
            className=""
            value={mode}
            onChange={(m) => set({ mode: m === 'all' ? '' : m })}
            options={[
              { value: 'all', label: 'All', icon: LayoutGrid },
              { value: 'video', label: 'Video', icon: Video },
              { value: 'clinic', label: 'Clinic', icon: Building2 },
            ]}
          />
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:-mx-3 sm:px-3" role="group" aria-label="Specialty">
          <button type="button" className={`chip ${!specialty ? 'chip-active' : ''}`} aria-pressed={!specialty} onClick={() => set({ specialty: '' })}>
            All specialties
          </button>
          {SPECIALTIES.map((s) => (
            <button
              key={s.name}
              type="button"
              aria-pressed={specialty === s.name}
              className={`chip ${specialty === s.name ? 'chip-active' : ''}`}
              onClick={() => set({ specialty: specialty === s.name ? '' : s.name })}
            >
              <s.icon className="size-4" aria-hidden="true" /> {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2 [&>*]:grow sm:[&>*]:grow-0">
        <p className="basis-full text-sm text-muted sm:mr-auto sm:basis-auto" aria-live="polite">
          <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'doctor' : 'doctors'} found
        </p>
        <button type="button" className={`chip h-10 justify-center ${today ? 'chip-active' : ''}`} aria-pressed={today} onClick={() => set({ today: today ? '' : '1' })}>
          Available today
        </button>
        <label className="relative">
          <span className="sr-only">Degree</span>
          <select className="chip h-10 w-full cursor-pointer appearance-none pr-8" value={degree} onChange={(e) => set({ degree: e.target.value })}>
            <option value="">Any degree</option>
            {DEGREE_FILTERS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted">▾</span>
        </label>
        <label className="relative">
          <span className="sr-only">Sort by</span>
          <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <select className="chip h-10 w-full cursor-pointer appearance-none pr-8 pl-8" value={sort} onChange={(e) => set({ sort: e.target.value === 'recommended' ? '' : e.target.value })}>
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted">▾</span>
        </label>
        {activeFilters > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setParams({}, { replace: true })}>
            <X className="size-4" aria-hidden="true" /> Clear all
          </button>
        )}
      </div>

      <div className="mt-5">
        {results.length ? (
          <div className="flex-fill gap-4 [--min:26rem]">
            {results.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No doctors match these filters"
            body="Try a different specialty, switch to clinic visits, or clear the filters."
            action={
              <button type="button" className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}
