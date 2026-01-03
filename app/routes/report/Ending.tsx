import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useState } from 'react'
import InfiniteGallery from '~/components/ui/3d-gallery-photography'
import { useReportBackground } from '~/hooks/useReportBackground'
import { usernameAtom } from '~/stores/app'
import Printer from './Printer'

const bgImageNameList = ['1', '2', '3', '4', '5', '6', '7', '8-1', '8-2', '9']

const Ending: React.FC = () => {
  const username = useAtomValue(usernameAtom)
  const { triggerReportBackground } = useReportBackground('star', 1)
  const [showGallery, setShowGallery] = useState(true)

  const handlePrintStart = () => {
    triggerReportBackground('star', 0.3)
    setShowGallery(false)
  }

  return (
    <div className="relative flex h-full flex-col overflow-y-auto p-6">
      <motion.div animate={{ opacity: showGallery ? 1 : 0 }} className="absolute inset-0 z-0" initial={{ opacity: 1 }}>
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
      </motion.div>
      <div className="relative z-10 text-report-base opacity-50">
        <p>嗨，{username || ''}</p>
        <p>收下 2025 年的独家记忆</p>
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-end">
        <Printer onPrintStart={handlePrintStart} />
      </div>
    </div>
  )
}

export default memo(Ending)
