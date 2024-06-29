// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import {
  Component,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'
import { isDark as isDarkFn, randomBgImg, queryString } from 'src/utils'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { isLogin } from 'src/utils/user'
import { updateFileContent } from 'src/services'
import { websiteList, settings } from 'src/store'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import { Router, ActivatedRoute } from '@angular/router'
import { $t, getLocale } from 'src/locale'
import mitt from 'src/utils/mitt'

@Component({
  selector: 'app-fixbar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixbarComponent {
  @Input() showCollapse: boolean = true
  @Input() collapsed: boolean = false
  @Input() selector: string = ''
  @Output() onCollapse = new EventEmitter()

  $t = $t
  settings = settings
  language = getLocale()
  websiteList = websiteList
  isDark: boolean = isDarkFn()
  syncLoading = false
  isLogin = isLogin
  themeList = [
    {
      name: $t('_switchTo') + ' Super',
      url: '/super',
    },
    {
      name: $t('_switchTo') + ' Light',
      url: '/light',
    },
    {
      name: $t('_switchTo') + ' Sim',
      url: '/sim',
    },
    {
      name: $t('_switchTo') + ' Side',
      url: '/side',
    },
    {
      name: $t('_switchTo') + ' Shortcut',
      url: '/shortcut',
    },
    {
      name: $t('_switchTo') + ' App',
      url: '/app',
    },
  ]

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.isDark) {
      document.documentElement.classList.add('dark-container')
    }

    const url = this.router.url.split('?')[0]
    this.themeList = this.themeList.filter((t) => {
      return t.url !== url
    })
  }

  ngOnInit() {}

  toggleTheme(theme: any) {
    this.router.navigate([theme.url], {
      queryParams: queryString(),
    })
    this.removeBackground()
  }

  goTop() {
    if (this.selector) {
      const el = document.querySelector(this.selector)
      if (el) {
        el.scrollTop = 0
      }
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  collapse() {
    this.onCollapse.emit()
  }

  removeBackground() {
    const el = document.getElementById('random-light-bg')
    el?.parentNode?.removeChild?.(el)
  }

  toggleMode() {
    this.isDark = !this.isDark
    mitt.emit('EVENT_DARK', this.isDark)
    window.localStorage.setItem(
      STORAGE_KEY_MAP.isDark,
      String(Number(this.isDark))
    )
    document.documentElement.classList.toggle('dark-container')

    if (this.isDark) {
      this.removeBackground()
    } else {
      const { data } = this.activatedRoute.snapshot
      data['renderLinear'] && randomBgImg()
    }
  }

  goSystemPage() {
    this.router.navigate(['system'])
  }

  handleSync() {
    if (this.syncLoading) {
      this.message.warning($t('_repeatOper'))
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.syncLoading = true

        updateFileContent({
          message: 'update db',
          content: JSON.stringify(this.websiteList),
          path: DB_PATH,
        })
          .then(() => {
            this.message.success($t('_syncSuccessTip'))
          })
          .finally(() => {
            this.syncLoading = false
          })
      },
    })
  }

  toggleLocale() {
    const l = this.language === 'en' ? 'zh-CN' : 'en'
    window.localStorage.setItem(STORAGE_KEY_MAP.language, l)
    window.location.reload()
  }
}
