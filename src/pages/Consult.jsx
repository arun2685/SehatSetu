import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, FileText, Headphones, Lock, RefreshCw, Video, Zap } from 'lucide-react'
import { DoctorMini } from '../components/DoctorCard'
import { SectionHeader } from '../components/ui'
import { useApp } from '../lib/store'
import { doctors } from '../data/doctors'
import { CONCERNS } from '../data/content'

export default function Consult() {
  const { openDialog, user, bookings } = useApp()
  const online = doctors.filter((d) => d.video)
  const specs = ['All', ...new Set(online.map((d) => d.specialty))]
  const [spec, setSpec] = useState('All')
  const shown = spec === 'All' ? online : online.filter((d) => d.specialty === spec)
  const past = user ? bookings.filter((b) => b.mode === 'video' && b.status === 'completed').length : 0

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky via-bg to-bg">
        <svg className="absolute inset-x-0 bottom-0 w-full text-primary/15" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 190C400 30 1000 10 1460 150" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="container-page relative flex-fill items-center gap-12 py-14 [--min:20rem] sm:py-24">
          <div className="grow-[1.35]!">
            <span className="badge bg-surface text-primary-ink shadow-soft">
              <Zap className="size-4" aria-hidden="true" /> Video consult
            </span>
            <h1 className="mt-5 text-[2.4rem] font-semibold text-ink sm:text-[3.25rem]">See a doctor from the comfort of home.</h1>
            <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
              Skip the waiting room. A verified General Physician joins your video call in about 60 seconds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => openDialog('consult')}>
                <Video className="size-5" aria-hidden="true" /> Start instant consult · ₹299
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => openDialog('symptoms')}>
                Not sure? Check symptoms
              </button>
            </div>
            {past > 0 && (
              <Link to="/bookings?tab=completed" className="link mt-6 inline-flex items-center gap-1.5">
                View your {past} past consultation{past > 1 ? 's' : ''} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
          <div>
          <ul className="flex-fill gap-3 [--min:15rem]">
            {[
              [Clock, 'Connect in ~60 seconds', '24/7, including nights & holidays'],
              [FileText, 'Digital prescription', 'Valid at any pharmacy in India'],
              [RefreshCw, 'Free follow-up', 'Message your doctor for 7 days'],
              [Lock, '100% private', 'Encrypted, never recorded'],
            ].map(([Icon, t, s]) => (
              <li key={t} className="card flex items-center gap-4 p-4">
                <span className="icon-circle size-12">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="block text-sm text-muted">{s}</span>
                </span>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </section>

      <section className="container-page mt-16 sm:mt-24">
        <SectionHeader eyebrow="Start with a concern" title="Pick what’s bothering you" />
        <div className="flex-fill gap-3 [--min:9rem]">
          {CONCERNS.filter((c) => online.some((d) => d.specialty === c.specialty)).map((c) => (
            <button
              key={c.title}
              type="button"
              onClick={() => openDialog('consult', { doctorId: online.find((d) => d.specialty === c.specialty).id })}
              className="card card-hover flex flex-col items-start gap-3 p-4 text-left"
            >
              <span className="icon-circle size-12">
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm leading-snug font-semibold">{c.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="container-page mt-16 sm:mt-24">
        <SectionHeader
          eyebrow={`${online.length} doctors online`}
          title="Specialists ready for a video call"
          subtitle="Choose a doctor and connect right away."
        />
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by specialty">
          {specs.map((s) => (
            <button key={s} type="button" aria-pressed={spec === s} className={`chip ${spec === s ? 'chip-active' : ''}`} onClick={() => setSpec(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex-fill gap-4 [--min:19rem]">
          {shown.map((d) => (
            <DoctorMini key={d.id} doctor={d} action="consult" />
          ))}
        </div>
      </section>

      <section className="container-page mt-16 sm:mt-24">
        <div className="flex flex-col items-start gap-5 rounded-[2rem] bg-sand p-6 sm:flex-row sm:items-center sm:p-9">
          <span className="icon-circle size-14">
            <Headphones className="size-6" aria-hidden="true" />
          </span>
          <div className="grow">
            <h2 className="font-display text-xl font-semibold">Before your call</h2>
            <ul className="flex-fill mt-2 gap-1.5 text-sm text-muted [--min:13rem]">
              {['Find a quiet, well-lit place', 'Keep old reports & medicines handy', 'Use earphones for privacy'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-accent-ink" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
