interface VinylRecordProps {
  title?: string
  subTitle?: string
}

const Vinyl = ({ title = 'TITLE', subTitle = '● STEREO ●' }: VinylRecordProps) => {
  // Create the curved text path
  const createTextPath = (text: string, radius: number, startAngle: number) => {
    const characters = text.split('')
    const anglePerChar = 6 // degrees per character

    return characters.map((char, i) => {
      const angle = startAngle + i * anglePerChar
      const radians = (angle * Math.PI) / 180
      const x = Math.cos(radians) * radius
      const y = Math.sin(radians) * radius
      const rotation = angle + 90

      return (
        <text
          className="fill-primary font-display font-semibold text-[14px] tracking-[0.3em]"
          dominantBaseline="middle"
          key={i}
          textAnchor="middle"
          transform={`rotate(${rotation}, ${x}, ${y})`}
          x={x}
          y={y}
        >
          {char}
        </text>
      )
    })
  }

  return (
    <div className="relative">
      {/* Main vinyl record */}
      <div
        className="vinyl-record relative h-[640px] w-[640px] animate-spin-slow rounded-full"
        style={{
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Vinyl grooves - multiple rings */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Outer edge highlight */}
          <div className="absolute inset-0 rounded-full border-2 border-vinyl-shine/20" />

          {/* Groove rings */}
          {[...new Array(40)].map((_, i) => (
            <div
              className="absolute rounded-full border border-foreground/2"
              key={i}
              style={{
                inset: `${8 + i * 2.5}%`,
              }}
            />
          ))}

          {/* Subtle shine effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
            }}
          />
        </div>

        {/* SVG for curved title text on the edge */}
        <svg className="absolute inset-0 h-full w-full" viewBox="-250 -250 500 500">
          {/* Title text curved along the edge */}
          <g className="opacity-90">{createTextPath(title, 220, -60)}</g>

          {/* Additional decorative text on the opposite side */}
          <g className="opacity-60">{createTextPath(subTitle, 220, 120)}</g>
        </svg>

        {/* Reflection overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 180deg, transparent 0deg, rgba(255,255,255,0.02) 60deg, transparent 120deg)',
          }}
        />
      </div>
    </div>
  )
}

export default Vinyl
