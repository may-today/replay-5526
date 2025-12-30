import clsx from 'clsx'
import { useEffect, useState } from 'react'

interface BackgroundSliderProps {
  images: string[]
  interval?: number
  className?: string
}

const BackgroundSlider: React.FC<BackgroundSliderProps> = ({ images, interval = 5000, className }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(activeIndex)
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [activeIndex, images.length, interval])

  return (
    <div className={clsx('absolute inset-0 z-0 overflow-hidden bg-black', className)}>
      {images.map((src, index) => {
        const isActive = index === activeIndex
        const isPrev = index === prevIndex

        const shouldAnimate = isActive || isPrev

        return (
          <div
            className={`fade-transition absolute inset-0 h-full w-full ${
              isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
            key={src}
          >
            <img
              alt={`Slide ${index}`}
              className={`base-zoom h-full w-full object-cover ${shouldAnimate ? 'animate-pan' : ''}`}
              src={src}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )
      })}
    </div>
  )
}

export default BackgroundSlider
