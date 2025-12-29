import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { EyeOff, MessageCircleQuestion } from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import type { Concert, ConcertSelectType } from '~/data/types'
import { cityConcertGroupList } from '~/lib/data'
import { selectedConcertDateTypeMapAtom, setSelectedConcertDateAtom } from '~/stores/app'

const ConcertSelectForm = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const setSelectedConcertDate = useSetAtom(setSelectedConcertDateAtom)

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-6 pb-24">
      {/* <ConcertSelectDebugPanel data={selectedConcertDateTypeMap} /> */}
      <h2 className="mb-4 font-bold text-xl">选择你去过的场次和座位：</h2>
      {Object.entries(cityConcertGroupList).map(([city, concerts]) => (
        <div key={city}>
          <h2 className="py-4 text-center font-bold text-2xl">{city}</h2>
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
            'h-12 cursor-pointer rounded-full border-2 border-black px-2 sm:px-4',
            'flex items-center justify-between',
            selected && 'bg-black text-white',
            selected ? 'hover:bg-gray-700' : 'hover:bg-black/30',
          ])}
        >
          <span>
            D{concert.cityIndex}# {concert.date.replace(/20\d{2}\./, '')}
          </span>
          {selected && (
            <span
              className={clsx([
                'shrink-0 rounded-full px-1.5 py-1 text-sm sm:px-2',
                'border border-white border-dashed',
              ])}
            >
              {getConcertSelectType(selected)}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="border-2 p-0" hideWhenDetached>
        <div className="flex border-b-2 p-2">
          {concert.city}D{concert.cityIndex} {concert.date.replace(/20\d{2}\./, '')}
        </div>
        <PopoverPrimitive.Close asChild>
          <div className="flex border-b-2">
            <ConcertSelectItemPopoverItem
              className="text-red-700"
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
        'flex flex-1 items-center gap-1 border-black border-r-2 p-2 last:border-r-0',
        'cursor-pointer hover:bg-black hover:text-white',
        selected && 'bg-black text-white hover:bg-gray-700',
      ])}
      onClick={onClick}
      type="button"
    >
      {icon} {text}
    </button>
  )
}

export default ConcertSelectForm
