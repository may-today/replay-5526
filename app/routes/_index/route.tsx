import Vinyl from './Vinyl'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function IndexPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Wood texture background */}
      <div
        className="wood-surface absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(180deg, hsl(25 30% 14%) 0%, hsl(25 25% 10%) 100%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 100px,
              rgba(0,0,0,0.03) 100px,
              rgba(0,0,0,0.03) 200px
            )
          `,
        }}
      />

      {/* Ambient light effect */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(38, 70%, 50%, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <header className="flex flex-col items-center justify-start">
        <div className="absolute top-[280px] -translate-y-full">
          <Vinyl subTitle="● MAYDAY ●" title="REPLAY 5525+1" />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-12 md:py-20">
        {/* Vinyl Record */}
        <div className="relative mb-12 md:mb-16" />
      </main>
    </div>
  )
}
