import { useState } from 'react'
import BaseInformationForm from './BaseInformationForm'
import ConcertSelectForm from './ConcertSelectForm'
import Vinyl from './Vinyl'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function IndexPage() {
  const [currentStep, setCurrentStep] = useState<'base' | 'concert'>('base')

  return (
    <div className="flex min-h-screen flex-col items-center justify-stretch overflow-hidden">
      {/* Ambient light effect */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(38, 70%, 50%, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Main content */}
      <main className="relative flex w-full flex-1 flex-col justify-start overflow-hidden px-8 py-12 md:py-20">
        {currentStep === 'base' && <BaseInformationForm onContinue={() => setCurrentStep('concert')} />}
        {currentStep === 'concert' && <ConcertSelectForm />}
        {/* <div className="w-full max-w-sm space-y-6">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold font-display text-2xl text-foreground text-shadow-gold md:text-3xl">
              开始你的旅程
            </h1>
            <p className="font-body text-muted-foreground">输入你的信息</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-body text-muted-foreground text-sm">你的名字</label>
              <Input
                className="h-12 border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary"
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入名字"
                type="text"
                value={name}
              />
            </div>

            <div className="space-y-2">
              <label className="font-body text-muted-foreground text-sm">你的城市</label>
              <Input
                className="h-12 border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary"
                onChange={(e) => setCity(e.target.value)}
                placeholder="请输入城市"
                type="text"
                value={city}
              />
            </div>
          </div>

          <Button
            className="group mt-8 h-12 w-full font-body text-base"
            disabled={!(name.trim() && city.trim())}
            onClick={handleContinue}
            style={{
              boxShadow: '0 10px 30px -10px hsla(38, 70%, 50%, 0.4)',
            }}
          >
            继续
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div> */}
      </main>

      {/* Footer */}
      <div className="-mb-[320px]">
        <Vinyl subTitle="● MAYDAY ●" title="REPLAY 5525+1" />
      </div>
    </div>
  )
}
