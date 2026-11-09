import { useEffect, useId, useRef } from 'react'
import { BadgeCheck, Star, X } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

export function Logo({ className = 'h-8', light = false }) {
  if (light) return <img src={`${BASE}logo-light.png`} alt="SehatSetu" className={`${className} w-auto`} />
  return (
    <>
      <img src={`${BASE}logo.png`} alt="SehatSetu" className={`${className} w-auto dark:hidden`} />
      <img src={`${BASE}logo-light.png`} alt="SehatSetu" className={`${className} hidden w-auto dark:block`} />
    </>
  )
}

const TINTS = [
  'bg-[#e3f0e8] text-[#2a6a4c] dark:bg-[#1f3329] dark:text-[#a9dcbc]',
  'bg-[#f3ead9] text-[#7a5a2b] dark:bg-[#2c271d] dark:text-[#e5cfa5]',
  'bg-[#e2eef3] text-[#2e6377] dark:bg-[#1b2b31] dark:text-[#a9d2e1]',
  'bg-[#f6e6e1] text-[#8a4a3c] dark:bg-[#2f2220] dark:text-[#ecbfb3]',
  'bg-[#ebe7f3] text-[#5a4b85] dark:bg-[#25222f] dark:text-[#c9bfe6]',
  'bg-[#e6f0ea] text-[#3d6b56] dark:bg-[#1c2d26] dark:text-[#b3d9c5]',
]

export const initials = (name) =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join('')
    .toUpperCase()

export function Avatar({ name, size = 'md', online = false, className = '' }) {
  const sizes = { sm: 'size-11 text-sm', md: 'size-14 text-lg', lg: 'size-20 text-2xl', xl: 'size-24 text-3xl' }
  const tint = TINTS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TINTS.length]
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className={`${sizes[size]} ${tint} grid place-items-center rounded-full font-display font-semibold`} aria-hidden="true">
        {initials(name)}
      </div>
      {online && (
        <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-surface bg-accent animate-pulse-ring" title="Online now" />
      )}
    </div>
  )
}

export function Rating({ value, count, className = '' }) {
  return (
    <span className={`relative inline-flex items-center gap-1 text-sm font-semibold text-ink ${className}`}>
      <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
      {value}
      {count != null && <span className="font-normal text-muted">({count})</span>}
      <span className="sr-only">out of 5 stars</span>
    </span>
  )
}

export const Verified = () => (
  <BadgeCheck className="size-[18px] shrink-0 fill-leaf-500 text-white dark:text-surface" aria-label="Verified doctor" />
)

export function SectionHeader({ eyebrow, title, subtitle, action, className = '' }) {
  return (
    <div className={`mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-10 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-2 text-lg text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Segmented({ value, onChange, options, className = '', label }) {
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex rounded-full bg-surface-2 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-semibold transition-colors ${
            value === o.value ? 'bg-surface text-primary-ink shadow-soft' : 'text-muted hover:text-ink'
          }`}
        >
          {o.icon && <o.icon className="size-4" aria-hidden="true" />}
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Accessible modal: bottom sheet on phones, centered card on larger screens. */
export function Modal({ onClose, title, subtitle, children, footer, size = 'md', icon: Icon }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  const titleId = useId()
  closeRef.current = onClose

  useEffect(() => {
    const prevFocus = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusables = () =>
      [...panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.disabled && el.offsetParent !== null,
      )
    // Focus the dialog itself so screen readers announce it; Tab then moves into the content.
    if (!panel.contains(document.activeElement)) panel.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
      } else if (e.key === 'Tab') {
        const els = focusables()
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [])

  const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-[rgb(24_36_31/0.32)] backdrop-blur-[2px] dark:bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full ${widths[size]} animate-rise flex-col rounded-t-[1.75rem] bg-surface text-ink shadow-lift outline-none sm:rounded-[1.75rem]`}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
        <div className="flex items-start gap-3 px-5 pt-4 pb-4 sm:px-7 sm:pt-7">
          {Icon && (
            <div className="icon-circle size-11">
              <Icon className="size-5" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0 grow">
            <h2 id={titleId} className="font-display text-xl font-semibold">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="icon-btn -mt-1 -mr-2 shrink-0" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="grow overflow-y-auto px-5 pb-6 sm:px-7">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">{footer}</div>}
      </div>
    </div>
  )
}

/** Close popovers on outside click / Escape. */
export function useDismiss(ref, open, setOpen) {
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, setOpen])
}

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="icon-circle mb-5 size-16">
        <Icon className="size-7" aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
