// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { isLogin } from 'src/utils/user'
import { settings, internal } from 'src/store'
import { ServiceCommonService } from 'src/services/common'

@Component({
  selector: 'app-sim',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SimComponent {
  description: string = settings.simThemeDesc.replace(
    '${total}',
    String(isLogin ? internal.loginViewCount : internal.userViewCount)
  )

  constructor(public serviceCommon: ServiceCommonService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.serviceCommon.settings.simOverType === 'ellipsis') {
      this.serviceCommon.getOverIndex('.top-nav .over-item')
    }
  }
}
