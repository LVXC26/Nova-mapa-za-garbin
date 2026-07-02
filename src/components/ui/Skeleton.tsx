export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  )
}

export function PloviloKarticaSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <Skeleton className="h-48 rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </div>
    </div>
  )
}

export function CharterKarticaSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton className="h-1.5 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SkipperKarticaSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton className="h-2 rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProfilHeroSkeleton() {
  return (
    <div className="bg-[#0c2340] pt-12 pb-16 px-4">
      <div className="max-w-5xl mx-auto flex items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-2xl shrink-0 bg-white/20" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-32 bg-white/20" />
          <Skeleton className="h-8 w-64 bg-white/20" />
          <Skeleton className="h-4 w-48 bg-white/20" />
        </div>
      </div>
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

export function NovicaSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <Skeleton className="h-44 rounded-none rounded-t-2xl" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}
