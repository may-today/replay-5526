import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import ReportBackground from '~/components/ReportBackground'
import { selectedConcertDateTypeMapAtom, usernameAtom } from '~/stores/app'
import Report from './Report'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function ReportPage() {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const selectedConcertDates = Object.keys(selectedConcertDateTypeMap)
  const username = useAtomValue(usernameAtom)
  const navigate = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedConcertDates.length === 0) {
      navigate('/')
    }
  }, [selectedConcertDates])

  if (selectedConcertDates.length === 0) {
    return null
  }
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Background */}
      <ReportBackground />

      {/* Main */}
      <Report username={username} />
    </div>
  )
}
