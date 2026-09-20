'use client'

export default function Avatar({
  slikaUrl,
  ime,
  velikost = 40,
  bgClassName = 'bg-[#0c2340]/8',
  textClassName = 'text-[#0c2340]',
  className = '',
  objectFit = 'cover',
}: {
  slikaUrl?: string | null
  ime: string
  velikost?: number
  bgClassName?: string
  textClassName?: string
  className?: string
  // 'contain' za logotipe (npr. charter/skipper podjetja) — 'cover' bi
  // pogosto obrezal široke/pravokotne logotipe (npr. besedilne znamke) tako,
  // da postanejo neberljivi. Za osebne fotografije ostane privzeti 'cover'.
  objectFit?: 'cover' | 'contain'
}) {
  if (slikaUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slikaUrl}
        alt={ime}
        className={`rounded-full shrink-0 ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
        style={{ width: velikost, height: velikost }}
      />
    )
  }
  const inicialka = ime.trim()[0]?.toUpperCase() ?? '?'
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 ${bgClassName} ${textClassName} ${className}`}
      style={{ width: velikost, height: velikost, fontSize: velikost * 0.4 }}
    >
      {inicialka}
    </div>
  )
}
