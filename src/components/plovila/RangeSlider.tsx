'use client'

interface RangeSliderProps {
  label: string
  min: number
  max: number
  low: number
  high: number
  step?: number
  onChange: (low: number, high: number) => void
  format?: (v: number) => string
  light?: boolean
}

export default function RangeSlider({
  label,
  min,
  max,
  low,
  high,
  step = 1,
  onChange,
  format = String,
  light = false,
}: RangeSliderProps) {
  const pLow = ((low - min) / (max - min)) * 100
  const pHigh = ((high - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm font-semibold ${light ? 'text-white' : 'text-[#0c2340]'}`}>{label}</span>
        <span className={`text-sm tabular-nums ${light ? 'text-white/70' : 'text-gray-400'}`}>
          {format(low)} – {format(high)}
        </span>
      </div>
      <div className="relative h-8 flex items-center select-none">
        {/* Track bg */}
        <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full ${light ? 'bg-white/20' : 'bg-gray-200'}`}>
          {/* Active track */}
          <div
            className="absolute h-full bg-[#c9a84c] rounded-full"
            style={{ left: `${pLow}%`, right: `${100 - pHigh}%` }}
          />
        </div>

        {/* Low thumb visual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#c9a84c] rounded-full shadow-md pointer-events-none z-10 transition-transform"
          style={{ left: `${pLow}%` }}
        />
        {/* High thumb visual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#c9a84c] rounded-full shadow-md pointer-events-none z-10 transition-transform"
          style={{ left: `${pHigh}%` }}
        />

        {/* Low input — invisible, captures events */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => {
            const v = +e.target.value
            if (v <= high) onChange(v, high)
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: pLow > 50 ? 5 : 3 }}
        />
        {/* High input — invisible, captures events */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => {
            const v = +e.target.value
            if (v >= low) onChange(low, v)
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ zIndex: pLow > 50 ? 3 : 5 }}
        />
      </div>
    </div>
  )
}
