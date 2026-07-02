import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ZemljevidMap from '@/components/zemljevid/ZemljevidMap'

export default function ZemljevidPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <ZemljevidMap />
      </main>
      <Footer />
    </>
  )
}
