import { useState } from 'react'
import NoiseBackground from '~/components/NoiseBackground'
import BaseInformationForm from './BaseInformationForm'
import ConcertSelectForm from './ConcertSelectForm'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState<'base' | 'concert'>('base')

  return (
    <div className="flex h-full flex-col items-center justify-stretch overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 to-gray-800" />
        <NoiseBackground />
      </div>

      {/* Main */}
      <main className="relative z-10 w-full flex-1 overflow-hidden">
        {currentStep === 'base' && <BaseInformationForm onContinue={() => setCurrentStep('concert')} />}
        {currentStep === 'concert' && <ConcertSelectForm />}
      </main>
    </div>
  )
}
