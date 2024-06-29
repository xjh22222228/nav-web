// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ISearchEngineProps } from 'src/types'
import { updateFileContent } from 'src/services'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SEARCH_PATH } from 'src/constants'
import { searchEngineList } from 'src/store'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'system-tag',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemSearchComponent {
  $t = $t
  searchList: ISearchEngineProps[] = searchEngineList
  submitting: boolean = false

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  handleAdd() {
    this.searchList.unshift({
      name: '',
      url: '',
      icon: '',
      placeholder: '',
      blocked: false,
      isInner: false,
    })
  }

  handleDelete(idx: number) {
    this.searchList.splice(idx, 1)
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        const o = {}
        this.searchList.forEach((item) => {
          if (item.name.trim()) {
            // @ts-ignore
            o[item.name] = null
          }
        })

        if (Object.keys(o).length !== this.searchList.length) {
          this.message.error($t('_repeatAdd'))
          return
        }

        this.submitting = true
        updateFileContent({
          message: 'Update Search',
          content: JSON.stringify(this.searchList, null, 2),
          path: SEARCH_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  onChangeUpload(path: any, idx: number) {
    this.searchList[idx].icon = path.cdn
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.searchList, event.previousIndex, event.currentIndex)
  }
}
