import { ArrowRight } from 'lucide-react'

const NextButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="space-y-4">
      <button
        className="flex size-20 items-center justify-center rounded-full border border-white/30 bg-white/10 font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
        onClick={onClick}
        type="button"
      >
        <ArrowRight className="size-10" strokeWidth={1} />
      </button>
      {/* <button
        className="flex size-20 items-center justify-center rounded-full bg-white/20 shadow-lg"
        onClick={onClick}
        type="button"
      >
        <ArrowRight className="size-10" />
      </button> */}
      <p className="text-center text-sm text-white/60">点击开启</p>
    </div>
  )
}

export default NextButton
