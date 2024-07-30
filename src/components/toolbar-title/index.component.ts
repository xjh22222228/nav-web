// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { INavThreeProp, INavProps } from 'src/types'
import { isLogin } from 'src/utils/user'
import { websiteList, settings } from 'src/store'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-toolbar-title',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ToolbarTitleWebComponent implements OnInit {
  @Input() index: number = 0
  @Input() dataSource!: INavThreeProp
  @Output() onCollapse = new EventEmitter()

  isLogin = isLogin
  websiteList: INavProps[] = websiteList
  settings = settings

  constructor() {}

  ngOnInit() {}

  openCreateWebModal() {
    event.emit('CREATE_WEB', {
      threeIndex: this.index,
    })
  }
}
