import { useAtomValue } from 'jotai'
import { Activity, useEffect, useState } from 'react'
import AttendedStat from '~/components/reports/AttendedStat'
import AttendedStat2 from '~/components/reports/AttendedStat2'
import CityStat from '~/components/reports/CityStat'
import EncoreBallStat from '~/components/reports/EncoreBallStat'
import GuestStat from '~/components/reports/GuestStat'
import RainStat, { shouldShowRainStat } from '~/components/reports/RainStat'
import RandomSongStat from '~/components/reports/RandomSongStat'
import RandomSongStat2 from '~/components/reports/RandomSongStat2'
import SpecialEventStat, { shouldShowSpecialEventStat } from '~/components/reports/SpecialEventStat'
import SpecialSongStat from '~/components/reports/SpecialSongStat'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'
import { selectedConcertDateTypeMapAtom, selectedConcertDetailsAtom } from '~/stores/app'

const Report: React.FC<{ username: string }> = ({ username }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  // 选择场次的数据，用于过滤不展示的报表页
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrentIndex(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const slides = {
    // 场次概览
    AttendedStat,
    // 场次概览2
    AttendedStat2,
    // 城市概览
    CityStat,
    // 下雨统计
    RainStat: shouldShowRainStat(selectedConcertDetails, selectedConcertDateTypeMap) ? RainStat : null,
    // 嘉宾统计
    GuestStat,
    // 随机歌曲统计
    RandomSongStat,
    // 随机曲目统计（你的唯一）
    RandomSongStat2,
    // 随机曲目统计（四宫格）
    // 特殊歌曲统计
    SpecialSongStat,
    // 结尾歌曲统计
    // 大球颜色统计
    EncoreBallStat,
    // 专属回忆
    SpecialEventStat: shouldShowSpecialEventStat(selectedConcertDetails) ? SpecialEventStat : null,
    // Talking 统计
    // 年度关键词
    // 小票打印机
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Carousel className="flex h-full w-full flex-col" opts={{ watchDrag: false }} setApi={setApi}>
        <CarouselContent className="h-full">
          {Object.entries(slides)
            .filter(([_, Slide]) => !!Slide)
            .map(([key, SlideComponent], index) => (
              <CarouselItem className="h-full select-none border-x-[0.5px]" key={key}>
                {/* 当前页、前一页保持活跃状态 */}
                <Activity mode={index + 1 === currentIndex || index + 1 === currentIndex - 1 ? 'visible' : 'hidden'}>
                  {SlideComponent ? <SlideComponent /> : null}
                </Activity>
              </CarouselItem>
            ))}
        </CarouselContent>
        <footer className="flex h-16 shrink-0 select-none items-center gap-2 border-t px-6">
          <div className="flex-1 text-muted-foreground/50 text-xs">
            <p>{username ? `${username} 的` : '我的'} 5525+1 年度报告</p>
            <p className="opacity-50">replay.mayday.land</p>
          </div>
          <CarouselPrevious className="translate-0 relative top-0 left-0" size="icon-lg" />
          <CarouselNext className="translate-0 relative top-0 left-0" size="icon-lg" />
        </footer>
      </Carousel>
    </div>
  )
}

export default Report
