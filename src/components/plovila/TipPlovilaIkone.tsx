// Preprosto, enotno oblikovane črtne ilustracije za izbirnik tipa
// plovila (glej TipPlovilaIzbirnik.tsx). `currentColor` — barva sledi
// besedilu, zato se ob izbrani (temni) kartici sama obrne v belo.

type Props = { className?: string }

export function IkonaVsaPlovila({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M32 6v34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 12c6 0 10 3 10 3s-4 7-10 7-10-7-10-7 4-3 10-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 40h24l-3 8a3 3 0 0 1-2.8 2H25.8a3 3 0 0 1-2.8-2l-3-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 40c2.5 2.5 5.5 2.5 8 0s5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0 5.5 2.5 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function IkonaJadrnica({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M33 8v34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M33 10c8 3 12 12 12 20H33V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M31 22c-5 2-8 8-8 14h8V22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 42h32l-4 9a3 3 0 0 1-2.8 2H23.8a3 3 0 0 1-2.8-2l-4-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 42c2.5 2.5 5.5 2.5 8 0s5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0 5.5 2.5 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function IkonaMotorni({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M8 40h48c0 5-5 10-14 10H22c-9 0-14-5-14-10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 40 20 24c1-2 3-3 5-3h6v19" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M35 21h5c2 0 4 1 5 3l6 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 30h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 40c2.5 2.5 5.5 2.5 8 0s5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function IkonaJetSki({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M8 40c4-4 12-6 22-6s21 3 26 8c2 2 1 5-2 5H14c-4 0-8-3-6-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="27" cy="26" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M27 21.5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 15h6M27 15l7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 42c2.5 2.5 5.5 2.5 8 0s5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function IkonaGumenjak({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M12 34c0-4 4-6 6-6h28c2 0 6 2 6 6 0 5-4 9-9 9H21c-5 0-9-4-9-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 34v-9M46 34v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="24" y="27" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M46 38h5a3 3 0 0 1 0 6h-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 43c2.5 2.5 5.5 2.5 8 0s5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function IkonaKatamaran({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M32 6v28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 9c6 3 8 10 8 15H32V9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 36h10l-1.6 8.5a2 2 0 0 1-2 1.5h-2.8a2 2 0 0 1-2-1.5L11 36Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M43 36h10l-1.6 8.5a2 2 0 0 1-2 1.5h-2.8a2 2 0 0 1-2-1.5L43 36Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 36h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 32h28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <path d="M6 44c2.5 2.5 5.5 2.5 8 0s5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0 5.5 2.5 8 0 5.5-2.5 8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
