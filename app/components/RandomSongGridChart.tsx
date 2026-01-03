import clsx from 'clsx'
import { type HierarchyNode, hierarchy, treemap, treemapResquarify } from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'

const GRADIENTS = [
  'linear-gradient(135deg, #24639a 0%, #007f86 100%)',
  'linear-gradient(135deg, #9d5aa4 0%, #ac3a49 100%)',
  'linear-gradient(135deg, #359c9e 0%, #226cb6 100%)',
  'linear-gradient(135deg, #5673a1 0%, #7295a5 100%)',
  'linear-gradient(135deg, #418058 0%, #5889a2 100%)',
  'linear-gradient(135deg, #9f7b4f 0%, #9958aa 100%)',
  'linear-gradient(135deg, #8c799d 0%, #5c82a8 100%)',
]

const GRAY_GRADIENT = 'linear-gradient(135deg, #222222 0%, #0f0f0f 100%)'

interface GenreGridProps {
  amountMap: Record<string, number>
  highlightedIds: string[]
}

const RandomSongGridChart: React.FC<GenreGridProps> = ({ amountMap, highlightedIds }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const itemData = useMemo(() => {
    const amountMapEntries = [...Object.entries(amountMap)].sort(() => Math.random() - 0.5)
    return amountMapEntries.map(([name, amount], index) => ({
      name,
      weight: amount,
      gradient: highlightedIds.includes(name) ? GRADIENTS[index % GRADIENTS.length] : GRAY_GRADIENT,
    }))
  }, [amountMap, highlightedIds])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const layoutData = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      return null
    }

    const root = hierarchy({ children: itemData }).sum((d: any) => d.weight)

    const treemapLayout = treemap()
      .size([dimensions.width, dimensions.height])
      .paddingInner(0)
      .paddingOuter(0)
      .round(true)
      .tile(treemapResquarify.ratio(0.4))

    treemapLayout(root as any)
    return root.leaves()
  }, [itemData, dimensions])

  const isDimmed = (name: string) => {
    if (highlightedIds.length === 0) {
      return false
    }
    return !highlightedIds.includes(name)
  }

  if (dimensions.width === 0) {
    return <div className="h-full min-h-[500px] w-full" ref={containerRef} />
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black shadow-2xl" ref={containerRef}>
      <div className="absolute inset-0">
        {layoutData?.map((node: HierarchyNode<{ name: string; weight: number; gradient: string }>, i) => {
          if (!node) {
            return null
          }
          const { x0, y0, x1, y1 } = node
          const { name, gradient } = node.data
          const width = x1 - x0
          const height = y1 - y0
          const dimmed = isDimmed(name)

          return (
            <div
              className="group absolute border-none transition-all duration-500 ease-in-out"
              key={name}
              style={{
                left: x0,
                top: y0,
                width,
                height,
                background: gradient,
                zIndex: dimmed ? 1 : 2,
                boxShadow: 'none',
              }}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden">
                <span
                  className={clsx([
                    'select-none text-center font-black font-sans uppercase tracking-widest transition-transform duration-300 group-hover:scale-110',
                    width < 50 ? 'text-[6px]' : width < 80 ? 'text-[10px]' : 'text-xs',
                    dimmed ? 'text-white/10' : 'text-white/40 mix-blend-hard-light',
                  ])}
                  style={{ opacity: 1 }} // 移除文字透明度处理
                >
                  {name}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RandomSongGridChart
