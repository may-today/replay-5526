import { memo } from 'react'
import { TextAnimate } from '~/components/ui/text-animate'
import { useReportBackground } from '~/hooks/useReportBackground'

// 随机曲目统计（串场）
const RandomSongStat2: React.FC = () => {
  useReportBackground('star')

  return (
    <div className="relative h-full overflow-hidden p-6">
      <div className="flex h-full flex-1 flex-col items-center justify-center overflow-hidden opacity-50">
        <div className="text-report-base">这其中</div>
        <TextAnimate animation="blurInUp" by="character" className="text-report-base" once>
          有一首是你的年度之最
        </TextAnimate>
      </div>
    </div>
  )
}

export default memo(RandomSongStat2)
