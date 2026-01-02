import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'
import { NumberTicker } from '~/components/ui/number-ticker'
import { ballColorMap } from '~/data/ballColor'
import type { ConcertSelectType } from '~/data/types'
import { groupVariants, itemVariants } from '~/lib/animated'
import { concertListMap } from '~/lib/data'
import { selectedConcertDateTypeMapAtom } from '~/stores/app'
import { AnimatedGroup } from '../ui/animated-group'

const getPageData = (options: { selectedConcertDateTypeMap: Record<string, ConcertSelectType> }) => {
  const { selectedConcertDateTypeMap } = options
  const selectedDates = Object.keys(selectedConcertDateTypeMap)
  const listenedBallColorListRaw = selectedDates.flatMap((date) => concertListMap[date].ballColorList)
  /** 听过的场次大球颜色数量字典 */
  const listenedBallColorAmountMap = Object.fromEntries(
    Object.entries(
      listenedBallColorListRaw.reduce(
        (acc, color) => {
          acc[color] = (acc[color] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ).sort(([, a], [, b]) => b - a)
  )

  return {
    /** 听过的场次大球颜色数量字典 */
    listenedBallColorAmountMap,
  }
}

// 大球颜色统计
const EncoreBallStat: React.FC = () => {
  const selectedConcertDateTypeMap = useAtomValue(selectedConcertDateTypeMapAtom)
  const data = useMemo(() => getPageData({ selectedConcertDateTypeMap }), [selectedConcertDateTypeMap])

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="flex-1 space-y-4 p-6">
        <header className="text-right text-report-base opacity-50">
          <p>你是否会期待</p>
          <p>每晚的安可大球</p>
        </header>
        <motion.div animate="visible" initial="hidden" variants={groupVariants}>
          <motion.div className="text-report-base" variants={itemVariants}>
            <p>这一年</p>
            <p>在 {Object.keys(ballColorMap).length} 种大球颜色中</p>
          </motion.div>
          <motion.p className="text-report-base" variants={itemVariants}>
            你收集了{' '}
            <NumberTicker className="text-report-lg" value={Object.keys(data.listenedBallColorAmountMap).length} /> 种
            {Object.keys(data.listenedBallColorAmountMap).length === Object.keys(ballColorMap).length && (
              <span>，掌声鼓励</span>
            )}
          </motion.p>
          <motion.div>
            <ListenedBallGroup listenedBallColorAmountMap={data.listenedBallColorAmountMap} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const ListenedBallGroup: React.FC<{ listenedBallColorAmountMap: Record<string, number> }> = ({
  listenedBallColorAmountMap,
}) => {
  return (
    <AnimatedGroup className="my-8 flex flex-wrap gap-4" preset="scale">
      {Object.entries(listenedBallColorAmountMap).map(([colorName, amount]) => {
        return (
          <div
            className={clsx(['relative h-12 w-12 rounded-md border-2'])}
            key={colorName}
            style={{
              backgroundColor: (ballColorMap as Record<string, string>)[colorName],
            }}
          >
            <div className={clsx(['absolute -top-3 -right-3 rounded-full bg-black px-3 py-1 text-white'])}>
              {amount}
            </div>
          </div>
        )
      })}
    </AnimatedGroup>
  )
}

export default memo(EncoreBallStat)
