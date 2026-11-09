import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, Bot, Building2, CalendarCheck, Check, ChevronDown, Clock, Crown, FileText, Lock, MessageSquareText, Quote,
  ShieldCheck, Star, Video, Zap,
} from 'lucide-react'
import { Avatar, SectionHeader, Verified } from '../components/ui'
import { SearchBox } from '../components/SearchBox'
import { DoctorMini } from '../components/DoctorCard'
import { useApp } from '../lib/store'
import { doctors, getDoctor } from '../data/doctors'
import { ARTICLES, CONCERNS, FAQS, SPECIALTIES, TESTIMONIALS } from '../data/content'
import { inr } from '../lib/time'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Concerns />
      <HowItWorks />
      <Specialties />
      <TopDoctors />
      <SymptomBanner />
      <PlusBanner />
      <Testimonials />
      <Articles />
      <Faq />
    </>
  )
}

/* ------------------------------------------------------------------ */
function Hero() {
  const { city } = useApp()
  const navigate = useNavigate()
  const popular = [
    ['Fever', 'General Physician'],
    ['Skin & hair', 'Dermatologist'],
    ['Child health', 'Child Specialist'],
    ['Periods', 'Gynecologist'],
    ['Anxiety', 'Psychiatrist'],
  ]
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary-soft/80 via-bg to-bg">
      {/* the logo's gentle bridge arc */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-10 -z-10 w-full text-primary/15" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-20 200C380 40 1000 20 1460 170" stroke="currentColor" strokeWidth="2" />
      </svg>

      <div className="container-page flex-fill items-center gap-14 pt-12 pb-16 [--min:20rem] sm:pt-20 lg:gap-16 lg:pt-24 lg:pb-24">
        <div className="animate-rise grow-[1.3]!">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted shadow-soft">
            <span className="size-2 rounded-full bg-accent animate-pulse-ring" aria-hidden="true" />
            Doctors available now in {city}
          </p>
          <h1 className="mt-6 text-[2.6rem] leading-[1.08] font-semibold text-ink sm:text-[3.5rem] lg:text-[3.9rem]">
            Talk to a doctor <br className="hidden sm:block" />
            in <span className="text-primary-ink">60 seconds.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Video consults and confirmed clinic visits with verified doctors — calm, simple and close to home.
          </p>

          <SearchBox className="mt-9 max-w-xl" />

          <p className="mt-5 mb-2 text-sm text-muted">Popular searches</p>
          <div className="flex-fill max-w-xl gap-2 [--min:6.5rem]">
            {popular.map(([label, spec]) => (
              <button key={label} type="button" className="chip h-10 justify-center text-sm" onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(spec)}`)}>
                {label}
              </button>
            ))}
          </div>

          <dl className="flex-fill mt-12 max-w-xl gap-y-4 divide-x divide-line [--min:6rem]">
            {[
              ['60 sec', 'average wait'],
              ['100%', 'verified doctors'],
              ['24/7', 'always open'],
            ].map(([v, l], i) => (
              <div key={l} className={i ? 'pl-5' : 'pr-5'}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-semibold text-ink sm:text-3xl">{v}</dd>
                <dd className="mt-0.5 text-sm text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <OnlineDoctorCard />
      </div>
    </section>
  )
}

function OnlineDoctorCard() {
  const { openDialog } = useApp()
  const d = getDoctor('aisha-roy')
  return (
    <div className="relative isolate mx-auto w-full max-w-md animate-rise [animation-delay:120ms] lg:mr-0">
      <div className="absolute -right-8 -bottom-8 -z-10 size-56 rounded-full bg-sand" aria-hidden="true" />
      <div className="absolute -top-10 -left-10 -z-10 size-36 rounded-full bg-sky" aria-hidden="true" />
      <div className="card p-6 shadow-lift sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary-ink">Doctor available now</p>
          <span className="badge bg-accent-soft text-accent-ink">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" /> Online
          </span>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <Avatar name={d.name} size="lg" online />
          <div>
            <p className="flex items-center gap-1.5 font-display text-xl font-semibold">
              {d.name} <Verified />
            </p>
            <p className="text-muted">
              {d.specialty} · {d.exp} yrs
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm">
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span className="font-semibold">{d.rating}</span>
              <span className="text-muted">({d.reviews} reviews)</span>
            </p>
          </div>
        </div>
        <div className="flex-fill mt-6 gap-3 [--min:8rem]">
          <div className="rounded-2xl bg-surface-2 p-4">
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Video className="size-4" aria-hidden="true" /> Video call
            </p>
            <p className="mt-1 font-display text-xl font-semibold">{inr(d.videoFee)}</p>
          </div>
          <div className="rounded-2xl bg-surface-2 p-4">
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Building2 className="size-4" aria-hidden="true" /> Clinic visit
            </p>
            <p className="mt-1 font-display text-xl font-semibold">{inr(d.clinicFee)}</p>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Clock className="size-4 text-primary-ink" aria-hidden="true" /> Usually joins in <span className="font-semibold text-ink">under a minute</span>
        </p>
        <button type="button" className="btn btn-primary btn-lg mt-5 w-full" onClick={() => openDialog('consult')}>
          <Video className="size-5" aria-hidden="true" /> Start video consult
        </button>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted">
          {['Prescription included', 'Free follow-up', 'Private'].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Check className="size-4 text-primary-ink" aria-hidden="true" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function Services() {
  const { openDialog } = useApp()
  const navigate = useNavigate()
  const cards = [
    {
      icon: Zap,
      tag: 'About 1 minute',
      title: 'Video consult',
      body: 'Speak to an on-duty doctor from home. Prescription included.',
      cta: 'Consult now',
      price: 'From ₹299',
      onClick: () => openDialog('consult'),
      tint: 'bg-primary-soft',
    },
    {
      icon: CalendarCheck,
      tag: 'Confirmed time',
      title: 'Clinic visit',
      body: 'Choose a time with a verified doctor near you. Pay at the clinic.',
      cta: 'Find doctors',
      price: 'No booking fee',
      onClick: () => navigate('/doctors?mode=clinic'),
      tint: 'bg-sky',
    },
    {
      icon: Bot,
      tag: 'Free',
      title: 'Not sure who to see?',
      body: 'Tell us how you feel and we’ll suggest the right doctor.',
      cta: 'Check symptoms',
      price: 'Takes 30 seconds',
      onClick: () => openDialog('symptoms'),
      tint: 'bg-sand',
    },
  ]
  return (
    <section className="container-page" aria-label="Services">
      <div className="flex-fill gap-4 [--min:17rem] sm:gap-5">
        {cards.map((c) => (
          <button
            key={c.title}
            type="button"
            onClick={c.onClick}
            className={`group flex flex-col rounded-3xl p-6 text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-7 ${c.tint}`}
          >
            <div className="flex items-center justify-between">
              <span className="icon-circle size-12 bg-surface shadow-soft">
                <c.icon className="size-6" aria-hidden="true" />
              </span>
              <span className="badge bg-surface/80 text-muted">{c.tag}</span>
            </div>
            <h2 className="mt-6 font-display text-[1.4rem] font-semibold">{c.title}</h2>
            <p className="mt-2 text-muted">{c.body}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-7">
              <span className="text-sm font-semibold text-ink/80">{c.price}</span>
              <span className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap text-primary-ink">
                {c.cta} <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Concerns() {
  const { openDialog } = useApp()
  const navigate = useNavigate()
  const start = (c) => {
    const doc = doctors.find((d) => d.specialty === c.specialty && d.video)
    if (doc) openDialog('consult', { doctorId: doc.id })
    else navigate(`/doctors?specialty=${encodeURIComponent(c.specialty)}`)
  }
  return (
    <section className="container-page mt-20 sm:mt-28">
      <SectionHeader
        eyebrow="Consult online"
        title="What’s bothering you today?"
        subtitle="Pick a concern to talk privately with the right specialist."
        action={
          <Link to="/consult" className="btn btn-secondary">
            All consult options <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />
      <div className="flex-fill gap-3 [--min:9.5rem] sm:gap-4 sm:[--min:14rem] lg:[--min:17rem] xl:[--min:20rem]">
        {CONCERNS.map((c) => (
          <button key={c.title} type="button" onClick={() => start(c)} className="card card-hover group flex flex-col items-start gap-3 p-4 text-left sm:flex-row sm:gap-4 sm:p-5">
            <span className="icon-circle size-12 transition-colors group-hover:bg-primary/15">
              <c.icon className="size-5 sm:size-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block leading-snug font-semibold">{c.title}</span>
              <span className="mt-0.5 hidden text-sm text-muted sm:block">{c.hint}</span>
              <span className="mt-2 inline-flex flex-wrap items-center gap-1 text-sm font-semibold text-primary-ink">
                {c.specialty} <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    { icon: MessageSquareText, title: 'Tell us what’s wrong', body: 'Search a doctor, pick a concern, or describe your symptoms.' },
    { icon: Video, title: 'Talk to a verified doctor', body: 'Video call in about a minute, or walk in at your booked clinic slot.' },
    { icon: FileText, title: 'Get your prescription', body: 'Signed digital prescription on SMS & WhatsApp. Valid at any pharmacy.' },
  ]
  return (
    <section className="container-page mt-20 sm:mt-28">
      <div className="rounded-[2rem] bg-sand px-5 py-10 sm:px-12 sm:py-14">
        <SectionHeader eyebrow="How it works" title="Care in three simple steps" className="!mb-8" />
        <ol className="flex-fill gap-6 [--min:11rem]">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 md:flex-col">
              <div className="flex items-center gap-3">
                <span className="icon-circle size-14 bg-surface shadow-soft">
                  <s.icon className="size-6" aria-hidden="true" />
                </span>
                {i < steps.length - 1 && <span className="hidden h-px grow border-t-2 border-dotted border-ink/15 lg:block" aria-hidden="true" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-ink">Step {i + 1}</p>
                <h3 className="mt-0.5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-base text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Specialties() {
  const [all, setAll] = useState(false)
  const list = all ? SPECIALTIES : SPECIALTIES.slice(0, 10)
  return (
    <section className="container-page mt-20 sm:mt-28">
      <SectionHeader eyebrow="Clinic & video" title="Browse by specialty" subtitle="20+ specialties, all doctors verified by our medical team." />
      <div className="flex-fill gap-3 [--min:9.5rem] sm:[--min:11rem] lg:[--min:13rem]">
        {list.map((s) => (
          <Link
            key={s.name}
            to={`/doctors?specialty=${encodeURIComponent(s.name)}`}
            className="card card-hover group flex flex-col items-start gap-4 p-5"
          >
            <span className="icon-circle size-12 transition-colors group-hover:bg-primary/15">
              <s.icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base leading-tight font-semibold">{s.name}</span>
              <span className="mt-1 block text-sm leading-snug text-muted">{s.blurb}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-5 text-center">
        <button type="button" className="btn btn-secondary" onClick={() => setAll((a) => !a)} aria-expanded={all}>
          {all ? 'Show fewer' : `Show all ${SPECIALTIES.length} specialties`}
          <ChevronDown className={`size-4 transition-transform ${all ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function TopDoctors() {
  const top = [...doctors].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 6)
  return (
    <section className="mt-20 sm:mt-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Top rated"
          title="Doctors patients love"
          subtitle="Verified credentials, real reviews, confirmed availability."
          action={
            <Link to="/doctors" className="btn btn-secondary">
              See all doctors <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
      </div>
      <div className="container-page">
        <div className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {top.map((d) => (
            <div key={d.id} className="w-[78%] shrink-0 snap-start sm:w-auto sm:shrink sm:grow sm:basis-[20rem]">
              <DoctorMini doctor={d} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function SymptomBanner() {
  const { openDialog } = useApp()
  const [text, setText] = useState('')
  return (
    <section className="container-page mt-20 sm:mt-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-sky px-6 py-10 sm:px-12 sm:py-14">
        <svg className="absolute -right-10 bottom-0 w-[60%] text-primary/15" viewBox="0 0 600 200" fill="none" aria-hidden="true">
          <path d="M0 190C150 40 420 10 600 120" stroke="currentColor" strokeWidth="4" />
        </svg>
        <div className="relative flex-fill items-center gap-8 [--min:20rem]">
          <div>
            <span className="badge bg-surface text-primary-ink shadow-soft">
              <Bot className="size-4" aria-hidden="true" /> Symptom navigator
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Unsure which doctor you need?</h2>
            <p className="mt-3 max-w-lg text-lg text-muted">
              Describe how you feel in your own words. We’ll check for warning signs and point you to the right specialist.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              openDialog('symptoms', { initial: text })
            }}
            className="rounded-3xl bg-surface p-2.5 shadow-soft"
          >
            <label htmlFor="sym-input" className="sr-only">
              Describe your symptoms
            </label>
            <textarea
              id="sym-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="e.g. Headache with blurry vision since yesterday"
              className="w-full resize-none rounded-2xl bg-surface-2 px-4 py-3 text-base text-ink outline-none placeholder:text-muted/70 focus:ring-4 focus:ring-primary/15"
            />
            <button type="submit" className="btn btn-primary btn-lg mt-2.5 w-full">
              Find the right doctor <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function PlusBanner() {
  return (
    <section className="container-page mt-5">
      <div className="flex flex-wrap items-center gap-6 rounded-[2rem] bg-blush p-6 sm:p-9">
        <span className="icon-circle size-16 bg-surface text-amber-600 shadow-soft dark:text-amber-300">
          <Crown className="size-7" aria-hidden="true" />
        </span>
        <div className="grow basis-[min(100%,18rem)]">
          <p className="eyebrow">SehatSetu Care Plus</p>
          <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">Unlimited doctor consults for your whole family</h2>
          <p className="mt-1 text-muted">Up to 6 members · ₹0 video consult fee · priority connect. From ₹149/month.</p>
        </div>
        <Link to="/plus" className="btn btn-primary btn-lg grow sm:grow-0">
          Explore plans <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Testimonials() {
  return (
    <section className="container-page mt-20 sm:mt-28">
      <SectionHeader eyebrow="Patient stories" title="Trusted by families across India" />
      <div className="flex-fill gap-4 [--min:18rem]">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="card flex flex-col p-7">
            <Quote className="size-8 text-primary/25" aria-hidden="true" />
            <div className="mt-3 flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-3 grow text-base leading-relaxed text-ink/90">“{t.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <Avatar name={t.name} size="sm" />
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block text-sm text-muted">{t.city}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Articles() {
  const { toast } = useApp()
  const tints = [
    'bg-primary-soft',
    'bg-sand',
    'bg-sky',
  ]
  return (
    <section className="container-page mt-20 sm:mt-28">
      <SectionHeader eyebrow="Health library" title="Read top health articles" subtitle="Doctor-written guides on prevention and everyday wellness." />
      <div className="flex-fill gap-4 [--min:18rem]">
        {ARTICLES.map((a, i) => (
          <article key={a.title} className="card card-hover flex flex-col overflow-hidden">
            <div className={`relative grid h-40 place-items-center ${tints[i]}`}>
              <a.icon className="size-14 text-primary-ink/60" strokeWidth={1.25} aria-hidden="true" />
              <span className="badge absolute top-4 left-4 bg-surface/90 text-ink">{a.category}</span>
            </div>
            <div className="flex grow flex-col p-6">
              <h3 className="font-display text-lg leading-snug font-semibold">{a.title}</h3>
              <p className="mt-2 grow text-muted">{a.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  <BadgeCheck className="size-4 text-accent-ink" aria-hidden="true" /> {a.author}
                </span>
                <button type="button" className="link text-sm" onClick={() => toast('Articles are coming soon', 'info')}>
                  Read · {a.read}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
function Faq() {
  return (
    <section className="container-page mt-20 sm:mt-28">
      <div className="flex-fill gap-8 [--min:18rem]">
        <div>
          <p className="eyebrow mb-2">FAQ</p>
          <h2 className="section-title">Questions, answered</h2>
          <p className="mt-3 text-muted">Still need help? Our care team is available 8 AM – 10 PM, every day.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              [ShieldCheck, 'NMC-registered, verified doctors only'],
              [Lock, 'End-to-end encrypted consultations'],
              [FileText, 'Prescriptions valid across India'],
            ].map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-2.5">
                <Icon className="size-5 text-accent-ink" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 grow-[1.6]!">
          {FAQS.map((f, i) => (
            <details key={f.q} className="card group p-0 open:shadow-sm" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-base text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
