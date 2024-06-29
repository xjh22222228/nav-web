// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { isLogin } from 'src/utils/user'
import {
  setWebsiteList,
  copyText,
  deleteByWeb,
  getTextContent,
} from 'src/utils'
import { INavProps, IWebProps } from 'src/types'
import { $t } from 'src/locale'
import { settings, websiteList, tagMap } from 'src/store'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() searchKeyword: string = ''
  @Input() dataSource: IWebProps | Record<string, any> = {}
  @Input() indexs: Array<number> = []
  @Input() cardStyle: string = 'standard'

  $t = $t
  objectKeys = Object.keys
  settings = settings
  websiteList: INavProps[] = websiteList
  isLogin: boolean = isLogin
  copyUrlDone = false
  copyPathDone = false
  tagMap = tagMap

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {}

  async copyUrl(e: Event, type: number) {
    const w = this.dataSource
    const { origin, hash, pathname } = window.location
    const pathUrl = `${origin}${pathname}${hash}?q=${
      w.name
    }&url=${encodeURIComponent(w.url)}`
    const isDone = await copyText(e, type === 1 ? pathUrl : w.url)

    if (type === 1) {
      this.copyPathDone = isDone
    } else {
      this.copyUrlDone = isDone
    }
  }

  copyMouseout() {
    this.copyUrlDone = false
    this.copyPathDone = false
  }

  openEditWebMoal() {
    event.emit('CREATE_WEB', {
      detail: this.dataSource,
    })
  }

  onRateChange(n: number) {
    this.dataSource.rate = n
    setWebsiteList(this.websiteList)
  }

  confirmDel() {
    deleteByWeb({
      ...(this.dataSource as IWebProps),
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc),
    })
  }

  openMoveWebModal() {
    event.emit('MOVE_WEB', {
      indexs: this.indexs,
      data: [this.dataSource],
    })
  }

  get getRate() {
    if (!this.dataSource.rate) {
      return null
    }
    const rate = Number(this.dataSource.rate)
    // 0分不显示
    if (!rate) {
      return null
    }
    return rate.toFixed(1) + '分'
  }
}
