import { useState } from 'react'
import BaseInformationForm from './BaseInformationForm'
import ConcertSelectForm from './ConcertSelectForm'
import Vinyl from './Vinyl'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState<'base' | 'concert'>('base')

  return (
    <div className="flex min-h-screen flex-col items-center justify-stretch overflow-hidden">
      {/* Background effect */}
      <div className="pointer-events-none fixed inset-0">
        <section className="flex h-1/2 flex-col items-center justify-center bg-linear-to-t from-[#ebebeb] to-[#dadada] font-semibold text-black sm:h-[500px] 2xl::h-[600px] dark:from-gray-950 dark:to-gray-800 dark:text-white">
          <div className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[35px_34px]" />
        </section>
        <div
          className="absolute inset-0 bg-[url('https://www.ui-layouts.com/noise.gif')] content-['']"
          style={{ opacity: 0.05 }}
        />
        <div
          className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(38, 70%, 50%, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Title */}
      {/* <section className="flex h-1/2 flex-col items-center justify-center bg-linear-to-t from-[#ebebeb] to-[#dadada] font-semibold text-black sm:h-[500px] 2xl::h-[600px] dark:from-gray-950 dark:to-gray-800 dark:text-white">
        <div className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[35px_34px]" />

        <h1 className="px-8 text-center font-semibold text-5xl leading-[120%] tracking-tight 2xl:text-7xl">
          Replay 5525+1
        </h1>
      </section> */}

      {/* Main content */}
      <main className="relative z-10 flex w-full flex-1 flex-col justify-start overflow-hidden px-8 py-12 md:py-20">
        {currentStep === 'base' && <BaseInformationForm onContinue={() => setCurrentStep('concert')} />}
        {currentStep === 'concert' && <ConcertSelectForm />}
      </main>

      {/* Footer */}
      <div className="-mb-[320px]">
        <Vinyl subTitle="● MAYDAY ●" title="REPLAY 5525+1" />
      </div>
    </div>
  )
}
