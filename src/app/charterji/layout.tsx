import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Charter podjetja | Garbin',
  description: 'Preverjena charter podjetja in zasebniki za najem plovil na Jadranu.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
