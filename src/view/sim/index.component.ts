// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from 'src/types'
import {
  fuzzySearch,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
  matchCurrentList,
  getOverIndex,
} from 'src/utils'
import { isLogin } from 'src/utils/user'
import { websiteList } from 'src/store'
import { settings, internal } from 'src/store'

@Component({
  selector: 'app-sim',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SimComponent {
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  settings = settings
  description: string = settings.simThemeDesc.replace(
    '${total}',
    String(isLogin ? internal.loginViewCount : internal.userViewCount)
  )
  isLogin = isLogin
  sliceMax = 1
  overIndex = Number.MAX_SAFE_INTEGER
  searchKeyword = ''

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const { id, page, q } = queryString()
      this.page = page
      this.id = id
      this.searchKeyword = q
      this.sliceMax = 1

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }
      setTimeout(() => {
        this.sliceMax = Number.MAX_SAFE_INTEGER
      }, 100)
    })
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    if (this.settings.simOverType === 'ellipsis') {
      queueMicrotask(() => {
        const overIndex = getOverIndex('.top-nav .over-item')
        if (this.overIndex === overIndex) {
          return
        }
        this.overIndex = overIndex
      })
    }
  }

  handleSidebarNav(index: number) {
    const { page } = queryString()
    this.websiteList[page].id = index
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page,
        id: index,
        _: Date.now(),
      },
    })
  }

  handleCilckTopNav(idx: number) {
    const id = this.websiteList[idx].id || 0
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page: idx,
        id,
        _: Date.now(),
      },
    })
  }

  onCollapse = (item: any, index: number) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }

  collapsed() {
    try {
      return !!websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }
}
