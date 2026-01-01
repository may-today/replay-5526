import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { RefreshCw } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { ScrollFadeEffect } from '~/components/ui/scroll-fade-effect'
import type { ConcertSelectType } from '~/data/types'
import { concertListMap } from '~/lib/data'
import { getConcertTitleByDate, getSeasonByDate, removeYearFromDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { groupVariants, groupVariantsFast, itemVariants } from './animated'

const getPageData = (selectedConcertDateTypeMap: Record<string, ConcertSelectType>) => {
  /** 按场次统计的随机歌曲列表 */
  const randomSongListDict: Record<string, string[]> = Object.values(concertListMap).reduce(
    (acc, concert) => {
      // 点歌、安可合并后去重
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
  /** 所有场次的随机曲目场次列表字典 */
  const totalRandomSongConcertListDict: Record<string, string[]> = {}
  for (const song of Array.from(new Set(totalRandomSongRawList))) {
    totalRandomSongConcertListDict[song] = Object.entries(randomSongListDict)
      .filter(([, songList]) => songList.includes(song))
      .map(([date]) => date)
  }

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
  /** 个人听过的随机曲目出现次数最多的歌曲列表 */
  const selectedTopRandomSongList = Object.entries(selectedRandomSongAmountMap)
    .filter(([, count]) => count === Object.values(selectedRandomSongAmountMap)[0])
    .map(([song]) => song)
  /** 个人听过的随机曲目出现次数最多的场次列表字典 */
  const selectedTopRandomSongConcertListDict: Record<string, string[]> = {}
  for (const song of selectedTopRandomSongList) {
    selectedTopRandomSongConcertListDict[song] = selectedDates.filter((date) => randomSongListDict[date].includes(song))
  }
  return {
    /** 所有场次的随机曲目出现次数字典（按出现次数排序） */
    totalRandomSongAmountMap,
    /** 所有场次的随机曲目场次列表字典 */
    totalRandomSongConcertListDict,
    /** 个人听过的随机曲目出现次数字典 */
    selectedRandomSongAmountMap,
    /** 个人听过的随机曲目出现次数最多的歌曲列表 */
    selectedTopRandomSongList,
    /** 个人听过的随机曲目出现次数最多的场次列表字典 */
    selectedTopRandomSongConcertListDict,
  }
}

// 随机曲目统计（你的唯一）
const RandomSongStat2: React.FC = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData(selectedConcertDateTypeMap), [selectedConcertDateTypeMap])
  const [selectTopSongIndex, setSelectTopSongIndex] = useState(0)
  const [currentDetailSong, setCurrentDetailSong] = useState<string | null>(null)
  const selectTopSongConcertList = useMemo(
    () => data.selectedTopRandomSongConcertListDict[data.selectedTopRandomSongList[selectTopSongIndex]],
    [data, selectTopSongIndex]
  )
  /** 当前选中的歌曲的场次详情列表 */
  const currentDetailSongConcertDetailList: { date: string; type: string }[] = useMemo(() => {
    if (!currentDetailSong) {
      return []
    }
    return data.totalRandomSongConcertListDict[currentDetailSong].map((date) => {
      const concert = concertListMap[date]
      let type = '-'
      if (concert.requestSongList.includes(currentDetailSong)) {
        type = '点歌'
      } else if (concert.encoreSongList.includes(currentDetailSong)) {
        type = '安可'
      }
      return {
        date,
        type,
      }
    })
  }, [data, currentDetailSong])

  const handleChangeSelectTopSong = () => {
    setSelectTopSongIndex((selectTopSongIndex + 1) % data.selectedTopRandomSongList.length)
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div className="flex h-full flex-1 flex-col space-y-4 overflow-hidden p-6">
        <motion.div animate="visible" className="space-y-4" initial="hidden" variants={groupVariants}>
          <motion.div className="text-right">
            <div className="text-report-base opacity-50">这其中</div>
            <div className="text-report-base opacity-50">有一首是你的年度之最</div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Tooltip defaultOpen={true} open={data.selectedTopRandomSongList.length > 1 ? undefined : false}>
              <TooltipTrigger
                disabled={data.selectedTopRandomSongList.length === 1}
                onClick={handleChangeSelectTopSong}
              >
                <span className="text-4xl text-report-lg">{data.selectedTopRandomSongList[selectTopSongIndex]}</span>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-1" side="right">
                <RefreshCw size={12} strokeWidth={1} />
                不是TA？换一个
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </motion.div>
        <motion.div animate="visible" className="mt-4 space-y-2" initial="hidden" variants={groupVariants}>
          <motion.p className="text-report-base leading-tight" variants={itemVariants}>
            在{getSeasonByDate(selectTopSongConcertList[0])}的 {removeYearFromDate(selectTopSongConcertList[0])}{' '}
            {getConcertTitleByDate(selectTopSongConcertList[0])} 第一次听到
          </motion.p>
          <motion.p className="text-report-base leading-tight" variants={itemVariants}>
            并在 {selectTopSongConcertList.length} 场演唱会中一次次重逢
          </motion.p>
        </motion.div>
        <ScrollFadeEffect className="flex-1">
          <motion.ul animate="visible" initial="hidden" variants={groupVariantsFast}>
            {Object.entries(data.selectedRandomSongAmountMap).map(([song, amount]) => (
              <motion.li
                className="flex items-center gap-2 border-white/10 border-b py-1 text-report-sm text-white/70 transition-colors last:border-b-0 hover:bg-white/10 active:bg-white/10"
                key={song}
                onClick={() => setCurrentDetailSong(song)}
                variants={itemVariants}
              >
                <div className="flex-1 truncate">{song}</div>
                {data.selectedRandomSongAmountMap[song] === data.totalRandomSongAmountMap[song] && (
                  <div className="rounded-full bg-white/10 px-2 py-0.5 text-white/50 text-xs">全勤</div>
                )}
                <span>{amount}次</span>
              </motion.li>
            ))}
          </motion.ul>
        </ScrollFadeEffect>
        <p className="animate-flicker text-right text-white/30 text-xs">*你可以点击它们，查看你们之间的故事</p>
      </div>
      <Dialog onOpenChange={(open) => !open && setCurrentDetailSong(null)} open={!!currentDetailSong}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mx-0 text-report-base">{currentDetailSong}</DialogTitle>
            <DialogDescription>我与 TA 的相遇故事</DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto">
            <ul>
              {currentDetailSongConcertDetailList?.map((detail) => (
                <li
                  className={clsx([
                    'flex items-center justify-between gap-2 border-white/5 border-b py-1 last:border-b-0',
                    Object.keys(selectedConcertDateTypeMap).includes(detail.date) ? 'text-white' : 'text-white/30',
                  ])}
                  key={detail.date}
                >
                  <div className="text-base">
                    {detail.date} {getConcertTitleByDate(detail.date)}{' '}
                  </div>
                  <div className="text-sm opacity-50">{detail.type}</div>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default memo(RandomSongStat2)
