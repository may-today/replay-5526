import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import { InfiniteSlider } from '~/components/ui/infinite-slider'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { Concert } from '~/data/types'
import { concertListMap } from '~/lib/data'
import { selectedConcertDetailsAtom, selectedCoordAtom } from '~/stores/app'
import { groupVariants, itemVariants } from './animated'

const allCityAmountMap = Object.values(concertListMap).reduce(
  (acc, concert) => {
    acc[concert.city] = (acc[concert.city] || 0) + 1
    return acc
  },
  {} as Record<string, number>
)
const allCityCoordMap = {
  桃园: [121.3, 24.99],
  新加坡: [103.49, 1.21],
  悉尼: [151.12, -33.51],
  拉斯维加斯: [115.14, 36.17],
  天津: [117.2, 39.08],
  香港: [114.17, 22.32],
  杭州: [120.12, 30.16],
  哈尔滨: [126.64, 45.75],
  台北: [121.33, 25.02],
  北京: [116.36, 39.92],
  上海: [121.48, 31.22],
  '上海-2': [121.48, 31.22],
  贵阳: [106.42, 26.34],
  长沙: [112.58, 28.11],
  郑州: [113.38, 34.45],
  厦门: [118.1, 24.46],
  广州: [113.23, 23.16],
} as Record<string, [number, number]>

const getPageData = (selectedConcertDetails: Concert[], selectedCoord: [number, number] | null) => {
  const allListenedAmountMap = selectedConcertDetails.reduce(
    (acc, concert) => {
      acc[concert.city] = (acc[concert.city] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const allListenedCityList = Object.keys(allListenedAmountMap)
  const fullAttendedCityList = Object.entries(allListenedAmountMap)
    .filter(([city, amount]) => amount === allCityAmountMap[city])
    .map(([city]) => city)
  const listenedCityDistance = getListenedCityDistance(selectedCoord, allListenedCityList).sort(
    (a, b) => b.distance - a.distance
  )
  const homeCity = listenedCityDistance.filter((city) => city.distance < 150)
  const allDistance = listenedCityDistance.reduce((acc, city) => acc + city.distance, 0) * 2
  return {
    allListenedCityList,
    fullAttendedCityList,
    listenedCityDistance,
    homeCity,
    allDistance,
  }
}

const CityStat: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedCoord = useAtomValue(selectedCoordAtom)
  const data = useMemo(
    () => getPageData(selectedConcertDetails, selectedCoord),
    [selectedConcertDetails, selectedCoord]
  )
  console.log('CityStat', data)

  return (
    <div className="relative h-full w-full overflow-hidden py-4">
      <InfiniteSlider className="mt-12 ml-[-25%] w-[150%] rotate-6" reverse>
        {Object.keys(allCityAmountMap).map((city) => {
          return (
            <div
              className={clsx([
                'relative rounded-full px-6 py-3 text-6xl',
                'border-2 border-black',
                data.allListenedCityList.includes(city) ? 'bg-black text-white' : '',
              ])}
              key={city}
            >
              {city}
            </div>
          )
        })}
      </InfiniteSlider>
      <div className="absolute right-0 bottom-0 left-0 px-4 py-4">
        <motion.div animate="visible" initial="hidden" variants={groupVariants}>
          <motion.p className="text-report-base" variants={itemVariants}>
            这一年
          </motion.p>
          {data.allDistance > 100 ? (
            <>
              <motion.div className="text-report-base" variants={itemVariants}>
                <span>你在路途上留下了</span>
                <NumberTicker className="text-report-lg" value={data.allDistance} />
                <span>公里的轨迹</span>
              </motion.div>
              <motion.div className="text-report-base" variants={itemVariants}>
                <span>走过 {data.allListenedCityList.length} 座城市</span>
              </motion.div>
            </>
          ) : (
            <motion.div className="text-report-base" variants={itemVariants}>
              <span>今年你一共去了</span>
              <NumberTicker className="text-report-lg" value={data.allListenedCityList.length} />
              <span>个城市</span>
            </motion.div>
          )}
          {selectedCoord && data.listenedCityDistance.length > 1 && (
            <motion.div className="text-report-base" variants={itemVariants}>
              <span>最远的一次，奔赴</span>
              <NumberTicker className="text-report-lg" value={data.listenedCityDistance[0].distance} />
              <span>公里外的</span>
              <span className="text-report-base">{data.listenedCityDistance[0].city}</span>
            </motion.div>
          )}
          {selectedCoord && data.homeCity.length > 0 && (
            <motion.div className="text-report-base" variants={itemVariants}>
              <span>最近的一次，是在家门口的</span>
              <span className="text-report-lg">{data.homeCity.map((city) => `${city.city}站`).join('、')}</span>
            </motion.div>
          )}
          {data.fullAttendedCityList.length > 0 && (
            <motion.div className="text-report-base" variants={itemVariants}>
              <span>在</span>
              <span className="text-report-lg">{data.fullAttendedCityList.join('、')}</span>
              <span>全勤</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

const getDistance = ([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) => {
  const radLat1 = (lat1 * Math.PI) / 180.0
  const radLat2 = (lat2 * Math.PI) / 180.0
  const a = radLat1 - radLat2
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.sin(a / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) ** 2))
  s *= 6378.137
  s = Math.round(s * 10_000) / 10_000
  return s
}

export const getListenedCityDistance = (selectedCoord: [number, number] | null, cityList: string[]) => {
  return cityList
    .map((city) => {
      return {
        city,
        distance: selectedCoord ? getDistance(selectedCoord, allCityCoordMap[city]) : 0,
      }
    })
    .sort((a, b) => b.distance - a.distance)
}

export default memo(CityStat)
