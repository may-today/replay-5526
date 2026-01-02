import { useAtomValue } from 'jotai'
import { memo } from 'react'
import { usernameAtom } from '~/stores/app'
import Printer from './Printer'

const Ending: React.FC = () => {
  const username = useAtomValue(usernameAtom)

  return (
    <div className="relative flex h-full flex-col overflow-y-auto p-6">
      <div className="text-report-base opacity-50">
        <p>嗨，{username || ''}</p>
        <p>收下 2025 年的独家记忆</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-end">
        <Printer />
      </div>
    </div>
  )
}

export default memo(Ending)
