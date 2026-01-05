import clsx from 'clsx'
import { useAtom, useAtomValue } from 'jotai'
import { RefreshCw } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { ScrollFadeEffect } from '~/components/ui/scroll-fade-effect'
import { SparklesText } from '~/components/ui/sparkles-text'
import type { ConcertSelectType } from '~/data/types'
import { useReportBackground } from '~/hooks/useReportBackground'
import { groupVariantsFast, itemVariants } from '~/lib/animated'
import { concertListMap } from '~/lib/data'
import { getConcertTitleByDate, getSeasonByDate, removeYearFromDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom, selectedRandomSongStat3IndexAtom } from '~/stores/app'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export const getPageData = (options: { selectedConcertDateTypeMap: Record<string, ConcertSelectType> }) => {
  const { selectedConcertDateTypeMap } = options
  /** 按场次统计的随机歌曲列表 */
  const randomSongListDict: Record<string, string[]> = Object.values(concertListMap).reduce(
    (acc, concert) => {
      // 点歌、安可、嘉宾五月天非固定歌单随机曲目合并后去重
      const songList = Array.from(
        new Set([...concert.requestSongList, ...concert.encoreSongList, ...(concert.guestRandomSongList || [])])
      )
      acc[concert.date] = songList
      return acc
    },
    {} as Record<string, string[]>
  )
  /** 所有场次的随机曲目原始列表 */
  const totalRandomSongRawList: string[] = Object.values(randomSongListDict).flat()
  /** 所有场次的随机曲目出现次数字典 */
  const totalRandomSongAmountMap = totalRandomSongRawList.reduce(
    (acc, song) => {
      acc[song] = (acc[song] || 0) + 1
      return acc
    },
    {} as Record<string, number>
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
  /** 个人听过的随机曲目出现次数字典 */
  const selectedRandomSongCountDict = selectedRandomSongRawList.reduce(
    (acc, song) => {
      acc[song] = (acc[song] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  /** 个人听过的随机曲目出现次数排序数组（降序） */
  const selectedRandomSongSortedEntries = Object.entries(selectedRandomSongCountDict).sort(([, a], [, b]) => b - a)
  /** 个人听过的随机曲目出现次数最多的歌曲列表 */
  const maxCount = Math.max(...Object.values(selectedRandomSongCountDict))
  const selectedTopRandomSongList = selectedRandomSongSortedEntries
    .filter(([, count]) => count === maxCount)
    .map(([song]) => song)
  /** 个人听过的随机曲目出现次数最多的场次列表字典 */
  const selectedTopRandomSongConcertListDict: Record<string, string[]> = {}
  for (const song of selectedTopRandomSongList) {
    selectedTopRandomSongConcertListDict[song] = selectedDates.filter((date) => randomSongListDict[date].includes(song))
  }
  /** （最小众）个人听过一次且只演唱过一次的随机曲目列表 */
  const selectedNicheRandomSongList = selectedRandomSongSortedEntries
    .filter(([song, count]) => count === 1 && totalRandomSongConcertListDict[song].length === 1)
    .map(([song]) => song)
  return {
    /** 所有场次的随机曲目出现次数字典（按出现次数排序） */
    totalRandomSongAmountMap,
    /** 所有场次的随机曲目场次列表字典 */
    totalRandomSongConcertListDict,
    /** 个人听过的随机曲目出现次数字典 */
    selectedRandomSongCountDict,
    /** 个人听过的随机曲目出现次数排序数组 */
    selectedRandomSongSortedEntries,
    /** 个人听过的随机曲目出现次数最多的歌曲列表 */
    selectedTopRandomSongList,
    /** 个人听过的随机曲目出现次数最多的场次列表字典 */
    selectedTopRandomSongConcertListDict,
    /** （最小众）个人听过一次且只演唱过一次的随机曲目列表 */
    selectedNicheRandomSongList,
  }
}

// 随机曲目统计（你的唯一）
const RandomSongStat3: React.FC = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData({ selectedConcertDateTypeMap }), [selectedConcertDateTypeMap])
  const [selectTopSongIndex, setSelectTopSongIndex] = useAtom(selectedRandomSongStat3IndexAtom)
  const [currentDetailSong, setCurrentDetailSong] = useState<string | null>(null)
  const selectTopSongConcertList = useMemo(
    () => data.selectedTopRandomSongConcertListDict[data.selectedTopRandomSongList[selectTopSongIndex]],
    [data, selectTopSongIndex]
  )
  console.log('RandomSongStat3', data)
  useReportBackground('star', 0.5)
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
    <div className="relative h-full overflow-hidden p-6 pb-2">
      <div className="flex h-full flex-1 flex-col space-y-4 overflow-hidden">
        <div>
          <Tooltip defaultOpen={true} open={data.selectedTopRandomSongList.length > 1 ? undefined : false}>
            <TooltipTrigger disabled={data.selectedTopRandomSongList.length === 1} onClick={handleChangeSelectTopSong}>
              <SparklesText className="text-4xl text-report-lg">
                {data.selectedTopRandomSongList[selectTopSongIndex]}
              </SparklesText>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-1" side="right">
              <RefreshCw size={12} strokeWidth={1} />
              不是TA？换一个
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="mx-0 mt-4 text-report-base">
          <p>
            在{getSeasonByDate(selectTopSongConcertList[0])}的 {removeYearFromDate(selectTopSongConcertList[0])}{' '}
            {getConcertTitleByDate(selectTopSongConcertList[0])} 第一次听到
          </p>
          <p>并在 {selectTopSongConcertList.length} 场演唱会中一次次重逢</p>
          {data.selectedNicheRandomSongList.length > 0 && (
            <>
              <p className="mx-0 mt-2 text-report-sm opacity-50!">
                另外，专属你的小众宝藏是{' '}
                {data.selectedNicheRandomSongList
                  .slice(0, 3)
                  .map((song) => `《${song}》`)
                  .join('')}
                {data.selectedNicheRandomSongList.length > 3 && `等${data.selectedNicheRandomSongList.length}首`}
              </p>
              <p className="mx-0 text-report-sm opacity-50!">今年只被唱过一次，恰好被幸运的你听见</p>
            </>
          )}
        </div>
        <ScrollFadeEffect className="flex-1">
          <motion.ul animate="visible" initial="hidden" variants={groupVariantsFast}>
            {data.selectedRandomSongSortedEntries.map(([song, amount]) => (
              <motion.li
                className="mx-0 flex items-center gap-2 border-white/10 border-b py-1 text-report-sm text-white/70 transition-colors last:border-b-0 hover:bg-white/10 active:bg-white/10"
                key={song}
                onClick={() => setCurrentDetailSong(song)}
                variants={itemVariants}
              >
                <div className="flex-1 truncate">{song}</div>
                {data.selectedRandomSongCountDict[song] === data.totalRandomSongAmountMap[song] && (
                  <div className="rounded-full bg-white/10 px-2 py-0.5 text-white/50 text-xs">全勤</div>
                )}
                <span>{amount}次</span>
              </motion.li>
            ))}
          </motion.ul>
        </ScrollFadeEffect>
        <p className="-translate-y-1/2 animate-flicker text-right text-white/30 text-xs">
          *你可以点击它们，查看你们之间的故事
        </p>
      </div>
      <Dialog onOpenChange={(open) => !open && setCurrentDetailSong(null)} open={!!currentDetailSong}>
        <DialogContent className="bg-background/60 backdrop-blur-sm">
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

export default memo(RandomSongStat3)
