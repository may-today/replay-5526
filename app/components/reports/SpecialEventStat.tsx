import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { Play, X } from 'lucide-react'
import { memo, useMemo, useState } from 'react'
import { ScrollFadeEffect } from '~/components/ui/scroll-fade-effect'
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerTimeRange,
} from '~/components/VideoPlayer'
import { type SpecialEvent, specialEventList } from '~/data/specialEvent'
import type { Concert } from '~/data/types'
import { getConcertTitleByDate } from '~/lib/format'
import { selectedNonOutdoorConcertDetailsAtom } from '~/stores/app'

export const shouldShowSpecialEventStat = (selectedConcertDetails: Concert[]) => {
  const specialEventDateList = specialEventList.flatMap(([dates]) => dates)
  const selectedEventDateAmount = selectedConcertDetails.filter((concert) =>
    specialEventDateList.includes(concert.date)
  ).length
  return selectedEventDateAmount >= 1
}

const getPageData = (selectedConcertDetails: Concert[]) => {
  const listenedSpecialEventMap: Record<string, SpecialEvent[]> = {}
  const usedEventIndexes: Set<number> = new Set()

  for (const concert of selectedConcertDetails) {
    for (let i = 0; i < specialEventList.length; i++) {
      if (usedEventIndexes.has(i)) {
        continue
      }
      const [eventDates, eventItem] = specialEventList[i]
      if (eventDates.includes(concert.date)) {
        if (!listenedSpecialEventMap[concert.date]) {
          listenedSpecialEventMap[concert.date] = []
        }
        listenedSpecialEventMap[concert.date].push(eventItem)
        usedEventIndexes.add(i)
      }
    }
  }

  return {
    listenedSpecialEventMap,
  }
}

const SpecialEventStat: React.FC = () => {
  const selectedNonOutdoorConcertDetails = useAtomValue(selectedNonOutdoorConcertDetailsAtom)
  const data = useMemo(() => getPageData(selectedNonOutdoorConcertDetails), [selectedNonOutdoorConcertDetails])
  const [currentEvent, setCurrentEvent] = useState<SpecialEvent | null>(null)
  console.log('SpecialEventStat', data)

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="flex h-full flex-1 flex-col space-y-4">
        <div className="p-6 pb-2 opacity-50">
          <div className="text-report-base">有你在的每一场</div>
          <div className="text-report-base">一定都很特别</div>
        </div>
        <ScrollFadeEffect className="relative flex flex-1 items-center px-6" orientation="horizontal">
          <div className="flex w-max gap-4">
            {Object.entries(data.listenedSpecialEventMap).map(([date, events]) => (
              <>
                {events.map((event, eventIndex) => (
                  <SpecialEventItem
                    date={date}
                    event={event}
                    key={event.noteId}
                    onClick={() => setCurrentEvent(event)}
                    showHeader={eventIndex === 0}
                  />
                ))}
              </>
            ))}
            <SpecialEventEmptyItem />
          </div>
        </ScrollFadeEffect>
      </div>
      <AnimatePresence>
        {currentEvent && <VideoDialog currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />}
      </AnimatePresence>
    </div>
  )
}

const SpecialEventItem: React.FC<{
  date: string
  event: SpecialEvent
  showHeader?: boolean
  onClick: () => void
}> = ({ date, event, showHeader = true, onClick }) => {
  return (
    <div className="flex w-60 flex-col items-stretch gap-6">
      <div className={clsx(['flex h-16 flex-col items-start justify-end', showHeader ? 'opacity-100' : 'opacity-0'])}>
        <p className="text-sm opacity-50">{date}</p>
        <p>{getConcertTitleByDate(date)}</p>
      </div>
      <button
        className="relative flex h-[40vh] flex-col overflow-hidden rounded-xl bg-white/5 p-4"
        onClick={onClick}
        type="button"
      >
        <div className="absolute inset-0">
          <img
            alt={event.title}
            className="h-full w-full object-cover"
            height={160}
            src={`${import.meta.env.VITE_STATIC_FILE_HOST}/5526-events/${event.noteId}.webp`}
            width={160}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 to-black/50" />
        </div>
        <p className="z-10 flex-1 text-left text-2xl text-white/80">#{event.title}</p>
        <div className="z-10 flex items-center gap-3">
          <p className="flex-1 truncate text-left text-sm text-white/40">{event.noteDesc}</p>
          <Play className="opacity-50" fill="#fff" size={16} />
        </div>
      </button>
    </div>
  )
}

const SpecialEventEmptyItem: React.FC = () => {
  return (
    <div className="flex w-60 flex-col items-stretch gap-6">
      <div className="h-16" />
      <div className="relative flex h-[40vh] flex-col items-center justify-center rounded-xl bg-white/5 p-4 text-white/30">
        <p>还有更多故事</p>
        <p>等你续写</p>
      </div>
    </div>
  )
}

const VideoDialog: React.FC<{
  currentEvent: SpecialEvent
  setCurrentEvent: (event: SpecialEvent | null) => void
}> = ({ currentEvent, setCurrentEvent }) => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-background/50 backdrop-blur"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={() => setCurrentEvent(null)}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
        className="relative max-h-full max-w-full"
        exit={{
          clipPath: 'inset(43.5% 43.5% 33.5% 43.5% )',
          opacity: 0,
          transition: {
            duration: 1,
            type: 'spring',
            stiffness: 100,
            damping: 20,
            opacity: { duration: 0.2, delay: 0.8 },
          },
        }}
        initial={{ clipPath: 'inset(43.5% 43.5% 33.5% 43.5% )', opacity: 0 }}
        transition={{
          duration: 1,
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <VideoPlayer className="relative max-h-[80vh] w-full">
          <VideoPlayerContent
            autoPlay
            className="w-full object-cover"
            slot="media"
            src={`${import.meta.env.VITE_STATIC_FILE_HOST}/5526-events/${currentEvent.noteId}.mp4`}
          />

          <button
            className="absolute top-2 right-2 z-10 cursor-pointer rounded-full p-1 transition-colors"
            onClick={() => setCurrentEvent(null)}
            type="button"
          >
            <X className="size-5 text-white" />
          </button>
          <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 items-center justify-center px-5 mix-blend-exclusion">
            <VideoPlayerPlayButton className="h-4 bg-transparent" />
            <VideoPlayerTimeRange className="bg-transparent" />
            <VideoPlayerMuteButton className="size-4 bg-transparent" />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </motion.div>
      <motion.div
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute right-0 bottom-0 left-0 space-y-1 px-4 py-3 text-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-medium opacity-50">#{currentEvent.title}</p>
        <p className="line-clamp-2">
          @{currentEvent.noteAuthor}：{currentEvent.noteDesc}
        </p>
      </motion.div>
    </div>
  )
}

export default memo(SpecialEventStat)
