import { useAtom } from 'jotai'
import { ArrowRight, LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '~/components/ui/select'
import { geoCoordMap } from '~/data/geoCoord'
import { customLocationAtom, selectedProvinceAtom, usernameAtom } from '~/stores/app'

const BaseInformationForm: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [username, setUsername] = useAtom(usernameAtom)
  const [selectedProvince, setSelectedProvince] = useAtom(selectedProvinceAtom)
  const [customLocation, setCustomLocation] = useAtom(customLocationAtom)
  const [isLocating, setIsLocating] = useState(false)
  const supportsGeolocation = 'geolocation' in navigator

  const handleGetLocation = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCustomLocation([longitude, latitude])
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)
        let errorMessage = '获取定位失败'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '浏览器定位未开启'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '定位信息不可用'
            break
          case error.TIMEOUT:
            errorMessage = '定位请求超时'
            break
        }
        toast.error(errorMessage)
      }
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-6 px-8 py-12">
      <div className="flex-1 space-y-8 overflow-y-auto">
        <div className="space-y-4">
          <div>怎么称呼（可选）？</div>
          <Input
            className="h-12 border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入名字"
            type="text"
            value={username}
          />
        </div>
        <div className="space-y-4">
          <div>
            <p>您的省份/城市（可选）？</p>
            <p className="mt-1 text-sm text-white/40">开启后可展示距离相关的数据</p>
          </div>
          <Select disabled={!!customLocation} onValueChange={setSelectedProvince} value={selectedProvince}>
            <SelectTrigger className="h-12! w-full border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              <SelectItem value="none">不透露</SelectItem>
              <SelectSeparator />
              <SelectItem value="others">其他国家或地区</SelectItem>
              <SelectSeparator />
              {Object.entries(geoCoordMap).map(([key, _]) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {supportsGeolocation && (
            <div className="flex items-center gap-2">
              <Button
                className={customLocation ? 'border-primary! text-primary hover:text-primary' : 'text-white/50'}
                disabled={isLocating}
                onClick={handleGetLocation}
                size="xs"
                variant="outline"
              >
                <LocateFixed />
                {isLocating ? '定位中...' : '使用我的定位'}
              </Button>
              {customLocation && (
                <Button className="text-white/50" onClick={() => setCustomLocation(null)} size="xs" variant="ghost">
                  清除定位
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Button
        className="group h-12 w-full rounded-full border border-white/30 bg-white/10 font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
        onClick={onContinue}
      >
        继续
        <ArrowRight className="size-5" />
      </Button>
    </div>
  )
}

export default BaseInformationForm
