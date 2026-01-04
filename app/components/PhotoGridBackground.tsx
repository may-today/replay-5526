import clsx from 'clsx'

const guestImgIdMap = {
  小玫瑰: 'rose',
  孙燕姿: 'syz',
  周杰伦: 'zjl',
  白敬亭: 'bjt',
  任贤齐: 'rxq',
  赵传: 'zc',
  Energy: 'energy',
  告五人: 'gwr',
  萧煌奇: 'xhq',
  韦礼安: 'wla',
  周思齐: 'zsq',
  F4: 'f4',
  张国玺: 'zgx',
  陈粒: 'cl',
  宋雨琦: 'syq',
  汪苏泷: 'wsl',
  丁当: 'dd',
} as Record<string, string>
const guestImgIds = Object.values(guestImgIdMap)

const PhotoGridBackground: React.FC<{ highlightList: string[] }> = ({ highlightList }) => {
  const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5)
  const highlightIdList = highlightList.map((guest) => guestImgIdMap[guest])

  return (
    <div className="mask-t-from-40% pointer-events-none h-full w-full overflow-hidden">
      <div
        className="absolute -top-[40%] -left-[40%] flex h-[180%] w-[180%] justify-center"
        style={{ transform: 'rotate(-10deg)' }}
      >
        <GridColumn highlightIdList={highlightIdList} photoIds={shuffle(guestImgIds)} speed="160s" />
        <GridColumn highlightIdList={highlightIdList} photoIds={shuffle(guestImgIds)} reverse speed="140s" />
        <GridColumn highlightIdList={highlightIdList} photoIds={shuffle(guestImgIds)} speed="180s" />
        <GridColumn highlightIdList={highlightIdList} photoIds={shuffle(guestImgIds)} reverse speed="130s" />
        <GridColumn highlightIdList={highlightIdList} photoIds={shuffle(guestImgIds)} speed="170s" />
      </div>
    </div>
  )
}

const GridColumn: React.FC<{
  photoIds: string[]
  reverse?: boolean
  speed?: string
  highlightIdList: string[]
}> = ({ photoIds, reverse = false, speed = '60s', highlightIdList }) => {
  // Triple the photos to ensure seamless looping
  const duplicatedPhotoIds = [...photoIds, ...photoIds, ...photoIds]

  return (
    <div className="flex min-w-[140px] flex-col">
      <div
        className={`${reverse ? 'animate-slow-scroll-reverse' : 'animate-slow-scroll'} flex flex-col`}
        style={{ animationDuration: speed }}
      >
        {duplicatedPhotoIds.map((photoId, index) => (
          <div className="relative aspect-square w-full overflow-hidden bg-gray-900" key={`${photoId}-${index}`}>
            <img
              alt={photoId}
              className={clsx(
                'h-full w-full object-cover opacity-40',
                highlightIdList.includes(photoId) ? 'opacity-100 filter-none' : 'grayscale filter'
              )}
              height={200}
              loading="lazy"
              src={`${import.meta.env.VITE_STATIC_FILE_HOST}/5526-assets/guest/${photoId}.webp`}
              width={200}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PhotoGridBackground
