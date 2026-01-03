import clsx from 'clsx'
import html2canvas from 'html2canvas-pro'
import { ImageDown } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import Receipt from './Receipt'

type PrintingStatus = 'idle' | 'printing' | 'finished'

const getButtonText = (status: PrintingStatus): string => {
  const textMap: Record<PrintingStatus, string> = {
    idle: '生成你的报告',
    printing: '打印中...',
    finished: '保存图片',
  }
  return textMap[status]
}

const Printer: React.FC<{ onPrintStart?: () => void }> = ({ onPrintStart }) => {
  const [status, setStatus] = useState<PrintingStatus>('idle')
  const [receiptHeight, setReceiptHeight] = useState(0)
  const [animationDuration, setAnimationDuration] = useState(4)
  const receiptRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isSavingImage, setIsSavingImage] = useState(false)
  const handleStartPrint = () => {
    setStatus('printing')
    onPrintStart?.()
    // 获取小票的实际高度
    if (receiptRef.current) {
      const height = receiptRef.current.scrollHeight
      setReceiptHeight(height)

      // 根据高度计算动画时长
      // 假设打印速度为 300px/秒，保持恒定的视觉速度
      const PRINT_SPEED = 300 // 像素/秒
      const duration = Math.max(3, Math.min(8, height / PRINT_SPEED)) // 限制在 3-8 秒之间
      setAnimationDuration(duration)
    }
  }

  const handleSaveImage = async () => {
    if (!receiptRef.current) {
      return
    }
    setIsSavingImage(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `replay-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSavingImage(false)
    }
  }

  const handleAnimationComplete = () => {
    if (status === 'printing') {
      setStatus('finished')
    }
  }

  const isDisabled = status === 'printing' || isSavingImage
  const isFinished = status === 'finished'
  const shouldShowReceipt = status === 'printing' || isFinished

  return (
    <div className="relative flex w-full max-w-[600px] flex-col">
      {/* The Printer Machine Body */}
      <div className="relative z-20 rounded-2xl border-neutral-700 border-b-6 bg-neutral-800 p-4 shadow-2xl">
        {/* Internal Paper Slot (Now lowered into the body) */}
        <div className="absolute top-6 left-1/2 w-[90%] -translate-x-1/2">
          <div className="relative">
            {/* Paper Slot Visual Hole */}
            <div className="relative z-10 h-2 w-full rounded-full border-gray-800 border-b bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
            {/* 外层容器：限制可视区域高度，使用 flex 布局保持底部对齐 */}
            <div
              className={clsx([
                'absolute bottom-2 left-1/2 z-[-1] flex w-full -translate-x-1/2 flex-col justify-end pt-[240px]',
                isFinished ? 'receipt-scroll overflow-y-auto' : 'overflow-hidden',
              ])}
              ref={scrollContainerRef}
              style={{
                maxHeight: 'calc(100vh - 160px)', // 屏幕高度减去打印机和其他元素占用的空间
              }}
            >
              {/* 内层容器：使用 motion 动画控制小票抽出效果，打印过程中保持底部对齐 */}
              <motion.div
                animate={{
                  maxHeight: shouldShowReceipt ? receiptHeight || 2000 : 0,
                }}
                className="mx-auto shrink-0 overflow-hidden"
                initial={{ maxHeight: 0 }}
                onAnimationComplete={handleAnimationComplete}
                transition={{
                  duration: animationDuration,
                  ease: 'linear',
                }}
              >
                <Receipt ref={receiptRef} />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          animate={{
            backgroundColor: status === 'printing' ? 'rgb(234, 179, 8)' : 'rgb(55, 65, 81)',
            boxShadow: status === 'printing' ? '0 0 8px rgba(234, 179, 8, 0.6)' : 'none',
          }}
          className="absolute top-2 left-2.5 size-1.5 rounded-full"
          transition={{ duration: 0.3 }}
        />

        {/* Machine Controls Area */}
        <div className="mt-8 flex items-center gap-4">
          <motion.button
            className={clsx([
              'flex items-center justify-center gap-1',
              'w-full rounded-xl border border-white/50 py-2 font-semibold opacity-100 shadow-lg transition-opacity',
              'bg-white text-black disabled:opacity-50',
            ])}
            disabled={isDisabled}
            onClick={isFinished ? handleSaveImage : handleStartPrint}
            type="button"
            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFinished && <ImageDown className="size-4" />}
            {getButtonText(status)}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default Printer
