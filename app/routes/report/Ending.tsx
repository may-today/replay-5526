import { useAtomValue } from 'jotai'
import { memo } from 'react'
import InfiniteGallery from '~/components/ui/3d-gallery-photography'
import { useReportBackground } from '~/hooks/useReportBackground'
import { usernameAtom } from '~/stores/app'
import Printer from './Printer'

const bgImageNameList = ['1', '2', '3', '4', '5', '6', '7', '8-1', '8-2', '9']

const Ending: React.FC = () => {
  const username = useAtomValue(usernameAtom)
  const { triggerReportBackground } = useReportBackground('star', 1)

  const handlePrintStart = () => {
    triggerReportBackground('star', 0.3)
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto p-6">
      <div className="absolute inset-0 z-0">
        <InfiniteGallery
          className="mask-b-from-20% h-full w-full"
          falloff={{ near: 0.8, far: 14 }}
          images={bgImageNameList.map(
            (name) => `${import.meta.env.VITE_STATIC_FILE_HOST}/cover/album/thumb/${name}.webp`
          )}
          speed={1.2}
          visibleCount={12}
          zSpacing={3}
        />
      </div>
      <div className="text-report-base opacity-50">
        <p>嗨，{username || ''}</p>
        <p>收下 2025 年的独家记忆</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-end">
        <Printer onPrintStart={handlePrintStart} />
      </div>
    </div>
  )
}

export default memo(Ending)
