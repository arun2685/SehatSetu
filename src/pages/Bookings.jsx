import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, CalendarClock, CalendarPlus, CalendarX, FileText, Navigation, RotateCcw, UserRound, Video, X } from 'lucide-react'
import { Avatar, EmptyState } from '../components/ui'
import { useApp } from '../lib/store'
import { getDoctor } from '../data/doctors'
import { inr, whenLabel } from '../lib/time'

const TABS = [
  ['upcoming', 'Upcoming'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
]

const STATUS = {
  upcoming: 'bg-accent-soft text-accent-ink',
  completed: 'bg-sky text-muted',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
}

export default function Bookings() {
  const { user, bookings, openDialog } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'upcoming'

  if (!user) {
    return (
      <div className="container-page max-w-2xl pt-10 sm:pt-16">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">My bookings</h1>
        <div className="mt-6">
          <EmptyState
            icon={UserRound}
            title="Sign in to see your appointments"
            body="Track upcoming visits, join video calls and download prescriptions — all in one place."
            action={
              <button type="button" className="btn btn-primary btn-lg" onClick={() => openDialog('signin')}>
                Sign in with mobile
              </button>
            }
          />
        </div>
      </div>
    )
  }

  // Past "upcoming" bookings older than 1 hour are shown as completed.
  const now = Date.now()
  const withStatus = bookings.map((b) => ({
    ...b,
    status: b.status === 'upcoming' && new Date(b.at).getTime() < now - 3600000 ? 'completed' : b.status,
  }))
  const counts = Object.fromEntries(TABS.map(([k]) => [k, withStatus.filter((b) => b.status === k).length]))
  const list = withStatus
    .filter((b) => b.status === tab)
    .sort((a, b) => (tab === 'upcoming' ? new Date(a.at) - new Date(b.at) : new Date(b.at) - new Date(a.at)))

  return (
    <div className="container-page max-w-4xl pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">My bookings</h1>
          <p className="mt-1 text-muted">Appointments for you and your family.</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          <CalendarPlus className="size-4" aria-hidden="true" /> New booking
        </Link>
      </div>

      <div role="tablist" aria-label="Booking status" className="mt-7 flex gap-1 rounded-full bg-surface-2 p-1">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setParams(k === 'upcoming' ? {} : { tab: k }, { replace: true })}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[0.9375rem] font-semibold transition-colors ${
              tab === k ? 'bg-surface text-primary-ink shadow-soft' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${tab === k ? 'bg-primary-soft text-primary-ink' : 'bg-surface text-muted'}`}>{counts[k]}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4" role="tabpanel">
        {list.length ? (
          list.map((b) => <BookingCard key={b.id} b={b} />)
        ) : (
          <EmptyState
            icon={tab === 'cancelled' ? CalendarX : CalendarClock}
            title={tab === 'upcoming' ? 'No upcoming appointments' : tab === 'completed' ? 'No past appointments yet' : 'No cancelled appointments'}
            body={tab === 'upcoming' ? 'Book a clinic visit or start an instant video consult.' : undefined}
            action={
              tab === 'upcoming' && (
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to="/doctors" className="btn btn-primary">
                    Find a doctor
                  </Link>
                  <button type="button" className="btn btn-secondary" onClick={() => openDialog('consult')}>
                    Instant consult
                  </button>
                </div>
              )
            }
          />
        )}
      </div>
    </div>
  )
}

function BookingCard({ b }) {
  const { openDialog, toast } = useApp()
  const navigate = useNavigate()
  const d = getDoctor(b.doctorId)
  if (!d) return null
  const at = new Date(b.at)
  const isVideo = b.mode === 'video'
  const startsSoon = at.getTime() - Date.now() < 15 * 60000
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.hospital}, ${d.area}, ${d.city}`)}`

  return (
    <article className="card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar name={d.name} />
        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/doctors/${d.id}`} className="block truncate font-display text-lg font-semibold hover:text-primary-ink">
                {d.name}
              </Link>
              <p className="text-sm text-muted">{d.specialty}</p>
            </div>
            <span className={`badge capitalize ${STATUS[b.status]}`}>{b.status}</span>
          </div>
          <dl className="flex-fill mt-3 gap-x-6 gap-y-1.5 text-sm [--min:13rem]">
            <div className="flex items-center gap-2">
              <dt className="sr-only">When</dt>
              <CalendarClock className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <dd className="font-semibold">{whenLabel(at)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Type</dt>
              {isVideo ? <Video className="size-4 shrink-0 text-muted" aria-hidden="true" /> : <Building2 className="size-4 shrink-0 text-muted" aria-hidden="true" />}
              <dd className="truncate">{isVideo ? 'Video consult' : `${d.hospital}`}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Patient</dt>
              <UserRound className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <dd>
                {b.patient}
                {b.relation !== 'Self' && <span className="text-muted"> ({b.relation})</span>}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <dt className="sr-only">Fee</dt>
              <dd>
                {inr(b.fee)} · {isVideo ? 'Paid online' : 'Pay at clinic'} · <span className="font-mono text-xs">{b.id}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4 sm:pl-[4.5rem] [&>*]:grow sm:[&>*]:grow-0">
        {b.status === 'upcoming' && (
          <>
            {isVideo ? (
              <button
                type="button"
                className={`btn btn-sm ${startsSoon ? 'btn-primary' : 'btn-soft'}`}
                onClick={() => toast(startsSoon ? 'Demo: the video call would open here' : `You can join from ${whenLabel(new Date(at.getTime() - 10 * 60000))}`, 'info')}
              >
                <Video className="size-4" aria-hidden="true" /> Join call
              </button>
            ) : (
              <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-soft btn-sm">
                <Navigation className="size-4" aria-hidden="true" /> Directions
              </a>
            )}
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openDialog('book', { rescheduleId: b.id })}>
              <CalendarClock className="size-4" aria-hidden="true" /> Reschedule
            </button>
            <button type="button" className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 dark:text-red-400" onClick={() => openDialog('cancel', { bookingId: b.id })}>
              <X className="size-4" aria-hidden="true" /> Cancel
            </button>
          </>
        )}
        {b.status === 'completed' && (
          <>
            <button type="button" className="btn btn-soft btn-sm" onClick={() => openDialog('prescription', { bookingId: b.id })}>
              <FileText className="size-4" aria-hidden="true" /> View prescription
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openDialog('book', { doctorId: d.id, mode: b.mode })}>
              <RotateCcw className="size-4" aria-hidden="true" /> Book again
            </button>
          </>
        )}
        {b.status === 'cancelled' && (
          <>
            <button type="button" className="btn btn-soft btn-sm" onClick={() => openDialog('book', { doctorId: d.id, mode: b.mode })}>
              <RotateCcw className="size-4" aria-hidden="true" /> Book again
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(d.specialty)}`)}>
              Other {d.specialty}s
            </button>
          </>
        )}
      </div>
    </article>
  )
}
