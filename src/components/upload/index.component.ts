// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { createFile, getCDN } from 'src/api'

@Component({
  selector: 'app-upload',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class UploadComponent {
  @Output() onChange = new EventEmitter()

  $t = $t
  uploading: boolean = false
  // @ts-ignore
  id = `f${Date.now()}${parseInt(Math.random() * 1000000)}`

  constructor(private message: NzMessageService) {}

  onChangeFile(e: any) {
    if (this.uploading) {
      return
    }

    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]

    if (!file.type.startsWith('image')) {
      return this.message.error($t('_notUpload'))
    }
    this.onUpload(file).finally(() => {
      e.target.value = ''
    })
  }

  onUpload(file: File) {
    const that = this
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onerror = reject
      fileReader.onload = function () {
        that.uploading = true
        const iconUrl = this.result as string
        const url = iconUrl.split(',')[1]
        // fileName 方便自动带上文件后缀
        const fileName = file.name.replace(/\s/gi, '')
        const path = `nav-${Date.now()}-${fileName}`

        createFile({
          branch: 'image',
          message: 'create image',
          content: url,
          isEncode: false,
          path,
        })
          .then(() => {
            const params = {
              rawPath: path,
              cdn: getCDN(path),
            }
            that.onChange.emit(params)
            that.message.success($t('_uploadSuccess'))
            resolve(params)
          })
          .catch(reject)
          .finally(() => {
            that.uploading = false
          })
      }
    })
  }
}
