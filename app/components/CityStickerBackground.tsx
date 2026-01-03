import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { cityImgIdMap } from '~/lib/data'

interface StickerData {
  id: string
  text: string
  imageUrl: string
  x: number
  y: number
  rotation: number
  scale: number
  shape: 'circle' | 'square' | 'star' | 'heart' | 'bubble' | 'custom'
  type: 'holographic' | 'silver' | 'gold'
}

const STICKER_SIZE = 120 // 贴纸尺寸

// 生成随机位置，确保贴纸不会完全超出屏幕
const generateRandomPosition = (index: number, containerWidth: number, containerHeight: number) => {
  // 使用索引作为种子，确保每次渲染位置一致
  const seed = index * 12_345
  const randomX = ((seed * 9301 + 49_297) % 233_280) / 233_280
  const randomY = ((seed * 6701 + 13_579) % 233_280) / 233_280

  // 留出边距，确保贴纸至少有 30% 在屏幕内
  const margin = STICKER_SIZE * 0.7
  const maxX = containerWidth - margin
  const maxY = containerHeight - margin

  return {
    x: Math.max(-margin, randomX * maxX),
    y: Math.max(-margin, randomY * maxY),
  }
}

const CityStickerBackground: React.FC<{ cityList: string[] }> = ({ cityList }) => {
  const [stickersWithPositions, setStickersWithPositions] = useState<StickerData[]>([])
  const cityStickerList: StickerData[] = useMemo(() => {
    return cityList.map((city, index) => {
      // 为每个城市生成稳定的随机值
      const seed = city.charCodeAt(0) * 1000 + index
      const randomRotation = ((seed * 9301) % 30) - 15 // -15 到 15 度
      const randomScale = 0.9 + ((seed * 7919) % 40) / 100 // 0.9 到 1.3

      return {
        id: city,
        text: '',
        imageUrl: `${import.meta.env.VITE_STATIC_FILE_HOST}/5526-assets/stadium/${cityImgIdMap[city]}.webp`,
        x: 0, // 将在 useEffect 中动态计算
        y: 0, // 将在 useEffect 中动态计算
        rotation: randomRotation,
        scale: randomScale,
        shape: 'custom' as const,
        type: 'holographic' as const,
      }
    })
  }, [cityList])

  useEffect(() => {
    const updatePositions = () => {
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight

      const positioned = cityStickerList.map((sticker, index) => {
        const { x, y } = generateRandomPosition(index, containerWidth, containerHeight)
        return {
          ...sticker,
          x,
          y,
        }
      })

      setStickersWithPositions(positioned)
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [cityStickerList])

  return (
    <div className="relative z-10 h-full w-full">
      <AnimatePresence>
        {stickersWithPositions.map((sticker) => (
          <Sticker data={sticker} key={sticker.id} />
        ))}
      </AnimatePresence>
    </div>
  )
}

const Sticker: React.FC<{
  data: StickerData
}> = ({ data }) => {
  return (
    <motion.div
      animate={{ scale: data.scale }}
      className={'group absolute cursor-grab select-none overflow-hidden'}
      drag
      dragMomentum={false}
      initial={{ x: data.x, y: data.y, rotate: data.rotation, scale: 0 }}
      whileHover={{ scale: data.scale * 1.02, zIndex: 50 }}
      whileTap={{ scale: data.scale * 0.98, cursor: 'grabbing' }}
    >
      <div className="h-full w-full overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <img
          alt=""
          className="pointer-events-none object-contain"
          loading="lazy"
          src={data.imageUrl}
          width={STICKER_SIZE}
        />
      </div>
    </motion.div>
  )
}

export default CityStickerBackground
