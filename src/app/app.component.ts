// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString, setLocation } from '../utils'
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n'
import { getLocale } from 'src/locale'
import { settings } from 'src/store'
import { verifyToken } from 'src/services'
import { getToken, userLogout, isLogin } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import Alert from './alert-event'

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogin: boolean = isLogin

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private i18n: NzI18nService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {
    new Alert(message, notification)
  }

  ngOnInit() {
    this.goRoute()
    this.activatedRoute.queryParams.subscribe(setLocation)

    if (getLocale() === 'zh-CN') {
      this.i18n.setLocale(zh_CN)
    } else {
      this.i18n.setLocale(en_US)
    }

    const token = getToken()
    if (token) {
      verifyToken(token).catch(() => {
        userLogout()
        setTimeout(() => {
          location.reload()
        }, 3000)
      })
    }
  }

  goRoute() {
    // is App
    if (settings.appTheme !== 'Current' && 'ontouchstart' in window) {
      const url = (this.router.url.split('?')[0] || '').toLowerCase()
      const { page, id, q } = queryString()
      const queryParams = { page, id, q }
      const path = '/' + String(settings.appTheme).toLowerCase()

      if (!url.includes(path)) {
        this.router.navigate([path], { queryParams })
      }
    }
  }
}
