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
  return `${concert.city}D${concert.cityIndex}`
}

export const getConcertTitleByDate = (date: string): string => {
  const concert = concertListMap[date]
  return formatConcertTitle(concert)
}
