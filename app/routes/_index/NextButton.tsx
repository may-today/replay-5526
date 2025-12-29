import { ArrowRight } from 'lucide-react'

const NextButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="space-y-4">
      <button
        className="flex size-20 items-center justify-center rounded-full bg-white/20 shadow-lg"
        onClick={onClick}
        type="button"
      >
        <ArrowRight className="size-10" />
      </button>
      <p className="text-center text-sm text-white/60">点击开启</p>
    </div>
  )
}

export default NextButton
