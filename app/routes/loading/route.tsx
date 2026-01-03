import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { SpinningText } from '~/components/ui/spinning-text'
import { TextAnimate } from '~/components/ui/text-animate'
import { usernameAtom } from '~/stores/app'

export default function LoadingPage() {
  const username = useAtomValue(usernameAtom)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location && !location.state?.fromIndex) {
      navigate('/', { replace: true, viewTransition: true })
    }
  }, [location, navigate])

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/report', { replace: true, viewTransition: true })
    }, 15_000)

    return () => clearTimeout(timer)
  }, [navigate])

  const handleGoToReport = () => {
    navigate('/report', { replace: true, viewTransition: true })
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="mask-t-from-40% absolute inset-0">
        <video
          autoPlay
          className="h-full w-full object-cover opacity-60"
          loop={false}
          muted
          onEnded={() => navigate('/report', { replace: true, viewTransition: true })}
          playsInline
          src={`${import.meta.env.VITE_STATIC_FILE_HOST}/5526-assets/5525-loading.mp4`}
        />
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <SpinningText className="font-sans leading-none" fontSize={0.8} radius={6}>
          {'MONSTER • MASA • STONE • MING • ASHIN • '}
        </SpinningText>
        <TextAnimate animation="blurInUp" by="character" className="mt-20 text-center" once>
          {`正在生成属于${username ? ` ${username} ` : '你'}的年度报告`}
        </TextAnimate>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-end p-6">
        <Button className="text-white/30" onClick={handleGoToReport} size="xs" variant="outline">
          跳过
        </Button>
      </div>
    </div>
  )
}
