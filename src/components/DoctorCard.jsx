import { Link } from 'react-router-dom'
import { Briefcase, Building2, MapPin, Video, Zap } from 'lucide-react'
import { Avatar, Rating, Verified } from './ui'
import { useApp } from '../lib/store'
import { inr, nextAvailable, whenLabel } from '../lib/time'

export function DoctorCard({ doctor: d }) {
  const { openDialog } = useApp()
  const nextVideo = d.video ? nextAvailable(d, 'video') : null
  const nextClinic = nextAvailable(d, 'clinic')

  return (
    <article className="card card-hover flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex gap-4">
        <Link to={`/doctors/${d.id}`} tabIndex={-1} aria-hidden="true">
          <Avatar name={d.name} online={d.video} />
        </Link>
        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <h3 className="flex items-center gap-1.5 font-display text-lg leading-tight font-semibold">
                <Link to={`/doctors/${d.id}`} className="truncate hover:text-primary-ink">
                  {d.name}
                </Link>
                <Verified />
              </h3>
              <p className="mt-0.5 font-semibold text-primary-ink">{d.specialty}</p>
            </div>
            <Rating value={d.rating} count={d.reviews} className="shrink-0" />
          </div>
          <p className="mt-1.5 line-clamp-1 text-sm text-muted">{d.degrees}</p>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5" aria-hidden="true" /> {d.exp} yrs exp
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" /> <span className="truncate">{d.area}, {d.city}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-fill gap-2 [--min:8rem]">
        <FeeBox
          icon={Video}
          label="Video call"
          fee={d.video ? inr(d.videoFee) : 'Not offered'}
          next={nextVideo ? whenLabel(nextVideo) : null}
          muted={!d.video}
        />
        <FeeBox icon={Building2} label="Clinic visit" fee={inr(d.clinicFee)} next={nextClinic ? whenLabel(nextClinic) : null} />
      </div>

      <div className="flex-fill mt-auto gap-2 [--min:8rem]">
        <Link to={`/doctors/${d.id}`} className="btn btn-secondary">
          View profile
        </Link>
        <button type="button" className="btn btn-primary" onClick={() => openDialog('book', { doctorId: d.id })}>
          <span className="sm:hidden">Book now</span>
          <span className="hidden sm:inline">Book appointment</span>
        </button>
      </div>
    </article>
  )
}

function FeeBox({ icon: Icon, label, fee, next, muted }) {
  return (
    <div className={`rounded-2xl bg-surface-2 px-4 py-3 ${muted ? 'opacity-60' : ''}`}>
      <p className="flex items-center gap-1.5 text-sm text-muted">
        <Icon className="size-3.5" aria-hidden="true" /> {label}
      </p>
      <p className="mt-0.5 font-semibold">{fee}</p>
      {next && !muted && <p className="mt-0.5 truncate text-sm text-primary-ink"><span className="hidden sm:inline">Next: </span>{next}</p>}
    </div>
  )
}

/** Smaller card for carousels / "online now" grids. */
export function DoctorMini({ doctor: d, action = 'book' }) {
  const { openDialog } = useApp()
  return (
    <article className="card card-hover flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <Avatar name={d.name} online={d.video} />
        <div className="min-w-0 grow">
          <h3 className="flex items-center gap-1 font-display leading-tight font-semibold">
            <Link to={`/doctors/${d.id}`} className="truncate hover:text-primary-ink">
              {d.name}
            </Link>
            <Verified />
          </h3>
          <p className="text-sm font-semibold text-primary-ink">{d.specialty}</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
            <Rating value={d.rating} className="text-sm" />
            <span aria-hidden="true">·</span>
            <span>{d.exp} yrs</span>
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-1 text-sm text-muted">{d.hospital}</p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
        <div>
          <p className="text-xs text-muted">{action === 'consult' ? 'Consult fee' : d.video ? 'Video from' : 'Clinic fee'}</p>
          <p className="font-semibold">{inr(action === 'consult' || d.video ? d.videoFee : d.clinicFee)}</p>
        </div>
        {action === 'consult' ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openDialog('consult', { doctorId: d.id })}>
            <Zap className="size-4" aria-hidden="true" /> Consult now
          </button>
        ) : (
          <button type="button" className="btn btn-soft btn-sm" onClick={() => openDialog('book', { doctorId: d.id })}>
            Book
          </button>
        )}
      </div>
    </article>
  )
}
