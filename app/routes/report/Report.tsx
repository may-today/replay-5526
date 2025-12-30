import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import AllListenedSongsStat from '~/components/reports/AllListenedSongsStat'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
// import AttendedStat from '~/components/reports/AttendedStat'
// import CityStat from '~/components/reports/CityStat'
// import EncoreSongStat from '~/components/reports/EncoreSongStat'
// import GuestStat from '~/components/reports/GuestStat'
// import RainStat, { shouldShowRainStat } from '~/components/reports/RainStat'
// import RequestSongsStat from '~/components/reports/RequestSongsStat'
// import SpecialEventStat, { shouldShowSpecialEventStat } from '~/components/reports/SpecialEventStat'
// import TalkingStat, { shouldShowTalkingStat } from '~/components/reports/TalkingStat'
// import Ending from './Ending'
import { selectedConcertDateTypeMapAtom, selectedConcertDetailsAtom } from '~/stores/app'

const Report: React.FC = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: false,
  })
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi?.canScrollPrev()) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi?.canScrollNext()) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) {
      return undefined
    }

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const slides = {
    // AttendedStat,
    AllListenedSongsStat,
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
      <Carousel className="flex h-full w-full flex-col">
        <CarouselContent className="h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem className="h-full" key={index}>
              <div className="p-1">
                <span className="font-semibold text-4xl">{index + 1}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <footer className="flex h-20 shrink-0 items-center justify-end gap-2 border-t-2 px-3">
          <CarouselPrevious className="translate-0 relative top-0 left-0" />
          <CarouselNext className="translate-0 relative top-0 left-0" />
        </footer>
      </Carousel>
      {/* <div className="flex-1 overflow-hidden bg-black1" ref={emblaRef}>
        <div className="flex h-full">
          {Object.entries(slides)
            .filter(([_, Slide]) => !!Slide)
            .map(([key, Slide], index) => (
              <div className="carousel-item" key={key}>
                <Freeze freeze={Math.abs(index - currentIndex) > 1}>
                  {Slide && <Slide focus={index === currentIndex} />}
                </Freeze>
              </div>
            ))}
        </div>
      </div>
      <div className="flex h-20 shrink-0 items-center justify-end gap-2 border-t-2 px-3">
        {selectedSnap !== 0 && selectedSnap !== snapCount - 1 && (
          <button
            className={clsx([
              'flex items-center justify-center',
              'h-14 cursor-pointer rounded-full px-4 text-lg',
              'border-2 border-black hover:bg-black hover:text-white',
            ])}
            onClick={scrollPrev}
            type="button"
          >
            <ArrowLeft />
          </button>
        )}
        {selectedSnap !== snapCount - 1 && (
          <button
            className={clsx([
              'flex items-center justify-center gap-2',
              'h-14 cursor-pointer rounded-full px-4 text-lg',
              'border-2 border-black hover:bg-black hover:text-white',
            ])}
            onClick={scrollNext}
            type="button"
          >
            <span>下一页</span>
            <ArrowRight strokeWidth={1.5} />
          </button>
        )}
      </div> */}
    </div>
  )
}

const useSelectedSnapDisplay = (
  emblaApi: EmblaCarouselType | undefined
): {
  selectedSnap: number
  snapCount: number
} => {
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const updateScrollSnapState = useCallback((emblaApi: EmblaCarouselType) => {
    setSnapCount(emblaApi.scrollSnapList().length)
    setSelectedSnap(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    updateScrollSnapState(emblaApi)
    emblaApi.on('select', updateScrollSnapState)
    emblaApi.on('reInit', updateScrollSnapState)
  }, [emblaApi, updateScrollSnapState])

  return {
    selectedSnap,
    snapCount,
  }
}

export default Report
