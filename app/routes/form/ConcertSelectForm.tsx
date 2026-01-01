import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { EyeOff, MessageCircleQuestion } from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { useNavigate } from 'react-router'
import PlaneImg from '~/assets/plane.png'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { ScrollFadeEffect } from '~/components/ui/scroll-fade-effect'
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from '~/components/ui/slide-to-unlock'
import type { Concert, ConcertSelectType } from '~/data/types'
import { cityConcertGroupList } from '~/lib/data'
import { formatConcertTitle, removeYearFromDate } from '~/lib/format'
import { selectedConcertDateTypeMapAtom, setSelectedConcertDateAtom } from '~/stores/app'

const ConcertSelectForm = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const setSelectedConcertDate = useSetAtom(setSelectedConcertDateAtom)
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col gap-6">
      <p className="translate-y-1/2 px-8 pt-6">选择去过的场次和座位</p>
      <ScrollFadeEffect className="flex-1 space-y-8 px-8">
        {Object.entries(cityConcertGroupList).map(([city, concerts]) => (
          <div className="space-y-4 pt-4" key={city}>
            <h2 className="font-bold text-lg">{city.split('-')[0]}</h2>
            <div className="grid grid-cols-2 gap-4">
              {concerts.map((concert) => (
                <ConcertSelectItem
                  concert={concert}
                  key={concert.date}
                  onClick={(selectType) => setSelectedConcertDate(concert.date, selectType)}
                  selected={selectedConcertDateTypeMap[concert.date]}
                />
              ))}
            </div>
          </div>
        ))}
      </ScrollFadeEffect>
      {Object.keys(selectedConcertDateTypeMap).length > 0 && (
        <div className="px-8 pb-12">
          <SlideToUnlock
            className="w-full bg-transparent! ring-0"
            handleWidth={80}
            onUnlock={() => navigate('/loading', { replace: true, viewTransition: true })}
          >
            <SlideToUnlockTrack className="h-5 rounded-full bg-white/10 backdrop-blur-md">
              <SlideToUnlockText>
                <span className="animate-pulse text-muted-foreground text-xs">滑动解锁你的年度报告</span>
              </SlideToUnlockText>
              <SlideToUnlockHandle className="-top-3 bg-transparent!">
                <img alt="plane" className="size-20" draggable={false} height={80} src={PlaneImg} width={80} />
              </SlideToUnlockHandle>
            </SlideToUnlockTrack>
          </SlideToUnlock>
          {/* <Button className="group h-12 w-full font-body text-base">继续</Button> */}
        </div>
      )}
    </div>
  )
}

export const getConcertSelectType = (type: ConcertSelectType) => {
  if (type === null) {
    return ''
  }
  return {
    unknown: '不记得',
    outdoor: '场外',
    ground: '内场',
    seats: '看台',
  }[type]
}

const ConcertSelectItem: React.FC<{
  concert: Concert
  selected: ConcertSelectType
  onClick: (selectType: ConcertSelectType) => void
}> = (props) => {
  const { concert, selected, onClick } = props
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={clsx([
            'h-10 cursor-pointer rounded-full border-2 border-white/10 px-2 sm:px-4',
            'flex items-center justify-between text-white/50',
            selected && 'border-white/30 bg-white/10 text-white!',
            selected ? 'hover:bg-gray-700' : 'hover:bg-black/30',
          ])}
        >
          <span>
            D{concert.cityIndex}# {removeYearFromDate(concert.date)}
          </span>
          {selected && (
            <span
              className={clsx(['shrink-0 rounded-full px-1 py-0.5 text-sm', 'border border-white/30 border-dashed'])}
            >
              {getConcertSelectType(selected)}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="gap-0 border-2 bg-gray-600/80 p-0 backdrop-blur-md" hideWhenDetached>
        <div className="flex border-b-2 p-2 text-muted-foreground text-xs">
          {formatConcertTitle(concert)} {removeYearFromDate(concert.date)}
        </div>
        <PopoverPrimitive.Close asChild>
          <div className="flex border-b-2">
            <ConcertSelectItemPopoverItem
              className="text-red-400"
              icon={<EyeOff size={20} strokeWidth={2} />}
              onClick={() => onClick(null)}
              selected={false}
              text="未看"
            />
            <ConcertSelectItemPopoverItem
              icon={<MessageCircleQuestion size={20} strokeWidth={2} />}
              onClick={() => onClick('unknown')}
              selected={selected === 'unknown'}
              text="不记得"
            />
          </div>
        </PopoverPrimitive.Close>
        <PopoverPrimitive.Close asChild>
          <div className="flex">
            <ConcertSelectItemPopoverItem
              onClick={() => {
                onClick('outdoor')
              }}
              selected={selected === 'outdoor'}
              text="场外"
            />
            <ConcertSelectItemPopoverItem
              onClick={() => {
                onClick('ground')
              }}
              selected={selected === 'ground'}
              text="内场"
            />
            <ConcertSelectItemPopoverItem
              onClick={() => {
                onClick('seats')
              }}
              selected={selected === 'seats'}
              text="看台"
            />
          </div>
        </PopoverPrimitive.Close>
      </PopoverContent>
    </Popover>
  )
}

const ConcertSelectItemPopoverItem: React.FC<{
  icon?: React.ReactNode
  text: string
  className?: string
  selected: boolean
  onClick: () => void
}> = (props) => {
  const { icon, text, className, selected, onClick } = props
  return (
    <button
      className={clsx([
        className,
        'flex flex-1 items-center gap-1 border-r-2 p-2 last:border-r-0',
        'cursor-pointer hover:bg-black/30 hover:text-white',
        selected && 'bg-black/30 text-white hover:bg-gray-700',
      ])}
      onClick={onClick}
      type="button"
    >
      {icon} {text}
    </button>
  )
}

export default ConcertSelectForm
