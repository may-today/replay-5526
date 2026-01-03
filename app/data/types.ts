export interface Concert {
  /** 日期 */
  date: string
  /** 城市 */
  city: string
  /** 场次 */
  cityIndex: number
  /** 是否尾场 */
  last?: boolean
  /** 类型（5525+1） */
  type?: '5526'
  /** 嘉宾 */
  guest: string
  /** 开始时间（hhmm） */
  start?: number
  /** 结束时间（hhmm） */
  end?: number
  /** 歌曲数量 */
  songAmount: number
  /** 点歌列表 */
  requestSongList: string[]
  /** 嘉宾歌曲列表 */
  guestSongList: string[]
  /** 非五月天歌曲列表 */
  specialSongList: string[]
  /** 安可歌曲列表 */
  encoreSongList: string[]
  /** 结尾歌曲 */
  endingSong: string
  /** 大球颜色列表 */
  ballColorList: string[]
}

export enum SongType {
  /** 日常歌单 */
  // NORMAL = 1,
  /** 点歌 */
  REQUEST = 1,
  /** 嘉宾歌单 */
  GUEST = 2,
  /** Ending */
  ENDING = 3,
  /** 安可 */
  ENCORE = 4,
}

export type ConcertSelectType = null | 'unknown' | 'outdoor' | 'ground' | 'seats'

export interface ReportBackground {
  type: 'star' | 'aurora' | 'ball' | null
  opacity: number
}
