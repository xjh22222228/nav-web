// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import config from '../nav.config.js'
import path from 'path'
import LOAD_MAP from './loading.js'
import dayjs from 'dayjs'
import getWebInfo from 'info-web'

const dbPath = path.join('.', 'data', 'db.json')
const setPath = path.join('.', 'data', 'settings.json')
const pkgPath = path.join('package.json')

const db = JSON.parse(fs.readFileSync(dbPath).toString())
const pkg = JSON.parse(fs.readFileSync(pkgPath).toString())
const settings = JSON.parse(fs.readFileSync(setPath).toString())

const nowDate = dayjs().format('YYYY-MM-DD HH:mm:ss')

const { description, title, keywords, loading, favicon, headerContent } =
  settings

const { gitRepoUrl, homeUrl } = config.default

const s = gitRepoUrl.split('/')

const authorName = s[s.length - 2]
const repoName = s[s.length - 1]

const htmlTemplate = `
  <!-- https://github.com/xjh22222228/nav -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}" id="xjh_2">
  <link rel="icon" href="${favicon}">
  <link rel ="apple-touch-icon" href="${favicon}">
`.trim()

let scriptTemplate = ``.trim()

let seoTemplate = `
<div data-url="https://github.com/xjh22222228/nav" data-a="x.i.e-jiahe" data-date="${nowDate}" data-version="${pkg.version}" id="META-NAV" style="z-index:-1;position:fixed;top:-10000vh;left:-10000vh;">
`

async function buildSeo() {
  function r(navList) {
    for (let value of navList) {
      if (Array.isArray(value.nav)) {
        r(value.nav)
      }

      seoTemplate += `<h3>${value.title || value.name || title}</h3>${
        value.icon ? `<img data-src="${value.icon}" alt="${homeUrl}" />` : ''
      }<p>${value.desc || description}</p><a href="${
        value.url || homeUrl || gitRepoUrl
      }"></a>`

      if (value.urls && typeof value.urls === 'object') {
        for (let k in value.urls) {
          seoTemplate += `<a href="${
            value.urls[k] || homeUrl || gitRepoUrl
          }"></a>`
        }
      }
    }
  }

  if (settings.openSEO) {
    r(db)
  }

  seoTemplate += '</div>'
}

async function build() {
  const htmlPath = path.join('.', 'src', 'main.html')
  const writePath = path.join('.', 'src', 'index.html')
  let t = fs.readFileSync(htmlPath).toString()
  t = t.replace(/<title>.*<\/title>/i, '')
  t = t.replace('<link rel="icon" href="assets/logo.png" />', '')
  t = t.replace('<link rel="icon" href="assets/logo.png">', '')
  t = t.replace('<!-- nav.config -->', htmlTemplate)
  if (headerContent) {
    t = t.replace('<!-- nav.headerContent -->', headerContent)
  }

  t = t.replace('<!-- nav.script -->', scriptTemplate)

  t = t.replace('<!-- nav.seo -->', seoTemplate)
  t = t.replace('<!-- nav.loading -->', LOAD_MAP[getLoadKey()] || '')

  fs.writeFileSync(writePath, t, { encoding: 'utf-8' })
  fs.unlinkSync('./nav.config.js')
}

buildSeo()
  .finally(() => build())
  .catch(console.error)

function getLoadKey() {
  const keys = Object.keys(LOAD_MAP)
  const rand = Math.floor(Math.random() * keys.length)
  const loadingKey = loading === 'random' ? keys[rand] : loading
  return loadingKey
}

// 检查链接

let errorUrlCount = 0
;(async function () {
  const items = []

  async function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      const item = nav[i]
      if (item.url) {
        delete item.ok
        if (
          settings.checkUrl ||
          settings.spiderIcon === 'EMPTY' ||
          settings.spiderIcon === 'ALWAYS' ||
          settings.spiderDescription === 'EMPTY' ||
          settings.spiderDescription === 'ALWAYS' ||
          settings.spiderTitle === 'EMPTY' ||
          settings.spiderTitle === 'ALWAYS'
        ) {
          const res = await getWebInfo(item.url, { timeout: 3000 })
          if (!res.status) {
            console.log(`疑似异常 ${item.url}`)
          }
          if (settings.checkUrl) {
            if (!res.status) {
              errorUrlCount += 1
              item.ok = false
            }
          }
          if (res.status) {
            if (settings.spiderIcon === 'ALWAYS') {
              item.icon = res.iconUrl
            } else if (settings.spiderIcon === 'EMPTY' && !item.icon) {
              item.icon = res.iconUrl
            }

            if (settings.spiderTitle === 'ALWAYS') {
              item.name = res.title
            } else if (settings.spiderTitle === 'EMPTY' && !item.name) {
              item.name = res.title
            }

            if (settings.spiderDescription === 'ALWAYS') {
              item.desc = res.description
            } else if (settings.spiderDescription === 'EMPTY' && !item.desc) {
              item.desc = res.description
            }
          }
        }
      } else {
        r(item.nav)
      }
    }
  }

  r(db)

  const promises = await Promise.allSettled(
    items.map((item) => getWebInfo(item.url))
  )

  for (let i = 0; i < promises.length; i++) {
    const item = items[i]
    const res = promises[i].value
    if (settings.checkUrl) {
      if (!res.status) {
        errorUrlCount += 1
        item.ok = false
        console.log(`异常 ${item.url}`)
      }
    }
    if (res.status) {
      if (settings.spiderIcon === 'ALWAYS') {
        item.icon = res.iconUrl
      } else if (settings.spiderIcon === 'EMPTY' && !item.icon) {
        item.icon = res.iconUrl
      }

      if (settings.spiderTitle === 'ALWAYS') {
        item.name = res.title
      } else if (settings.spiderTitle === 'EMPTY' && !item.name) {
        item.name = res.title
      }

      if (settings.spiderDescription === 'ALWAYS') {
        item.desc = res.description
      } else if (settings.spiderDescription === 'EMPTY' && !item.desc) {
        item.desc = res.description
      }
    }
  }
})()

process.on('exit', () => {
  settings.errorUrlCount = errorUrlCount
  fs.writeFileSync(setPath, JSON.stringify(settings), { encoding: 'utf-8' })
  fs.writeFileSync(dbPath, JSON.stringify(db), { encoding: 'utf-8' })
  console.log('All success!')
})
