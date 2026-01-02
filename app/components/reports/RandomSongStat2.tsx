import { memo } from 'react'

// 随机曲目统计（串场）
const RandomSongStat2: React.FC = () => {
  return (
    <div className="relative h-full overflow-hidden p-6">
      <div className="flex h-full flex-1 flex-col items-center justify-center overflow-hidden">
        <div className="text-report-base opacity-50">这其中</div>
        <div className="text-report-base opacity-50">有一首是你的年度之最</div>
      </div>
    </div>
  )
}

export default memo(RandomSongStat2)
