import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { geoCoordMap } from '~/data/geoCoord'
import type { Concert, ConcertSelectType, ReportBackground } from '~/data/types'
import { concertListMap } from '~/lib/data'

export const usernameAtom = atomWithStorage<string>('replay:username', '')
export const selectedProvinceAtom = atomWithStorage<string>('replay:selectedProvince', 'none')
export const selectedCoordAtom = atom<[number, number] | null>((get) => {
  const province = get(selectedProvinceAtom)
  return geoCoordMap[province] || null
})
export const selectedConcertDateTypeMapAtom = atomWithStorage<Record<string, ConcertSelectType>>(
  'replay:selectedConcertDateTypeMap',
  {}
)
/** 随机曲目之最自选 index */
export const selectedRandomSongStat3IndexAtom = atom(0)
/** 随报告进度更新的背景 */
export const selectedReportBackgroundAtom = atom<ReportBackground>({
  type: null,
  opacity: 1,
})

export const selectedConcertDetailsAtom = atom<Concert[]>((get) => {
  return Array.from(Object.keys(get(selectedConcertDateTypeMapAtom))).map((date) => concertListMap[date])
})
export const selectedNonOutdoorConcertDetailsAtom = atom<Concert[]>((get) => {
  const selectTypeMap = get(selectedConcertDateTypeMapAtom)
  return Object.keys(selectTypeMap)
    .filter((date) => selectTypeMap[date] !== 'outdoor')
    .map((date) => concertListMap[date])
})

export const setSelectedConcertDateAtom = atom(null, (get, set, date: string, selectType: ConcertSelectType) => {
  const data = get(selectedConcertDateTypeMapAtom)
  const newData = { ...data }

  if (selectType) {
    newData[date] = selectType
  } else {
    delete newData[date]
  }

  // sort by date
  const sortedDates = Object.keys(newData).sort((a, b) => parseDateToNumber(a) - parseDateToNumber(b))
  const sortedMap = sortedDates.reduce(
    (acc, date) => {
      acc[date] = newData[date]
      return acc
    },
    {} as Record<string, ConcertSelectType>
  )

  set(selectedConcertDateTypeMapAtom, sortedMap)
})

// 2024.05.24 -> 20240524
const parseDateToNumber = (date: string) => {
  return ~~date.replace(/\./g, '')
}
