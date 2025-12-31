import { Activity, useEffect, useState } from 'react'
// import AllListenedSongsStat from '~/components/reports/AllListenedSongsStat'
import AttendedStat from '~/components/reports/AttendedStat'
import AttendedStat2 from '~/components/reports/AttendedStat2'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel'

// import CityStat from '~/components/reports/CityStat'
// import EncoreSongStat from '~/components/reports/EncoreSongStat'
// import GuestStat from '~/components/reports/GuestStat'
// import RainStat, { shouldShowRainStat } from '~/components/reports/RainStat'
// import RequestSongsStat from '~/components/reports/RequestSongsStat'
// import SpecialEventStat, { shouldShowSpecialEventStat } from '~/components/reports/SpecialEventStat'
// import TalkingStat, { shouldShowTalkingStat } from '~/components/reports/TalkingStat'
// import Ending from './Ending'

const Report: React.FC<{ username: string }> = ({ username }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)

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
    // 歌曲概览
    // AllListenedSongsStat,
    // CityStat,
    // RainStat: shouldShowRainStat(selectedConcertDetails, selectedConcertDateTypeMap) ? RainStat : null,
    // GuestStat,
    // RequestSongsStat,
    // EncoreSongStat,
    // SpecialEventStat: shouldShowSpecialEventStat(selectedConcertDetails) ? SpecialEventStat : null,
    // TalkingStat: shouldShowTalkingStat(selectedConcertDetails, selectedConcertDateTypeMap) ? TalkingStat : null,
    // Ending,
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Carousel className="flex h-full w-full flex-col" setApi={setApi}>
        <CarouselContent className="h-full">
          {Object.entries(slides)
            .filter(([_, Slide]) => !!Slide)
            .map(([key, Slide], index) => (
              <CarouselItem className="h-full select-none border-[0.5px] border-x" key={key}>
                {/* 当前页、前一页保持活跃状态 */}
                <Activity mode={index + 1 === currentIndex || index + 1 === currentIndex - 1 ? 'visible' : 'hidden'}>
                  <Slide focus />
                </Activity>
              </CarouselItem>
            ))}
        </CarouselContent>
        <footer className="flex h-16 shrink-0 items-center gap-2 border-t px-6">
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
