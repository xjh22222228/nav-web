// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component, OnInit } from '@angular/core'
import config from '../../../nav.config'
import { settings } from 'src/store'

@Component({
  selector: 'app-icon-git',
  templateUrl: './icon-git.component.html',
  styleUrls: ['./icon-git.component.scss'],
})
export class IconGitComponent implements OnInit {
  gitRepoUrl: string =
    config.gitRepoUrl === 'https://github.com/xjh22222228/nav-web'
      ? 'https://github.com/xjh22222228/nav'
      : config.gitRepoUrl
  showGithub = settings.showGithub

  constructor() {}

  ngOnInit(): void {}
}
