// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { INavProps } from 'src/types'

@Component({
  selector: 'app-web-more-menu',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class WebMoreMenuComponent {
  @Input() index = 0
  @Input() data: INavProps[] = []
  @Input() page = 0
  @Output() onClick = new EventEmitter()

  ngOnInit() {}

  handleCilck(index: number) {
    this.onClick?.emit?.(index)
  }
}
