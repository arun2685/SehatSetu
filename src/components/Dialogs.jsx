import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Bot, CalendarCheck, CircleAlert, Crown, FileText, HeartHandshake, LogOut, Monitor, Moon, Phone, RotateCcw, ShieldCheck,
  Siren, Smartphone, Sun, Video, Zap,
} from 'lucide-react'
import { Avatar, Modal, Segmented, Verified } from './ui'
import { PatientFields, emptyPatient, patientFor, validatePatient, Field } from './PatientFields'
import { BookingDialog } from './BookingDialog'
import { useApp } from '../lib/store'
import { doctors, getDoctor } from '../data/doctors'
import { SPECIALTIES, specialtyIcon } from '../data/content'
import { inr, whenLabel } from '../lib/time'
import { triage, SYMPTOM_CHIPS } from '../lib/triage'

export function DialogHost() {
  const { dialog, closeDialog } = useApp()
  if (!dialog) return null
  const props = { ...dialog.props, onClose: closeDialog }
  switch (dialog.type) {
    case 'book':
      return <BookingDialog key={JSON.stringify(dialog.props)} {...props} />
    case 'consult':
      return <ConsultDialog {...props} />
    case 'signin':
      return <SignInDialog {...props} />
    case 'symptoms':
      return <SymptomDialog {...props} />
    case 'prescription':
      return <PrescriptionDialog {...props} />
    case 'cancel':
      return <CancelDialog {...props} />
    case 'account':
      return <AccountDialog {...props} />
    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/* Sign in (demo OTP)                                                  */
/* ------------------------------------------------------------------ */
function SignInDialog({ onClose, then }) {
  const { signIn, toast, openDialog } = useApp()
  const [step, setStep] = useState('phone')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [timer, setTimer] = useState(30)

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return
    const t = setTimeout(() => setTimer((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [step, timer])

  const sendOtp = (e) => {
    e?.preventDefault()
    const errs = validatePatient({ ...emptyPatient, name, phone }, null)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStep('otp')
    setTimer(30)
  }

  const verify = (e) => {
    e?.preventDefault()
    if (!/^\d{6}$/.test(otp)) return setErrors({ otp: 'Enter the 6-digit code' })
    signIn({ name: name.trim(), phone })
    toast(`Welcome, ${name.trim().split(' ')[0]}!`)
    if (then) openDialog(then.type, then.props)
    else onClose()
  }

  return (
    <Modal
      title={step === 'phone' ? 'Sign in to SehatSetu' : 'Verify your number'}
      subtitle={step === 'phone' ? 'Book faster, track appointments and keep your prescriptions in one place.' : `Code sent to +91 ${phone}`}
      icon={Smartphone}
      onClose={onClose}
      size="sm"
    >
      {step === 'phone' ? (
        <form onSubmit={sendOtp} className="space-y-4" noValidate>
          <Field label="Full name" error={errors.name}>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Uttam Das" />
          </Field>
          <Field label="Mobile number" error={errors.phone}>
            <div className="flex">
              <span className="grid place-items-center rounded-l-2xl border border-r-0 border-line bg-surface-2 px-3 text-sm text-muted">+91</span>
              <input
                className="input rounded-l-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile"
              />
            </div>
          </Field>
          <button type="submit" className="btn btn-primary btn-lg w-full">
            Get OTP
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="size-3.5" aria-hidden="true" /> Your number is never shared with anyone.
          </p>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4" noValidate>
          <Field label="6-digit code" error={errors.otp}>
            <input
              className="input h-14 text-center font-display text-2xl tracking-[0.6em]"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              autoFocus
            />
          </Field>
          <p className="rounded-2xl bg-accent-soft px-4 py-2.5 text-sm text-accent-ink">Demo mode: any 6 digits will work.</p>
          <button type="submit" className="btn btn-primary btn-lg w-full">
            Verify & continue
          </button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="inline-flex items-center gap-1 text-muted hover:text-ink" onClick={() => setStep('phone')}>
              <ArrowLeft className="size-4" aria-hidden="true" /> Change number
            </button>
            {timer > 0 ? (
              <span className="text-muted">Resend in {timer}s</span>
            ) : (
              <button type="button" className="link" onClick={() => setTimer(30)}>
                Resend code
              </button>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Instant video consult                                               */
/* ------------------------------------------------------------------ */
const QUICK_CONCERNS = ['Fever', 'Cold & cough', 'Headache', 'Stomach pain', 'Skin rash', 'Follow-up']

function ConsultDialog({ doctorId, onClose }) {
  const { user, signIn, addBooking, toast } = useApp()
  const navigate = useNavigate()
  const doctor = getDoctor(doctorId ?? 'aisha-roy')
  const isInstant = !doctorId
  const [step, setStep] = useState('details')
  const [patient, setPatient] = useState(emptyPatient)
  const [errors, setErrors] = useState({})
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (step !== 'connecting') return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    const done = setTimeout(() => setStep('ready'), 4200)
    return () => {
      clearInterval(t)
      clearTimeout(done)
    }
  }, [step])

  const start = () => {
    const errs = validatePatient(patient, user)
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (!user) signIn({ name: patient.name.trim(), phone: patient.phone }, { seed: false })
    addBooking({
      doctorId: doctor.id,
      mode: 'video',
      at: new Date().toISOString(),
      fee: doctor.videoFee,
      reason: patient.reason.trim(),
      instant: true,
      ...patientFor(patient, user),
    })
    setSeconds(0)
    setStep('connecting')
  }

  if (step === 'connecting' || step === 'ready') {
    const ready = step === 'ready'
    return (
      <Modal title={ready ? 'Your doctor is ready' : 'Connecting you…'} onClose={onClose} size="sm">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="relative grid size-36 place-items-center">
            {!ready && (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <span className="absolute inset-4 animate-ping rounded-full bg-primary/25 [animation-delay:400ms]" />
              </>
            )}
            <Avatar name={doctor.name} size="xl" online={ready} />
          </div>
          <p className="mt-4 flex items-center gap-1 font-display text-lg font-semibold">
            {doctor.name} <Verified />
          </p>
          <p className="text-sm text-muted">{doctor.specialty}</p>
          {ready ? (
            <p className="mt-4 max-w-xs text-sm text-muted">Connected in {Math.max(seconds, 4)} seconds. Find a quiet, well-lit spot before joining.</p>
          ) : (
            <p className="mt-4 text-sm text-muted" aria-live="polite">
              Finding the next available doctor… <span className="font-mono font-semibold text-ink">0:{String(seconds).padStart(2, '0')}</span>
            </p>
          )}
          {ready && (
            <div className="mt-6 flex w-full flex-col gap-2">
              <button
                type="button"
                className="btn btn-primary btn-lg w-full"
                onClick={() => {
                  toast('Demo: the video call would open here', 'info')
                  onClose()
                }}
              >
                <Video className="size-5" aria-hidden="true" /> Join video call
              </button>
              <button
                type="button"
                className="btn btn-ghost w-full"
                onClick={() => {
                  onClose()
                  navigate('/bookings')
                }}
              >
                Join later from My Bookings
              </button>
            </div>
          )}
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title={isInstant ? 'Instant video consult' : 'Consult now'}
      subtitle={isInstant ? 'An on-duty General Physician joins in about 60 seconds.' : 'Start a video call right away.'}
      icon={Zap}
      onClose={onClose}
      size="lg"
      footer={
        <button type="button" className="btn btn-primary btn-lg w-full" onClick={start}>
          <Video className="size-5" aria-hidden="true" /> Pay {inr(doctor.videoFee)} & connect
        </button>
      }
    >
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
        <Avatar name={doctor.name} size="sm" online />
        <div className="min-w-0 grow">
          <p className="flex items-center gap-1 font-semibold">
            <span className="truncate">{isInstant ? 'Next available General Physician' : doctor.name}</span>
            {!isInstant && <Verified />}
          </p>
          <p className="truncate text-sm text-muted">{isInstant ? 'Avg. wait under 60 seconds · MBBS, verified' : `${doctor.specialty} · Online now`}</p>
        </div>
        <p className="font-semibold">{inr(doctor.videoFee)}</p>
      </div>

      <div className="mb-4">
        <p className="label">What’s bothering you?</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_CONCERNS.map((c) => {
            const active = patient.reason === c
            return (
              <button key={c} type="button" className={`chip ${active ? 'chip-active' : ''}`} aria-pressed={active} onClick={() => setPatient({ ...patient, reason: active ? '' : c })}>
                {c}
              </button>
            )
          })}
        </div>
      </div>

      <PatientFields value={patient} onChange={setPatient} user={user} errors={errors} />

      <ul className="flex-fill mt-5 gap-2 text-sm text-muted [--min:11rem]">
        {['Digital prescription', 'Free follow-up for 7 days', 'Full refund if not connected'].map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 shrink-0 text-accent-ink" aria-hidden="true" /> {t}
          </li>
        ))}
      </ul>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Symptom checker                                                     */
/* ------------------------------------------------------------------ */
function SymptomDialog({ initial = '', onClose }) {
  const { openDialog } = useApp()
  const navigate = useNavigate()
  const [text, setText] = useState(initial)
  const [result, setResult] = useState(() => (initial.trim() ? triage(initial) : null))

  const run = (e) => {
    e?.preventDefault()
    if (text.trim().length < 3) return
    setResult(triage(text))
  }

  const addChip = (c) => setText((t) => (t.trim() ? `${t.trim().replace(/[.,]$/, '')}, ${c.toLowerCase()}` : c))

  return (
    <Modal
      title="Symptom navigator"
      subtitle="Describe how you feel. We’ll suggest the right kind of doctor."
      icon={Bot}
      onClose={onClose}
      size="lg"
    >
      {!result ? (
        <form onSubmit={run} className="space-y-4">
          <label className="block">
            <span className="sr-only">Describe your symptoms</span>
            <textarea
              className="input h-32 resize-none py-3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Headache with blurry vision since yesterday"
              autoFocus
              maxLength={400}
            />
          </label>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted">Or tap to add</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_CHIPS.map((c) => (
                <button key={c} type="button" className="chip h-9 text-sm" onClick={() => addChip(c)}>
                  + {c}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={text.trim().length < 3}>
            Find the right doctor
          </button>
          <p className="text-center text-xs text-muted">Guidance only — not a diagnosis. In an emergency, call 108.</p>
        </form>
      ) : (
        <TriageResult
          text={text}
          result={result}
          onReset={() => setResult(null)}
          onBrowse={(s) => {
            onClose()
            navigate(`/doctors?specialty=${encodeURIComponent(s)}`)
          }}
          openDialog={openDialog}
        />
      )}
    </Modal>
  )
}

function TriageResult({ text, result, onReset, onBrowse, openDialog }) {
  if (result.level === 'crisis') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/40">
          <HeartHandshake className="size-8 text-rose-600 dark:text-rose-400" aria-hidden="true" />
          <h3 className="mt-3 font-display text-lg font-semibold">You don’t have to face this alone</h3>
          <p className="mt-1 text-sm text-ink/80">
            Talking to someone can help right now. Tele-MANAS is a free, confidential 24/7 mental-health helpline by the Government of India.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="tel:14416" className="btn bg-rose-600 text-white hover:bg-rose-700">
              <Phone className="size-4" aria-hidden="true" /> Call Tele-MANAS 14416
            </a>
            <a href="tel:112" className="btn btn-secondary">
              Emergency 112
            </a>
          </div>
        </div>
        <button type="button" className="btn btn-soft w-full" onClick={() => openDialog('consult', { doctorId: 'ananya-roy-choudhury' })}>
          Talk to a psychiatrist now
        </button>
        <button type="button" className="btn btn-ghost w-full" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" /> Start over
        </button>
      </div>
    )
  }

  if (result.level === 'emergency') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
          <Siren className="size-8 text-red-600 dark:text-red-400" aria-hidden="true" />
          <h3 className="mt-3 font-display text-lg font-semibold text-red-700 dark:text-red-300">This may be a medical emergency</h3>
          <p className="mt-1 text-sm text-ink/80">{result.why} Please don’t wait for an online consult — get help immediately.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="tel:108" className="btn btn-danger">
              <Phone className="size-4" aria-hidden="true" /> Call ambulance 108
            </a>
            <a href="tel:112" className="btn btn-secondary">
              Emergency 112
            </a>
          </div>
        </div>
        <button type="button" className="btn btn-ghost w-full" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" /> Describe different symptoms
        </button>
      </div>
    )
  }

  const spec = SPECIALTIES.find((s) => s.name === result.specialty)
  const Icon = specialtyIcon(result.specialty)
  const matches = doctors.filter((d) => d.specialty === result.specialty).slice(0, 3)
  const urgency =
    result.level === 'soon'
      ? { label: 'See a doctor today', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' }
      : { label: 'Not urgent — book at your convenience', cls: 'bg-accent-soft text-accent-ink' }

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-surface-2 px-4 py-3 text-muted">
        You said: <span className="text-ink">“{text.trim()}”</span>
      </p>
      <div className="rounded-2xl border border-primary/20 bg-primary-soft p-5">
        <span className={`badge ${urgency.cls}`}>
          <CircleAlert className="size-3.5" aria-hidden="true" /> {urgency.label}
        </span>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-surface text-primary-ink">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted">Recommended specialist</p>
            <p className="font-display text-xl font-semibold">{result.specialty}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink/80">{result.note ?? `${spec?.blurb}. A ${result.specialty} is the right first stop for what you described.`}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Available {result.specialty}s</p>
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {matches.map((d) => (
            <li key={d.id} className="flex items-center gap-3 p-3">
              <Avatar name={d.name} size="sm" online={d.video} />
              <div className="min-w-0 grow">
                <p className="truncate text-sm font-semibold">{d.name}</p>
                <p className="truncate text-xs text-muted">
                  ★ {d.rating} · {d.exp} yrs · {d.video ? `Video ${inr(d.videoFee)}` : `Clinic ${inr(d.clinicFee)}`}
                </p>
              </div>
              {d.video ? (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openDialog('consult', { doctorId: d.id })}>
                  Consult
                </button>
              ) : (
                <button type="button" className="btn btn-soft btn-sm" onClick={() => openDialog('book', { doctorId: d.id })}>
                  Book
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-fill gap-2 [--min:12rem]">
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" /> Start over
        </button>
        <button type="button" className="btn btn-soft" onClick={() => onBrowse(result.specialty)}>
          See all {result.specialty}s
        </button>
      </div>
      <p className="text-center text-xs text-muted">This is guidance, not a diagnosis. If symptoms get worse, seek care immediately.</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Prescription (sample)                                               */
/* ------------------------------------------------------------------ */
const RX = {
  Dermatologist: [
    ['Gentle foaming face wash', 'Twice daily'],
    ['Adapalene 0.1% gel', 'Thin layer at night on affected area'],
    ['Sunscreen SPF 30+', 'Every morning, reapply outdoors'],
  ],
  'Child Specialist': [
    ['Saline nasal drops', '2 drops each nostril, 3 times a day'],
    ['Warm fluids & rest', 'Plenty through the day'],
    ['Paracetamol syrup', 'Only if fever > 100°F, dose as per weight'],
  ],
  default: [
    ['Paracetamol 500 mg', '1 tablet if fever > 100°F, max 3 a day'],
    ['ORS', '1 glass after each loose motion / as needed'],
    ['Rest & hydration', 'Review if not better in 3 days'],
  ],
}

function PrescriptionDialog({ bookingId, onClose }) {
  const { bookings, toast } = useApp()
  const b = bookings.find((x) => x.id === bookingId)
  if (!b) return null
  const d = getDoctor(b.doctorId)
  const rx = RX[d.specialty] ?? RX.default
  return (
    <Modal
      title="Prescription"
      subtitle={`${whenLabel(new Date(b.at))} · ${b.id}`}
      icon={FileText}
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-primary w-full" onClick={() => toast('Demo: PDF download would start here', 'info')}>
          Download PDF
        </button>
      }
    >
      <div className="rounded-2xl border border-line p-4">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div>
            <p className="font-semibold">{d.name}</p>
            <p className="text-xs text-muted">{d.degrees}</p>
            <p className="text-xs text-muted">Reg. No. TMC/{d.id.length * 1371}</p>
          </div>
          <p className="font-display text-2xl font-semibold text-primary-ink">℞</p>
        </div>
        <div className="flex-fill gap-2 py-3 text-sm [--min:10rem]">
          <p>
            <span className="text-muted">Patient: </span>
            {b.patient}
          </p>
          <p>
            <span className="text-muted">Complaint: </span>
            {b.reason || 'General consultation'}
          </p>
        </div>
        <ol className="space-y-2">
          {rx.map(([m, how], i) => (
            <li key={m} className="flex gap-3 rounded-2xl bg-surface-2 p-3.5">
              <span className="font-semibold text-muted">{i + 1}.</span>
              <div>
                <p className="font-semibold">{m}</p>
                <p className="text-muted">{how}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">Sample prescription for demo purposes only.</p>
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Cancel booking                                                      */
/* ------------------------------------------------------------------ */
function CancelDialog({ bookingId, onClose }) {
  const { bookings, updateBooking, toast } = useApp()
  const b = bookings.find((x) => x.id === bookingId)
  if (!b) return null
  const d = getDoctor(b.doctorId)
  return (
    <Modal
      title="Cancel this appointment?"
      subtitle={`${d.name} · ${whenLabel(new Date(b.at))}`}
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>
            Keep it
          </button>
          <button
            type="button"
            className="btn btn-danger flex-1"
            onClick={() => {
              updateBooking(b.id, { status: 'cancelled' })
              toast('Appointment cancelled')
              onClose()
            }}
          >
            Yes, cancel
          </button>
        </div>
      }
    >
      <p className="text-sm text-muted">
        {b.mode === 'video' ? `Your payment of ${inr(b.fee)} will be refunded to the original method within 3–5 days.` : 'There is no charge for cancelling a clinic visit.'}{' '}
        You can also reschedule instead.
      </p>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* Account sheet (mobile)                                              */
/* ------------------------------------------------------------------ */
function AccountDialog({ onClose }) {
  const { user, signOut, toast, theme, setTheme, resetDemo } = useApp()
  const navigate = useNavigate()
  if (!user) return null
  const go = (to) => {
    onClose()
    navigate(to)
  }
  return (
    <Modal title={user.name} subtitle={`+91 ${user.phone}`} onClose={onClose} size="sm">
      <div className="space-y-2">
        <button type="button" className="btn btn-secondary w-full justify-start" onClick={() => go('/bookings')}>
          <CalendarCheck className="size-4" aria-hidden="true" /> My bookings
        </button>
        <button type="button" className="btn btn-secondary w-full justify-start" onClick={() => go('/plus')}>
          <Crown className="size-4" aria-hidden="true" /> Care Plus membership
        </button>
        <div className="pt-3">
          <p className="label">Appearance</p>
          <Segmented
            label="Theme"
            className="w-full"
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'Auto', icon: Monitor },
            ]}
          />
        </div>
        <div className="flex gap-2 pt-3">
          <button
            type="button"
            className="btn btn-secondary flex-1 text-red-600 dark:text-red-400"
            onClick={() => {
              signOut()
              toast('Signed out')
              onClose()
            }}
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
          <button
            type="button"
            className="btn btn-ghost flex-1"
            onClick={() => {
              resetDemo()
              toast('Demo data reset', 'info')
              onClose()
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Reset demo
          </button>
        </div>
      </div>
    </Modal>
  )
}
