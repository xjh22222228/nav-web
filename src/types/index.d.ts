// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

export type ThemeType =
  | 'Current'
  | 'Light'
  | 'Sim'
  | 'Side'
  | 'App'
  | 'Shortcut'

type OverType = 'overflow' | 'ellipsis'

export interface ITagPropValues {
  id: number
  name: string
  color: string
  createdAt: string
  desc: string
  isInner: boolean

  [key: string]: any
}

export interface ITagProp {
  [tagName: string]: ITagPropValues
}

export interface IWebProps {
  __name__?: string | undefined // 搜索原name值
  __desc__?: string | undefined
  id: string | number
  name: string
  desc: string
  url: string
  icon?: string | null
  createdAt?: string
  rate?: number // 0-5
  top?: boolean
  index?: number // sort
  ownVisible?: boolean
  breadcrumb: string[]
  ok?: boolean
  urls?: {
    [tagName: string]: string
  }
  [key: string]: any
}

export interface INavThreeProp {
  title?: string
  icon?: string | null
  createdAt?: string
  collapsed?: boolean
  ownVisible?: boolean
  nav: IWebProps[]
  [key: string]: any
}

export interface INavTwoProp {
  title?: string
  icon?: string | null
  createdAt?: string
  collapsed?: boolean
  ownVisible?: boolean
  nav: INavThreeProp[]
  [key: string]: any
}

export interface INavProps extends Object {
  title: string
  id?: number
  icon?: string | null
  createdAt?: string
  ownVisible?: boolean
  collapsed?: boolean
  nav: INavTwoProp[]
  [key: string]: any
}

export interface ISearchEngineProps {
  name: string
  url?: string
  icon: string | null
  placeholder?: string
  blocked: boolean
  isInner: boolean
}

export interface ISettings {
  favicon: string
  language: 'zh-CN' | 'en'
  loading: string
  homeUrl: string
  title: string
  description: string
  keywords: string
  theme: ThemeType
  openSEO: boolean
  appTheme: ThemeType
  footerContent: string
  headerContent: string
  showGithub: boolean
  showLanguage: boolean
  showCopy: Boolean | undefined
  showShare: Boolean | undefined
  showThemeToggle: Boolean
  actionUrl: string | null
  checkUrl: boolean
  errorUrlCount?: number

  lightCardStyle: string
  lightOverType: OverType
  lightImages: Record<string, any>[]

  simThemeImages: Record<string, any>[]
  simThemeDesc: string
  simThemeHeight: number
  simThemeAutoplay: boolean
  simCardStyle: string
  simTitle: string
  simOverType: OverType

  sideThemeImages: Record<string, any>[]
  sideThemeHeight: number
  sideThemeAutoplay: boolean
  sideCardStyle: string
  sideTitle: string

  shortcutThemeImages: Record<string, any>[]
  shortcutThemeShowWeather: boolean
  shortcutTitle: string

  superTitle: string
  superOverType: OverType
  superCardStyle: string
  superImages: Record<string, any>[]

  showRate: boolean
  mirrorList: Record<string, any>[]

  allowCollect: boolean
  email: string
}

export interface IConfig {
  gitRepoUrl: string
  provider: 'Github' | 'Gitee'
  branch: string
  hashMode: boolean
}

export type internalProps = {
  loginViewCount: number
  userViewCount: number
}

declare global {
  const Swiper: any
}
