'use client'

// Ista postavitev kot galerija na strani plovila: velika glavna slika + do
// 4 manjše sličice zraven, zadnja s "+N" prekritjem, če je slik več kot 5.
export default function GalerijaMreza({
  slike,
  alt,
  visina = 'h-72 sm:h-96',
  onSlikaClick,
}: {
  slike: string[]
  alt: string
  visina?: string
  onSlikaClick?: (indeks: number) => void
}) {
  if (slike.length === 0) return null

  if (slike.length === 1) {
    return (
      <div className={`rounded-xl overflow-hidden ${visina}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slike[0]}
          alt={alt}
          onClick={() => onSlikaClick?.(0)}
          className={`w-full h-full object-cover ${onSlikaClick ? 'cursor-pointer' : ''}`}
        />
      </div>
    )
  }

  const sličice = slike.slice(1, 5)
  const steviloSkritih = slike.length - 5
  const mrezaRazred = sličice.length === 2 ? 'grid-cols-1 grid-rows-2' : 'grid-cols-2 grid-rows-2'

  return (
    <div className={`grid grid-cols-4 gap-1.5 ${visina}`}>
      <div
        className={`col-span-4 sm:col-span-2 rounded-xl overflow-hidden relative group ${onSlikaClick ? 'cursor-pointer' : ''}`}
        onClick={() => onSlikaClick?.(0)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slike[0]}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <div className={`col-span-4 sm:col-span-2 grid ${mrezaRazred} gap-1.5`}>
        {sličice.map((url, i) => {
          const zadnja = i === sličice.length - 1
          return (
            <div
              key={i}
              className={`rounded-lg overflow-hidden relative group ${onSlikaClick ? 'cursor-pointer' : ''}`}
              onClick={() => onSlikaClick?.(i + 1)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${alt} ${i + 2}`}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              {zadnja && steviloSkritih > 0 && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white font-semibold">
                  +{steviloSkritih}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
