// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { websiteList } from 'src/store'
import { IWebProps, INavProps } from 'src/types'
import { queryString, fuzzySearch } from 'src/utils'
import { isLogin } from 'src/utils/user'
import { ActivatedRoute } from '@angular/router'
import event from 'src/utils/mitt'

let DEFAULT_WEBSITE: Array<IWebProps> = []

@Component({
  selector: 'app-web-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class WebListComponent implements OnInit {
  @Input() max: number = 110
  @Input() search = true
  @Input() overflow = false

  websiteList: INavProps[] = websiteList
  dataList: IWebProps[] = []

  constructor(private activatedRoute: ActivatedRoute) {
    const init = () => {
      this.getTopWeb()
      this.activatedRoute.queryParams.subscribe(() => {
        const { q } = queryString()
        const result = fuzzySearch(this.websiteList, q)

        if (this.search && q.trim()) {
          if (result.length === 0) {
            this.dataList = []
          } else {
            this.dataList = result[0].nav.slice(0, this.max)
          }
        } else {
          this.dataList = DEFAULT_WEBSITE
        }
      })
    }
    if (window.__FINISHED__) {
      init()
    } else {
      event.on('WEB_FINISH', () => {
        init()
      })
    }
  }

  ngOnInit() {}

  // 获取置顶WEB
  getTopWeb() {
    const dataList: IWebProps[] = []
    const max = this.max

    function r(nav: any) {
      if (!Array.isArray(nav)) return

      for (let i = 0; i < nav.length; i++) {
        if (dataList.length > max) {
          break
        }

        const item = nav[i]
        if (item.url) {
          if (item.top && (isLogin || !item.ownVisible)) {
            dataList.push(item)
          }
        } else {
          r(item.nav)
        }
      }
    }
    r(websiteList)

    // @ts-ignore
    this.dataList = dataList.sort((a: any, b: any) => {
      const aIdx =
        a.index == null || a.index === '' ? Number.MAX_SAFE_INTEGER : a.index
      const bIdx =
        b.index == null || b.index === '' ? Number.MAX_SAFE_INTEGER : b.index
      return aIdx - bIdx
    })
    DEFAULT_WEBSITE = this.dataList
  }

  goUrl(url: string) {
    if (url) {
      window.open(url)
    }
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }
}
