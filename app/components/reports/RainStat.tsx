import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { Concert, ConcertSelectType } from '~/data/types'
import { useReportBackground } from '~/hooks/useReportBackground'
import { groupVariants, itemVariants } from '~/lib/animated'
import { getConcertTitleByDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom, selectedConcertDetailsAtom } from '~/stores/app'

const rainDateList = [
  '2025.01.01',
  '2025.04.18',
  '2025.05.23',
  '2025.07.25',
  '2025.08.02',
  '2025.08.08',
  '2025.09.19',
  '2025.09.21',
  '2025.09.23',
  '2025.10.17',
]

export const shouldShowRainStat = (
  selectedConcertDetails: Concert[],
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
) => {
  return selectedConcertDetails.some((concert) => isRainConcert(concert, selectedConcertDateTypeMap))
}

export const isRainConcert = (concert: Concert, selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  return rainDateList.includes(concert.date) && selectedConcertDateTypeMap[concert.date] !== 'seats'
}

const getPageData = (options: {
  selectedConcertDetails: Concert[]
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
}) => {
  const { selectedConcertDetails, selectedConcertDateTypeMap } = options
  const listenedRainList = selectedConcertDetails.filter((concert) =>
    isRainConcert(concert, selectedConcertDateTypeMap)
  )

  return {
    listenedRainList,
  }
}

const RainStat: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(
    () => getPageData({ selectedConcertDetails, selectedConcertDateTypeMap }),
    [selectedConcertDetails, selectedConcertDateTypeMap]
  )
  console.log('RainStat', data)
  useReportBackground('rain')

  return (
    <div className="relative h-full p-4">
      <header className="mb-6 text-right text-report-base opacity-50">
        <p>2025 年的第一天</p>
        <p>「回到那一天」在雨声中启程。</p>
      </header>
      <div className="text-report-base">这一年，你和五月天一同淋过</div>
      <div className="text-report-base">
        <NumberTicker className="text-report-lg" value={data.listenedRainList.length} />
        <span>场雨，落在</span>
      </div>
      <motion.div
        animate="visible"
        className="mt-2 space-y-2 text-right text-report-lg"
        initial="hidden"
        variants={groupVariants}
      >
        {data.listenedRainList.map((concert) => (
          <motion.p key={concert.date} variants={itemVariants}>
            {getConcertTitleByDate(concert.date)}
          </motion.p>
        ))}
      </motion.div>
    </div>
  )
}

export default memo(RainStat)
