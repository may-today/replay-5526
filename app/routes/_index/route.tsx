import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import logo from '~/assets/logo.svg'
import NextButton from './NextButton'

export const meta = () => {
  return [{ title: 'Replay 5525+1 年度报告' }, { name: 'description', content: 'Replay 5525+1 年度报告' }]
}

export default function FormPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-stretch overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* 渐变遮罩：上部80%透明度（20%可见），60%位置40%透明度（60%可见），底部0%透明度（100%可见） */}
        <img
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover"
          height={100}
          src="/assets/9.webp"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
          }}
          width={100}
        />
        <div className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f6e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f6e_1px,transparent_1px)] bg-size-[35px_34px]" />
        <ShaderGradientCanvas
          className="mask-b-from-20% mask-b-to-80% absolute inset-0 opacity-50"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            bgColor1="#000000"
            bgColor2="#000000"
            brightness={0.8}
            cAzimuthAngle={270}
            cameraZoom={15.1}
            cDistance={0.5}
            color1="#73bfc4"
            color2="#ff810a"
            color3="#8da0ce"
            cPolarAngle={180}
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="on"
            lightType="env"
            pixelDensity={1}
            positionX={-0.1}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.4}
            rotationX={0}
            rotationY={130}
            rotationZ={70}
            shader="defaults"
            type="sphere"
            uAmplitude={3.2}
            uDensity={0.8}
            uFrequency={5.5}
            uSpeed={0.3}
            uStrength={0.3}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
        <div className="flex h-full flex-col items-center justify-center bg-linear-to-t from-[#ebebeb] to-[#dadada] font-semibold text-black dark:from-gray-950 dark:to-gray-800 dark:text-white" />
        {/* <div
          className="absolute inset-0 bg-[url('https://www.ui-layouts.com/noise.gif')] content-['']"
          style={{ opacity: 0.06 }}
        /> */}
      </div>

      {/* <UnicornScene height="50vh" projectId="EqVrhB2kvzv91mGIIpb4?update=1.0.2" width="100vw" /> */}

      {/* Title */}
      {/* <section className="flex h-1/2 flex-col items-center justify-center bg-linear-to-t from-[#ebebeb] to-[#dadada] font-semibold text-black sm:h-[500px] 2xl::h-[600px] dark:from-gray-950 dark:to-gray-800 dark:text-white">
        <div className="mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[35px_34px]" />

        <h1 className="px-8 text-center font-semibold text-5xl leading-[120%] tracking-tight 2xl:text-7xl">
          Replay 5525+1
        </h1>
      </section> */}
      <main className="z-10 flex w-full flex-1 flex-col items-start p-6 sm:p-12">
        <img alt="logo" className="w-40 opacity-75" height={100} src={logo} width={100} />
      </main>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <NextButton onClick={() => {}} />
      </div>
    </div>
  )
}
