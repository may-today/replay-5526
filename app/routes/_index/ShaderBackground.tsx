import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

const ShaderBackground: React.FC = () => {
  return (
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
        brightness={1}
        cAzimuthAngle={270}
        cameraZoom={15.1}
        cDistance={0.5}
        color1="#73bfc4"
        color2="#2179d1"
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
  )
}

export default ShaderBackground
