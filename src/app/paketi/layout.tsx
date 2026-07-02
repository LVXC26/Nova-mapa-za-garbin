import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Paketi in cene | Garbin',
  description: 'Transparentni paketi za charterje, skiperje in prodajalce plovil.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
