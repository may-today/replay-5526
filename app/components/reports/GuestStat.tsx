import { useAtomValue } from 'jotai'
import { memo, useMemo } from 'react'
// import Accusefive from '~/assets/guest/accusefive.webp'
// import Cheer from '~/assets/guest/cheer.webp'
// import Della from '~/assets/guest/della.webp'
// import Ella from '~/assets/guest/ella.webp'
// import Energy from '~/assets/guest/energy.webp'
// import Jam from '~/assets/guest/jam.webp'
// import Jjlin from '~/assets/guest/jjlin.webp'
// import Michael from '~/assets/guest/michael.webp'
// import Rene from '~/assets/guest/rene.webp'
// import Richie from '~/assets/guest/richie.webp'
// import Xin from '~/assets/guest/xin.webp'
import { NumberTicker } from '~/components/ui/number-ticker'
// import { InfiniteSlider } from '~/components/ui/infinite-slider'
import type { Concert } from '~/data/types'
import { useFocusValueMap } from '~/hooks/useFocus'
import { concertListMap } from '~/lib/data'
import { getConcertTitleByDate } from '~/lib/format'
import { selectedConcertDetailsAtom } from '~/stores/app'

// const guestImgMap = {
//   告五人: Accusefive,
//   陳綺貞: Cheer,
//   丁噹: Della,
//   陳嘉樺: Ella,
//   Energy,
//   蕭敬騰: Jam,
//   林俊傑: Jjlin,
//   光良: Michael,
//   劉若英: Rene,
//   任賢齊: Richie,
//   劉雨昕: Xin,
// }

const allGuestConcertAmount = Object.values(concertListMap).filter((concert) => !!concert.guest).length

const getPageData = (selectedConcertDetails: Concert[]) => {
  const allListenedGuestConcertList = selectedConcertDetails.filter((concert) => !!concert.guest)
  const allListenedGuestList = Array.from(new Set(allListenedGuestConcertList.map((concert) => concert.guest)))
  return {
    allListenedGuestConcertList,
    allListenedGuestList,
  }
}

const GuestStat: React.FC<{
  focus: boolean
}> = ({ focus }) => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = useMemo(() => getPageData(selectedConcertDetails), [selectedConcertDetails])
  console.log('GuestStat', data)

  const animValue = useFocusValueMap(focus, () => ({
    listenedGuestConcertAmount: data.allListenedGuestConcertList.length,
    guestAmount: data.allListenedGuestList.length,
  }))

  return (
    <div className="relative h-full">
      <div className="mr-36 h-full overflow-y-auto p-4">
        <p className="text-report-base opacity-50">今年，有 {allGuestConcertAmount} 场演唱会有嘉宾出现</p>
        {data.allListenedGuestConcertList.length > 0 ? (
          <>
            <div className="text-report-base">
              <span>你解锁了其中的</span>
              <NumberTicker className="text-report-lg" value={animValue.listenedGuestConcertAmount} />
              <span>场：</span>
            </div>
            <div className="mt-4 text-report-base">
              {data.allListenedGuestConcertList.map((concert) => (
                <div className="mb-1 flex flex-col sm:flex-row" key={concert.date}>
                  <span className="shrink-0">{getConcertTitleByDate(concert.date)}</span>
                  <span className="shrink-0 text-2xl text-report-lg">「{concert.guest}」</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-report-base">你还没有解锁过</div>
            <div className="text-report-base">但也获得了纯度更高的五月天</div>
          </>
        )}
      </div>
      {/* <div className="absolute top-0 right-4 bottom-0">
        <InfiniteSlider className="h-full" direction="vertical">
          {Object.entries(guestImgMap).map(([guest, img]) => {
            return (
              <img
                alt="guest"
                className={clsx([
                  'h-32 w-32 border-2',
                  data.allListenedGuestList.includes(guest) ? 'opacity-100' : 'opacity-60',
                ])}
                key={guest}
                src={img}
              />
            )
          })}
        </InfiniteSlider>
      </div> */}
    </div>
  )
}

export default memo(GuestStat)
