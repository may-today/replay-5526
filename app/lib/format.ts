import type { Concert } from '~/data/types'
import { concertListMap } from './data'

export const convertHHmmToMinutes = (hhmm: number) => {
  const hours = Math.floor(hhmm / 100)
  const minutes = hhmm % 100
  return hours * 60 + minutes
}

export const convertHHmmToString = (hhmm: number) => {
  const hours = Math.floor(hhmm / 100) % 24
  const minutes = hhmm % 100
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const formatConcertTitle = (concert: Concert): string => {
  return `${concert.city.split('-')[0]}D${concert.cityIndex}`
}

export const getConcertTitleByDate = (date: string): string => {
  const concert = concertListMap[date]
  if (!concert) {
    return '--'
  }
  return formatConcertTitle(concert)
}

/**
 * 根据日期推算季节（初春、深冬等）
 * @param date 日期，格式为 YYYY.MM.DD
 */
export const getSeasonByDate = (date: string): string => {
  const [, monthStr, dayStr] = date.split('.')
  const month = Number.parseInt(monthStr, 10)
  const day = Number.parseInt(dayStr, 10)

  // 季节阶段映射表：每个月份对应两个阶段（20日之前和之后）
  const seasonMap: Record<number, [string, string]> = {
    1: ['冬天', '深冬'],
    2: ['深冬', '早春'],
    3: ['早春', '春天'],
    4: ['春天', '暮春'],
    5: ['暮春', '初夏'],
    6: ['初夏', '夏天'],
    7: ['夏天', '暮夏'],
    8: ['暮夏', '初秋'],
    9: ['初秋', '秋天'],
    10: ['秋天', '深秋'],
    11: ['深秋', '初冬'],
    12: ['初冬', '冬天'],
  }

  const [early, late] = seasonMap[month] ?? ['春天', '春天']
  return day <= 20 ? early : late
}

const yearPattern = /20\d{2}\./

export const removeYearFromDate = (date: string): string => {
  return date.replace(yearPattern, '')
}
