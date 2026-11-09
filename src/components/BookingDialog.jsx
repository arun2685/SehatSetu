import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, CalendarCheck, CalendarDays, CircleCheck, MapPin, Moon, Sun, Sunrise, Video } from 'lucide-react'
import { Avatar, Modal, Segmented, Verified } from './ui'
import { PatientFields, emptyPatient, patientFor, validatePatient } from './PatientFields'
import { useApp } from '../lib/store'
import { getDoctor } from '../data/doctors'
import { addDays, fullDate, inr, relativeDay, slotsFor, startOfDay, whenLabel } from '../lib/time'

const PERIOD_ICON = { Morning: Sunrise, Afternoon: Sun, Evening: Moon }

export function BookingDialog({ doctorId, mode: initialMode, rescheduleId, onClose }) {
  const { user, bookings, signIn, addBooking, updateBooking, toast } = useApp()
  const navigate = useNavigate()
  const existing = rescheduleId ? bookings.find((b) => b.id === rescheduleId) : null
  const doctor = getDoctor(existing?.doctorId ?? doctorId)

  const [mode, setMode] = useState(existing?.mode ?? initialMode ?? (doctor.video ? 'video' : 'clinic'))
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startOfDay(), i)), [])
  const daySlots = useMemo(() => days.map((d) => slotsFor(doctor, d, mode)), [days, doctor, mode])
  const firstOpenDay = Math.max(0, daySlots.findIndex((s) => s.some((x) => x.available)))
  const [dayIdx, setDayIdx] = useState(firstOpenDay)
  const [slot, setSlot] = useState(null)
  const [step, setStep] = useState('slot')
  const [patient, setPatient] = useState(emptyPatient)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const fee = mode === 'video' ? doctor.videoFee : doctor.clinicFee
  const slots = daySlots[dayIdx]
  const groups = ['Morning', 'Afternoon', 'Evening'].map((p) => [p, slots.filter((s) => s.period === p)]).filter(([, s]) => s.length)

  const changeMode = (m) => {
    setMode(m)
    setSlot(null)
    setDayIdx(Math.max(0, days.findIndex((d) => slotsFor(doctor, d, m).some((s) => s.available))))
  }

  const confirm = () => {
    if (existing) {
      updateBooking(existing.id, { at: slot.at.toISOString(), mode, fee })
      toast(`Rescheduled to ${whenLabel(slot.at)}`)
      onClose()
      return
    }
    const errs = validatePatient(patient, user)
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (!user) signIn({ name: patient.name.trim(), phone: patient.phone }, { seed: false })
    const b = addBooking({
      doctorId: doctor.id,
      mode,
      at: slot.at.toISOString(),
      fee,
      reason: patient.reason.trim(),
      ...patientFor(patient, user),
    })
    setDone(b)
    setStep('done')
  }

  const title = existing ? 'Reschedule appointment' : step === 'done' ? 'Appointment confirmed' : 'Book an appointment'

  const footer =
    step === 'slot' ? (
      <div className="flex items-center gap-3">
        <div className="min-w-0 grow text-sm">
          {slot ? (
            <>
              <p className="truncate font-semibold">{whenLabel(slot.at)}</p>
              <p className="text-muted">{mode === 'video' ? 'Video consult' : 'Clinic visit'} · {inr(fee)}</p>
            </>
          ) : (
            <p className="text-muted">Pick a time slot</p>
          )}
        </div>
        <button type="button" className="btn btn-primary btn-lg" disabled={!slot} onClick={() => (existing ? confirm() : setStep('details'))}>
          {existing ? 'Confirm new time' : 'Continue'}
        </button>
      </div>
    ) : step === 'details' ? (
      <div className="flex gap-3">
        <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep('slot')} aria-label="Back to time slots">
          <ArrowLeft className="size-4" />
        </button>
        <button type="button" className="btn btn-primary btn-lg grow" onClick={confirm}>
          {mode === 'video' ? `Pay ${inr(fee)} & confirm` : 'Confirm booking'}
        </button>
      </div>
    ) : (
      <div className="flex gap-3">
        <button type="button" className="btn btn-secondary btn-lg flex-1" onClick={onClose}>
          Done
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg flex-1"
          onClick={() => {
            onClose()
            navigate('/bookings')
          }}
        >
          View my bookings
        </button>
      </div>
    )

  return (
    <Modal title={title} icon={step === 'done' ? undefined : CalendarDays} onClose={onClose} footer={footer} size="lg">
      {step !== 'done' && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
          <Avatar name={doctor.name} size="sm" />
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-semibold">
              <span className="truncate">{doctor.name}</span> <Verified />
            </p>
            <p className="truncate text-sm text-muted">
              {doctor.specialty} · {doctor.hospital}
            </p>
          </div>
        </div>
      )}

      {step === 'slot' && (
        <div className="space-y-5">
          <div>
            <p className="label">Consultation type</p>
            <Segmented
              label="Consultation type"
              className="w-full"
              value={mode}
              onChange={changeMode}
              options={[
                ...(doctor.video ? [{ value: 'video', label: `Video · ${inr(doctor.videoFee)}`, icon: Video }] : []),
                { value: 'clinic', label: `Clinic · ${inr(doctor.clinicFee)}`, icon: Building2 },
              ]}
            />
            {!doctor.video && <p className="mt-2 text-xs text-muted">This doctor sees patients in clinic only.</p>}
          </div>

          <div>
            <p className="label">Choose a day</p>
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6" role="radiogroup" aria-label="Day">
              {days.map((d, i) => {
                const open = daySlots[i].filter((s) => s.available).length
                const active = i === dayIdx
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={!open}
                    onClick={() => {
                      setDayIdx(i)
                      setSlot(null)
                    }}
                    className={`flex w-[4.75rem] shrink-0 flex-col items-center rounded-2xl border px-2 py-2.5 transition-colors disabled:opacity-40 ${
                      active ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface hover:border-primary/40'
                    }`}
                  >
                    <span className={`text-xs font-medium ${active ? 'opacity-90' : 'text-muted'}`}>
                      {i < 2 ? relativeDay(d) : d.toLocaleDateString('en-IN', { weekday: 'short' })}
                    </span>
                    <span className="font-display text-xl font-semibold">{d.getDate()}</span>
                    <span className={`text-xs font-medium ${active ? 'opacity-90' : open ? 'text-accent-ink' : 'text-muted'}`}>
                      {open ? `${open} slot${open > 1 ? 's' : ''}` : 'Full'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-muted">{fullDate(days[dayIdx])}</p>
            {groups.map(([period, list]) => {
              const Icon = PERIOD_ICON[period]
              return (
                <div key={period}>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                    <Icon className="size-4 text-muted" aria-hidden="true" /> {period}
                  </p>
                  <div className="grid-fill gap-2 [--min:5.75rem]" role="radiogroup" aria-label={`${period} slots`}>
                    {list.map((s) => {
                      const active = slot?.time === s.time
                      return (
                        <button
                          key={s.time}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={!s.available}
                          onClick={() => setSlot(s)}
                          className={`h-11 rounded-full border text-[0.9375rem] font-semibold transition-colors disabled:border-transparent disabled:bg-surface-2 disabled:text-muted/50 disabled:line-through ${
                            active ? 'border-primary bg-primary text-on-primary' : 'border-line hover:border-primary hover:text-primary-ink'
                          }`}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-line p-3 text-sm">
            <div className="icon-circle size-11">
              {mode === 'video' ? <Video className="size-5" /> : <Building2 className="size-5" />}
            </div>
            <div className="grow">
              <p className="font-semibold">{whenLabel(slot.at)}</p>
              <p className="text-muted">{mode === 'video' ? 'Video consult on SehatSetu' : `${doctor.area}, ${doctor.city}`}</p>
            </div>
            <button type="button" className="link text-sm" onClick={() => setStep('slot')}>
              Change
            </button>
          </div>

          <PatientFields value={patient} onChange={setPatient} user={user} errors={errors} />

          <div className="rounded-2xl bg-surface-2 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{mode === 'video' ? 'Consultation fee' : 'Doctor’s visiting fee'}</span>
              <span className="font-semibold">{inr(fee)}</span>
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-muted">Booking fee</span>
              <span className="font-semibold text-accent-ink">
                <s className="mr-1.5 font-normal text-muted">₹49</s>FREE
              </span>
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold">
              <span>{mode === 'video' ? 'Pay now' : 'Pay at clinic'}</span>
              <span>{inr(fee)}</span>
            </div>
          </div>
        </div>
      )}

      {step === 'done' && done && (
        <div className="pt-2 text-center">
          <div className="mx-auto grid size-16 animate-rise place-items-center rounded-full bg-accent-soft text-accent-ink">
            <CircleCheck className="size-9" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base text-muted">
            {done.patient === (user?.name ?? patient.name.trim()) ? 'You’re booked with' : `${done.patient} is booked with`}
          </p>
          <p className="font-display text-xl font-semibold">{doctor.name}</p>
          <div className="mx-auto mt-5 max-w-sm space-y-2.5 rounded-2xl border border-line p-4 text-left text-sm">
            <Row icon={CalendarCheck} label={whenLabel(new Date(done.at))} />
            <Row icon={mode === 'video' ? Video : MapPin} label={mode === 'video' ? 'Video consult — join from My Bookings' : `${doctor.hospital}, ${doctor.area}`} />
            <p className="border-t border-line pt-2.5 text-xs text-muted">
              Booking ID <span className="font-mono font-semibold text-ink">{done.id}</span> · Confirmation sent by SMS
            </p>
          </div>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">
            {mode === 'video'
              ? 'We’ll remind you 10 minutes before. Keep your phone’s camera and mic ready.'
              : 'Please reach 10 minutes early and show your booking ID at reception.'}
          </p>
        </div>
      )}
    </Modal>
  )
}

function Row({ icon: Icon, label }) {
  return (
    <p className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" /> <span>{label}</span>
    </p>
  )
}
