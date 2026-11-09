import { Segmented } from './ui'

export const emptyPatient = { who: 'self', name: '', phone: '', patientName: '', relation: 'Father', reason: '' }

const PHONE_RE = /^[6-9]\d{9}$/

export function validatePatient(p, user) {
  const errors = {}
  if (!user) {
    if (p.name.trim().length < 2) errors.name = 'Please enter your full name'
    if (!PHONE_RE.test(p.phone)) errors.phone = 'Enter a valid 10-digit mobile number'
  }
  if (p.who === 'other' && p.patientName.trim().length < 2) errors.patientName = 'Please enter the patient’s name'
  return errors
}

/** Returns { patient, relation } for the booking record. */
export function patientFor(p, user) {
  const self = user?.name ?? p.name.trim()
  return p.who === 'self' ? { patient: self, relation: 'Self' } : { patient: p.patientName.trim(), relation: p.relation }
}

export function PatientFields({ value: p, onChange, user, errors = {}, showReason = true }) {
  const set = (patch) => onChange({ ...p, ...patch })
  return (
    <div className="space-y-4">
      <div>
        <p className="label">Who is this appointment for?</p>
        <Segmented
          label="Patient"
          className="w-full"
          value={p.who}
          onChange={(who) => set({ who })}
          options={[
            { value: 'self', label: 'Myself' },
            { value: 'other', label: 'Someone else' },
          ]}
        />
      </div>

      {!user && (
        <div className="flex-fill gap-3 [--min:14rem]">
          <Field label="Your full name" error={errors.name}>
            <input className="input" value={p.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" placeholder="e.g. Uttam Das" />
          </Field>
          <Field label="Mobile number" error={errors.phone}>
            <div className="flex">
              <span className="grid place-items-center rounded-l-2xl border border-r-0 border-line bg-surface-2 px-3 text-sm text-muted">+91</span>
              <input
                className="input rounded-l-none"
                value={p.phone}
                onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98XXXXXX10"
              />
            </div>
          </Field>
          <p className="-mt-1 basis-full! text-sm text-muted">We’ll create your SehatSetu account and send booking updates to this number.</p>
        </div>
      )}

      {p.who === 'other' && (
        <div className="flex-fill gap-3 [--min:10rem]">
          <Field label="Patient’s name" error={errors.patientName} className="grow-[2]!">
            <input className="input" value={p.patientName} onChange={(e) => set({ patientName: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Relation">
            <select className="input" value={p.relation} onChange={(e) => set({ relation: e.target.value })}>
              {['Father', 'Mother', 'Spouse', 'Child', 'Sibling', 'Other'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {showReason && (
        <Field label="Reason for visit (optional)">
          <textarea
            className="input h-20 resize-none py-2.5"
            value={p.reason}
            onChange={(e) => set({ reason: e.target.value })}
            placeholder="e.g. Fever and cough since 2 days"
            maxLength={200}
          />
        </Field>
      )}
    </div>
  )
}

export function Field({ label, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}
