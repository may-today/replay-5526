import concertListRaw from '../data/concert_list.json'
import type { Concert } from '../data/types'

const concertList = concertListRaw as Concert[]

const getCityConcertGroupList = () => {
  const cityIndexConcertGroupList = {} as Record<string, Concert[]>
  for (const concert of concertList) {
    // group by city
    if (!cityIndexConcertGroupList[concert.city]) {
      cityIndexConcertGroupList[concert.city] = []
    }
    cityIndexConcertGroupList[concert.city].push(concert)
  }
  return cityIndexConcertGroupList
}

const getConcertListMap = () => {
  const concertListMap = {} as Record<string, Concert>
  for (const concert of concertList) {
    concertListMap[concert.date] = concert
  }
  return concertListMap
}

export const cityConcertGroupList = getCityConcertGroupList()
export const concertListMap = getConcertListMap()
export const cityPlaceMap = {
  桃园: '乐天桃园棒球场',
  新加坡: '新加坡国家体育场',
  悉尼: 'Accor Stadium',
  拉斯维加斯: 'Allegiant Stadium',
  天津: '奥林匹克中心体育场',
  香港: '启德主场馆',
  杭州: '奥体中心体育场',
  哈尔滨: '国际会展体育中心体育场',
  台北: '台北大巨蛋',
  北京: '国家体育场',
  上海: '上海体育场',
  贵阳: '奥林匹克体育中心',
  长沙: '贺龙体育场',
  郑州: '奥林匹克体育中心',
  厦门: '白鹭体育场',
  广州: '大湾区文化体育中心',
  台中: '台中洲际棒球场',
} as Record<string, string>
