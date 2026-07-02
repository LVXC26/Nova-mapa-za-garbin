import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Skiperji | Garbin',
  description: 'Preverjeni skiperji za varno in udobno plovbo po Jadranu.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
