import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Briefcase, Building2, CalendarCheck, Clock, GraduationCap, Languages, MapPin, Navigation, ShieldCheck, Star, UserX, Video, Zap,
} from 'lucide-react'
import { Avatar, EmptyState, Rating, Segmented, Verified } from '../components/ui'
import { DoctorMini } from '../components/DoctorCard'
import { useApp } from '../lib/store'
import { doctors, getDoctor, reviewsFor } from '../data/doctors'
import { SPECIALTIES } from '../data/content'
import { inr, nextAvailable, whenLabel } from '../lib/time'

export default function DoctorProfile() {
  const { id } = useParams()
  const d = getDoctor(id)
  if (!d) {
    return (
      <div className="container-page pt-12">
        <EmptyState
          icon={UserX}
          title="Doctor not found"
          body="This profile may have moved. Browse all verified doctors instead."
          action={
            <Link to="/doctors" className="btn btn-primary">
              Browse doctors
            </Link>
          }
        />
      </div>
    )
  }
  return <Profile key={d.id} d={d} />
}

function Profile({ d }) {
  const { openDialog } = useApp()
  const [mode, setMode] = useState(d.video ? 'video' : 'clinic')
  const next = nextAvailable(d, mode)
  const fee = mode === 'video' ? d.videoFee : d.clinicFee
  const spec = SPECIALTIES.find((s) => s.name === d.specialty)
  const reviews = reviewsFor(d)
  const similar = doctors.filter((x) => x.id !== d.id && (x.specialty === d.specialty || x.hospital === d.hospital)).slice(0, 3)
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.hospital}, ${d.area}, ${d.city}`)}`

  return (
    <div className="container-page pt-6 sm:pt-10">
      <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> All doctors
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          {/* Header card */}
          <section className="card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-soft via-sky to-sand sm:h-28" aria-hidden="true" />
            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-10 flex flex-wrap items-end justify-between gap-3">
                <Avatar name={d.name} size="xl" online={d.video} className="rounded-full ring-4 ring-surface" />
                <Rating value={d.rating} count={`${d.reviews} reviews`} className="mb-1" />
              </div>
              <h1 className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold sm:text-3xl">
                {d.name} <Verified />
              </h1>
              <p className="mt-0.5 font-semibold text-accent-ink">{d.specialty}</p>
              <ul className="flex-fill mt-4 gap-2.5 text-sm text-ink/85 [--min:15rem]">
                <Info icon={GraduationCap}>{d.degrees}</Info>
                <Info icon={Briefcase}>{d.exp} years of experience</Info>
                <Info icon={Building2}>{d.hospital}</Info>
                <Info icon={MapPin}>
                  {d.area}, {d.city}
                </Info>
                <Info icon={Languages}>Speaks {d.languages.join(', ')}</Info>
                <Info icon={ShieldCheck}>Registration verified by SehatSetu</Info>
              </ul>
            </div>
          </section>

          {/* About */}
          <section className="card p-5 sm:p-7">
            <h2 className="font-display text-lg font-semibold">About</h2>
            <p className="mt-2 text-base leading-relaxed text-muted">
              {d.name.replace('Dr. ', 'Dr. ')} is a {d.specialty.toLowerCase()} with {d.exp} years of experience, currently practising at {d.hospital}.{' '}
              {spec ? `Patients commonly consult for ${spec.blurb.toLowerCase()}.` : ''} Known for clear explanations and practical treatment plans,{' '}
              {d.gender === 'F' ? 'she' : 'he'} consults in {d.languages.slice(0, -1).join(', ')} and {d.languages.at(-1)}.
            </p>
            <div className="flex-fill mt-5 gap-3 [--min:9rem]">
              <Stat label="Patient rating" value={`${d.rating} / 5`} />
              <Stat label="Experience" value={`${d.exp} yrs`} />
              <Stat label="Consult modes" value={d.video ? 'Video & clinic' : 'Clinic only'} />
            </div>
          </section>

          {/* Clinic */}
          <section className="card p-5 sm:p-7">
            <h2 className="font-display text-lg font-semibold">Clinic location</h2>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                <div className="icon-circle size-12">
                  <Building2 className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold">{d.hospital}</p>
                  <p className="text-sm text-muted">
                    {d.area}, {d.city}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <Clock className="size-4" aria-hidden="true" /> Mon – Sat, 9:00 AM – 7:30 PM
                  </p>
                </div>
              </div>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                <Navigation className="size-4" aria-hidden="true" /> Directions
              </a>
            </div>
          </section>

          {/* Reviews */}
          <section className="card p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Patient reviews</h2>
              <Rating value={d.rating} count={d.reviews} />
            </div>
            <ul className="mt-4 divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.who} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.who}</p>
                    <p className="text-xs text-muted">{r.ago}</p>
                  </div>
                  <div className="mt-1 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-line'}`} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-base text-muted">{r.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Booking widget */}
        <aside className="card p-6 lg:sticky lg:top-24" aria-label="Book appointment">
          <h2 className="font-display text-lg font-semibold">Book an appointment</h2>
          <Segmented
            label="Consultation type"
            className="mt-4 w-full"
            value={mode}
            onChange={setMode}
            options={[
              ...(d.video ? [{ value: 'video', label: 'Video', icon: Video }] : []),
              { value: 'clinic', label: 'Clinic', icon: Building2 },
            ]}
          />
          <div className="mt-5 space-y-3 rounded-2xl bg-surface-2 p-4">
            <div className="flex justify-between">
              <span className="text-muted">{mode === 'video' ? 'Consultation fee' : 'Visiting fee'}</span>
              <span className="font-semibold">{inr(fee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Next available</span>
              <span className="font-semibold text-accent-ink">{next ? whenLabel(next) : 'No slots this week'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment</span>
              <span className="font-semibold">{mode === 'video' ? 'Online' : 'At clinic'}</span>
            </div>
          </div>
          <button type="button" className="btn btn-primary btn-lg mt-4 w-full" onClick={() => openDialog('book', { doctorId: d.id, mode })}>
            <CalendarCheck className="size-5" aria-hidden="true" /> Choose a time
          </button>
          {d.video && (
            <button type="button" className="btn btn-soft btn-lg mt-2 w-full" onClick={() => openDialog('consult', { doctorId: d.id })}>
              <Zap className="size-5" aria-hidden="true" /> Consult now · {inr(d.videoFee)}
            </button>
          )}
          <p className="mt-3 text-center text-xs text-muted">Free cancellation up to 1 hour before</p>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title mb-6">Similar doctors</h2>
          <div className="flex-fill gap-4 [--min:18rem]">
            {similar.map((x) => (
              <DoctorMini key={x.id} doctor={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Info({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-surface-2 px-4 py-3.5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  )
}
