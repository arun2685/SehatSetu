import { Check, Crown, HeartPulse, ShieldCheck, Users, Zap } from 'lucide-react'
import { useApp } from '../lib/store'
import { PLANS } from '../data/content'
import { inr } from '../lib/time'

export default function Plus() {
  const { toast, user, openDialog } = useApp()
  const choose = (p) => {
    if (!user) return openDialog('signin')
    toast(`Demo: checkout for ${p.name} would open here`, 'info')
  }
  return (
    <div className="container-page pt-10 sm:pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="badge bg-blush text-amber-800 dark:text-amber-200">
          <Crown className="size-3.5" aria-hidden="true" /> SehatSetu Care Plus
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">One plan. Unlimited doctor consults for your family.</h1>
        <p className="mt-4 text-lg text-muted">Talk to a General Physician any time, at ₹0 per consult. Cancel anytime.</p>
      </div>

      <ul className="flex-fill mx-auto mt-10 max-w-4xl gap-3 [--min:11rem]">
        {[
          [Zap, 'Priority connect'],
          [Users, 'Up to 6 members'],
          [HeartPulse, 'Free health check-ups'],
          [ShieldCheck, 'No booking fees'],
        ].map(([Icon, t]) => (
          <li key={t} className="flex items-center justify-center gap-2 rounded-full bg-surface px-4 py-3 text-[0.9375rem] font-semibold shadow-soft">
            <Icon className="size-4 text-primary-ink" aria-hidden="true" /> {t}
          </li>
        ))}
      </ul>

      <div className="flex-fill mx-auto mt-12 max-w-5xl gap-5 [--min:17rem]">
        {PLANS.map((p) => (
          <section
            key={p.id}
            className={`relative flex flex-col rounded-[2rem] p-7 sm:p-8 ${
              p.popular ? 'border-2 border-primary/50 bg-surface shadow-lift' : 'card'
            }`}
          >
            {p.popular && <span className="badge absolute -top-3.5 left-6 bg-primary text-on-primary">Most popular</span>}
            <h2 className="font-display text-xl font-semibold">{p.name}</h2>
            <p className="text-muted">{p.members}</p>
            <p className="mt-5">
              <span className="font-display text-4xl font-semibold">{inr(p.price)}</span>
              <span className="text-muted"> / {p.period}</span>
            </p>
            {p.note && <p className="mt-1 text-sm font-semibold text-accent-ink">{p.note}</p>}
            <ul className="mt-6 grow space-y-3 text-base">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary-ink" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => choose(p)}
              className={`btn btn-lg mt-8 w-full ${p.popular ? 'btn-primary' : 'btn-soft'}`}
            >
              Choose {p.name.replace('Care Plus ', '')}
            </button>
          </section>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted">Prices include GST. Specialist consults are discounted, not free.</p>
    </div>
  )
}
