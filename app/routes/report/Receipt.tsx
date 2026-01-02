import { useAtomValue } from 'jotai'
import { forwardRef, useMemo } from 'react'
import receiptLogo from '~/assets/5525.png'
import { getPageData as getAttendedStat2Data } from '~/components/reports/AttendedStat2'
import { getPageData as getCityStatData } from '~/components/reports/CityStat'
import { getPageData as getEncoreBallStatData } from '~/components/reports/EncoreBallStat'
import { getPageData as getGuestStatData } from '~/components/reports/GuestStat'
import { getPageData as getRandomSongStat3Data } from '~/components/reports/RandomSongStat3'
import { ballColorMap } from '~/data/ballColor'
import type { Concert, ConcertSelectType } from '~/data/types'
import { cityPlaceMap } from '~/lib/data'
import { getConcertTitleByDate, removeYearFromDate } from '~/lib/format'
import {
  selectedConcertDateTypeMapAtom,
  selectedConcertDetailsAtom,
  selectedCoordAtom,
  selectedRandomSongStat3IndexAtom,
  usernameAtom,
} from '~/stores/app'

interface ReceiptItem {
  no: number
  item: string
  date: string
}

interface ReceiptStat {
  icon: string
  text: string
}

export interface ReceiptData {
  title: string
  stats: ReceiptStat[]
  items: ReceiptItem[]
  totals: { label: string; value: string }[]
  highlight: string
  footerText: string
}

const getPageData = (options: {
  selectedConcertDetails: Concert[]
  selectedConcertDateTypeMap: Record<string, ConcertSelectType>
  selectedCoord: [number, number] | null
}) => {
  const { selectedConcertDetails, selectedConcertDateTypeMap, selectedCoord } = options
  const attendedStat2Data = getAttendedStat2Data({ selectedConcertDateTypeMap })
  const cityStatData = getCityStatData({ selectedConcertDetails, selectedCoord })
  const randomSongStat3Data = getRandomSongStat3Data({ selectedConcertDateTypeMap })
  const guestStatData = getGuestStatData({ selectedConcertDetails })
  const encoreBallStatData = getEncoreBallStatData({ selectedConcertDateTypeMap })
  return {
    selectConcertItemList: selectedConcertDetails.map((concert) => ({
      date: removeYearFromDate(concert.date),
      name: getConcertTitleByDate(concert.date),
      city: concert.city,
      cityIndex: concert.cityIndex,
      place: cityPlaceMap[concert.city.split('-')[0]],
    })),
    totalMinutes: attendedStat2Data.totalMinutes,
    allListenedCityList: cityStatData.allListenedCityList,
    allDistance: cityStatData.allDistance,
    selectedTopRandomSongList: randomSongStat3Data.selectedTopRandomSongList,
    selectedNicheRandomSongList: randomSongStat3Data.selectedNicheRandomSongList,
    allListenedGuestList: guestStatData.allListenedGuestList,
    listenedBallColorList: encoreBallStatData.listenedBallColorList,
  }
}

const Receipt = forwardRef<HTMLDivElement>((_, ref) => {
  const username = useAtomValue(usernameAtom)
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const selectedCoord = useAtomValue(selectedCoordAtom)
  const selectTopSongIndex = useAtomValue(selectedRandomSongStat3IndexAtom)
  const data = useMemo(
    () => getPageData({ selectedConcertDetails, selectedConcertDateTypeMap, selectedCoord }),
    [selectedConcertDetails, selectedConcertDateTypeMap, selectedCoord]
  )
  console.log('Receipt', data)

  return (
    <div
      className="receipt-font relative w-72 origin-bottom transform border-gray-200 border-x bg-white text-[10px] text-black shadow-2xl"
      ref={ref}
    >
      {/* Top Jagged Edge */}
      <div className="zigzag-border absolute top-0 left-0 h-2 w-full -translate-y-full transform" />

      <div className="flex flex-col items-stretch gap-1 px-6 py-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 py-3 text-center font-bold uppercase tracking-tighter">
          <img alt="logo" className="w-10" height={40} src={receiptLogo} width={40} />
          <h1>Replay 5525+1</h1>
        </div>
        {/* General Info */}
        <div className="border-black border-t border-dashed pt-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 truncate">NAME:{username}</div>
            <div>
              DATE:{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="mb-4 w-full space-y-1">
          {data.stats.map((stat, idx) => (
            <div className="flex items-center gap-2" key={idx}>
              <span className="text-base">{stat.icon}</span>
              <span>{stat.text}</span>
            </div>
          ))}
        </div> */}

        {/* Items Table */}
        <div>
          <div className="grid grid-cols-12 border-black border-y py-0.5 font-bold uppercase">
            <div className="col-span-3">DATE</div>
            <div className="col-span-3">CONCERT</div>
            <div className="col-span-6 text-right">PLACE</div>
          </div>
          {data.selectConcertItemList.map((item) => (
            <div
              className="grid grid-cols-12 items-center gap-4 border-black/5 border-b py-0.5 last:border-b-0"
              key={item.date}
            >
              <div className="col-span-3">{item.date}</div>
              <div className="col-span-3">{item.name}</div>
              <div className="col-span-6 text-right opacity-60">{item.place}</div>
            </div>
          ))}
        </div>

        <div className="border-black border-t border-dashed" />

        {/* Detail Info */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 truncate">观演场次:{data.selectConcertItemList.length}</div>
            <div className="flex-1 text-right">观演分钟数:{data.totalMinutes}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 truncate">观演城市:{data.allListenedCityList.length}</div>
            {data.allDistance > 0 && <div className="flex-1 text-right">奔波里程:{data.allDistance}km</div>}
          </div>
          <div>年度之最:《{data.selectedTopRandomSongList[selectTopSongIndex]}》</div>
          {data.selectedNicheRandomSongList.length > 0 && (
            <div>年度最小众:{data.selectedNicheRandomSongList.map((song) => `《${song}》`).join('、')}</div>
          )}
          {data.allListenedGuestList.length > 0 && <div>嘉宾:{data.allListenedGuestList.join('、')}</div>}
          {/* Encore Ball Info */}
          {data.listenedBallColorList.length > 1 && (
            <div className="my-1 flex flex-wrap">
              {data.listenedBallColorList.map((color) => (
                <div
                  className="relative h-1.5 flex-1"
                  key={color}
                  style={{
                    backgroundColor: ballColorMap[color],
                  }}
                >
                  {/* 老式打印机暗色遮罩 */}
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City Stamp Area */}
        {data.allListenedCityList.length > 0 && (
          <div className="h-32 bg-black/5">
            <div className="flex items-center justify-between gap-4">
              观演城市:{data.allListenedCityList.join('、')}
            </div>
          </div>
        )}

        {/* Footer */}
        {/* <div className="border-black border-t" /> */}
        <div className="flex justify-center pt-2">
          <p className="text-[9px] text-gray-400">Generated by Gemini AI • {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Bottom Jagged Edge */}
      <div className="zigzag-border-bottom h-2 w-full" />
    </div>
  )
})

export default Receipt
