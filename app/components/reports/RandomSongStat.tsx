import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { ConcertSelectType } from '~/data/types'
import { useReportBackground } from '~/hooks/useReportBackground'
import { groupVariants, itemVariants } from '~/lib/animated'
import { concertListMap } from '~/lib/data'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import RandomSongGridChart from '../RandomSongGridChart'

const getPageData = (options: { selectedConcertDateTypeMap: Record<string, ConcertSelectType> }) => {
  const { selectedConcertDateTypeMap } = options
  /** 总歌曲次数 */
  const totalSongTime = Object.values(concertListMap).reduce((acc, concert) => acc + concert.songAmount, 0)
  /** 按场次统计的随机歌曲列表 */
  const randomSongListDict: Record<string, string[]> = Object.values(concertListMap).reduce(
    (acc, concert) => {
      // 嘉宾曲目（需要和 specialSongList 做交集，因为嘉宾会唱五月天的歌）
      // const guestSpecialSongList = concert.guestSongList.filter((song) => concert.specialSongList.includes(song))
      // 和点歌、安可合并后去重
      const songList = Array.from(new Set([...concert.requestSongList, ...concert.encoreSongList]))
      acc[concert.date] = songList
      return acc
    },
    {} as Record<string, string[]>
  )
  /** 所有场次的随机曲目原始列表 */
  const totalRandomSongRawList: string[] = Object.values(randomSongListDict).flat()
  /** 所有场次的随机曲目出现次数字典（按出现次数排序） */
  const totalRandomSongAmountMap: Record<string, number> = Object.fromEntries(
    Object.entries(
      totalRandomSongRawList.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  /** 所有场次的随机曲目列表（去重） */
  const totalRandomSongList: string[] = Array.from(new Set(totalRandomSongRawList))
  /** 总随机歌曲数量 */
  const totalRandomSongAmount = totalRandomSongList.length
  /**
   * 总歌曲数量，计算方式为固定歌单（固定+一安）+ 总随机歌曲数量（去重）
   * 5525/5526 公共固定歌曲 开场部分 5 + 点歌前部分 3 + 点歌后部分 10
   * 5525 固定歌曲 19
   * 5526 固定歌曲 18
   * 嘉宾歌曲 26
   */
  const totalSongAmount = 55 + 26 + totalRandomSongAmount

  /** 个人选择的场次 */
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  /** 个人听过的随机曲目原始列表 */
  const selectedRandomSongRawList = selectedDates.flatMap((date) => randomSongListDict[date] || [])
  /** 个人听过的随机曲目出现次数字典（按出现次数排序） */
  const selectedRandomSongAmountMap: Record<string, number> = Object.fromEntries(
    Object.entries(
      selectedRandomSongRawList.reduce(
        (acc, song) => {
          acc[song] = (acc[song] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )
  /** 个人听过的随机曲目列表（去重） */
  const selectedRandomSongList: string[] = Array.from(new Set(selectedRandomSongRawList))
  /** 个人听过的随机曲目数量 */
  const selectedRandomSongAmount = selectedRandomSongList.length
  return {
    /** 总歌曲次数 */
    totalSongTime,
    /** 总歌曲数量 */
    totalSongAmount,
    /** 随机歌曲数量 */
    totalRandomSongAmount,
    /** 总随机歌曲出现次数字典 */
    totalRandomSongAmountMap,
    /** 个人听过的随机曲目 */
    selectedRandomSongList,
    /** 个人听过的随机曲目数量 */
    selectedRandomSongAmount,
    /** 个人听过的随机曲目出现次数字典 */
    selectedRandomSongAmountMap,
  }
}

// 随机歌曲统计
const RandomSongStat: React.FC = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData({ selectedConcertDateTypeMap }), [selectedConcertDateTypeMap])
  console.log('RandomSongStat', data)
  useReportBackground(null)

  return (
    <div className="relative h-full">
      <div className="mask-t-from-40% pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <RandomSongGridChart amountMap={data.totalRandomSongAmountMap} highlightedIds={data.selectedRandomSongList} />
      </div>
      <div className="relative z-10 h-full w-full space-y-4 overflow-y-auto p-6">
        <header className="text-right text-report-base opacity-50">
          <p>这一年</p>
          <p>
            <span>共演唱了 </span>
            <NumberTicker value={data.totalSongTime} />
            <span> 次，</span>
            <NumberTicker value={data.totalSongAmount} />
            <span> 首歌曲</span>
          </p>
          <p>
            <span>其中 </span>
            <NumberTicker value={data.totalRandomSongAmount} />
            <span> 首是那些不期而遇</span>
          </p>
          <p>来自于点歌、安可的随机曲目</p>
        </header>
        <motion.div animate="visible" initial="hidden" variants={groupVariants}>
          <motion.p className="text-report-base" variants={itemVariants}>
            你听过 <NumberTicker className="text-report-lg" value={data.selectedRandomSongAmount} /> 首随机曲目
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default memo(RandomSongStat)
