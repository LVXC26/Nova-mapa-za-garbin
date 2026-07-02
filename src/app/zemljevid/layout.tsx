import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Jadranski zemljevid | Garbin',
  description: 'Interaktivni zemljevid marin, otokov, restavracij in nevarnih con na Jadranu.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
