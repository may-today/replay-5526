import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import type { ConcertSelectType } from '~/data/types'
import { concertListMap } from '~/lib/data'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { groupVariants, itemVariants } from './animated'

const getPageData = (selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  /** 按场次统计的特殊歌曲列表 */
  const specialSongListDict: Record<string, string[]> = Object.values(concertListMap).reduce(
    (acc, concert) => {
      acc[concert.date] = concert.specialSongList
      return acc
    },
    {} as Record<string, string[]>
  )
  /** 所有场次的特殊歌曲列表（去重） */
  const totalSpecialSongList: string[] = Array.from(new Set(Object.values(specialSongListDict).flat()))
  /** 总特殊歌曲数量 */
  const totalSpecialSongAmount = totalSpecialSongList.length

  /** 个人选择的场次 */
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  /** 个人听过的特殊歌曲列表（去重） */
  const selectedSpecialSongList: string[] = Array.from(
    new Set(selectedDates.flatMap((date) => specialSongListDict[date] || []))
  )
  /** 个人听过的特殊歌曲数量 */
  const selectedSpecialSongAmount = selectedSpecialSongList.length
  return {
    /** 总特殊歌曲数量 */
    totalSpecialSongAmount,
    /** 个人听过的特殊歌曲列表 */
    selectedSpecialSongList,
    /** 个人听过的特殊歌曲数量 */
    selectedSpecialSongAmount,
  }
}

// 特殊歌曲统计
const SpecialSongStat: React.FC = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData(selectedConcertDateTypeMap), [selectedConcertDateTypeMap])

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="flex-1 space-y-4 p-6">
        <div className="text-right">
          <div className="text-report-base opacity-50">这一年</div>
          <div className="text-report-base opacity-50">
            <span>有 </span>
            <NumberTicker value={data.totalSpecialSongAmount} />
            <span> 首歌曲并非出自五月天</span>
          </div>
        </div>
        <motion.div animate="visible" initial="hidden" variants={groupVariants}>
          <motion.div className="text-report-base" variants={itemVariants}>
            <p>
              而你在现场听过 <NumberTicker className="text-report-lg" value={data.selectedSpecialSongAmount} /> 首
            </p>
            <p>让记忆多出几段意想不到的旋律</p>
          </motion.div>
          <motion.div className="mt-8 text-right text-report-base opacity-50!" variants={itemVariants}>
            <p>它们与那些熟悉的歌</p>
            <p>共同构成了这一年的回忆</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default memo(SpecialSongStat)
