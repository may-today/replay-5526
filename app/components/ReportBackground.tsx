import { GrainGradient } from '@paper-design/shaders-react'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { ballColorMap } from '~/data/ballColor'
import { selectedConcertDateTypeMapAtom, selectedReportBackgroundAtom } from '~/stores/app'
import NoiseBackground from './NoiseBackground'
import { getPageData as getEncoreBallStatData } from './reports/EncoreBallStat'
import AuroraFlowShader from './ui/aurora-flow-shader'
import { StarsCanvas } from './ui/stars-canvas'

const ReportBackground: React.FC = () => {
  const selectedReportBackground = useAtomValue(selectedReportBackgroundAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const listenedBallColorList = useMemo(
    () => getEncoreBallStatData({ selectedConcertDateTypeMap }).listenedBallColorList,
    [selectedConcertDateTypeMap]
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {selectedReportBackground.type === 'star' && (
        <motion.div
          animate={{ opacity: selectedReportBackground.opacity, transition: { duration: 2 } }}
          className="h-full w-full"
          initial={{ opacity: 0 }}
        >
          <StarsCanvas className="h-full w-full" />
        </motion.div>
      )}
      {selectedReportBackground.type === 'ball' && (
        <motion.div
          animate={{ opacity: selectedReportBackground.opacity, transition: { duration: 2 } }}
          className="h-full w-full"
          initial={{ opacity: 0 }}
        >
          <GrainGradient
            className="h-full w-full"
            colorBack="#121212"
            colors={listenedBallColorList.slice(0, 7).map((color) => ballColorMap[color])}
            intensity={0.8}
            noise={0}
            scale={1.5}
            shape="wave"
            softness={1}
            speed={1}
          />
        </motion.div>
      )}
      {selectedReportBackground.type === 'aurora' && (
        <motion.div
          animate={{ opacity: selectedReportBackground.opacity, transition: { duration: 2 } }}
          className="h-full w-full"
          initial={{ opacity: 0 }}
        >
          <AuroraFlowShader amplitude={0.5} className="h-full w-full" frequency={5} />
        </motion.div>
      )}
      {selectedReportBackground.type === 'rain' && (
        <motion.div
          animate={{ opacity: selectedReportBackground.opacity, transition: { duration: 2 } }}
          className="h-full w-full"
          initial={{ opacity: 0 }}
        >
          <video
            autoPlay
            className="mask-t-from-40% h-full w-full object-cover opacity-50"
            loop
            muted
            playsInline
            src={`${import.meta.env.VITE_STATIC_FILE_HOST}/5526-assets/rain.mp4`}
          />
        </motion.div>
      )}
      <NoiseBackground opacity={0.03} />
    </div>
  )
}

export default ReportBackground
