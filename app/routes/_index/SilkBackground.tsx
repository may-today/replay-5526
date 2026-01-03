import Silk from '~/components/Silk'

const SilkBackground: React.FC = () => {
  return (
    <div className="mask-b-from-20% mask-b-to-80% mask-r-from-60% absolute inset-x-0 top-0 h-2/3">
      <Silk color="#2179d1" noiseIntensity={0} rotation={0} scale={1} speed={5} />
    </div>
  )
}

export default SilkBackground
