import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Plovila za prodajo | Garbin',
  description: 'Jadrnice, motorni čolni, gumenjaki in katamarani. Filtriranje po tipu, ceni in dolžini.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
