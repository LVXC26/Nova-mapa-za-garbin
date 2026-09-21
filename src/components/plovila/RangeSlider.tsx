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
  // Ko podano, se prikaz "format(low) – format(high)" zamenja z dvema
  // vnosnima poljema (npr. za ceno, kjer je drsnik prepocasen za velike
  // razpone) — parse pretvori vpisano besedilo nazaj v enoto drsnika
  // (za ceno gre pri tem za indeks v CENA_VALUES, ne za € znesek).
  parse?: (text: string) => number | null
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
  parse,
}: RangeSliderProps) {
  const pLow = ((low - min) / (max - min)) * 100
  const pHigh = ((high - min) / (max - min)) * 100

  function commit(text: string, meja: 'low' | 'high') {
    if (!parse) return
    const v = parse(text)
    if (v === null || Number.isNaN(v)) return
    const zamejeno = Math.min(max, Math.max(min, v))
    if (meja === 'low') onChange(Math.min(zamejeno, high), high)
    else onChange(low, Math.max(zamejeno, low))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3 gap-2">
        <span className={`text-sm font-semibold shrink-0 ${light ? 'text-white' : 'text-[#0c2340]'}`}>{label}</span>
        {parse ? (
          <div className="flex items-center gap-1">
            <input
              key={`low-${low}`}
              type="text"
              defaultValue={format(low)}
              onBlur={(e) => commit(e.target.value, 'low')}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
              className={`w-[4.5rem] px-1.5 py-0.5 rounded-md text-xs text-right tabular-nums bg-transparent border focus:outline-none ${
                light
                  ? 'border-white/20 text-white focus:border-[#c9a84c]'
                  : 'border-gray-200 text-gray-600 focus:border-[#c9a84c]'
              }`}
            />
            <span className={`text-xs shrink-0 ${light ? 'text-white/40' : 'text-gray-300'}`}>–</span>
            <input
              key={`high-${high}`}
              type="text"
              defaultValue={format(high)}
              onBlur={(e) => commit(e.target.value, 'high')}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
              className={`w-[4.5rem] px-1.5 py-0.5 rounded-md text-xs text-right tabular-nums bg-transparent border focus:outline-none ${
                light
                  ? 'border-white/20 text-white focus:border-[#c9a84c]'
                  : 'border-gray-200 text-gray-600 focus:border-[#c9a84c]'
              }`}
            />
          </div>
        ) : (
          <span className={`text-sm tabular-nums ${light ? 'text-white/70' : 'text-gray-400'}`}>
            {format(low)} – {format(high)}
          </span>
        )}
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

        {/* Low input — invisible, captures events samo na svojem ročaju (glej .range-slider-input v globals.css) */}
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
          className="range-slider-input absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        {/* High input — invisible, captures events samo na svojem ročaju */}
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
          className="range-slider-input absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  )
}
