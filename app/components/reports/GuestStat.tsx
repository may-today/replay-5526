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

const getPageData = (selectedConcertDetails: Concert[]) => {
  const allGuestConcertAmount = Object.values(concertListMap).filter((concert) => !!concert.guest).length
  const allGuestList = Array.from(
    new Set(
      Object.values(concertListMap)
        .filter((concert) => !!concert.guest)
        .flatMap((concert) => concert.guest.split(','))
    )
  )
  const allGuestSongList = Array.from(
    new Set(
      Object.values(concertListMap)
        .filter((concert) => !!concert.guest)
        .flatMap((concert) => concert.guestSongList)
    )
  )
  const allGuestSongAmount = allGuestSongList.length
  const allListenedGuestConcertList = selectedConcertDetails.filter((concert) => !!concert.guest)
  const allListenedGuestList = Array.from(new Set(allListenedGuestConcertList.map((concert) => concert.guest)))
  return {
    /** 总嘉宾场次 */
    allGuestConcertAmount,
    /** 总嘉宾列表 */
    allGuestList,
    /** 总嘉宾歌曲数量 */
    allGuestSongAmount,
    /** 个人听过的嘉宾场次 */
    allListenedGuestConcertList,
    /** 个人听过的嘉宾列表 */
    allListenedGuestList,
  }
}

const GuestStat = () => {
  const selectedConcertDetails = useAtomValue(selectedConcertDetailsAtom)
  const data = useMemo(() => getPageData(selectedConcertDetails), [selectedConcertDetails])
  console.log('GuestStat', data)

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="flex-1 space-y-4 p-6">
        <div className="text-right">
          <div className="text-report-base opacity-50">这一年</div>
          <div className="text-report-base opacity-50">有 {data.allGuestConcertAmount} 场演唱会有嘉宾出现</div>
          <div className="text-report-base opacity-50">带来了 {data.allGuestSongAmount} 首音乐特调</div>
        </div>
        {data.allListenedGuestConcertList.length > 0 ? (
          <>
            <div className="text-report-base">
              <span>你解锁了其中的</span>
              <NumberTicker className="text-report-lg" value={data.allListenedGuestConcertList.length} />
              <span>场</span>
            </div>
            <div className="mt-4 text-report-base">
              {data.allListenedGuestConcertList.map((concert) => (
                <div className="mb-1 space-x-2" key={concert.date}>
                  <span className="shrink-0 opacity-50">{concert.date}</span>
                  <span className="shrink-0 opacity-50">{getConcertTitleByDate(concert.date)}</span>
                  <span className="shrink-0">「{concert.guest}」</span>
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
