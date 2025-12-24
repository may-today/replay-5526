import { useAtom } from 'jotai'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '~/components/ui/select'
import { geoCoordMap } from '~/data/geoCoord'
import { selectedProvinceAtom, usernameAtom } from '~/stores/app'

const BaseInformationForm = () => {
  const [username, setUsername] = useAtom(usernameAtom)
  const [selectedProvince, setSelectedProvince] = useAtom(selectedProvinceAtom)

  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <div className="text-muted-foreground">怎么称呼（可选）？</div>
        <Input
          className="h-12 border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入名字"
          type="text"
          value={username}
        />
      </div>
      <div className="space-y-4">
        <div className="text-muted-foreground">您的省份/城市（可选）？</div>
        <Select onValueChange={setSelectedProvince} value={selectedProvince}>
          <SelectTrigger className="h-12! w-full border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary">
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
      </div>
    </div>
  )
}

export default BaseInformationForm
