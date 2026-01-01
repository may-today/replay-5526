import { useNavigate } from 'react-router'
import logo from '~/assets/logo.svg'
import GridBackground from '~/components/GridBackground'
import NoiseBackground from '~/components/NoiseBackground'
import BackgroundSlider from './BackgroundSlider'
import NextButton from './NextButton'
import ShaderBackground from './ShaderBackground'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

const bgImageNameList = ['1', '2', '3', '4', '5', '6', '7', '8-1', '8-2', '9']

export default function FormPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col items-center justify-stretch overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundSlider
          className="mask-t-from-60% mask-t-to-80% mask-b-from-20%"
          images={bgImageNameList.map(
            (name) => `${import.meta.env.VITE_STATIC_FILE_HOST}/cover/album/thumb/${name}.webp`
          )}
        />
        <GridBackground />
        <ShaderBackground />
        <NoiseBackground />
      </div>

      {/* Main */}
      <main className="z-10 flex w-full flex-1 flex-col items-start px-6 py-8 sm:px-12 sm:py-12">
        <img alt="logo" className="w-40 opacity-75" height={100} src={logo} width={100} />
      </main>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-14 z-20 flex justify-center">
        <NextButton
          onClick={() =>
            navigate('/form', {
              viewTransition: true,
            })
          }
        />
      </div>
    </div>
  )
}
