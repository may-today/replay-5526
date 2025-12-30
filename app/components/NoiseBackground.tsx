const NoiseBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  return (
    <div
      className="absolute inset-0 bg-[url('https://wx-static.ddiu.site/assets/noise.gif')] content-['']"
      style={{ opacity }}
    />
  )
}

export default NoiseBackground
