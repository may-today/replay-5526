import { useAtomValue } from 'jotai'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { Concert, ConcertSelectType } from '~/data/types'
import { getConcertTitleByDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom, selectedConcertDetailsAtom } from '~/stores/app'

const rainDateList = [
  '2025.01.01',
  '2025.04.18',
  '2025.05.23',
  '2025.05.24',
  '2025.07.25',
  '2025.08.02',
  '2025.08.08',
  '2025.09.19',
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

const getPageData = (
  selectedConcertDetails: Concert[],
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
) => {
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
    () => getPageData(selectedConcertDetails, selectedConcertDateTypeMap),
    [selectedConcertDetails, selectedConcertDateTypeMap]
  )
  console.log('RainStat', data)

  return (
    <div className="relative h-full p-4">
      <div className="absolute inset-0">
        {/* <Rain dropletColor="rgb(60, 60, 60)" dropletOpacity={0.8} numDrops={120} /> */}
      </div>
      <div className="mb-6 text-right text-report-base opacity-50">
        <p>2025 年的第一天</p>
        <p>「回到那一天」在雨声中启程。</p>
      </div>
      <div className="text-report-base">这一年，你和五月天一同淋过</div>
      <div className="text-report-base">
        <NumberTicker className="text-report-lg" value={data.listenedRainList.length} />
        <span>场雨</span>
        <div className="mt-2 text-right">
          {data.listenedRainList.map((concert) => (
            <div key={concert.date}>{/* <ConcertTitle className="text-report-lg" concert={concert} /> */}</div>
          ))}
        </div>
      </div>
      <div className="text-report-base">
        <p>{data.listenedRainList.length > 1 ? '它们分别落在' : '落在'}</p>
        <div className="mt-2 text-right">
          {data.listenedRainList.map((concert) => (
            <p className="text-report-lg" key={concert.date}>
              {getConcertTitleByDate(concert.date)}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(RainStat)
