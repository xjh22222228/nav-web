// @ts-nocheck
// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { isLogin, userLogout } from 'src/utils/user'
import { Router } from '@angular/router'
import { VERSION } from 'src/constants'

@Component({
  selector: 'app-system',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemComponent {
  $t = $t
  isLogin: boolean = isLogin
  showLoginModal: boolean = !isLogin
  currentMenu: string = ''
  date = document.getElementById('META-NAV')?.dataset?.['date'] || ''
  currentVersionSrc = `https://img.shields.io/badge/current-v${VERSION}-red.svg?longCache=true&style=flat-square`

  constructor(private router: Router) {}

  ngOnInit() {
    const u = window.location.href.split('/')
    this.currentMenu = u[u.length - 1]

    // 解决暗黑模式部分样式不正确问题，后台没有暗黑
    if (!(window.location.hostname === 'localhost')) {
      const isReload = window.sessionStorage.getItem('reload')
      window.sessionStorage.removeItem('reload')
      if (!isReload) {
        window.sessionStorage.setItem('reload', '1')
        window.location.reload()
      }
    }
  }

  goBack() {
    this.router.navigate(['/'])
  }

  goRoute(to: string) {
    this.router.navigate([to])
  }

  logout() {
    userLogout()
    this.router.navigate(['/'])
    setTimeout(() => {
      location.reload()
    }, 26)
  }
}
